from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from accounts.models import User

from .models import Course, Category, Enrollment
from .serializers import CourseSerializer, CategorySerializer, EnrollmentSerializer



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]



class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role !='instructor':
            raise PermissionDenied("Only instructor can create course")

        serializer.save(instructor=self.request.user)



class EnrollView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'student':
            return Response({"error": "Only students can enroll"}, status=400)

        course_id = request.data.get("course")

        Enrollment.objects.create(
            student=request.user,
            course_id=course_id
        )

        return Response({"msg": "Enrolled successfully"})



class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "users": User.objects.count(),
            "courses": Course.objects.count(),
            "enrollments": Enrollment.objects.count()
        })