/**
 * TONI 2.0 - BRIDGE SCRIPT
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
        window.SektorSporttasche.open();
    } else if (name === 'analyse') {
        // Hier bauen wir gleich die Analyse-Daten ein
        alert("Analyse-Sektor wird im nächsten Schritt aktiviert!");
    } else {
        alert("Sektor " + name.toUpperCase() + " ist in Arbeit...");
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

    // Toni-Antwort-Logik
    const cmd = command.toLowerCase();
    let response = "Befehl empfangen. Ich analysiere...";
    
    if (cmd.includes("aufbau") || cmd.includes("hütchen")) {
        response = "Materialkammer bereit. Welche Übung planst du?";
    } else if (cmd.includes("taktik")) {
        response = "Taktik-Board aktualisiert. Die 50+ Spieler sind in der Datenbank.";
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
    
    // Arena (Spielfeld) starten
    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
        // Spieler aus dem Speicher direkt auf den Platz laden
        window.arena.syncFromDatabase(); 
    }

    // Enter-Taste für die Chatbox aktivieren
    const input = document.getElementById('command-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCommand(input.value);
        });
    }
};
