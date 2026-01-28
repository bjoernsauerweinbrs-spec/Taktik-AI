/**
 * Toni 2.0 - Hauptsteuerung (The Orchestrator)
 * Diese Datei ist das Gehirn, das alle Module (Voice, Calc, Database) verbindet.
 */

const state = {
    isAuthorized: localStorage.getItem('isAuthorized') === 'true',
    currentPitch: '',
    isLocked: false,
    squad: []
};

// 1. Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', async () => {
    if (!state.isAuthorized) return;

    try {
        // Datenbank starten
        await window.initToniDB();
        console.log("✅ Toni-Datenbank bereit.");

        // Knöpfe und Eingabefelder aktivieren
        initEventListeners();
        
    } catch (err) {
        console.error("❌ Fehler beim Systemstart:", err);
    }
});

/**
 * 2. Die Antwort-Logik (Altersklassen-Weiche)
 * Verarbeitet: "Senioren", "Jugend", "Funino"
 */
window.processAgeGroupAnswer = function(answer) {
    const lowerAnswer = answer.toLowerCase();
    let selectedType = "";

    if (lowerAnswer.includes("senior")) {
        selectedType = "Senioren-Großfeld";
    } else if (lowerAnswer.includes("jugend") || lowerAnswer.includes("u17") || lowerAnswer.includes("kleinfeld")) {
        selectedType = "Jugend-Kleinfeld";
    } else if (lowerAnswer.includes("funino")) {
        selectedType = "Funino";
    }

    if (selectedType) {
        state.currentPitch = selectedType;
        
        // Toni bestätigt männlich und autoritär
        const response = `Verstanden, ${selectedType} ist aktiv. Ginga-Style geladen. Ich habe die Grundordnung auf 4-3-3 gesetzt. Das Board gehört dir.`;
        window.toniVoice.speak(response);

        // UI aktualisieren
        const label = document.getElementById('pitch-label');
        if (label) label.innerText = `Aktiv: ${selectedType}`;

        // Hier triggern wir später das Einfliegen der Spieler
        console.log(`Konfiguration für ${selectedType} abgeschlossen.`);
    } 
    else {
        // Fachmännische Rückführung bei unklarer Antwort
        const retryMsg = "Das klingt gut, Björn, aber ich brauche die Altersklasse für die Feldkonfiguration. Bitte wähle Senioren-Großfeld, Jugend-Kleinfeld oder Funino.";
        window.toniVoice.speak(retryMsg);
    }
};

/**
 * 3. Chat-Interaktion (Anfragen an Toni)
 */
function askToni() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    
    if (text) {
        addMessage('user', text);
        input.value = '';
        
        // Simulierter Denkprozess (später echte KI-Anbindung)
        setTimeout(() => {
            const response = "Analysiere die Taktik im Ginga-Style...";
            addMessage('toni', response);
            window.toniVoice.speak(response);
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
 * 4. Event-Listener (Klicks und Tastendruck)
 */
function initEventListeners() {
    // Senden-Button
    document.getElementById('send-btn')?.addEventListener('click', askToni);
    
    // Enter-Taste im Textfeld
    document.getElementById('user-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') askToni();
    });

    // Reset-Button im Header
    document.getElementById('btn-reset-board')?.addEventListener('click', () => {
        if(confirm("Möchtest du das Board wirklich zurücksetzen?")) {
            location.reload();
        }
    });
}
