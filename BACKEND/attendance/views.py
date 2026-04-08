from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Attendance
from .serializers import AttendanceSerializer
from accounts.models import Profile

@login_required
def attendance_list(request):
    attendances = Attendance.objects.filter(user=request.user)
    return render(request, 'attendance.html', {'attendances': attendances})

@login_required
def mark_attendance(request):
    today = date.today()
    attendance, created = Attendance.objects.get_or_create(user=request.user, date=today)
    if request.method == 'POST':
        if 'check_in' in request.POST:
            attendance.check_in = request.POST['check_in']
        if 'check_out' in request.POST:
            attendance.check_out = request.POST['check_out']
        attendance.save()
    return render(request, 'mark_attendance.html', {'attendance': attendance})

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            profile = Profile.objects.get(user=user)
            if profile.role == 'admin':
                return Attendance.objects.all()
        except Profile.DoesNotExist:
            pass
        return Attendance.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
