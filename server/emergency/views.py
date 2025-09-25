from rest_framework import viewsets
from .models import EmergencyRequest
from .serializers import EmergencySerializer

class EmergencyViewSet(viewsets.ModelViewSet):
    queryset = EmergencyRequest.objects.all().order_by('-request_time')
    serializer_class = EmergencySerializer
