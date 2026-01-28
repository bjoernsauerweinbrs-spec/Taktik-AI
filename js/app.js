/**
 * Toni 2.0 - Hauptsteuerung (The Orchestrator)
 * Diese Datei verbindet die app.html mit allen Modulen.
 */

const state = {
    isAuthorized: localStorage.getItem('isAuthorized') === 'true',
    currentPitch: 'grossfeld',
    isLocked: false,
    squad: []
};

// Startet das System, sobald die Seite geladen ist
document.addEventListener('DOMContentLoaded', async () => {
    if (!state.isAuthorized) return;

    try {
        // 1. Datenbank-Verbindung herstellen
        await window.initToniDB();
        console.log("✅ Toni-Datenbank bereit.");

        // 2. Ersten Kader-Check (lädt Spieler in die Sidebar)
        if (typeof refreshSquad === "function") {
            await refreshSquad();
        }
        
        // 3. Aktiviert die Knöpfe und Eingabefelder
        initEventListeners();
        
    } catch (err) {
        console.error("❌ Fehler beim Starten von Toni 2.0:", err);
    }
});

/**
 * TONI-CHAT LOGIK
 */
function askToni() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    
    if (text) {
        addMessage('user', text);
        input.value = '';
        
        // Toni antwortet und nutzt das voice.js Modul
        setTimeout(() => {
            const response = "Ich bin bereit, Björn. Das Spielfeld wird im Ginga-Style kalibriert.";
            addMessage('toni', response);
            if (window.toniVoice) window.toniVoice.speak(response);
        }, 1000);
    }
}

function addMessage(sender, text) {
    const chatBody = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = `<strong>${sender === 'toni' ? 'Toni' : 'Björn'}:</strong> ${text}`;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

/**
 * BUTTON-STEUERUNG
 */
function initEventListeners() {
    document.getElementById('send-btn')?.addEventListener('click', askToni);
    document.getElementById('user-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') askToni();
    });
}
