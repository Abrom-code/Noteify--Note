const forgetForm = document.getElementById('forgetForm');

forgetForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if(user) {
        alert("Password reset link sent to your email (demo)!");
    } else {
        alert("Email not found. Please check or sign up first.");
    }
});
