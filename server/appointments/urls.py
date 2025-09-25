from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, DoctorViewSet

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'doctors', DoctorViewSet, basename='doctors')

urlpatterns = router.urls
