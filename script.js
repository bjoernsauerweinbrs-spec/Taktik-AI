/**
 * TONI 2.0 - BRIDGE SCRIPT (MASTER UPDATE)
 * Zentrale Steuerung: Verbindet UI-Sektoren, Arena-Tools und KI-Logik.
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
    const content = document.querySelector('.briefcase-window');
    
    if (name === 'kabine') {
        if (window.SektorSporttasche) window.SektorSporttasche.open();
    } 
    else if (name === 'analyse') {
        if (window.SektorAnalyse) window.SektorAnalyse.open();
    } 
    else if (name === 'stadion') {
        if (window.SektorStadion) window.SektorStadion.open();
    }
    else {
        // Fallback für noch nicht belegte Sektoren (verhindert leere Fenster)
        content.innerHTML = `
            <div style="text-align:center; padding-top:100px; animation: fadeIn 0.5s;">
                <i class="fas fa-microchip" style="font-size:4rem; color:var(--neon-green); margin-bottom:20px; opacity:0.2;"></i>
                <h2 style="color:#fff; letter-spacing:2px;">SEKTOR ${name.toUpperCase()}</h2>
                <p style="color:#555;">Dieses Modul wird gerade von der KI kalibriert...</p>
                <button class="pro-btn-gold" onclick="window.BriefcaseUI.renderMainGrid()" style="margin-top:30px; width:200px;">ZENTRALE</button>
            </div>
        `;
    }
}

// 3. Equipment-Palette Steuerung (Einklappen/Ausklappen)
function toggleEquipmentPalette(show) {
    const palette = document.getElementById('equipment-palette');
    if (!palette) return;
    
    if (show) {
        palette.classList.add('open');
    } else {
        palette.classList.remove('open');
    }
}

// 4. Toni Chat-Logik (KI-Befehle verarbeiten)
function handleCommand(command) {
    if (!command.trim()) return;
    
    const chatBox = document.getElementById('chat-box');
    const userMsg = document.createElement('p');
    userMsg.style.color = "#fff";
    userMsg.innerHTML = `<strong>Coach:</strong> ${command}`;
    chatBox.appendChild(userMsg);

    const cmd = command.toLowerCase();
    let response = "Ich habe den Befehl registriert. Soll ich die Arena entsprechend kalibrieren?";
    
    // Erweiterte Toni-Logik mit Paletten-Steuerung
    if (cmd.includes("aufbau") || cmd.includes("hütchen") || cmd.includes("übung") || cmd.includes("training")) {
        response = "Verstanden. Ich habe die Materialkammer ausgefahren. Die Tools für den Aufbau sind jetzt bereit.";
        toggleEquipmentPalette(true); // Palette automatisch ausfahren
    } else if (cmd.includes("spiel") || cmd.includes("taktik") || cmd.includes("match")) {
        response = "Match-Modus aktiv. Ich habe das Equipment verstaut, damit wir uns auf die Taktik konzentrieren können.";
        toggleEquipmentPalette(false); // Palette einklappen
    } else if (cmd.includes("analyse") || cmd.includes("puls")) {
        response = "Vital-Monitor ist aktiv. Die Sensoren übertragen jetzt die Live-Daten der Spieler.";
    }

    const toniMsg = document.createElement('p');
    toniMsg.style.color = "var(--neon-green)";
    toniMsg.innerHTML = `<strong>Toni:</strong> ${response}`;
    chatBox.appendChild(toniMsg);
    
    document.getElementById('command-input').value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 5. Initialisierung beim Laden der Seite
window.onload = () => {
    console.log("TONI 2.0 Cockpit geladen. System-Check...");
    
    // Datenbank initialisieren
    if (window.Database) {
        window.Database.init();
        // Palette je nach Modus (Training/Match) voreinstellen
        toggleEquipmentPalette(window.Database.activeMode === 'training');
    }

    // Arena (Spielfeld) starten
    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
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
