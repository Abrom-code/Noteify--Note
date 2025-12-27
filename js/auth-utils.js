function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
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

function updateNavigationForLoggedInUser(navLinks, user) {
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.innerHTML = `
        <a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}>Home</a>
        <a href="about.html" ${currentPage === 'about.html' ? 'class="active"' : ''}>About</a>
        <a href="main.html" ${currentPage === 'main.html' ? 'class="active"' : ''}>My Notes</a>
        <div class="user-menu" style="position: relative;">
            <button class="user-menu-btn" style="
                background: linear-gradient(135deg, #2dabff, #4a90e2);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                <span>Hi, ${user.name}</span>
                <span style="font-size: 12px;">▼</span>
            </button>
            <div class="user-dropdown" style="
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                min-width: 150px;
                display: none;
                z-index: 1000;
                margin-top: 5px;
            ">
                <a href="main.html" style="
                    display: block;
                    padding: 12px 16px;
                    text-decoration: none;
                    color: #2c3e50;
                    border-bottom: 1px solid #f8f9fa;
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
                    My Notes
                </a>
                <a href="#" onclick="logout()" style="
                    display: block;
                    padding: 12px 16px;
                    text-decoration: none;
                    color: #dc3545;
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
                    Logout
                </a>
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
        <a href="main.html" ${currentPage === 'main.html' ? 'class="active"' : ''}>Notes App</a>
        <a href="login.html" ${currentPage === 'login.html' ? 'class="active"' : ''}>Login</a>
        <a href="signup.html" ${currentPage === 'signup.html' ? 'class="active"' : ''}>Sign Up</a>
    `;
}

function setupUserMenuEvents() {
    const userMenuBtn = document.querySelector('.user-menu-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', function() {
            userDropdown.style.display = 'none';
        });
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        showNotification('Logged out successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-size: 14px;
    `;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function redirectIfLoggedIn() {
    const currentUser = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentUser && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'main.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateNavigationForAuth();
    redirectIfLoggedIn();
});