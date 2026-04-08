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
const employees = [
    { id: 'EMP001', name: 'Jane Wanjiku', class: 'jw', in: '08:00', out: '18:30' },
    { id: 'EMP002', name: 'Peter Omondi', class: 'po', in: '07:50', out: '17:00' },
    { id: 'EMP003', name: 'Mary Akinyi', class: 'ma', in: '08:20', out: '16:00' },
    { id: 'EMP004', name: 'Samuel Kamau', class: 'sk', in: '08:00', out: '19:00' },
    { id: 'EMP005', name: 'Catherine Mutua', class: 'cm', in: '07:45', out: '16:45' },
    { id: 'EMP006', name: 'David Kiprono', class: 'dk', in: '08:00', out: '18:00' },
    { id: 'EMP007', name: 'Alice Njeri', class: 'an', in: '08:10', out: '16:30' },
    { id: 'EMP008', name: 'John Otieno', class: 'jo', in: '09:00', out: '17:15' }
];

function calculateOvertime(checkInStr, checkOutStr) {
    const [inH, inM] = checkInStr.split(':').map(Number);
    const [outH, outM] = checkOutStr.split(':').map(Number);
    const eightAmMinutes = 8 * 60;
    const fourPmMinutes = 16 * 60;
    const checkInTotalMinutes = inH * 60 + inM;
    const checkOutTotalMinutes = outH * 60 + outM;

    const lateness = Math.max(0, checkInTotalMinutes - eightAmMinutes);
    const potentialOT = Math.max(0, checkOutTotalMinutes - fourPmMinutes);
    const netOT = Math.max(0, potentialOT - lateness);
    
    return (netOT / 60).toFixed(1);
}

let attendanceFilter = 'all';

function updateStatus(id, newStatus) {
    let data = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const recordIndex = data.findIndex(r => r.id === id);
    if (recordIndex !== -1) {
        data[recordIndex].status = newStatus;
        if (data[recordIndex].checkIn && data[recordIndex].checkOut) {
            data[recordIndex].overtime = calculateOvertime(data[recordIndex].checkIn || data[recordIndex].in, data[recordIndex].checkOut || data[recordIndex].out);
        }
        localStorage.setItem('attendanceRecords', JSON.stringify(data));
        renderTable(attendanceFilter);
    }
}

function updatePendingBanner(data) {
    const pendingCount = data.filter(r => (r.status || 'pending') === 'pending').length;
    const banner = document.getElementById('adminAlert');
    const text = document.getElementById('pendingCountText');
    
    if (pendingCount > 0) {
        banner.style.display = 'flex';
        text.innerText = `You have ${pendingCount} pending attendance records to review`;
    } else {
        banner.style.display = 'none';
    }
}

function renderTable(filter = 'all') {
    const body = document.getElementById('attendanceBody');
    if (!body) return;

    let data = JSON.parse(localStorage.getItem('attendanceRecords'));
    
    if (!data) {
        data = employees.map(emp => ({
            ...emp,
            date: 'Feb 20, 2026',
            status: 'pending',
            overtime: calculateOvertime(emp.in, emp.out)
        }));
        localStorage.setItem('attendanceRecords', JSON.stringify(data));
    }

    body.innerHTML = '';
    
    const visibleRecords = data.filter(record => {
        const status = record.status || 'pending';
        return filter === 'all' || status === filter;
    });

    visibleRecords.forEach((record) => {
        const dateLabel = record.date || record.dateRaw || 'Unknown';
        const checkIn = record.checkIn || record.in || '-';
        const checkOut = record.checkOut || record.out || '-';
        const overtimeValue = record.overtime || (record.checkIn && record.checkOut ? calculateOvertime(checkIn, checkOut) : 0);
        const otDisplay = overtimeValue > 0 ? `<span class="overtime-label">${overtimeValue} hrs</span>` : 'None';
        const statusValue = record.status || 'pending';
        
        const actionBtn = statusValue === 'approved' 
            ? `<button class="reject-btn" onclick="updateStatus('${record.id}', 'rejected')">Reject</button>` 
            : `<button class="approve-btn" onclick="updateStatus('${record.id}', 'approved')">Approve</button>`;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="user-cell">
                    <span class="avatar ${record.class || ''}">${record.id ? record.id.slice(-2) : '--'}</span>
                    <div class="user-info-stack">
                        <strong>${record.name || 'Unknown'}</strong>
                        <small>${record.id || 'N/A'}</small>
                    </div>
                </div>
            </td>
            <td>${dateLabel}</td>
            <td>${checkIn}</td>
            <td>${checkOut}</td>
            <td>${otDisplay}</td>
            <td><span class="status-pill ${statusValue}">${statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}</span></td>
            <td>${actionBtn}</td>
        `;
        body.appendChild(row);
    });

    updatePendingBanner(data);
}

document.addEventListener('DOMContentLoaded', () => {
    renderTable(attendanceFilter);
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            attendanceFilter = button.dataset.filter;
            renderTable(attendanceFilter);
        });
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

document.addEventListener('DOMContentLoaded', manageActiveLink);