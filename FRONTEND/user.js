const storedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
if (!storedUser || storedUser.role !== 'employee') {
    window.location.href = 'login.html';
}

if (!storedUser.id) {
    window.location.href = 'login.html';
}

const currentEmployee = { ...storedUser, rate: storedUser.rate || 1500 };
let attendanceRecords = [];
let withdrawalRecords = [];

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function setEmployeeName() {
    const employeeNameEl = document.getElementById('employeeName');
    const welcomeNameEl = document.getElementById('welcomeName');
    if (employeeNameEl) employeeNameEl.innerText = currentEmployee.name;
    if (welcomeNameEl) welcomeNameEl.innerText = currentEmployee.name;
}

async function fetchAttendanceAndWithdrawals() {
    try {
        const attResponse = await fetch('http://localhost:8000/attendance/api/', {
            headers: getAuthHeaders()
        });
        if (attResponse.ok) {
            attendanceRecords = await attResponse.json();
        }
        
        const withResponse = await fetch('http://localhost:8000/payroll/withdrawal/api/', {
            headers: getAuthHeaders()
        });
        if (withResponse.ok) {
            withdrawalRecords = await withResponse.json();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        attendanceRecords = [];
        withdrawalRecords = [];
    }
    updateDashboard();
}

function updateDashboard() {
    const myAttendance = attendanceRecords.filter(r => r.user === currentEmployee.id);
    const myWithdrawals = withdrawalRecords.filter(w => w.user === currentEmployee.id);

    const approvedDays = myAttendance.filter(r => r.status === 'approved');

    let totalEarned = 0;

    approvedDays.forEach(day => {
        const ot = parseFloat(day.overtime) || 0;
        totalEarned += currentEmployee.rate + (ot * (currentEmployee.rate / 8));
    });

    const totalWithdrawn = myWithdrawals.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const balance = Math.max(0, totalEarned - totalWithdrawn);

    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length > 0) statValues[0].innerText = approvedDays.length;
    if (statValues.length > 2) statValues[2].innerText = `KES ${totalEarned.toLocaleString()}`;
    if (statValues.length > 3) statValues[3].innerText = `KES ${balance.toLocaleString()}`;

    renderAttendance(myAttendance);
    renderWithdrawals(myWithdrawals);
}

function renderAttendance(records) {
    const boxes = document.querySelectorAll('.data-box');
    if (boxes.length === 0) return;
    const box = boxes[0];

    const items = records.slice(-3).reverse().map(r => {
        const dateLabel = r.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A';
        return `<p>${dateLabel} - ${r.status || 'pending'}</p>`;
    }).join('');

    box.innerHTML = `<h3>Recent Attendance</h3>${items}`;
}

function renderWithdrawals(records) {
    const boxes = document.querySelectorAll('.data-box');
    if (boxes.length < 2) return;
    const box = boxes[1];

    const items = records.slice(-2).reverse().map(w => {
        const dateLabel = w.created_at ? new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A';
        return `<p>KES ${parseFloat(w.amount || 0).toLocaleString()} - ${dateLabel}</p>`;
    }).join('');

    box.innerHTML = `<h3>Recent Withdrawals</h3>${items}`;
}

function handleLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        window.location.href = 'login.html';
    });
}

function manageActiveLink() {
    const currentPath = window.location.pathname.split('/').pop();
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

document.addEventListener('DOMContentLoaded', () => {
    setEmployeeName();
    updateDashboard();
    handleLogout();
    manageActiveLink();
});