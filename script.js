/**
 * TONI 2.0 - BRIDGE SCRIPT (MASTER UPDATE)
 * Zentrale Steuerung: Verbindet UI-Sektoren, Arena und KI-Logik.
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
            window.SektorAnalyse.open();
        } else {
            console.error("SektorAnalyse nicht gefunden!");
        }
    } 
    else if (name === 'stadion') {
        if (window.SektorStadion) {
            window.SektorStadion.open(); // Öffnet die neue Einsatz-Mappe
        } else {
            console.error("SektorStadion (Einsatz-Mappe) nicht gefunden!");
        }
    }
    else {
        alert("Sektor " + name.toUpperCase() + " ist in der Entwicklung.");
    }
}

// 3. Toni Chat-Logik (KI-Befehle verarbeiten)
function handleCommand(command) {
    if (!command.trim()) return;
    
    const chatBox = document.getElementById('chat-box');
    const userMsg = document.createElement('p');
    userMsg.style.color = "#fff";
    userMsg.innerHTML = `<strong>Coach:</strong> ${command}`;
    chatBox.appendChild(userMsg);

    const cmd = command.toLowerCase();
    let response = "Ich habe den Befehl registriert. Soll ich die Arena entsprechend kalibrieren?";
    
    // Erweiterte Toni-Logik
    if (cmd.includes("aufbau") || cmd.includes("hütchen") || cmd.includes("übung")) {
        response = "Verstanden. Ich habe die Materialkammer geöffnet. Du kannst Hütchen und Bälle jetzt direkt auf dem Board platzieren.";
    } else if (cmd.includes("taktik") || cmd.includes("aufstellung")) {
        response = "Taktik-Board ist synchronisiert. Die Spieler aus der Kabine stehen am unteren Rand bereit.";
    } else if (cmd.includes("analyse") || cmd.includes("puls")) {
        response = "Vital-Monitor ist aktiv. Ich überwache die Herzfrequenz und Laufleistung der Spieler.";
    } else if (cmd.includes("mappe") || cmd.includes("plan") || cmd.includes("stadion")) {
        response = "Einsatz-Mappe liegt bereit. Soll ich einen Snapshot der aktuellen Arena für den Trainingsplan machen?";
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
    console.log("TONI 2.0 Cockpit geladen. System-Check...");
    
    // Datenbank initialisieren
    if (window.Database) window.Database.init();

    // Arena (Spielfeld) starten
    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
        
        // Erst-Synchronisation der Spieler auf das Board
        if (window.Database) {
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
    
    console.log("System ONLINE. Warte auf Anweisungen.");
};
