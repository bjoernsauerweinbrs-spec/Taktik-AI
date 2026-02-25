/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8)
   ========================================================================== */

// 1. DER TRESOR (GLOBAL STATE)
// Hier liegen alle Daten sicher verschlossen.
const eliteStore = {
    config: {
        version: "15.8 PRO",
        passkey: "1234",
        kiActive: false
    },
    // Management & Finanzen
    finance: {
        liquidAssets: 500000,
        monthlyIncome: 25000,
        monthlyExpenses: 12000,
        sponsors: ["Telekom", "Adidas"]
    },
    // Kader & Bio-Daten
    players: [
        { 
            id: 1, 
            name: "M. Müller", 
            pos: "ST", 
            stats: { pac: 85, sho: 80, pas: 75, dri: 82, def: 30, phy: 70 },
            bio: { weight: 78, kfa: 10, muscle: 42, water: 60, heartRate: 52, vo2max: 58 },
            contract: { salary: 4500, expiry: 2026 }
        }
        // Weitere Spieler folgen modular
    ],
    inventory: {
        huetchen: 20,
        baelle: 15,
        hemden: 22
    }
};

// 2. BOOT-SEQUENZ (LOGIN LOGIK)
function systemBootSequence() {
    const input = document.getElementById('passkey');
    const authLayer = document.getElementById('auth-layer');
    
    // Passwort-Check
    if (input.value === eliteStore.config.passkey) {
        console.log("Access Granted. Initializing Toni 2.0...");
        
        // Visueller Übergang (Portal-Effekt)
        authLayer.style.transition = "all 0.8s cubic-bezier(0.7, 0, 0.3, 1)";
        authLayer.style.transform = "scale(5) rotate(10deg)";
        authLayer.style.opacity = "0";
        
        setTimeout(() => {
            authLayer.classList.add('hidden');
            // Hier triggern wir das Erscheinen der 3-Spalten-Startseite
            initializeDashboard();
        }, 800);

    } else {
        // Fehler-Effekt
        input.style.borderColor = "var(--neon-alert)";
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        alert("ZUGRIFF VERWEIGERT. IDENTITÄT NICHT BESTÄTIGT.");
    }
}

// 3. CORE-FUNKTIONEN (MATHEMATIK & LOGIK)

/**
 * Berechnet das FIFA-Gesamt-Rating basierend auf der gewichteten Formel:
 * $$Rating_{Total} = \frac{(PAC \cdot 2) + (SHO \cdot 1.5) + (PAS \cdot 2) + (DRI \cdot 1.5) + (DEF \cdot 1) + (PHY \cdot 2)}{10}$$
 */
function calculatePlayerRating(s) {
    const total = (s.pac * 2) + (s.sho * 1.5) + (s.pas * 2) + (s.dri * 1.5) + (s.def * 1) + (s.phy * 2);
    return Math.round(total / 10);
}

// 4. MODUL-WÄCHTER (INITIALISIERUNG)
function initializeDashboard() {
    // Diese Funktion wird später die 3 Spalten mit Leben füllen
    document.body.innerHTML += `
        <div id="main-interface" class="fade-in">
            <header id="top-bar">SYSTEM INITIALISIERT | WILLKOMMEN TRAINER</header>
            <div class="hud-grid">
                <aside id="nav-left" class="hud-column"></aside>
                <main id="stage-center" class="hud-column"></main>
                <aside id="info-right" class="hud-column"></aside>
            </div>
        </div>
    `;
    console.log("Toni 2.0: Dashboard Ready.");
}

// Support für die Enter-Taste
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !document.getElementById('auth-layer').classList.contains('hidden')) {
        systemBootSequence();
    }
});
