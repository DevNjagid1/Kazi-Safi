from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'payroll/api', views.PayrollViewSet)
router.register(r'withdrawal/api', views.WithdrawalViewSet)
router.register(r'deposit/api', views.DepositViewSet)

urlpatterns = [
    path('', views.payroll_list, name='payroll_list'),
    path('withdraw/', views.withdraw_to_mpesa, name='withdraw_to_mpesa'),
    path('stats/', views.get_stats, name='get_stats'),
] + router.urls