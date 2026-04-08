#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'attendance_system.settings')
django.setup()

from django.contrib.auth.models import User
from employees.models import Employee

users = User.objects.all()
print(f"Total users: {users.count()}")
print("\nAll users in database:")
for user in users:
    print(f"  - {user.username}: {user.first_name} {user.last_name} ({user.email})")

print("\nAll employees in database:")
emps = Employee.objects.all()
print(f"Total employees: {emps.count()}")
for emp in emps:
    print(f"  - {emp.employee_id}: {emp.user.first_name} {emp.user.last_name} ({emp.phone})")
