// Authentication utilities
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
}

function updateNavigationForAuth() {
    const currentUser = getCurrentUser();
    const navLinks = document.querySelector('.nav-links');
    
    if (!navLinks) return;
    
    if (currentUser) {
        updateNavigationForLoggedInUser(navLinks, currentUser);
    } else {
        updateNavigationForGuestUser(navLinks);
    }
}

// Make updateNavigationForAuth globally available
window.updateNavigationForAuth = updateNavigationForAuth;

function updateNavigationForLoggedInUser(navLinks, user) {
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.innerHTML = `
        <a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}>Home</a>
        <a href="about.html" ${currentPage === 'about.html' ? 'class="active"' : ''}>About</a>
        <a href="main.html" ${currentPage === 'main.html' ? 'class="active"' : ''}>My Notes</a>
        <div class="user-menu">
            <button class="user-menu-btn">
                Hi, ${user.name} ▼
            </button>
            <div class="user-dropdown">
                <a href="main.html">My Notes</a>
                <a href="#" onclick="logout()">Logout</a>
            </div>
        </div>
    `;
    
    setupUserMenuEvents();
}

function updateNavigationForGuestUser(navLinks) {
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.innerHTML = `
        <a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}>Home</a>
        <a href="about.html" ${currentPage === 'about.html' ? 'class="active"' : ''}>About</a>
        <a href="login.html" ${currentPage === 'login.html' ? 'class="active"' : ''}>Login</a>
        <a href="signup.html" ${currentPage === 'signup.html' ? 'class="active"' : ''}>Sign Up</a>
    `;
}

function setupUserMenuEvents() {
    const userMenuBtn = document.querySelector('.user-menu-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', () => {
            userDropdown.style.display = 'none';
        });
    }
}

async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            // Use the global logout function
            if (window.performLogout) {
                await window.performLogout();
            } else {
                // Fallback if global function not available
                localStorage.removeItem('currentUser');
            }
            
            showNotification('Logged out successfully!', 'success');
            
            // Force navigation update
            updateNavigationForAuth();
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('currentUser');
            showNotification('Logged out successfully!', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 12px 20px;
        border-radius: 8px; color: white; font-weight: 500; z-index: 10000;
        max-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%); transition: transform 0.3s ease;
    `;
    
    const colors = { success: '#28a745', error: '#dc3545', warning: '#ffc107', info: '#17a2b8' };
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function redirectIfLoggedIn() {
    const currentUser = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentUser && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'main.html';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for Firebase to initialize
    await new Promise(resolve => setTimeout(resolve, 500));
    updateNavigationForAuth();
    redirectIfLoggedIn();
});