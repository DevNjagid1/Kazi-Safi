const form = document.getElementById('loginForm');
const passInput = document.getElementById('password');
const roleInput = document.getElementById('role');
const idInput = document.getElementById('identifier');
const loginBtn = document.getElementById('loginBtn');
const forgotLink = document.getElementById('forgotPasswordLink');
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeIcon = document.querySelector('.eye-icon');
const eyeOffIcon = document.querySelector('.eye-off-icon');

togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passInput.setAttribute('type', type);
    
    if (type === 'text') {
        eyeIcon.style.display = 'none';
        eyeOffIcon.style.display = 'block';
    } else {
        eyeIcon.style.display = 'block';
        eyeOffIcon.style.display = 'none';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    idInput.classList.remove('error');
    passInput.classList.remove('error');

    const identifier = idInput.value.trim();
    const password = passInput.value;

    loginBtn.disabled = true;
    loginBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke-linecap="round"/>
        </svg>
        Verifying...
    `;

    try {
        const response = await fetch('http://localhost:8000/accounts/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: identifier,
                password: password
            })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            if (data.user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'user.html';
            }
        } else {
            loginBtn.disabled = false;
            loginBtn.innerText = "Sign in";
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        loginBtn.disabled = false;
        loginBtn.innerText = "Sign in";
        alert('Network error');
    }
});

forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt("Enter your email address to reset password:");
    if (email) alert("A reset link has been sent to " + email);
});