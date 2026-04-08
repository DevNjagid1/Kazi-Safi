const storedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
if (!storedUser || storedUser.role !== 'employee') {
    window.location.href = 'login.html';
}
if (!storedUser.id) {
    window.location.href = 'login.html';
}
const currentEmployee = storedUser;

function setEmployeeName() {
    const employeeNameEl = document.getElementById('employeeName');
    if (employeeNameEl) employeeNameEl.innerText = currentEmployee.name;
}

let workInterval = null;
let startTime = null;

function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').innerText = now.toLocaleDateString('en-US', options);
    document.getElementById('currentTime').innerText = now.toLocaleTimeString('en-US', { hour12: false });
}

function startWorkTimer(){
    workInterval = setInterval(()=>{
        const now = new Date();
        const diff = new Date(now - startTime);
        const hrs = String(diff.getUTCHours()).padStart(2,'0');
        const mins = String(diff.getUTCMinutes()).padStart(2,'0');
        const secs = String(diff.getUTCSeconds()).padStart(2,'0');
        document.getElementById('workTimer').innerText = `${hrs}:${mins}:${secs}`;
    },1000);
}

function stopWorkTimer(){
    clearInterval(workInterval);
    document.getElementById('workTimer').innerText = "00:00:00";
}

function calculateOvertime(checkInStr, checkOutStr) {
    const [inH, inM] = checkInStr.split(':').map(Number);
    const [outH, outM] = checkOutStr.split(':').map(Number);
    const startMin = inH * 60 + inM;
    const endMin = outH * 60 + outM;
    const overtimeMinutes = Math.max(0, endMin - Math.max(startMin, 16 * 60));
    return (overtimeMinutes / 60).toFixed(1);
}

function checkIn(){

    const now = new Date();
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const todayStr = now.toLocaleDateString('en-GB');
    const alreadyCheckedIn = records.find(r => r.id === currentEmployee.id && r.dateRaw === todayStr);
    if(alreadyCheckedIn) return alert("Already checked in today");

    const entry = {
        id: currentEmployee.id,
        name: currentEmployee.name,
        date: now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
        dateRaw: todayStr,
        day: now.toLocaleDateString('en-US',{weekday:'long'}),
        checkIn: now.toLocaleTimeString('en-US',{hour12:false}),
        checkOut: null,
        in: now.toLocaleTimeString('en-US',{hour12:false}),
        out: null,
        status: 'pending'
    };

    records.push(entry);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));

    startTime = now;
    startWorkTimer();

    document.getElementById('checkInBtn').disabled = true;
    document.getElementById('checkOutBtn').disabled = false;

    renderHistory();
}

function checkOut(){
    const now = new Date();
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const todayStr = now.toLocaleDateString('en-GB');
    const record = records.find(r => r.id === currentEmployee.id && r.dateRaw === todayStr);
    if(!record) return;

    const checkOutTime = now.toLocaleTimeString('en-US',{hour12:false});
    record.checkOut = checkOutTime;
    record.out = checkOutTime;
    if (record.checkIn) {
        record.overtime = calculateOvertime(record.checkIn, record.checkOut);
    }
    localStorage.setItem('attendanceRecords', JSON.stringify(records));

    stopWorkTimer();

    document.getElementById('checkInBtn').disabled = false;
    document.getElementById('checkOutBtn').disabled = true;

    renderHistory();
}

function renderHistory() {
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const myRecords = records.filter(r => r.id === currentEmployee.id).reverse();
    const counts = { pending: 0, approved: 0, rejected: 0 };
    const body = document.getElementById('historyBody');
    body.innerHTML = '';

    myRecords.forEach(r => {
        if (counts.hasOwnProperty(r.status)) counts[r.status]++;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${r.date || 'N/A'}</td>
            <td>${r.day || 'N/A'}</td>
            <td>${r.checkIn || '-'}</td>
            <td>${r.checkOut || '-'}</td>
            <td><span class="badge ${r.status}">${r.status || 'pending'}</span></td>
        `;
        body.appendChild(row);
    });

    document.getElementById('countPending').innerText = counts.pending;
    document.getElementById('countApproved').innerText = counts.approved;
    document.getElementById('countRejected').innerText = counts.rejected;
}

function parseTimeString(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds || 0);
}

function updateButtons() {
    const todayStr = new Date().toLocaleDateString('en-GB');
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const todayRecord = records.find(r => r.id === currentEmployee.id && r.dateRaw === todayStr);

    const checkInBtn = document.getElementById('checkInBtn');
    const checkOutBtn = document.getElementById('checkOutBtn');
    if (!checkInBtn || !checkOutBtn) return;

    if (todayRecord && !todayRecord.checkOut) {
        checkInBtn.disabled = true;
        checkOutBtn.disabled = false;
        if (!workInterval && todayRecord.checkIn) {
            startTime = parseTimeString(todayRecord.checkIn);
            startWorkTimer();
        }
    } else {
        checkInBtn.disabled = false;
        checkOutBtn.disabled = true;
    }
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

setInterval(updateClock, 1000);

document.addEventListener('DOMContentLoaded', () => {
    setEmployeeName();
    updateClock();
    renderHistory();
    updateButtons();
    handleLogout();
    manageActiveLink();
});