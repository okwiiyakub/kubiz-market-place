from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    UpdateProfileSerializer,
    ChangePasswordSerializer,
)


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'Invalid email or password.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=user_obj.username, password=password)

        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)

        return Response(
            {'detail': 'Invalid email or password.'},
            status=status.HTTP_400_BAD_REQUEST
        )


class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logged out successfully.'})


class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UpdateProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            current_password = serializer.validated_data["current_password"]
            new_password = serializer.validated_data["new_password"]

            if not request.user.check_password(current_password):
                return Response(
                    {"current_password": "Current password is incorrect."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            request.user.set_password(new_password)
            request.user.save()

            update_session_auth_hash(request, request.user)

            return Response({"detail": "Password changed successfully."})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)