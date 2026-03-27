// Firebase Authentication System
const loginForm = document.getElementById('loginForm');

document.addEventListener('DOMContentLoaded', function() {
    setupMobileNavigation();
    setupThemeToggle();
    initializeFirebaseAuth();
});

async function initializeFirebaseAuth() {
    let attempts = 0;
    while (!window.firebaseAuth && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.firebaseAuth) {
        showNotification('Firebase authentication not available', 'error');
        return;
    }
    
    setupFirebaseEventListeners();
}

function setupFirebaseEventListeners() {
    if (loginForm) loginForm.addEventListener('submit', handleEmailLogin);
    
    const googleBtn = document.getElementById('googleLogin');
    if (googleBtn) googleBtn.addEventListener('click', handleGoogleLogin);
    
    const githubBtn = document.getElementById('githubLogin');
    if (githubBtn) githubBtn.addEventListener('click', handleGitHubLogin);
    
    const testBtn = document.getElementById('testLogin');
    if (testBtn) testBtn.addEventListener('click', handleTestLogin);
}

async function handleEmailLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
    
    try {
        await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
        showNotification('Login successful!', 'success');
        setTimeout(() => window.location.href = 'main.html', 1000);
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            if (confirm('Account not found. Create new account with these credentials?')) {
                await handleCreateAccount(email, password);
                return;
            }
        }
        showNotification(getErrorMessage(error), 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleCreateAccount(email, password) {
    try {
        const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
        showNotification('Account created successfully!', 'success');
        setTimeout(() => window.location.href = 'main.html', 1000);
    } catch (error) {
        showNotification(getErrorMessage(error), 'error');
    }
}

async function handleGoogleLogin() {
    const googleBtn = document.getElementById('googleLogin');
    const originalHTML = googleBtn.innerHTML;
    
    try {
        googleBtn.disabled = true;
        googleBtn.textContent = 'Connecting...';
        
        const provider = new window.GoogleAuthProvider();
        await window.signInWithPopup(window.firebaseAuth, provider);
        showNotification('Google login successful!', 'success');
        setTimeout(() => window.location.href = 'main.html', 1000);
    } catch (error) {
        showNotification(getErrorMessage(error), 'error');
    } finally {
        googleBtn.disabled = false;
        googleBtn.innerHTML = originalHTML;
    }
}

async function handleGitHubLogin() {
    const githubBtn = document.getElementById('githubLogin');
    const originalHTML = githubBtn.innerHTML;
    
    try {
        githubBtn.disabled = true;
        githubBtn.textContent = 'Connecting...';
        
        const provider = new window.GithubAuthProvider();
        await window.signInWithPopup(window.firebaseAuth, provider);
        showNotification('GitHub login successful!', 'success');
        setTimeout(() => window.location.href = 'main.html', 1000);
    } catch (error) {
        showNotification(getErrorMessage(error), 'error');
    } finally {
        githubBtn.disabled = false;
        githubBtn.innerHTML = originalHTML;
    }
}

async function handleTestLogin() {
    const testBtn = document.getElementById('testLogin');
    const originalHTML = testBtn.innerHTML;
    
    try {
        testBtn.disabled = true;
        testBtn.innerHTML = ' Signing in...';
        
        try {
            await window.signInWithEmailAndPassword(window.firebaseAuth, 'test@noteify.com', 'password123');
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                await createUserWithEmailAndPassword(window.firebaseAuth, 'test@noteify.com', 'password123');
            } else {
                throw error;
            }
        }
        
        showNotification('Test login successful!', 'success');
        setTimeout(() => window.location.href = 'main.html', 1000);
    } catch (error) {
        showNotification(getErrorMessage(error), 'error');
    } finally {
        testBtn.disabled = false;
        testBtn.innerHTML = originalHTML;
    }
}

function getErrorMessage(error) {
    const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/email-already-in-use': 'Email already in use.',
        'auth/weak-password': 'Password too weak.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
        'auth/popup-closed-by-user': 'Sign-in popup closed.',
        'auth/popup-blocked': 'Popup blocked. Allow popups and try again.',
        'auth/invalid-credential': 'Invalid credentials.',
        'auth/unauthorized-domain': 'Domain not authorized. Add 127.0.0.1 to Firebase.'
    };
    return messages[error.code] || 'Authentication failed.';
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

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function setupMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}