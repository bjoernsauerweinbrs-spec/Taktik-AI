/**
 * TONI 2.0 - Haupt-Controller (Der Dirigent)
 * Steuert den Ablauf nach dem Klick auf den Start-Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sicherheits-Check (Login-Status prüfen)
    const isAuthorized = localStorage.getItem('isAuthorized');
    
    if (!isAuthorized) {
        window.location.href = 'index.html';
        return;
    }

    console.log("[Toni 2.0] System im Standby. Warte auf Benutzer-Interaktion...");

    // 2. Warten auf das Start-Signal vom Overlay (Wichtig für Mobile-Audio)
    window.ToniEvents.on('SYSTEM:START', () => {
        const overlay = document.getElementById('start-overlay');
        if (overlay) overlay.style.display = 'none';
        
        const userName = localStorage.getItem('userName') || 'Trainer';
        document.getElementById('user-name-display').textContent = userName;
        
        console.log(`[Toni 2.0] Start-Signal empfangen. Ginga-Sequenz für ${userName} wird eingeleitet...`);
        startGingaSequence(userName);
    });
});

/**
 * Die dramaturgische Start-Sequenz
 */
async function startGingaSequence(userName) {
    const status = document.getElementById('status-display');
    
    // Phase 1: Begrüßung (Voice Modul aktivieren)
    status.textContent = "Toni bereitet sich vor...";
    
    window.ToniEvents.emit('VOICE:SPEAK', {
        text: `Hallo ${userName}, ich bin Toni. Dein Taktik-System auf Weltniveau ist bereit. Übernehmen wir die Spielkontrolle?`
    });

    // Phase 2: Stadionbau starten, wenn Toni fertig gesprochen hat
    window.ToniEvents.on('VOICE:ENDED', () => {
        status.textContent = "Baue Stadion auf...";
        window.ToniEvents.emit('ARENA:BUILD', { type: 'senioren' }); 
    });

    // Phase 3: System freigeben, wenn das Stadion fertig ist
    window.ToniEvents.on('ARENA:READY', () => {
        document.body.classList.remove('blackout');
        document.body.classList.add('ready');
        status.textContent = "System bereit. Ginga!";
        
        // Aktentasche (Sidebar) nach einer kurzen Verzögerung einblenden
        setTimeout(() => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('active');
        }, 1000);
    });
}

/**
 * Globale UI-Funktionen
 */
window.toggleSidebar = function(forceOpen = null) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    if (forceOpen === true) {
        sidebar.classList.add('active');
    } else if (forceOpen === false) {
        sidebar.classList.remove('active');
    } else {
        sidebar.classList.toggle('active');
    }
};

window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`tab-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    window.ToniEvents.emit('UI:TAB_CHANGED', { tab: tabName });
    console.log(`[UI] Tab gewechselt zu: ${tabName}`);
};
