#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'attendance_system.settings')
django.setup()

from django.contrib.auth.models import User
from employees.models import Employee
from accounts.models import Profile
from datetime import date

employees = [
    {'id': 'EMP003', 'username': 'mary_akinyi', 'email': 'mary.akinyi@kazisafi.co.ke', 'name': 'Mary Akinyi', 'phone': '+254700100003'},
    {'id': 'EMP004', 'username': 'samuel_kamau', 'email': 'samuel.kamau@kazisafi.co.ke', 'name': 'Samuel Kamau', 'phone': '+254700100004'},
    {'id': 'EMP005', 'username': 'catherine_mutua', 'email': 'catherine.mutua@kazisafi.co.ke', 'name': 'Catherine Mutua', 'phone': '+254700100005'},
    {'id': 'EMP006', 'username': 'david_kiprono', 'email': 'david.kiprono@kazisafi.co.ke', 'name': 'David Kiprono', 'phone': '+254700100006'},
    {'id': 'EMP007', 'username': 'alice_njeri', 'email': 'alice.njeri@kazisafi.co.ke', 'name': 'Alice Njeri', 'phone': '+254700100007'},
    {'id': 'EMP008', 'username': 'john_otieno', 'email': 'john.otieno@kazisafi.co.ke', 'name': 'John Otieno', 'phone': '+254700100008'},
]

for emp in employees:
    if not User.objects.filter(username=emp['username']).exists():
        user = User.objects.create_user(
            username=emp['username'],
            email=emp['email'],
            password='password123',
            first_name=emp['name'].split()[0],
            last_name=emp['name'].split()[-1]
        )
        Profile.objects.create(user=user, role='employee')
        Employee.objects.create(
            user=user,
            employee_id=emp['id'],
            department='General',
            position='Employee',
            hire_date=date(2024, 1, 1),
            salary=1500,
            phone=emp['phone']
        )
        print(f"✓ Created {emp['name']} ({emp['id']})")
    else:
        print(f"✗ {emp['username']} already exists")

print("\nAll employees initialized successfully!")
