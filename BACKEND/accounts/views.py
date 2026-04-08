from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile
from .serializers import UserSerializer

def login_view(request):
    if request.method == 'POST':
        identifier = request.POST['username']  # Can be username or email
        password = request.POST['password']
        user = authenticate(request, username=identifier, password=password)
        if user is None:
            # Try email
            try:
                user_obj = User.objects.get(email=identifier)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        if user is not None:
            login(request, user)
            try:
                profile = Profile.objects.get(user=user)
                if profile.role == 'admin':
                    return redirect('admin_dashboard')
                else:
                    return redirect('dashboard')
            except Profile.DoesNotExist:
                messages.error(request, 'Profile not found')
        else:
            messages.error(request, 'Invalid credentials')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

def dashboard(request):
    return render(request, 'dashboard.html')

def admin_dashboard(request):
    return render(request, 'admin-dashboard.html')

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    identifier = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=identifier, password=password)
    if user is None:
        try:
            user_obj = User.objects.get(email=identifier)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_400_BAD_REQUEST)

    user_data = UserSerializer(user).data
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': user_data,
        'role': profile.role,
        'phone': profile.phone,
        'address': profile.address
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')

    if not name or not email or not password:
        return Response({'error': 'Name, email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    base_username = email.split('@')[0]
    username = base_username
    count = User.objects.filter(username__startswith=base_username).count()
    if count:
        username = f"{base_username}{count + 1}"

    first_name = name.split()[0]
    last_name = ' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    Profile.objects.create(user=user, role='employee')

    refresh = RefreshToken.for_user(user)
    user_data = UserSerializer(user).data
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': user_data,
        'role': 'employee'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    profile = Profile.objects.get(user=request.user)
    return Response({
        'role': profile.role,
        'phone': profile.phone,
        'address': profile.address
    })
