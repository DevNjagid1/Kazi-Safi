from django.db import models
from django.contrib.auth.models import User

class SupportTicket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)
    message = models.TextField()
    category = models.CharField(max_length=50, default='Other')
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('in_progress', 'In Progress'), ('closed', 'Closed')], default='open')
    response = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
