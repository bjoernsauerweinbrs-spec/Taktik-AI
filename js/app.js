/**
 * TONI 2.0 - Haupt-Controller (Finaler Fix)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check, ob Björn oder Nadine autorisiert sind
    const isAuthorized = localStorage.getItem('isAuthorized');
    if (!isAuthorized) {
        window.location.href = 'index.html';
        return;
    }

    console.log("[Toni 2.0] System bereit. Warte auf Tippen auf das Play-Symbol...");

    // 2. Start-Event vom Overlay (Zündschlüssel für Audio)
    window.ToniEvents.on('SYSTEM:START', () => {
        const overlay = document.getElementById('start-overlay');
        if (overlay) overlay.style.display = 'none'; // Play-Button weg
        
        const userName = localStorage.getItem('userName') || 'Trainer';
        document.getElementById('user-name-display').textContent = userName;
        
        startGingaSequence(userName);
    });
});

/**
 * Die dramaturgische Start-Sequenz
 */
async function startGingaSequence(userName) {
    const status = document.getElementById('status-display');
    
    // Phase 1: Männliche Stimme begrüßt Björn/Nadine
    status.textContent = "Toni analysiert Daten...";
    window.ToniEvents.emit('VOICE:SPEAK', {
        text: `Hallo ${userName}, ich bin Toni. Das Stadion ist bereit für deinen Ginga Style. Legen wir los?`
    });

    // Phase 2: Stadionbau nach Sprachausgabe
    window.ToniEvents.on('VOICE:ENDED', () => {
        status.textContent = "Baue Arena...";
        window.ToniEvents.emit('ARENA:BUILD', { type: 'senioren' }); 
    });

    // Phase 3: System-Freigabe und Aktentaschen-Inhalt laden
    window.ToniEvents.on('ARENA:READY', () => {
        document.body.classList.remove('blackout');
        document.body.classList.add('ready');
        status.textContent = "System online.";
        
        // Aktentasche öffnen und "Systemsteuerung"-Meldung durch Chat ersetzen
        setTimeout(() => {
            window.toggleSidebar(true);
            window.switchTab('chat'); // Lädt sofort den Chat-Inhalt
        }, 800);
    });
}

/**
 * Steuerung der Aktentasche (Sidebar)
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

/**
 * Inhalts-Wechsel (Repariert die Meldung "Warte auf System-Start")
 */
window.switchTab = function(tabName) {
    const content = document.getElementById('tab-content');
    
    // Aktiven Button visuell markieren
    document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`tab-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Inhalt der Aktentasche je nach Tab füllen
    if (tabName === 'chat') {
        const userName = localStorage.getItem('userName') || 'Trainer';
        content.innerHTML = `
            <div class="chat-wrapper">
                <div class="message-toni">
                    <strong>TONI:</strong><br>
                    Hallo ${userName}! Ich habe das Feld für die Senioren aufgebaut. 
                    Wie kann ich dir heute taktisch helfen?
                </div>
                <div class="chat-input-area" style="margin-top: 20px;">
                    <input type="text" placeholder="Frag Toni nach Taktik..." 
                           style="width: 100%; padding: 10px; background: #222; border: 1px solid #444; color: white; border-radius: 5px;">
                </div>
            </div>
        `;
    } else if (tabName === 'kader') {
        content.innerHTML = `<div style="padding:10px;">Lade Kader-Datenbank...</div>`;
        window.ToniEvents.emit('UI:TAB_CHANGED', { tab: 'kader' });
    } else {
        content.innerHTML = `<div style="padding:10px; color:#666;">Bereich ${tabName} wird vorbereitet...</div>`;
    }
};
