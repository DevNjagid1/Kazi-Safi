const storedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
if (!storedUser || storedUser.role !== 'employee') {
    window.location.href = 'login.html';
}
if (!storedUser.id) {
    window.location.href = 'login.html';
}
const currentEmployee = { ...storedUser, rate: storedUser.rate || 1500 };

function setEmployeeName() {
    const employeeNameEl = document.getElementById('employeeName');
    if (employeeNameEl) employeeNameEl.innerText = currentEmployee.name || 'Employee';
}

function calculateEarnings() {
    const attendance = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const transactions = JSON.parse(localStorage.getItem('mpesaTransactions')) || [];

    const approvedDays = attendance.filter(r => r.id === currentEmployee.id && r.status === 'approved');
    const myWithdrawals = transactions.filter(t => t.id === currentEmployee.id);

    const hourlyRate = currentEmployee.rate / 8;
    let totalGross = 0;

    const body = document.getElementById('earningsBody');
    body.innerHTML = '';

    approvedDays.forEach(day => {
        const otHrs = parseFloat(day.overtime) || 0;
        const otPay = otHrs * hourlyRate;
        const dayTotal = currentEmployee.rate + otPay;
        totalGross += dayTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${day.date}</td>
            <td>${day.day}</td>
            <td>${otHrs} h</td>
            <td style="font-weight:600; color:#059669">KES ${dayTotal.toLocaleString()}</td>
        `;
        body.appendChild(row);
    });

    const totalWithdrawn = myWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const balance = Math.max(0, totalGross - totalWithdrawn);

    document.getElementById('daysWorked').innerText = approvedDays.length;
    document.getElementById('totalEarned').innerText = `KES ${totalGross.toLocaleString()}`;
    document.getElementById('availableBalance').innerText = `KES ${balance.toLocaleString()}`;

    document.getElementById('formulaText').innerText = 
        `Earnings = (${approvedDays.length} days × KES ${currentEmployee.rate.toLocaleString()}) + (${(totalGross - (approvedDays.length * currentEmployee.rate)).toLocaleString()} OT Pay) = KES ${totalGross.toLocaleString()}`;

    document.getElementById('calcTotal').innerText = `KES ${totalGross.toLocaleString()}`;
    document.getElementById('calcWithdrawn').innerText = `- KES ${totalWithdrawn.toLocaleString()}`;
    document.getElementById('calcBalance').innerText = `= KES ${balance.toLocaleString()}`;
}

function handleLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
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
    calculateEarnings();
    handleLogout();
    manageActiveLink();
});