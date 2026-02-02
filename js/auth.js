window.ToniAuth = {
    init() {
        const key = localStorage.getItem('toni2_api_key');
        if (key) document.getElementById('api-key-input').value = key;
    },
    login() {
        const pass = document.getElementById('password-input').value;
        const key = document.getElementById('api-key-input').value;

        if (pass === "Toni2026") {
            localStorage.setItem('toni2_api_key', key);
            document.getElementById('login-screen').classList.add('hidden');
            // Starte die KI-Partner-Logik
            ToniAI.init();
        } else {
            alert("Coach, falsches Passwort!");
        }
    }
};
