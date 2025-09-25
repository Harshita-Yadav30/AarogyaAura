from rest_framework.routers import DefaultRouter
from .views import EmergencyViewSet

router = DefaultRouter()
router.register(r'emergency', EmergencyViewSet)

urlpatterns = router.urls
