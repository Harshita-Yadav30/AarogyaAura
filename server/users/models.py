from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ("doctor", "Doctor"),
        ("patient", "Patient"),
        ("pharmacist", "Pharmacist"),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    specialization = models.CharField(max_length=100, blank=True, null=True)  # For doctors
    name = models.CharField(max_length=150, blank=False, default="Unknown")
