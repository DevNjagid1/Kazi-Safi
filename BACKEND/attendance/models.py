from django.db import models
from django.contrib.auth.models import User

class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)
    overtime = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=[('present', 'Present'), ('absent', 'Absent'), ('late', 'Late'), ('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')])
