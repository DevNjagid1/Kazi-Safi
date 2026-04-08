from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api', views.EmployeeViewSet)

urlpatterns = [
    path('', views.employee_list, name='employee_list'),
    path('<int:pk>/', views.employee_detail, name='employee_detail'),
    path('admin/', views.admin_employee_list, name='admin_employee_list'),
    path('edit/<int:pk>/', views.edit_employee, name='edit_employee'),
] + router.urls