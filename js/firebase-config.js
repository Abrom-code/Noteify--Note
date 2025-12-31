// Shared Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut,
    GoogleAuthProvider, 
    GithubAuthProvider,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyD-RSGkf_yfdF3O7yQbG66m7BIZQNzrrpc",
    authDomain: "notefiy-ae6c1.firebaseapp.com",
    projectId: "notefiy-ae6c1",
    storageBucket: "notefiy-ae6c1.firebasestorage.app",
    messagingSenderId: "120587425022",
    appId: "1:120587425022:web:f1a911357a5116108541af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Make Firebase available globally
window.firebaseAuth = auth;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signInWithPopup = signInWithPopup;
window.signOut = signOut;
window.GoogleAuthProvider = GoogleAuthProvider;
window.GithubAuthProvider = GithubAuthProvider;
window.onAuthStateChanged = onAuthStateChanged;

// Global auth state listener
let isLoggingOut = false;

onAuthStateChanged(auth, (user) => {
    if (isLoggingOut) {
        // Don't update localStorage during logout process
        return;
    }
    
    if (user) {
        const userData = {
            id: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL,
            provider: user.providerData[0]?.providerId || 'email'
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
        localStorage.removeItem('currentUser');
    }
    
    // Update navigation if auth-utils is available
    if (window.updateNavigationForAuth) {
        window.updateNavigationForAuth();
    }
});

// Global logout function
window.performLogout = async function() {
    isLoggingOut = true;
    try {
        await signOut(auth);
        localStorage.removeItem('currentUser');
        
        // Small delay to ensure Firebase processes the logout
        await new Promise(resolve => setTimeout(resolve, 100));
        
        isLoggingOut = false;
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('currentUser');
        isLoggingOut = false;
        return false;
    }
};

console.log('🔥 Firebase initialized');