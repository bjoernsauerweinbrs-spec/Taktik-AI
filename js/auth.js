// =========================================
// Toni 2.0 – Auth Logic
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    const regBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');

    if (regBtn) {
        regBtn.addEventListener('click', () => {
            const u = document.getElementById('username').value.trim();
            const p = document.getElementById('password').value.trim();
            if (!u || !p) return alert("Bitte Daten eingeben!");
            
            window.TONI.storage.saveUser(u, p);
            alert("Registriert! Du kannst dich jetzt einloggen.");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const u = document.getElementById('username').value.trim();
            const p = document.getElementById('password').value.trim();

            const user = window.TONI.storage.getUser(u);
            if (user && user.password === p) {
                enterApp(u);
            } else {
                alert("Login fehlgeschlagen!");
            }
        });
    }
});

function enterApp(username) {
    sessionStorage.setItem('sessionUser', username);
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    
    // UI Refresh
    if (typeof renderArena === 'function') renderArena();
    console.log(`Willkommen zurück, ${username}`);
}

// Logout Global
window.appLogout = function() {
    sessionStorage.removeItem('sessionUser');
    location.reload();
};
