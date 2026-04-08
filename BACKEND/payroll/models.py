from django.db import models
from django.contrib.auth.models import User

class Payroll(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.DateField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.BooleanField(default=False)

class Withdrawal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    receipt_number = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Deposit(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    deposited_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class CompanyBalance(models.Model):
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_balance(cls):
        balance_obj, created = cls.objects.get_or_create(id=1, defaults={'balance': 0})
        return balance_obj.balance

    @classmethod
    def update_balance(cls, amount):
        balance_obj, created = cls.objects.get_or_create(id=1, defaults={'balance': 0})
        balance_obj.balance += amount
        balance_obj.save()
        return balance_obj.balance
