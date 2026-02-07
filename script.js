/**
 * TONI 2.0 - BRIDGE SCRIPT (MASTER UPDATE)
 * Verbindet das HTML mit der Logik der Module
 */

// 1. Die Haupt-Funktion für den Button "TASCHE"
function toggleBriefcase() {
    if (window.BriefcaseUI) {
        window.BriefcaseUI.toggle();
    } else {
        console.error("Fehler: BriefcaseUI-Modul wurde noch nicht geladen!");
    }
}

// 2. Navigation innerhalb der Aktentasche (Sektoren öffnen)
function openSection(name) {
    console.log("Navigiere zu Sektor:", name);
    
    if (name === 'kabine') {
        if (window.SektorSporttasche) {
            window.SektorSporttasche.open();
        } else {
            console.error("SektorSporttasche nicht gefunden!");
        }
    } 
    else if (name === 'analyse') {
        if (window.SektorAnalyse) {
            window.SektorAnalyse.open(); // Aktiviert den Analyse-Sektor
        } else {
            console.error("SektorAnalyse nicht gefunden!");
        }
    } 
    else {
        alert("Sektor " + name.toUpperCase() + " wird im nächsten Update freigeschaltet.");
    }
}

// 3. Toni Chat-Logik (Befehle verarbeiten)
function handleCommand(command) {
    if (!command.trim()) return;
    
    const chatBox = document.getElementById('chat-box');
    const userMsg = document.createElement('p');
    userMsg.style.color = "#fff";
    userMsg.innerHTML = `<strong>Coach:</strong> ${command}`;
    chatBox.appendChild(userMsg);

    const cmd = command.toLowerCase();
    let response = "Befehl empfangen. Ich analysiere...";
    
    if (cmd.includes("aufbau") || cmd.includes("hütchen")) {
        response = "Materialkammer bereit. Ich habe die Arena für den Aufbau kalibriert.";
    } else if (cmd.includes("taktik") || cmd.includes("kabine")) {
        response = "Taktik-Board steht. Alle Spielerdaten sind im Direktzugriff.";
    } else if (cmd.includes("analyse") || cmd.includes("puls")) {
        response = "Vital-Monitor ist aktiv. Ich überwache die Herzfrequenz der Spieler.";
    }

    const toniMsg = document.createElement('p');
    toniMsg.style.color = "var(--neon-green)";
    toniMsg.innerHTML = `<strong>Toni:</strong> ${response}`;
    chatBox.appendChild(toniMsg);
    
    document.getElementById('command-input').value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. Initialisierung beim Laden der Seite
window.onload = () => {
    console.log("TONI 2.0 Cockpit geladen.");
    
    // Datenbank initialisieren (Sicherheitshalber)
    if (window.Database) window.Database.init();

    // Arena (Spielfeld) starten
    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
        // Falls Spieler anwesend sind, direkt auf das Feld rendern
        if (window.Database && typeof window.Database.getPresentPlayers === 'function') {
            window.arena.syncFromDatabase(); 
        }
    }

    // Enter-Taste für die Chatbox aktivieren
    const input = document.getElementById('command-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCommand(input.value);
        });
    }
};
