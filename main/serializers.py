from rest_framework import serializers
import base64
from .models import School, Classroom, Test, Question, Option, UserTestSubmission, TestRecords, Teacher, Student
from accounts.models import CustomUser, Sessions
from .forms import SchoolCreateForm, ClassroomCreateForm, TestCreateForm, QuestionCreateForm, OptionCreateForm, TestSubmissionForm, ConnectTestForm




class OptionSerializer(serializers.ModelSerializer):
    option_picture = serializers.SerializerMethodField()

    class Meta:
        model = Option
        fields = '__all__'

    def get_option_picture(self, obj):
        if obj.option_picture:
            option_id = obj.pk
            return f"https://englishgamesreact.pythonanywhere.com/option/picture/{option_id}/"
        return None

class QuestionSerializer(serializers.ModelSerializer):
    question_picture = serializers.SerializerMethodField()
    question_sound = serializers.SerializerMethodField()
    options = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = '__all__'

    def get_question_picture(self, obj):
        if obj.question_picture:
            question_id = obj.pk
            return f"https://englishgamesreact.pythonanywhere.com/question/picture/{question_id}/"
        return None

    def get_question_sound(self, obj):
        if obj.question_sound:
            question_id = obj.pk
            return f"https://englishgamesreact.pythonanywhere.com/question/sound/{question_id}/"
        return None

    def get_options(self, obj):
        options = obj.option_set.filter(is_correct=True)
        serializer = OptionSerializer(options, many=True)
        return serializer.data

class TestQuestionSerializer(serializers.ModelSerializer):
    question_picture = serializers.SerializerMethodField()
    question_sound = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = '__all__'

    def get_question_picture(self, obj):
        if obj.question_picture:
            question_id = obj.pk
            return f"https://englishgamesreact.pythonanywhere.com/question/picture/{question_id}/"
        return None

    def get_question_sound(self, obj):
        if obj.question_sound:
            question_id = obj.pk
            return f"https://englishgamesreact.pythonanywhere.com/question/sound/{question_id}/"
        return None




class TestByClassroomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Test
        fields = ['name', 'id']

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class ClassroomSerializer(serializers.ModelSerializer):


    class Meta:
        model = Classroom
        fields = '__all__'

    def get_classroom_picture(self, obj):
        if obj.classroom_picture:
            classroom_id = obj.pk
            return f"https://englishgamesreact.pythonanywhere.com/classroom/picture/{classroom_id}/"
        return None

class SchoolSerializer(serializers.ModelSerializer):
    school_picture = serializers.SerializerMethodField()
    classrooms = ClassroomSerializer(many=True, read_only=True)

    class Meta:
        model = School
        fields = '__all__'

    def get_school_picture(self, obj):
        if obj.school_picture:
            school_id = obj.pk
            return f"https://englishgamesreact.pythonanywhere.com/school/picture/{school_id}/"
        return None


class CustomUserSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)
    student = StudentSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'id', 'teacher', 'student']






class TestRecordsSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    question = QuestionSerializer(read_only=True)

    class Meta:
        model = TestRecords
        fields = '__all__'





class SessionsSerializer(serializers.ModelSerializer):
    test_records = TestRecordsSerializer(many=True, read_only=True, source='testrecords_set')

    class Meta:
        model = Sessions
        fields = '__all__'

class OnlySessionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sessions
        fields = '__all__'



class UserTestSubmissionSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    question = QuestionSerializer(read_only=True)
    selected_option = OptionSerializer(read_only=True)

    class Meta:
        model = UserTestSubmission
        fields = '__all__'

class ConnectTestFormSerializer(serializers.Serializer):
    # Define the fields for your form here
    pass