from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('employee', 'Employee')])
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
