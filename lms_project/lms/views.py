from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from accounts.models import User
from django.utils import timezone

from .models import Course, Category, Enrollment, Lesson, LessonProgress, Review, Choice, Question, Quiz, QuizAttempt
from .serializers import CourseSerializer, CategorySerializer, EnrollmentSerializer, LessonSerializer, LessonProgressSerializer, ReviewSerializer, ChoiceSerializer, QuestionSerializer, QuizSerializer, QuizAttemptSerializer


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


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        queryset = Lesson.objects.all()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):

        if self.request.user.role != 'instructor':
            raise PermissionDenied("Only instructor can add lessons")

        course = serializer.validated_data.get('course')
        if course.instructor != self.request.user:
            raise PermissionDenied("You can only add lessons to your own course")

        serializer.save()


class MarkLessonCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'student':
            return Response({"error": "Only students can mark lessons complete"}, status=400)

        lesson_id = request.data.get("lesson")

        progress, created = LessonProgress.objects.get_or_create(
            student=request.user,
            lesson_id=lesson_id,
        )
        progress.completed = True
        progress.completed_at = timezone.now()
        progress.save()

        return Response({"msg": "Lesson marked as complete"})


class CourseProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):

        total_lessons = Lesson.objects.filter(course_id=course_id).count()

        if total_lessons == 0:
            return Response({"total_lessons": 0, "completed": 0, "percentage": 0})

        completed = LessonProgress.objects.filter(
            student=request.user,
            lesson__course_id=course_id,
            completed=True,
        ).count()

        percentage = round((completed / total_lessons) * 100)

        return Response({
            "total_lessons": total_lessons,
            "completed": completed,
            "percentage": percentage,
        })


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        queryset = Review.objects.all()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):

        if self.request.user.role != 'student':
            raise PermissionDenied("Only students can leave a review")

        course = serializer.validated_data.get('course')
        is_enrolled = Enrollment.objects.filter(student=self.request.user, course=course).exists()
        if not is_enrolled:
            raise PermissionDenied("You must be enrolled in this course to review it")

        serializer.save(student=self.request.user)


class LessonProgressViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        queryset = LessonProgress.objects.filter(student=self.request.user)
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(lesson__course_id=course_id)
        return queryset


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # ?course=<id> দিয়ে ফিল্টার করা যাবে
        queryset = Quiz.objects.all()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != 'instructor':
            raise PermissionDenied("Only instructor can create a quiz")

        course = serializer.validated_data.get('course')
        if course.instructor != self.request.user:
            raise PermissionDenied("You can only add a quiz to your own course")

        serializer.save()


class AddQuestionView(APIView):
    """
    Instructor একটা কলেই প্রশ্ন + তার সব অপশন যোগ করতে পারবে।
    Expected body:
    {
        "quiz": 1,
        "text": "What is Django?",
        "choices": [
            {"text": "A framework", "is_correct": true},
            {"text": "A language", "is_correct": false}
        ]
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'instructor':
            raise PermissionDenied("Only instructor can add questions")

        quiz_id = request.data.get("quiz")
        quiz = Quiz.objects.get(id=quiz_id)

        if quiz.course.instructor != request.user:
            raise PermissionDenied("You can only add questions to your own quiz")

        question = Question.objects.create(quiz=quiz, text=request.data.get("text"))

        for choice in request.data.get("choices", []):
            Choice.objects.create(
                question=question,
                text=choice.get("text"),
                is_correct=choice.get("is_correct", False),
            )

        return Response({"msg": "Question added successfully"})


class SubmitQuizView(APIView):
    """
    Student কুইজ সাবমিট করলে স্কোর গণনা করে QuizAttempt-এ সেভ করবে।
    Expected body:
    {
        "quiz": 1,
        "answers": { "3": 7, "4": 9 }   // { question_id: selected_choice_id }
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'student':
            return Response({"error": "Only students can submit a quiz"}, status=400)

        quiz_id = request.data.get("quiz")
        answers = request.data.get("answers", {})

        quiz = Quiz.objects.get(id=quiz_id)
        questions = quiz.questions.all()

        score = 0
        for question in questions:
            selected_choice_id = answers.get(str(question.id))
            if selected_choice_id:
                is_correct = Choice.objects.filter(
                    id=selected_choice_id, question=question, is_correct=True
                ).exists()
                if is_correct:
                    score += 1

        attempt = QuizAttempt.objects.create(
            student=request.user,
            quiz=quiz,
            score=score,
            total_questions=questions.count(),
        )

        return Response({
            "score": attempt.score,
            "total_questions": attempt.total_questions,
        })


class QuizAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # স্টুডেন্ট শুধু নিজের attempt history দেখবে
        return QuizAttempt.objects.filter(student=self.request.user)
