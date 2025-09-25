from django.db import models
from django.conf import settings

class EmergencyRequest(models.Model):
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    request_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="pending")  # pending/accepted/completed

    def __str__(self):
        return f"Emergency for {self.patient.username} at {self.request_time}"
