const form = document.getElementById('registerForm');

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPass').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/accounts/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.error || 'Registration failed. Please try again.');
            return;
        }

        const data = await response.json();
        alert(`Registration successful! Please sign in.`);
        
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('currentUser', JSON.stringify({
            id: data.user.id,
            name: data.user.first_name || data.user.name || name,
            email: data.user.email,
            role: data.role
        }));
        
        window.location.href = 'user.html';
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
    }
}

if (form) {
    form.addEventListener('submit', handleRegister);
}
