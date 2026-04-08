const storedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
if (!storedUser || storedUser.role !== 'employee') {
    window.location.href = 'login.html';
}
if (!storedUser.id) {
    window.location.href = 'login.html';
}
const EMP = { id: storedUser.id, name: storedUser.name };
let supportTickets = [];

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function setEmployeeName() {
    const employeeNameEl = document.getElementById('employeeName');
    if (employeeNameEl) employeeNameEl.innerText = EMP.name;
}

function showTicketForm() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('ticketDetailContent').style.display = 'none';
    document.getElementById('ticketForm').style.display = 'block';
}

function hideTicketForm() {
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('ticketForm').style.display = 'none';
    document.getElementById('ticketDetailContent').style.display = 'none';
}

function viewTicketDetails(ticketId) {
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('ticketForm').style.display = 'none';

    const detailContent = document.getElementById('ticketDetailContent');
    detailContent.style.display = 'block';
    detailContent.innerHTML = `
        <div class="detail-header">
            <span class="status-pill ${ticket.status}">${ticket.status === 'open' ? 'Pending' : ticket.status === 'in_progress' ? 'In Progress' : 'Closed'}</span>
            <h3 style="margin-top:10px">${ticket.category || ticket.subject}</h3>
            <small style="color:#9ca3af">${ticket.id} • Submitted on ${new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small>
        </div>
        <div class="detail-body">
            <p>${ticket.message}</p>
        </div>
        <div class="detail-footer">
            <p>Resolution Status: <strong>${ticket.status === 'open' ? 'Pending Review' : ticket.status === 'in_progress' ? 'In Progress' : 'Addressed by Admin'}</strong></p>
            <p style="font-size:11px; color:#9ca3af; margin-top:5px">We aim to respond to all inquiries within 24 hours.</p>
        </div>
    `;
}

async function submitTicket() {
    const category = document.getElementById('ticketCategory').value;
    const msg = document.getElementById('ticketMessage').value;

    if (!msg) return alert('Please enter a message');

    try {
        const response = await fetch('http://localhost:8000/support/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({
                subject: category,
                message: msg,
                category: category
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Unable to submit ticket');
        }
        document.getElementById('ticketMessage').value = '';
        hideTicketForm();
        await loadTickets();
    } catch (error) {
        console.error('Error submitting ticket:', error);
        alert('Error submitting ticket. Please try again.');
    }
}

function renderPage() {
    const myTkts = supportTickets.filter(t => t.user === EMP.id).reverse();
    document.getElementById('openCount').innerText = myTkts.filter(t => t.status === 'open').length;
    document.getElementById('resolvedCount').innerText = myTkts.filter(t => t.status !== 'open').length;

    const list = document.getElementById('ticketList');
    list.innerHTML = '';

    myTkts.forEach(t => {
        const statusLabel = t.status === 'open' ? 'Pending' : t.status === 'in_progress' ? 'In Progress' : 'Closed';
        const div = document.createElement('div');
        div.className = 'ticket-item';
        div.onclick = () => viewTicketDetails(t.id);
        div.innerHTML = `
            <div class="ticket-item-header">
                <span class="ticket-id">${t.id}</span>
                <span class="status-pill ${t.status}">${statusLabel}</span>
            </div>
            <h4>${t.category || t.subject}</h4>
            <p>${t.message}</p>
        `;
        list.appendChild(div);
    });

    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === path) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function handleLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
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
    loadTickets();
    handleLogout();
    manageActiveLink();
});