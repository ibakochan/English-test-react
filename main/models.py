from django.db import models
from accounts.models import CustomUser, Sessions
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class School(models.Model):
    school_name = models.CharField(max_length=200, unique=True)
    school_password = models.CharField(max_length=200)
    school_picture = models.BinaryField(null=True, editable=True)
    school_content_type = models.CharField(max_length=256, null=True, help_text='The MIMEType of the file')

    def set_password(self, raw_password):
        self.school_password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.school_password)

    def __str__(self):
        return self.school_name

class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    student_number = models.CharField(max_length=20, null=True)

    def __str__(self):
        return self.user.username

class Classroom(models.Model):
    name = models.CharField(max_length=200, unique=True)
    hashed_password = models.CharField(max_length=200)
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True)
    classroom_picture = models.BinaryField(null=True, editable=True)
    classroom_content_type = models.CharField(max_length=256, null=True, help_text='The MIMEType of the file')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True, blank=True, related_name='classrooms')
    students = models.ManyToManyField(Student, blank=True, related_name='classrooms')


    def set_password(self, raw_password):
        self.hashed_password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.hashed_password)

    def __str__(self):
        return self.name

class Test(models.Model):
    classroom = models.ManyToManyField('Classroom', blank=True)
    name = models.CharField(max_length=200)
    test_picture = models.BinaryField(null=True, editable=True)
    test_content_type = models.CharField(max_length=256, null=True, help_text='The MIMEType of the file')
    total_questions = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=500)
    question_picture = models.BinaryField(null=True, editable=True)
    question_content_type = models.CharField(max_length=256, null=True, help_text='The MIMEType of the file')
    question_sound = models.BinaryField(null=True, editable=True)
    question_sound_content_type = models.CharField(max_length=256, null=True, help_text='The MIMEType of the file')

    def __str__(self):
        return self.name

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)
    option_picture = models.BinaryField(null=True, editable=True)
    option_content_type = models.CharField(max_length=256, null=True, help_text='The MIMEType of the file')

    def __str__(self):
        return self.name




class UserTestSubmission(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    score = models.FloatField(default=0)
    selected_option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True, blank=True)
    total_score = models.FloatField(default=0)

    def __str__(self):
        return f"{self.user} - {self.test} - {self.timestamp}"




class TestRecords(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, default=None)
    account_sessions = models.ForeignKey(Sessions, on_delete=models.CASCADE, default=None)
    question_name = models.CharField(max_length=500)
    selected_option_name = models.CharField(max_length=200, null=True, blank=True)
    recorded_score = models.FloatField(default=0)
    total_recorded_score = models.FloatField(default=0)
    group_id = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user} - {self.test} - Question: {self.question_name} - Option: {self.selected_option_name if self.selected_option_name else 'Not answered'} - Score: {self.recorded_score}"

