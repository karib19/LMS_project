from rest_framework import serializers
from .models import Course, Category, Enrollment, Lesson, LessonProgress, Review, Choice, Question, Quiz, QuizAttempt


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['instructor']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = '__all__'
        read_only_fields = ['student', 'completed_at']


class ReviewSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['student']


class ChoiceSerializer(serializers.ModelSerializer):
    # instructor-এর জন্য — is_correct সহ, কুইজ ম্যানেজ করার সময় ব্যবহার হবে
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']


class ChoiceStudentSerializer(serializers.ModelSerializer):
    # student-এর জন্য — is_correct বাদ, উত্তর leak হওয়া আটকাতে
    class Meta:
        model = Choice
        fields = ['id', 'text']


class QuestionStudentSerializer(serializers.ModelSerializer):
    choices = ChoiceStudentSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']


class QuizSerializer(serializers.ModelSerializer):
    # কুইজ দেওয়ার সময় স্টুডেন্ট এটাই পাবে - প্রশ্ন+অপশন থাকবে, সঠিক উত্তর থাকবে না
    questions = QuestionStudentSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'course', 'title', 'questions']
        read_only_fields = ['course']


class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = '__all__'
        read_only_fields = ['student', 'score', 'total_questions']