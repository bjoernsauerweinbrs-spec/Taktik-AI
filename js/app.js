// =========================================
// Toni 2.0 – App Core (Vollständig)
// =========================================

// Globales Konfigurations-Objekt
window.ToniConfig = {
    dataPath: 'data/players.sample.json',
    debug: true
};

function initApp() {
    console.log("🛠️ App-Kern geladen.");
    
    // Check für Mobile/Desktop Anpassungen
    if (window.innerWidth < 768) {
        console.log("📱 Mobil-Modus aktiv");
        document.body.classList.add('is-mobile');
    }
}

// Globaler Logout
window.logout = function() {
    sessionStorage.clear();
    location.reload();
};

// Error-Boundary (Fängt Fehler ab, damit die Seite nicht schwarz wird)
window.onerror = function(msg, url, line) {
    console.error(`Toni-Error: ${msg} in ${url} Zeile: ${line}`);
    return false;
};
