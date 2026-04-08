from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import AuditLog
from .serializers import AuditLogSerializer

def is_admin(user):
    return user.profile.role == 'admin'

@login_required
@user_passes_test(is_admin)
def audit_logs(request):
    logs = AuditLog.objects.all()
    return render(request, 'audit.html', {'logs': logs})

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
