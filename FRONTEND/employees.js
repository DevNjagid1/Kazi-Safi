const storedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
if (!storedUser || storedUser.role !== 'admin') {
    window.location.href = 'login.html';
}
const modal = document.getElementById('employeeModal');
const editModal = document.getElementById('editEmployeeModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModal = document.getElementById('closeModal');
const closeEditModal = document.getElementById('closeEditModal');
const employeeForm = document.getElementById('addEmployeeForm');
const editEmployeeForm = document.getElementById('editEmployeeForm');
const employeeTableBody = document.querySelector('#employeeTable tbody');
const searchInput = document.getElementById('employeeSearch');
const logoutBtn = document.getElementById('logoutBtn');

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if(confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('access_token');
            window.location.href = 'login.html';
        }
    });
}

openModalBtn.addEventListener('click', () => modal.style.display = 'block');
closeModal.addEventListener('click', () => modal.style.display = 'none');
closeEditModal.addEventListener('click', () => editModal.style.display = 'none');
window.addEventListener('click', (e) => { 
    if (e.target == modal) modal.style.display = 'none'; 
    if (e.target == editModal) editModal.style.display = 'none'; 
});

async function loadEmployees() {
    try {
        const response = await fetch('http://localhost:8000/employees/api/', {
            headers: getAuthHeaders()
        });
        const employees = await response.json();
        employeeTableBody.innerHTML = '';
        employees.forEach(employee => {
            const initials = employee.user_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            const statusClass = employee.status === 'active' ? 'active' : 'disabled';
            const statusText = employee.status === 'active' ? 'Active' : 'Inactive';
            const toggleText = employee.status === 'active' ? 'Disable' : 'Activate';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="user-cell"><span class="avatar">${initials}</span><span>${employee.user_name}</span></div></td>
                <td>${employee.employee_id}</td>
                <td>${employee.user_email}</td>
                <td>${employee.phone || ''}</td>
                <td>KES ${parseFloat(employee.salary).toLocaleString()}</td>
                <td>${employee.hire_date}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td><button class="edit-btn" data-id="${employee.id}">Edit</button> <button class="toggle-status-btn" data-id="${employee.id}">${toggleText}</button></td>
            `;
            employeeTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

employeeForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('newName').value;
    const id = document.getElementById('newId').value;
    const email = document.getElementById('newEmail').value;
    const phone = document.getElementById('newPhone').value;
    const rate = document.getElementById('newRate').value;
    const date = document.getElementById('newDate').value;

    const employeeData = {
        employee_id: id,
        department: '',
        position: '',
        hire_date: date,
        salary: parseFloat(rate),
        phone: phone,
        user_name: name,
        user_email: email,
        password: 'defaultpassword'
    };

    try {
        const response = await fetch('http://localhost:8000/employees/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(employeeData)
        });
        if (response.ok) {
            loadEmployees(); // Reload to show new employee
        } else {
            console.error('Error adding employee');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    employeeForm.reset();
    modal.style.display = 'none';
});

document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('toggle-status-btn')) {
        const btn = e.target;
        const id = btn.getAttribute('data-id');
        
        try {
            const response = await fetch(`http://localhost:8000/employees/api/${id}/toggle_status/`, {
                method: 'PATCH',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                loadEmployees(); // Reload to show updated status
            } else {
                console.error('Error toggling status');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else if (e.target.classList.contains('edit-btn')) {
        const id = e.target.getAttribute('data-id');
        // Fetch employee details and populate edit modal
        try {
            const response = await fetch(`http://localhost:8000/employees/api/${id}/`, {
                headers: getAuthHeaders()
            });
            const employee = await response.json();
            document.getElementById('editId').value = employee.id;
            document.getElementById('editEmployeeId').value = employee.employee_id;
            document.getElementById('editDepartment').value = employee.department;
            document.getElementById('editPosition').value = employee.position;
            document.getElementById('editSalary').value = employee.salary;
            document.getElementById('editPhone').value = employee.phone;
            document.getElementById('editStatus').value = employee.status;
            editModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    }
});

editEmployeeForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const employeeId = document.getElementById('editEmployeeId').value;
    const department = document.getElementById('editDepartment').value;
    const position = document.getElementById('editPosition').value;
    const salary = document.getElementById('editSalary').value;
    const phone = document.getElementById('editPhone').value;
    const status = document.getElementById('editStatus').value;

    const employeeData = {
        employee_id: employeeId,
        department: department,
        position: position,
        salary: parseFloat(salary),
        phone: phone,
        status: status
    };

    try {
        const response = await fetch(`http://localhost:8000/employees/api/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(employeeData)
        });
        if (response.ok) {
            editModal.style.display = 'none';
            loadEmployees(); // Reload to show changes
        } else {
            console.error('Error updating employee');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

searchInput.addEventListener('keyup', function(e) {
    const term = e.target.value.toLowerCase();
    const rows = employeeTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none';
    });
});

function manageActiveLink() {
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    manageActiveLink();
    loadEmployees();
});