#!/usr/bin/env python
import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'attendance_system.settings')
django.setup()

from django.contrib.auth.models import User
from employees.models import Employee

# Fix EMP001 - change from Meshack Masha to Jane Wanjiku
try:
    emp1 = Employee.objects.get(employee_id='EMP001')
    emp1.user.first_name = 'Jane'
    emp1.user.last_name = 'Wanjiku'
    emp1.user.email = 'jane.wanjiku@kazisafi.co.ke'
    emp1.user.username = 'jane_wanjiku'
    emp1.phone = '+254700100001'
    emp1.user.save()
    emp1.save()
    print("✓ Updated EMP001 to Jane Wanjiku")
except Employee.DoesNotExist:
    print("✗ EMP001 not found")

# Add EMP002 - Meshack Masha
if not Employee.objects.filter(employee_id='EMP002').exists():
    if not User.objects.filter(username='meshack_masha').exists():
        try:
            user2 = User.objects.create_user(
                username='meshack_masha',
                email='meshack.masha@kazisafi.co.ke',
                password='password123',
                first_name='Meshack',
                last_name='Masha'
            )
            Employee.objects.create(
                user=user2,
                employee_id='EMP002',
                department='General',
                position='Employee',
                hire_date=date(2024, 1, 1),
                salary=1500,
                phone='+254797407512'
            )
            print("✓ Created EMP002: Meshack Masha")
        except Exception as e:
            print(f"✗ Error creating EMP002: {e}")
    else:
        # User exists but no employee record
        try:
            user = User.objects.get(username='meshack_masha')
            Employee.objects.create(
                user=user,
                employee_id='EMP002',
                department='General',
                position='Employee',
                hire_date=date(2024, 1, 1),
                salary=1500,
                phone='+254797407512'
            )
            print("✓ Created EMP002 employee record for Meshack Masha")
        except Exception as e:
            print(f"✗ Error creating EMP002 record: {e}")
else:
    print("✗ EMP002 already exists")

# Add EMP008 - John Otieno
if not Employee.objects.filter(employee_id='EMP008').exists():
    if not User.objects.filter(username='john_otieno').exists():
        try:
            user8 = User.objects.create_user(
                username='john_otieno',
                email='john.otieno@kazisafi.co.ke',
                password='password123',
                first_name='John',
                last_name='Otieno'
            )
            Employee.objects.create(
                user=user8,
                employee_id='EMP008',
                department='General',
                position='Employee',
                hire_date=date(2024, 1, 1),
                salary=1500,
                phone='+254700100008'
            )
            print("✓ Created EMP008: John Otieno")
        except Exception as e:
            print(f"✗ Error creating EMP008: {e}")
    else:
        # User exists but no employee record
        try:
            user = User.objects.get(username='john_otieno')
            Employee.objects.create(
                user=user,
                employee_id='EMP008',
                department='General',
                position='Employee',
                hire_date=date(2024, 1, 1),
                salary=1500,
                phone='+254700100008'
            )
            print("✓ Created EMP008 employee record for John Otieno")
        except Exception as e:
            print(f"✗ Error creating EMP008 record: {e}")
else:
    print("✗ EMP008 already exists")

print("\n=== Final Employee List ===")
emps = Employee.objects.all().order_by('employee_id')
for emp in emps:
    print(f"{emp.employee_id}: {emp.user.first_name} {emp.user.last_name} ({emp.phone})")
