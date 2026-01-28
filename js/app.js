/**
 * TONI 2.0 - Haupt-Controller (Der Dirigent)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sicherheits-Check (Login-Status)
    const isAuthorized = localStorage.getItem('isAuthorized');
    const userName = localStorage.getItem('userName') || 'Trainer';

    if (!isAuthorized) {
        window.location.href = 'index.html'; // Zurück zum Login, falls nicht angemeldet
        return;
    }

    // 2. Initialisierung der UI
    document.getElementById('user-name-display').textContent = userName;
    console.log(`[Toni 2.0] Willkommen zurück, ${userName}. Ginga-System wird geladen...`);

    // 3. Start der Ginga-Sequenz (Ablaufsteuerung)
    startGingaSequence(userName);
});

/**
 * Die dramaturgische Start-Sequenz
 * Blackout -> Stimme -> Arena Build
 */
async function startGingaSequence(userName) {
    const status = document.getElementById('status-display');
    
    // Phase 1: Begrüßung (Voice)
    status.textContent = "Toni bereitet sich vor...";
    
    // Wir senden ein Event an das Voice-Modul
    window.ToniEvents.emit('VOICE:SPEAK', {
        text: `Hallo ${userName}, ich bin Toni. Dein Taktik-System auf Weltniveau ist bereit. Übernehmen wir die Spielkontrolle?`
    });

    // Wir warten auf das Ende der Stimme (via EventBus)
    window.ToniEvents.on('VOICE:ENDED', () => {
        status.textContent = "Baue Stadion auf...";
        
        // Phase 2: Arena-Konstruktion triggern
        window.ToniEvents.emit('ARENA:BUILD', { type: 'senioren' }); 
    });

    // Wenn die Arena fertig ist, blenden wir alles ein
    window.ToniEvents.on('ARENA:READY', () => {
        document.body.classList.remove('blackout');
        document.body.classList.add('ready');
        status.textContent = "System bereit. Ginga!";
        
        // Aktentasche automatisch im Chat-Modus öffnen
        setTimeout(() => toggleSidebar(true), 1000);
    });
}

/**
 * Steuerung der Aktentasche (Sidebar)
 */
function toggleSidebar(forceOpen = null) {
    const sidebar = document.getElementById('sidebar');
    if (forceOpen === true) {
        sidebar.classList.add('active');
    } else if (forceOpen === false) {
        sidebar.classList.remove('active');
    } else {
        sidebar.classList.toggle('active');
    }
}

/**
 * Tab-Wechsel innerhalb der Aktentasche
 */
function switchTab(tabName) {
    // Inaktive Tabs visuell zurücksetzen
    document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
    
    // Aktiven Tab markieren
    // (Hier würde der EventBus später den Inhalt des Tabs laden)
    window.ToniEvents.emit('UI:TAB_CHANGED', { tab: tabName });
    console.log(`[UI] Wechsel zu Tab: ${tabName}`);
}
