from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api', views.SupportTicketViewSet)

urlpatterns = [
    path('', views.support_inbox, name='support_inbox'),
    path('create/', views.create_ticket, name='create_ticket'),
    path('admin/', views.admin_support_inbox, name='admin_support_inbox'),
    path('update/<int:ticket_id>/', views.update_ticket, name='update_ticket'),
] + router.urls