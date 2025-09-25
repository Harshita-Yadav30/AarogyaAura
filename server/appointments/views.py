from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Appointment, User
from .serializers import AppointmentSerializer, DoctorSerializer
from .permissions import IsDoctor, IsPatient
from django.utils import timezone
import random
from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os
from django.conf import settings
from django.core.files import File
import qrcode
import datetime

class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint to list all doctors
    """
    queryset = User.objects.filter(role="doctor")
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "doctor":
            return Appointment.objects.filter(doctor=user).order_by('-emergency', 'scheduled_at')
        elif user.role == "patient":
            return Appointment.objects.filter(patient=user).order_by('-priority', 'scheduled_at')
        return Appointment.objects.none()

    @action(detail=False, methods=['post'], permission_classes=[IsPatient])
    def book_offline(self, request):
        try:
            data = request.data
            doctor_id = data.get("doctor")
            scheduled_at = data.get("scheduled_at", timezone.now())
            emergency = data.get("emergency", False)

            # Token calculation
            count = Appointment.objects.filter(
                doctor_id=doctor_id,
                scheduled_at__date=scheduled_at[:10]
            ).count()

            data["token_number"] = count + 1
            data["patient"] = request.user.id
            data["emergency"] = emergency

            data["appointment_date"] = str(datetime.date.today() + datetime.timedelta(days=1))
            start_time = datetime.datetime.combine(
                datetime.date.today(),
                datetime.time(hour=8, minute=30)
            )
            data["appointment_time"] = str((start_time + datetime.timedelta(minutes=15 * count)).time())

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            print(e)
            data = request.data
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsPatient])
    def start_video(self, request, pk=None):
        appointment = self.get_object()
        appointment.room_id = f"room-{random.randint(1000,9999)}"
        appointment.save()
        return Response({"room_id": appointment.room_id})

    @action(detail=True, methods=['post'], permission_classes=[IsPatient])
    def emergency_request(self, request, pk=None):
        appointment = self.get_object()
        appointment.emergency = True
        appointment.save()
        # You can trigger notification to doctor/admin here
        return Response({"status": "Emergency alert sent!"})
    
    @action(detail=True, methods=['post'], permission_classes=[IsDoctor])
    def prescribe(self, request, pk=None):
        appointment = self.get_object()
        medicines = request.data.get("medicines")  # list
        notes = request.data.get("notes", "")

        # --- Generate PDF as before ---
        prescriptions_dir = os.path.join(settings.MEDIA_ROOT, "prescriptions")
        os.makedirs(prescriptions_dir, exist_ok=True)
        pdf_filename = f"prescription_appointment_{appointment.id}.pdf"
        pdf_path = os.path.join(prescriptions_dir, pdf_filename)

        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import A4
        c = canvas.Canvas(pdf_path, pagesize=A4)
        width, height = A4
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, f"Prescription - Appointment #{appointment.id}")
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 80, f"Doctor: {appointment.doctor.first_name} ({appointment.doctor.specialization})")
        c.drawString(50, height - 100, f"Patient: {appointment.patient.first_name} ({appointment.patient.email})")
        c.drawString(50, height - 120, f"Date: {appointment.scheduled_at.strftime('%Y-%m-%d %H:%M')}")
        c.drawString(50, height - 160, "Medicines:")
        y = height - 180
        if medicines:
            for med in medicines:
                c.drawString(60, y, f"- {med}")
                y -= 20
        else:
            c.drawString(60, y, "No medicines listed")
            y -= 20
        c.drawString(50, y - 10, "Notes:")
        c.drawString(60, y - 30, notes or "None")

        # --- Generate QR code ---
        qr_data = f"{request.scheme}://{request.get_host()}/api/appointments/{appointment.id}/verify/"
        qr_img = qrcode.make(qr_data)
        qr_path = os.path.join(prescriptions_dir, f"qr_appointment_{appointment.id}.png")
        qr_img.save(qr_path)

        # Embed QR in PDF (optional)
        c.drawImage(qr_path, width - 150, height - 150, width=100, height=100)
        c.showPage()
        c.save()

        # Save PDF and QR URLs to appointment
        appointment.prescription_pdf = f"prescriptions/{pdf_filename}"
        appointment.prescription_qr = f"prescriptions/qr_appointment_{appointment.id}.png"
        appointment.status = "treated"
        appointment.medicines = medicines
        appointment.notes = notes
        appointment.save()

        return Response({
            "prescription_pdf": appointment.prescription_pdf.url if appointment.prescription_pdf else None,
            "prescription_qr": appointment.prescription_qr.url if appointment.prescription_qr else None,
        })
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def verify(self, request, pk=None):
        appointment = self.get_object()

        return Response({
            "doctor": appointment.doctor.name,
            "patient": appointment.patient.name,
            "medicines": appointment.medicines,
            "notes": appointment.notes,
            "status": appointment.status,
            "pdf_url": appointment.prescription_pdf.url,
        })
