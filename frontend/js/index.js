document.addEventListener('DOMContentLoaded', function() {
    checkAuthenticationStatus();
    setupDemoFunctionality();
    setupMobileNavigation();
    setupThemeToggle();
});

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        return;
    }
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    updateThemeIcon(currentTheme);
    
    // Add event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add a subtle animation
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
        } else {
            themeIcon.textContent = '🌙';
        }
    }
}

function getCurrentUser() {
    try {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
}

function setupMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navRight = document.querySelector('.nav-right');
    
    if (navToggle && navRight) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navRight.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navRight.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navToggle.classList.remove('active');
                navRight.classList.remove('active');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navRight.contains(e.target)) {
                navToggle.classList.remove('active');
                navRight.classList.remove('active');
            }
        });
    }
}

function checkAuthenticationStatus() {
    const currentUser = getCurrentUser();
    const getStartedBtn = document.querySelector('.hero-buttons .btn-primary');
    const signUpFreeBtn = document.querySelector('.cta-buttons .btn-primary');
    
    if (currentUser) {
        updateButtonsForLoggedInUser(getStartedBtn, signUpFreeBtn);
    }
}

function updateButtonsForLoggedInUser(getStartedBtn, signUpFreeBtn) {
    if (getStartedBtn) {
        getStartedBtn.textContent = 'Go to My Notes';
        getStartedBtn.href = 'main.html';
    }
    
    if (signUpFreeBtn) {
        signUpFreeBtn.textContent = 'Open My Notes';
        signUpFreeBtn.href = 'main.html';
    }
}

function setupDemoFunctionality() {
    const addDemoNoteBtn = document.getElementById('addDemoNote');
    const demoNotesGrid = document.getElementById('demoNotesGrid');
    
    if (addDemoNoteBtn && demoNotesGrid) {
        let demoNoteCount = 1;
        
        addDemoNoteBtn.addEventListener('click', function() {
            demoNoteCount++;
            
            const demoNote = document.createElement('div');
            demoNote.className = 'demo-note';
            demoNote.innerHTML = `
                <h4>Demo Note ${demoNoteCount}</h4>
                <p>This is another sample note created by clicking the Add Note button. Try it out!</p>
                <span class="demo-date">Just now</span>
            `;
            
            demoNotesGrid.appendChild(demoNote);
            
            if (demoNoteCount >= 5) {
                addDemoNoteBtn.textContent = 'Demo Complete!';
                addDemoNoteBtn.disabled = true;
            }
        });
    }
}