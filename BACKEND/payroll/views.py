from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Payroll, Withdrawal, Deposit, CompanyBalance
from .serializers import PayrollSerializer, WithdrawalSerializer, DepositSerializer
from employees.models import Employee
from attendance.models import Attendance
from django.db.models import Sum
from accounts.models import Profile
import random
import string

@login_required
def payroll_list(request):
    payrolls = Payroll.objects.filter(user=request.user)
    return render(request, 'payroll.html', {'payrolls': payrolls})

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            profile = Profile.objects.get(user=user)
            if profile.role == 'admin':
                return Payroll.objects.all()
        except Profile.DoesNotExist:
            pass
        return Payroll.objects.filter(user=user)

class WithdrawalViewSet(viewsets.ModelViewSet):
    queryset = Withdrawal.objects.all()
    serializer_class = WithdrawalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            profile = Profile.objects.get(user=user)
            if profile.role == 'admin':
                return Withdrawal.objects.all()
        except Profile.DoesNotExist:
            pass
        return Withdrawal.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DepositViewSet(viewsets.ModelViewSet):
    queryset = Deposit.objects.all()
    serializer_class = DepositSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        deposit = serializer.save()
        CompanyBalance.update_balance(deposit.amount)

@api_view(['POST'])
def withdraw_to_mpesa(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    amount = request.data.get('amount')
    phone = request.data.get('phone', '254700100001')
    
    if not amount or float(amount) < 50:
        return Response({'error': 'Minimum withdrawal is KES 50'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Simulate M-Pesa transaction
    receipt = 'MPESA-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    
    withdrawal = Withdrawal.objects.create(
        user=request.user,
        amount=amount,
        receipt_number=receipt,
        status='completed'
    )
    
    return Response({
        'message': f'KES {amount} sent to M-Pesa successfully!',
        'receipt': receipt,
        'status': 'completed'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_stats(request):
    total_employees = Employee.objects.count()
    active_employees = Employee.objects.filter(status='active').count()
    pending_attendance = Attendance.objects.filter(status='pending').count()
    total_payroll = Payroll.objects.aggregate(total=models.Sum('net_salary'))['total'] or 0
    total_withdrawals = Withdrawal.objects.filter(status='completed').aggregate(total=models.Sum('amount'))['total'] or 0
    company_balance = CompanyBalance.get_balance()

    return Response({
        'total_employees': total_employees,
        'active_employees': active_employees,
        'pending_attendance': pending_attendance,
        'total_payroll': total_payroll,
        'total_withdrawals': total_withdrawals,
        'company_balance': company_balance
    })
