from django import forms
from main.models import School, Classroom, Test, Question, Option, UserTestSubmission
from django.core.files.uploadedfile import InMemoryUploadedFile
from accounts.models import CustomUser
from main.humanize import naturalsize
from django.forms import DateInput
from django.core.exceptions import ValidationError

class ClassroomJoinForm(forms.Form):
    classroom_name = forms.CharField(
        label="教室名",
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
    )
    classroom_password = forms.CharField(
        label="教室のパスワード",
        required=True,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )

class ConnectTestForm(forms.ModelForm):

    class Meta:
        model = Test
        fields = ['classroom']  # Only include the 'classroom' field

        # Define widgets for styling
        widgets = {
            'classroom': forms.CheckboxSelectMultiple(attrs={'class': 'form-check-input'})  # Use CheckboxSelectMultiple for ManyToManyField
        }


class SingleCheckboxSelect(forms.CheckboxSelectMultiple):
    def value_from_datadict(self, data, files, name):
        value = super().value_from_datadict(data, files, name)
        if isinstance(value, list):
            return value[0] if value else None
        return value



class TestSubmissionForm(forms.ModelForm):

    class Meta:
        model = UserTestSubmission
        fields = ['selected_option']
        widgets = {
            'selected_option': forms.RadioSelect(),
        }



class SchoolCreateForm(forms.ModelForm):
    # This is a form for creating a schedule.
    # You can write a title, choose color, category and upload a picture.
    max_upload_limit = 2 * 1024 * 1024
    max_upload_limit_text = naturalsize(max_upload_limit)

    school_picture = forms.FileField(required=False, label='Picture upload limit <= '+max_upload_limit_text)
    upload_field_name = 'school_picture'



    class Meta:
        model = School
        fields = ['school_name', 'school_password', 'school_picture']

        #Using widgets again for some style.
    widgets = {
        'name': forms.TextInput(attrs={'class': 'form-control'}),
        'hashed_password': forms.TextInput(attrs={'class': 'form-control'}),
    }

    def clean(self):
        cleaned_data = super().clean()
        school = cleaned_data.get('school_picture')
        if school is None:
            return
        if len(school) > self.max_upload_limit:
            self.add_error('schohol_picture', "File must be < "+self.max_upload_limit_text+" bytes")



    def save(self, commit=True):
        instance = super(SchoolCreateForm, self).save(commit=False)

        f = instance.school_picture
        if isinstance(f, InMemoryUploadedFile):
            bytearr = f.read()
            instance.school_content_type = f.content_type
            instance.school_picture = bytearr

        if commit:
            instance.save()

        return instance




class ClassroomCreateForm(forms.ModelForm):
    # This is a form for creating a schedule.
    # You can write a title, choose color, category and upload a picture.
    max_upload_limit = 2 * 1024 * 1024
    max_upload_limit_text = naturalsize(max_upload_limit)

    classroom_picture = forms.FileField(required=False, label='Picture upload limit <= '+max_upload_limit_text)
    upload_field_name = 'classroom_picture'



    class Meta:
        model = Classroom
        fields = ['name', 'hashed_password', 'classroom_picture']

        #Using widgets again for some style.
    widgets = {
        'name': forms.TextInput(attrs={'class': 'form-control'}),
        'hashed_password': forms.TextInput(attrs={'class': 'form-control'}),
    }

    def clean(self):
        cleaned_data = super().clean()
        test = cleaned_data.get('classroom_picture')
        if test is None:
            return
        if len(test) > self.max_upload_limit:
            self.add_error('classroom_picture', "File must be < "+self.max_upload_limit_text+" bytes")



    def save(self, commit=True):
        instance = super(ClassroomCreateForm, self).save(commit=False)

        f = instance.classroom_picture
        if isinstance(f, InMemoryUploadedFile):
            bytearr = f.read()
            instance.classroom_content_type = f.content_type
            instance.classroom_picture = bytearr

        if commit:
            instance.save()

        return instance





class TestCreateForm(forms.ModelForm):
    # This is a form for creating a schedule.
    # You can write a title, choose color, category and upload a picture.
    max_upload_limit = 2 * 1024 * 1024
    max_upload_limit_text = naturalsize(max_upload_limit)

    test_picture = forms.FileField(required=False, label='Picture upload limit <= '+max_upload_limit_text)
    upload_field_name = 'test_picture'



    class Meta:
        model = Test
        fields = ['name', 'test_picture']

        #Using widgets again for some style.
    widgets = {
        'name': forms.TextInput(attrs={'class': 'form-control'}),
    }

    def clean(self):
        cleaned_data = super().clean()
        test = cleaned_data.get('test_picture')
        if test is None:
            return
        if len(test) > self.max_upload_limit:
            self.add_error('test_picture', "File must be < "+self.max_upload_limit_text+" bytes")



    def save(self, commit=True):
        instance = super(TestCreateForm, self).save(commit=False)

        f = instance.test_picture
        if isinstance(f, InMemoryUploadedFile):
            bytearr = f.read()
            instance.test_content_type = f.content_type
            instance.test_picture = bytearr

        if commit:
            instance.save()

        return instance


class QuestionCreateForm(forms.ModelForm):
    # This is a form for creating a schedule.
    # You can write a title, choose color, category and upload a picture.
    max_upload_limit = 2 * 1024 * 1024
    max_upload_limit_text = naturalsize(max_upload_limit)
    max_sound_upload_limit = 2 * 1024 * 1024
    max_sound_upload_limit_text = naturalsize(max_sound_upload_limit)

    question_picture = forms.FileField(required=False, label='Picture upload limit <= '+max_upload_limit_text)
    upload_field_name = 'question_picture'
    question_sound = forms.FileField(required=False, label='Sound upload limit <= '+max_sound_upload_limit_text)
    upload_sound_field_name = 'question_sound'



    class Meta:
        model = Question
        fields = ['name', 'question_picture', 'question_sound']

        #Using widgets again for some style.
    widgets = {
        'name': forms.TextInput(attrs={'class': 'form-control'}),
    }

    def clean(self):
        cleaned_data = super().clean()
        question = cleaned_data.get('question_picture')
        if question is None:
            return
        if len(question) > self.max_upload_limit:
            self.add_error('question_picture', "Picture must be < "+self.max_upload_limit_text+" bytes")

        question_s = cleaned_data.get('question_sound')
        if question_s is None:
            return
        if len(question_s) > self.max_sound_upload_limit:
            self.add_error('question_sound', "Sound must be < "+self.max_sound_upload_limit_text+" bytes")



    def save(self, commit=True):
        instance = super(QuestionCreateForm, self).save(commit=False)

        f = instance.question_picture
        f_s = instance.question_sound
        if isinstance(f, InMemoryUploadedFile):
            bytearr = f.read()
            instance.content_type = f.content_type
            instance.question_picture = bytearr
        if isinstance(f_s, InMemoryUploadedFile):
            bytearr = f_s.read()
            instance.sound_content_type = f_s.content_type
            instance.question_sound = bytearr

        if commit:
            instance.save()

        return instance


class OptionCreateForm(forms.ModelForm):
    # This is a form for creating a schedule.
    # You can write a title, choose color, category and upload a picture.
    max_upload_limit = 2 * 1024 * 1024
    max_upload_limit_text = naturalsize(max_upload_limit)

    option_picture = forms.FileField(required=False, label='Picture upload limit <= '+max_upload_limit_text)
    upload_field_name = 'option_picture'



    class Meta:
        model = Option
        fields = ['name', 'option_picture', 'is_correct']

        #Using widgets again for some style.
    widgets = {
        'name': forms.TextInput(attrs={'class': 'form-control'}),
    }


    def clean(self):
        cleaned_data = super().clean()
        option = cleaned_data.get('option_picture')
        if option is None:
            return
        if len(option) > self.max_upload_limit:
            self.add_error('option_picture', "File must be < "+self.max_upload_limit_text+" bytes")



    def save(self, commit=True):
        instance = super(OptionCreateForm, self).save(commit=False)

        f = instance.option_picture
        if isinstance(f, InMemoryUploadedFile):
            bytearr = f.read()
            instance.option_content_type = f.content_type
            instance.option_picture = bytearr

        if commit:
            instance.save()

        return instance
