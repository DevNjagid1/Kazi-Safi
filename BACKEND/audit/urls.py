from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api', views.AuditLogViewSet)

urlpatterns = [
    path('', views.audit_logs, name='audit_logs'),
] + router.urls