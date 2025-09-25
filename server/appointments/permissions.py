from rest_framework.permissions import BasePermission

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "patient"

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "doctor"

class IsPharmacist(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "pharmacist"
