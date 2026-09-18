from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, CategoryViewSet, DashboardView, EnrollView,
    LessonViewSet, MarkLessonCompleteView, CourseProgressView, ReviewViewSet, LessonProgressViewSet, QuizViewSet, AddQuestionView, SubmitQuizView, QuizAttemptViewSet
)

router = DefaultRouter()
router.register('courses', CourseViewSet)
router.register('categories', CategoryViewSet)
router.register('lessons', LessonViewSet)
router.register('reviews', ReviewViewSet)
router.register('lesson-progress', LessonProgressViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view()),
    path('enroll/', EnrollView.as_view()),
    path('lessons/complete/', MarkLessonCompleteView.as_view()),
    path('courses/<int:course_id>/progress/', CourseProgressView.as_view()),
    path('questions/add/', AddQuestionView.as_view()),
    path('quiz/submit/', SubmitQuizView.as_view()),
]