from rest_framework import serializers
from .models import Employee
from django.contrib.auth.models import User
from accounts.models import Profile

class EmployeeSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    hire_date = serializers.DateField(format='%b %d, %Y')
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Employee
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.pop('password', 'defaultpassword')
        user_data = {
            'username': validated_data['employee_id'],
            'email': validated_data.get('user_email', ''),
            'first_name': validated_data.get('user_name', '').split()[0] if validated_data.get('user_name') else '',
            'last_name': ' '.join(validated_data.get('user_name', '').split()[1:]) if validated_data.get('user_name') else '',
        }
        user = User.objects.create_user(**user_data, password=password)
        Profile.objects.create(user=user, role='employee')
        validated_data['user'] = user
        return super().create(validated_data)