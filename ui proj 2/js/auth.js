let currentUser = null;
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        currentUser = JSON.parse(localStorage.getItem('userData'));
        return true;
    }
    return false;
}
async function login(email, password) {
    try {
        console.log('Login attempt for:', email);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('Found users in storage:', users.length);
        // First check if user exists
        const userExists = users.some(u => u.email === email);
        if (!userExists) {
            console.log('Email not found, redirecting to signup');
            window.location.href = 'signup.html?email=' + encodeURIComponent(email);
            return false;
        }
        // Then check password
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            console.log('Incorrect password');
            throw new Error('Invalid password');
        }
        console.log('User found:', user.email);
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        currentUser = userData;
        // Handle redirect after successful login
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || 'index.html';
        window.location.href = redirectUrl;
        return true;
    } catch (error) {
        console.error('Login failed:', error.message);
        return false;
    }
}
async function signup(name, email, password) {
    try {
        console.log('Signup attempt for:', email);
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('users')) || [];
        } catch (e) {
            console.log('No existing users found, starting fresh');
            users = [];
        }
        if (users.some(u => u.email === email)) {
            console.log('User already exists:', email);
            throw new Error('User already exists');
        }
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            dateCreated: new Date().toISOString()
        };
        users.push(newUser);
        console.log('Saving new user to storage');
        localStorage.setItem('users', JSON.stringify(users));
        const userData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        currentUser = userData;
        console.log('Signup successful for:', email);
        return true;
    } catch (error) {
        console.error('Signup failed:', error.message);
        return false;
    }
}
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    window.location.href = 'index.html';
}
function getCurrentUser() {
    return currentUser;
}
function hasAccess() {
    return checkAuth();
}
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, adding submit handler');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log('Attempting login for:', email);
            const success = await login(email, password);
            if (success) {
                console.log('Login successful, redirecting to dashboard');
                window.location.href = 'dashboard.html';
            } else {
                console.log('Login failed');
                alert('Login failed. Please check your credentials.');
            }
        });
    } else {
        console.log('Login form not found on this page');
    }
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const success = await signup(name, email, password);
            if (success) {
                window.location.href = 'dashboard.html';
            } else {
                alert('Signup failed. Please try again.');
            }
        });
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    const protectedPages = ['dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage) && !hasAccess()) {
        window.location.href = 'login.html';
    }
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.style.display = checkAuth() ? 'inline-block' : 'none';
    }
});
window.authFunctions = {
    login,
    signup,
    logout,
    getCurrentUser,
    hasAccess
};
