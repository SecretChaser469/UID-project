document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    updateNavigation(user);
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchDestination').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
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
        dashboardLink.style.display = 'block';
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline">Login</a>
            <a href="signup.html" class="btn btn-primary">Sign Up</a>
        `;
        dashboardLink.style.display = 'none';
    }
}
const availableCities = {
    'hyderabad': 'hyderabad.html',
    'kochi': 'kochi.html',
    'kolkata': 'kolkata.html'
};
function handleSearch() {
    const searchInput = document.getElementById('searchDestination');
    const searchTerm = searchInput.value.trim().toLowerCase();
    const isLoggedIn = window.authFunctions.hasAccess();
    if (!searchTerm) {
        alert('Please enter a city name');
        return;
    }
    if (!isLoggedIn) {
        alert('Please log in to view detailed itineraries');
        window.location.href = 'login.html';
        return;
    }
    if (availableCities[searchTerm]) {
        window.location.href = availableCities[searchTerm];
    } else {
        window.location.href = 'not-found.html';
    }
}
function handleLogout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    updateNavigation(null);
    window.location.href = 'index.html';
}
