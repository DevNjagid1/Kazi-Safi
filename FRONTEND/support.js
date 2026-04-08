const storedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
if (!storedUser || storedUser.role !== 'admin') {
    window.location.href = 'login.html';
}
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if(confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('access_token');
            window.location.href = 'login.html';
        }
    });
}

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

let allTickets = [];

async function loadTickets() {
    try {
        const response = await fetch('http://localhost:8000/support/api/', {
            headers: getAuthHeaders()
        });
        allTickets = await response.json();
        renderTickets('all');
    } catch (error) {
        console.error('Error loading tickets:', error);
        // Fallback to hardcoded
        allTickets = tickets;
        renderTickets('all');
    }
}

function renderTickets(filter = 'all') {
    const container = document.getElementById('ticketContainer');
    container.innerHTML = '';

    const filteredTickets = allTickets.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    filteredTickets.forEach(ticket => {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        const employee = ticket.user_name || 'Unknown';
        const timestamp = new Date(ticket.created_at).toLocaleString();
        card.innerHTML = `
            <div class="ticket-header">
                <div>
                    <span class="ticket-id">TKT-${ticket.id}</span>
                    <h3 class="ticket-title">${ticket.subject}</h3>
                </div>
                <span class="status-badge ${ticket.status}">
                    ${ticket.status === 'closed' ? '✓' : ticket.status === 'in_progress' ? '●' : '●'} ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', ' ')}
                </span>
            </div>
            <div class="ticket-body">
                ${ticket.message}
            </div>
            <div class="ticket-footer">
                <div class="employee-meta">${employee}</div>
                <div class="footer-actions">
                    <span class="timestamp">${timestamp}</span>
                    ${ticket.status !== 'closed' ? `<button class="resolve-btn" onclick="resolveTicket('${ticket.id}')">Mark as Resolved</button>` : ''}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function resolveTicket(id) {
    // For demo, update locally
    alert('Mark ticket ' + id + ' as resolved');
    loadTickets();
}

function filterTickets(type) {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === type) btn.classList.add('active');
    });
    loadTickets(); // Reload and filter
}

window.filterTickets = filterTickets;

document.addEventListener('DOMContentLoaded', loadTickets);

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