const storedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
if (!storedUser || storedUser.role !== 'admin') {
    window.location.href = 'login.html';
}
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if(confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    });
}
const auditLogs = [
    { timestamp: 'Feb 20, 2026', time: '05:06:50', user: 'John Kamau', role: 'JK', action: 'RESOLVE TICKET', type: 'support', details: 'Resolved ticket TKT-2026-0001' },
    { timestamp: 'Feb 20, 2026', time: '03:11:52', user: 'John Kamau', role: 'JK', action: 'LOGIN', type: 'login', details: 'Admin logged in successfully' },
    { timestamp: 'Feb 20, 2026', time: '03:06:01', user: 'John Kamau', role: 'JK', action: 'LOGOUT', type: 'login', details: 'Admin logged out' },
    { timestamp: 'Feb 6, 2026', time: '08:00:00', user: 'John Kamau', role: 'JK', action: 'LOGIN', type: 'login', details: 'Admin logged in successfully' },
    { timestamp: 'Feb 1, 2026', time: '09:00:00', user: 'John Kamau', role: 'JK', action: 'APPROVE ATTENDANCE', type: 'attendance', details: 'Approved attendance for Jane Wanjiku (2026-02-01)' },
    { timestamp: 'Jan 10, 2026', time: '11:30:00', user: 'John Kamau', role: 'JK', action: 'CREATE EMPLOYEE', type: 'employee', details: 'Created employee account for Mary Akinyi' },
    { timestamp: 'Jan 28, 2026', time: '14:30:00', user: 'Jane Wanjiku', role: 'JW', action: 'WITHDRAWAL', type: 'withdrawal', details: 'Withdrew KES 2,000 via M-Pesa' },
    { timestamp: 'Feb 2, 2026', time: '08:00:00', user: 'Peter Omondi', role: 'PO', action: 'MARK ATTENDANCE', type: 'attendance', details: 'Marked attendance for 2026-02-02' }
];

function renderLogs(filterText = '', typeFilter = 'all') {
    const body = document.getElementById('logBody');
    body.innerHTML = '';

    const filtered = auditLogs.filter(log => {
        const matchesText = log.details.toLowerCase().includes(filterText.toLowerCase()) || 
                           log.user.toLowerCase().includes(filterText.toLowerCase());
        const matchesType = typeFilter === 'all' || log.type === typeFilter;
        return matchesText && matchesType;
    });

    filtered.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="timestamp-cell">
                <strong>${log.timestamp}</strong>
                <span>${log.time}</span>
            </td>
            <td>
                <div class="log-user">
                    <div class="log-avatar">${log.role}</div>
                    ${log.user}
                </div>
            </td>
            <td>
                <span class="action-badge type-${log.type}">${log.action}</span>
            </td>
            <td>${log.details}</td>
        `;
        body.appendChild(row);
    });
}

document.getElementById('logSearch').addEventListener('input', (e) => {
    const type = document.getElementById('actionFilter').value;
    renderLogs(e.target.value, type);
});

document.getElementById('actionFilter').addEventListener('change', (e) => {
    const text = document.getElementById('logSearch').value;
    renderLogs(text, e.target.value);
});

document.addEventListener('DOMContentLoaded', () => renderLogs());
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

document.addEventListener('DOMContentLoaded', manageActiveLink);