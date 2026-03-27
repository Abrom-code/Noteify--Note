// Firebase Password Reset
document.addEventListener('DOMContentLoaded', function() {
    setupForgetForm();
    initializeFirebase();
});

async function initializeFirebase() {
    let attempts = 0;
    while (!window.firebaseAuth && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.firebaseAuth) {
        showError('Firebase authentication not available');
    }
}

function setupForgetForm() {
    const forgetForm = document.getElementById('forgetForm');
    if (!forgetForm) return;
    
    forgetForm.addEventListener('submit', handlePasswordReset);
}

async function handlePasswordReset(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        showError('Please enter your email address');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!window.firebaseAuth) {
        showError('Authentication service not available');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Import Firebase password reset function
        const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        await sendPasswordResetEmail(window.firebaseAuth, email);
        
        showSuccess('Password reset email sent! Check your inbox.');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        console.error('Password reset error:', error);
        
        const errorMessages = {
            'auth/user-not-found': 'No account found with this email address.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/too-many-requests': 'Too many requests. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your connection.'
        };
        
        const message = errorMessages[error.code] || 'Failed to send reset email. Please try again.';
        showError(message);
        
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
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