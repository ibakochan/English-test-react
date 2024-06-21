from django.contrib import admin
from accounts.models import CustomUser, Sessions

from main.models import School, Classroom, Test, Question, Option, UserTestSubmission, TestRecords, Teacher, Student
admin.site.register([School, Classroom, Test, Question, Option, UserTestSubmission, TestRecords, CustomUser, Sessions, Teacher, Student])