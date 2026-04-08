const storedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
if (!storedUser || storedUser.role !== 'admin') {
    window.location.href = 'login.html';
}
const navItems = document.querySelectorAll('.nav-item');
const logoutBtn = document.getElementById('logoutBtn');
const viewAllBtn = document.querySelector('.view-all');
const statCards = document.querySelectorAll('.stat-card');

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

async function loadStats() {
    try {
        const response = await fetch('http://localhost:8000/payroll/stats/', {
            headers: getAuthHeaders()
        });
        const stats = await response.json();
        document.getElementById('total-employees').textContent = stats.total_employees;
        document.getElementById('pending-attendance').textContent = stats.pending_attendance;
        document.getElementById('total-payroll').textContent = 'KES ' + parseFloat(stats.total_payroll).toLocaleString();
        document.getElementById('total-withdrawals').textContent = 'KES ' + parseFloat(stats.total_withdrawals).toLocaleString();
        document.getElementById('company-balance').textContent = 'KES ' + parseFloat(stats.company_balance).toLocaleString();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

const depositForm = document.getElementById('depositForm');
if (depositForm) {
    depositForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const amount = document.getElementById('depositAmount').value;
        const description = document.getElementById('depositDescription').value;
        try {
            const response = await fetch('http://localhost:8000/payroll/deposit/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    description: description,
                    deposited_by: 1  // Assume admin id 1
                })
            });
            if (response.ok) {
                loadStats();
                depositForm.reset();
            } else {
                console.error('Error depositing');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

if (viewAllBtn) {
    viewAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const attendanceNav = Array.from(navItems).find(link => link.textContent === 'Attendance');
        if (attendanceNav) {
            attendanceNav.click();
        }
    });
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

statCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
        card.style.transition = 'transform 0.2s ease';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
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
    loadStats();
});