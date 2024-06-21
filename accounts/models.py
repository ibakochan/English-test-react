from django.contrib.auth.models import AbstractUser
from django.db import models





class CustomUser(AbstractUser):
    pass




class Sessions(models.Model):
    # Define fields for your Session model
    # You might want to add fields like session_id, start_time, end_time, etc.
    # For this example, I'll just include a field for session_name
    session_name = models.CharField(max_length=200, default=None)
    user = models.CharField(max_length=200, default=None)
    number = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)  # Change made here



    def __str__(self):
        return self.session_name