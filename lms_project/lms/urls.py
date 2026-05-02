from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, CategoryViewSet, DashboardView, EnrollView

router = DefaultRouter()
router.register('courses', CourseViewSet)
router.register('categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view()),
    path('enroll/', EnrollView.as_view()),
]