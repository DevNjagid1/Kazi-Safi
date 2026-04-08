from rest_framework.decorators import action
from rest_framework.response import Response

@login_required
def employee_list(request):
    employees = Employee.objects.all()
    return render(request, 'employees.html', {'employees': employees})

@login_required
def admin_employee_list(request):
    try:
        profile = Profile.objects.get(user=request.user)
        if profile.role == 'admin':
            employees = Employee.objects.all()
            return render(request, 'admin_employees.html', {'employees': employees})
    except Profile.DoesNotExist:
        pass
    return redirect('employee_list')

@login_required
def employee_detail(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    return render(request, 'employee_detail.html', {'employee': employee})

@login_required
def edit_employee(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == 'POST':
        employee.employee_id = request.POST.get('employee_id', employee.employee_id)
        employee.department = request.POST.get('department', employee.department)
        employee.position = request.POST.get('position', employee.position)
        employee.salary = request.POST.get('salary', employee.salary)
        employee.phone = request.POST.get('phone', employee.phone)
        employee.status = request.POST.get('status', employee.status)
        employee.save()
        return redirect('admin_employee_list')
    return render(request, 'edit_employee.html', {'employee': employee})

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            profile = Profile.objects.get(user=user)
            if profile.role == 'admin':
                return Employee.objects.all()
        except Profile.DoesNotExist:
            pass
        return Employee.objects.filter(user=user)

    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        employee = self.get_object()
        employee.status = 'inactive' if employee.status == 'active' else 'active'
        employee.save()
        serializer = self.get_serializer(employee)
        return Response(serializer.data)
