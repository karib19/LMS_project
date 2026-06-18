from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import RegisterSerializer



class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"msg": "Registered"})


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=400)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"msg": "Logged out"})



class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "role": user.role
        })



class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user

        user.username = request.data.get("username", user.username)
        user.email = request.data.get("email", user.email)


        user.save()

        return Response({"msg": "Profile updated"})



class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"error": "User not found"}, status=400)

        return Response({"msg": "Reset link sent (demo mode)"})



class ResetPasswordView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        password = request.data.get("password")

        user = User.objects.filter(id=user_id).first()

        if not user:
            return Response({"error": "User not found"}, status=400)

        user.set_password(password)
        user.save()

        return Response({"msg": "Password updated"})