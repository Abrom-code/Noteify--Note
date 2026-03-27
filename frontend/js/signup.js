// Firebase-powered Signup System
const signupForm = document.getElementById('signupForm');

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
    if (signupForm) {
        signupForm.addEventListener('submit', handleEmailSignup);
    }
    
    // Google Signup
    const googleBtn = document.getElementById('googleSignup');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleSignup);
    }
    
    // GitHub Signup
    const githubBtn = document.getElementById('githubSignup');
    if (githubBtn) {
        githubBtn.addEventListener('click', handleGitHubSignup);
    }
}

async function handleEmailSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    try {
        // Import Firebase auth functions
        const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
        
        // Update user profile with display name
        await updateProfile(userCredential.user, {
            displayName: name
        });
        
        showNotification('Account created successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 1000);
        
    } catch (error) {
        console.error('Signup error:', error);
        showNotification(getErrorMessage(error), 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleGoogleSignup() {
    const googleBtn = document.getElementById('googleSignup');
    const originalHTML = googleBtn.innerHTML;
    
    try {
        googleBtn.disabled = true;
        googleBtn.textContent = 'Connecting...';
        
        const provider = new window.GoogleAuthProvider();
        await window.signInWithPopup(window.firebaseAuth, provider);
        showNotification('Google signup successful!', 'success');
        setTimeout(() => window.location.href = 'main.html', 1000);
    } catch (error) {
        showNotification(getErrorMessage(error), 'error');
    } finally {
        googleBtn.disabled = false;
        googleBtn.innerHTML = originalHTML;
    }
}

async function handleGitHubSignup() {
    const githubBtn = document.getElementById('githubSignup');
    const originalHTML = githubBtn.innerHTML;
    
    try {
        githubBtn.disabled = true;
        githubBtn.textContent = 'Connecting...';
        
        const provider = new window.GithubAuthProvider();
        await window.signInWithPopup(window.firebaseAuth, provider);
        showNotification('GitHub signup successful!', 'success');
        setTimeout(() => window.location.href = 'main.html', 1000);
    } catch (error) {
        showNotification(getErrorMessage(error), 'error');
    } finally {
        githubBtn.disabled = false;
        githubBtn.innerHTML = originalHTML;
    }
}

function getErrorMessage(error) {
    const messages = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.'
    };
    return messages[error.code] || 'Account creation failed. Please try again.';
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