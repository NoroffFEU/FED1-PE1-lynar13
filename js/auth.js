document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is already logged in when the page loads
    checkLogin();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async event => {
            event.preventDefault();
            console.log('Login form submitted');
            const email = event.target.email.value;
            const password = event.target.password.value;
            await login(email, password);
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async event => {
            event.preventDefault();
            console.log('Register form submitted');
            const name = event.target.name.value;
            const email = event.target.email.value;
            const password = event.target.password.value;
            await register(name, email, password);
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log('Logout button clicked');
            logout();
        });
    }
});

// Function to log in the user
async function login(email, password) {
    try {
        console.log('Attempting to log in with', email, password);
        const response = await fetch('https://v2.api.noroff.dev/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok) {
            const { accessToken } = data.data;
            localStorage.setItem('accessToken', accessToken);
            alert('Login Successful! You can now manage your posts.');
            window.location.href = '../post/create.html';
        } else {
            alert('Login failed: ' + (data.errors ? data.errors.map(error => error.message).join(', ') : 'Unknown error'));
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed');
    }
}

// Function to get the access token from local storage
function getAccessToken() {
    return localStorage.getItem('accessToken');
}

// Function to check if the user is logged in
function checkLogin() {
    const token = getAccessToken();
    const logoutButton = document.getElementById('logout-button');
    if (token) {
        if (logoutButton) {
            logoutButton.style.display = 'block';
        }
    } else {
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
        window.location.href = '/account/login.html';
    }
}

// Function to log out the user
function logout() {
    console.log('Logging out');
    localStorage.removeItem('accessToken');
    window.location.href = '/account/login.html';
}

// Function to register a new user
async function register(name, email, password) {
    try {
        console.log('Attempting to register with', name, email, password);
        const payload = {
            name,
            email,
            bio: "",
            avatar: {
                url: "",
                alt: ""
            },
            banner: {
                url: "",
                alt: ""
            },
            venueManager: true,
            password
        };
        const response = await fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Register response:', data);

        if (response.ok) {
            alert('Registration successful. Please log in.');
            window.location.href = '/account/login.html';
        } else {
            alert('Registration failed: ' + (data.errors ? data.errors.map(error => error.message).join(', ') : 'Unknown error'));
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed');
    }
}
