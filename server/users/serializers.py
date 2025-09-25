from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# For returning user info
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'role', 'specialization')

# For registering new users
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    name = serializers.CharField(write_only=True, required=True)
    specialization = serializers.CharField(write_only=True, required=False)  # optional for non-doctors

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'role', 'name', 'specialization')

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        specialization = validated_data.pop('specialization', '')
        email = validated_data['email']
        user = User.objects.create(
            username=email,
            email=email,
            role=validated_data['role'],
            name=name,
            specialization=specialization if validated_data['role'] == "doctor" else ""
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# Custom JWT serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token
