/**
 * TONI 2.0 - BRIDGE SCRIPT (FULL UPDATE)
 * Koordiniert UI, Arena-Materialien und Toni-Interaktion
 */

// 1. AKTENTASCHE STEUERUNG
function toggleBriefcase() {
    const modal = document.getElementById('briefcase-modal');
    if (!modal) return console.error("Modal nicht gefunden!");

    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        if (window.BriefcaseUI) {
            window.BriefcaseUI.renderMainGrid();
        }
    }
}

function openSection(section) {
    console.log("Navigiere zu Sektor:", section);
    if (section === 'kabine' && window.SektorSporttasche) {
        window.SektorSporttasche.open();
    } else if (section === 'analyse' && window.SektorAnalyse) {
        window.SektorAnalyse.open();
    } else {
        alert("Sektor " + section.toUpperCase() + " wird in Kürze freigeschaltet.");
    }
}

// 2. ARENA MATERIAL-STEUERUNG (Materialkammer)
/**
 * Diese Funktionen werden von der Palette neben dem Spielfeld aufgerufen
 */
function spawnMaterial(type, color) {
    if (window.arena) {
        window.arena.addEquipment(type, color);
        // Kurzes Feedback von Toni
        const msg = type === 'cone' ? "Hütchen platziert." : "Material auf dem Feld.";
        toniSpeak(msg);
    }
}

// 3. TONI CHAT & ANALYSE LOGIK
function toniSpeak(text) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;

    const msgElement = document.createElement('p');
    msgElement.style.color = "var(--neon-green)";
    msgElement.style.marginBottom = "10px";
    msgElement.style.animation = "fadeIn 0.5s ease";
    msgElement.innerHTML = `<strong>Toni:</strong> ${text}`;
    
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleCommand(command) {
    if (!command.trim()) return;
    
    // Deinen Befehl im Chat anzeigen
    const chatBox = document.getElementById('chat-box');
    const userMsg = document.createElement('p');
    userMsg.style.color = "#fff";
    userMsg.innerHTML = `<strong>Coach:</strong> ${command}`;
    chatBox.appendChild(userMsg);

    // Toni Logik / Antworten
    const cmd = command.toLowerCase();
    if (cmd.includes("hütchen") || cmd.includes("aufbau")) {
        toniSpeak("Verstanden. Ich habe die Materialkammer für den Aufbau vorbereitet.");
    } else if (cmd.includes("taktik") || cmd.includes("aufstellung")) {
        toniSpeak("Analysiere aktuelle Positionen... Die Abstände in der Kette wirken stabil.");
    } else {
        toniSpeak("Befehl empfangen. Ich verarbeite die Daten für die nächste Analyse.");
    }

    document.getElementById('command-input').value = "";
}

// 4. INITIALISIERUNG
window.onload = () => {
    console.log("TONI 2.0 SYSTEM ONLINE");
    
    // Arena starten
    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
    }

    // Enter-Taste für Toni-Befehle
    const input = document.getElementById('command-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCommand(input.value);
        });
    }
};
window.onload = () => {
    // Datenbank laden (falls noch nicht geschehen)
    if (window.Database) window.Database.init();
    
    // Arena starten
    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
        window.arena.syncFromDatabase(); // Spieler direkt auf den Platz laden
    }
    
    console.log("System bereit und Daten geladen.");
};
window.onload = () => {
    // Datenbank laden (falls noch nicht geschehen)
    if (window.Database) window.Database.init();
    
    // Arena starten
    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
        window.arena.syncFromDatabase(); // Spieler direkt auf den Platz laden
    }
    
    console.log("System bereit und Daten geladen.");
};
