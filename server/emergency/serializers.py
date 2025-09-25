from rest_framework import serializers
from .models import EmergencyRequest

class EmergencySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyRequest
        fields = "__all__"
