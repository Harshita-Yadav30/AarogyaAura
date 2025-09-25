from rest_framework import serializers
from .models import Appointment, User
from users.serializers import UserSerializer

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ("id", "prescription_pdf")

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'username', 'email', 'specialization')

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_info = UserSerializer(source="doctor", read_only=True)
    patient_info = UserSerializer(source="patient", read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
