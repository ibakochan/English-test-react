from django.urls import path, include
from . import views
from django.contrib.auth.decorators import user_passes_test
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'schools', views.SchoolViewSet)
router.register(r'classrooms', views.ClassroomViewSet)
router.register(r'name-id-tests', views.NameIdTestViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'test-questions', views.TestQuestionViewSet, basename='test-questions')
router.register(r'options', views.OptionViewSet)
router.register(r'test-records', views.TestRecordsViewSet)
router.register(r'sessions', views.SessionsViewSet)
router.register(r'only-sessions', views.OnlySessionsViewSet, basename='only-sessions')
router.register(r'users', views.CustomUserViewSet)
router.register(r'teachers', views.TeacherViewSet)  # Added TeacherViewSet
router.register(r'students', views.StudentViewSet)  # Added StudentViewSet



def is_superuser(user):
    return user.is_superuser



app_name='main'
urlpatterns = [
    path('api/', include(router.urls)),
    path('signup/student/', views.StudentSignUpView.as_view(), name='student_signup'),
    path('signup/teacher/', views.TeacherSignUpView.as_view(), name='teacher_signup'),
    path('', views.ProfilePageView.as_view(), name='profile'),
    path('join_classroom/', views.ClassroomJoinView.as_view(), name='join_classroom'),
    path('delete/<int:pk>/', views.AccountDeleteView.as_view(), name='delete_account'),
    path('school/create/', views.SchoolCreateView.as_view(), name='school_create'),
    path('classroom/<int:pk>/create/', views.ClassroomCreateView.as_view(), name='classroom_create'),
    path('test/<int:pk>/create/', views.TestCreateView.as_view(), name='test_create'),
    path('question/<int:pk>/create/', views.QuestionCreateView.as_view(), name='question_create'),
    path('option/<int:pk>/create/', views.OptionCreateView.as_view(), name='option_create'),
    path('school/picture/<int:pk>/', views.school_stream_file, name='school_picture'),
    path('classroom/picture/<int:pk>/', views.classroom_stream_file, name='classroom_picture'),
    path('test/picture/<int:pk>/', views.test_stream_file, name='test_picture'),
    path('question/picture/<int:pk>/', views.question_stream_file, name='question_picture'),
    path('question/sound/<int:pk>/', views.question_sound_file, name='question_sound'),
    path('option/picture/<int:pk>/', views.option_stream_file, name='option_picture'),
    path('test/<int:test_id>/question/<int:question_id>/submit/', views.TestAnswerView.as_view(), name='test_submit'),
    path('test/<int:pk>/record/', views.TestRecordView.as_view(), name='test_record'),
    path('question/<int:pk>/delete/', views.QuestionDeleteView.as_view(), name='question_delete'),
    path('option/<int:pk>/delete/', views.OptionDeleteView.as_view(), name='option_delete'),
    path('submissions/delete/', views.TestsubmissionsDeleteView.as_view(), name='submissions_delete'),
    path('test-classroom/<int:pk>/', views.TestClassroomView.as_view(), name='test-classroom'),
]