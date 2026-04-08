from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SupportTicket
from .serializers import SupportTicketSerializer
from accounts.models import Profile

@login_required
def support_inbox(request):
    tickets = SupportTicket.objects.filter(user=request.user)
    return render(request, 'support.html', {'tickets': tickets})

@login_required
def admin_support_inbox(request):
    try:
        profile = Profile.objects.get(user=request.user)
        if profile.role == 'admin':
            tickets = SupportTicket.objects.all()
            return render(request, 'admin_support_inbox.html', {'tickets': tickets})
    except Profile.DoesNotExist:
        pass
    return redirect('support_inbox')

@login_required
def update_ticket(request, ticket_id):
    ticket = get_object_or_404(SupportTicket, id=ticket_id)
    if request.method == 'POST':
        ticket.response = request.POST.get('response', '')
        ticket.status = request.POST.get('status', ticket.status)
        ticket.save()
    return redirect('admin_support_inbox')

@login_required
def create_ticket(request):
    if request.method == 'POST':
        subject = request.POST['subject']
        message = request.POST['message']
        SupportTicket.objects.create(user=request.user, subject=subject, message=message)
        return redirect('support_inbox')
    return render(request, 'create_ticket.html')

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            profile = Profile.objects.get(user=user)
            if profile.role == 'admin':
                return SupportTicket.objects.all()
        except Profile.DoesNotExist:
            pass
        return SupportTicket.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
