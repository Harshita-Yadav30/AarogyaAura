from django.db import models
from users.models import User
from django.utils import timezone

class Appointment(models.Model):
    APPOINTMENT_TYPES = (
        ("offline", "Offline"),
        ("tele", "Teleconsultation"),
    )

    PRIORITY_CHOICES = (
        (1, "High"),
        (2, "Medium"),
        (3, "Low"),
    )

    STATUS_CHOICES = (
        ("scheduled", "Scheduled"),
        ("treated", "Treated"),
    )

    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments_doctor")
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments_patient")
    appointment_type = models.CharField(max_length=10, choices=APPOINTMENT_TYPES)
    appointment_date = models.CharField(max_length=10, blank=True)
    appointment_time = models.CharField(max_length=10, blank=True)
    scheduled_at = models.DateTimeField(default=timezone.now)
    token_number = models.PositiveIntegerField(null=True, blank=True)
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=3)
    room_id = models.CharField(max_length=50, blank=True, null=True)
    emergency = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="scheduled")
    
    # New fields for prescription
    medicines = models.JSONField(null=True, blank=True)  # store list of medicines
    notes = models.TextField(null=True, blank=True)
    prescription_pdf = models.FileField(upload_to="prescriptions/", blank=True, null=True)
    prescription_qr = models.ImageField(upload_to="prescriptions/", null=True, blank=True)
