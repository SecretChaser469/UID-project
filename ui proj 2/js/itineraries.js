document.addEventListener('DOMContentLoaded', () => {
    const viewButtons = document.querySelectorAll('.view-itinerary');
    const loginPrompts = document.querySelectorAll('.login-prompt');
    const authButtons = document.querySelector('.auth-buttons');
    const dashboardLink = document.getElementById('dashboardLink');
    const isLoggedIn = window.authFunctions.hasAccess();
    if (isLoggedIn) {
        authButtons.style.display = 'none';
        dashboardLink.style.display = 'inline-block';
    }
    viewButtons.forEach((button, index) => {
        if (isLoggedIn) {
            button.addEventListener('click', () => {
                const city = button.getAttribute('data-city');
                window.location.href = `${city}.html`;
            });
        } else {
            button.style.display = 'none';
            loginPrompts[index].style.display = 'block';
        }
    });
});
function updateNavigation(user) {
    const authButtons = document.querySelector('.auth-buttons');
    const dashboardLink = document.getElementById('dashboardLink');
    if (user) {
        authButtons.innerHTML = `
            <span class="user-greeting">Welcome, ${user.name}</span>
            <button id="logoutBtn" class="btn btn-outline">Logout</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        if (dashboardLink) {
            dashboardLink.style.display = 'block';
        }
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline">Login</a>
            <a href="signup.html" class="btn btn-primary">Sign Up</a>
        `;
        if (dashboardLink) {
            dashboardLink.style.display = 'none';
        }
        updateViewButtons();
    }
}
function handleViewItinerary(event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('userData'));
    if (!user) {
        const button = event.target;
        const card = button.closest('.itinerary-card');
        const existingPrompt = card.querySelector('.login-prompt');
        if (existingPrompt) {
            existingPrompt.remove();
        }
        const loginPrompt = document.createElement('div');
        loginPrompt.className = 'login-prompt';
        loginPrompt.innerHTML = 'Please <a href="login.html">login</a> or <a href="signup.html">sign up</a> to view full itineraries';
        button.parentNode.insertBefore(loginPrompt, button.nextSibling);
        return;
    }
    const card = event.target.closest('.itinerary-card');
    const title = card.querySelector('h3').textContent;
    const cityName = title.split('-')[0].trim().toLowerCase();
    sessionStorage.setItem('selectedItinerary', cityName);
    window.location.href = `itinerary-details.html?city=${encodeURIComponent(cityName)}`;
}
function updateViewButtons() {
    const viewButtons = document.querySelectorAll('.btn-primary');
    viewButtons.forEach(button => {
        if (button.textContent.includes('View Full Itinerary')) {
            button.classList.add('btn-disabled');
        }
    });
}
function handleLogout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    window.location.reload();
}
