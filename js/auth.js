/**
 * AUTH MODUL: Passwort & API-Key Sicherung
 */
window.ToniAuth = {
    init() {
        const savedKey = localStorage.getItem('toni2_api_key');
        if (savedKey) document.getElementById('api-key-input').value = savedKey;
    },

    login() {
        const pass = document.getElementById('password-input').value;
        const key = document.getElementById('api-key-input').value;

        if (pass === "Toni2026") { 
            localStorage.setItem('toni2_api_key', key);
            document.getElementById('login-screen').classList.add('hidden');
            // Initialisiere den Rest erst NACH dem Login
            ToniAI.init();
            BriefcaseUI.init();
        } else {
            alert("Zugriff verweigert, Coach!");
        }
    }
};
