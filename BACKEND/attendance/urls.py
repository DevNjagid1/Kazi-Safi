from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api', views.AttendanceViewSet)

urlpatterns = [
    path('', views.attendance_list, name='attendance_list'),
    path('mark/', views.mark_attendance, name='mark_attendance'),
] + router.urls