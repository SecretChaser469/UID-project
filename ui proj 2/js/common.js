
updateNavigation();

document.addEventListener('DOMContentLoaded', updateNavigation);

window.addEventListener('load', updateNavigation);
function updateNavigation() {
    console.log('Updating navigation...');
    
    if (!document.body) {
        console.log('Document body not ready, retrying...');
        setTimeout(updateNavigation, 100);
        return;
    }
    
    let user = null;
    try {
        const userData = localStorage.getItem('userData');
        user = userData ? JSON.parse(userData) : null;
    } catch (e) {
        console.error('Error parsing user data:', e);
        user = null;
    }
    const authButtons = document.querySelectorAll('.auth-buttons');
    const dashboardLinks = document.querySelectorAll('#dashboardLink');
    console.log('User data:', user);
    console.log('Auth buttons found:', authButtons.length);
    console.log('Dashboard links found:', dashboardLinks.length);
    if (user && user.name) {
        console.log('User is logged in, showing dashboard');
        
        authButtons.forEach(container => {
            container.innerHTML = `
                <span class="user-greeting">Welcome, ${user.name}</span>
                <button class="logout-btn btn btn-outline">Logout</button>
            `;
            const logoutBtn = container.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', handleLogout);
            }
        });
        
        dashboardLinks.forEach(link => {
            console.log('Showing dashboard link:', link);
            if (link) {
                link.style.display = 'inline-block';
                
                void link.offsetHeight;
                
                link.style.opacity = '1';
            }
        });
    } else {
        console.log('User is not logged in, hiding dashboard');
        
        authButtons.forEach(container => {
            container.innerHTML = `
                <a href="login.html" class="btn btn-outline">Login</a>
                <a href="signup.html" class="btn btn-primary">Sign Up</a>
            `;
        });
        
        dashboardLinks.forEach(link => {
            console.log('Hiding dashboard link:', link);
            if (link) {
                
                link.style.opacity = '0';

                setTimeout(() => {
                    if (link) link.style.display = 'none';
                }, 300);
            }
        });
    }
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page:', currentPage);
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkHref = link.getAttribute('href');
        console.log('Checking link:', linkHref, 'against current page:', currentPage);
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html') ||
            (currentPage.startsWith('index.html') && linkHref === 'index.html')) {
            console.log('Setting active:', linkHref);
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    console.log('Navigation update complete');
    
    setTimeout(() => {
        const user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
        const authButtons = document.querySelectorAll('.auth-buttons');
        console.log('Final check - User logged in:', !!user, 'Auth buttons found:', authButtons.length);
    }, 500);
}
function handleLogout() {
    localStorage.removeItem('userData');
    updateNavigation();
    window.location.href = 'index.html';
}
function isUserLoggedIn() {
    return localStorage.getItem('userData') !== null;
}
function requireLogin(redirectUrl = 'login.html') {
    if (!isUserLoggedIn()) {
        window.location.href = `${redirectUrl}?redirect=${encodeURIComponent(window.location.pathname)}`;
        return false;
    }
    return true;
}
