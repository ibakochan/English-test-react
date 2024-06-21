from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from main.models import Teacher, Student, School
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password


class TeacherSignUpForm(UserCreationForm):
    username = forms.CharField(
        label="名前",
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
    )

    password1 = forms.CharField(
        label="パスワード",
        required=True,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )

    password2 = forms.CharField(
        label="パスワード確認",
        required=True,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )

    school_name = forms.CharField(
        label="学校名",
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
    )

    school_password = forms.CharField(
        label="学校のパスワード",
        required=True,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'password1', 'password2')


class StudentSignUpForm(UserCreationForm):
    username = forms.CharField(
        label="名前",
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
    )

    password1 = forms.CharField(
        label="パスワード",
        required=True,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )

    password2 = forms.CharField(
        label="パスワード確認",
        required=True,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )

    student_number = forms.CharField(
        label="学生番号",
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            student_number = self.cleaned_data.get('student_number')
            Student.objects.create(user=user, student_number=student_number)
        return user