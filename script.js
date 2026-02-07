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
    else if (name === 'settings') {
        // Neu: Aufruf der Setup-Sektion für die KI
        if (window.SektorSettings) window.SektorSettings.open();
    }
    else {
        content.innerHTML = `
            <div style="text-align:center; padding-top:100px; animation: fadeIn 0.5s;">
                <i class="fas fa-microchip" style="font-size:4rem; color:var(--neon-green); margin-bottom:20px; opacity:0.1;"></i>
                <h2 style="color:#fff; letter-spacing:2px;">SEKTOR ${name.toUpperCase()}</h2>
                <p style="color:#555;">Toni kalibriert dieses Modul basierend auf deinen Anforderungen...</p>
                <button class="pro-btn-gold" onclick="window.BriefcaseUI.renderMainGrid()" style="margin-top:30px; width:220px;">ZURÜCK ZUR ZENTRALE</button>
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

// 4. Toni Chat-Logik (Erweiterte KI-Befehle & Taktik-Beratung)
function handleCommand(command) {
    if (!command.trim()) return;
    
    const chatBox = document.getElementById('chat-box');
    const userMsg = document.createElement('p');
    userMsg.style.color = "#fff";
    userMsg.style.marginBottom = "10px";
    userMsg.innerHTML = `<strong>Coach:</strong> ${command}`;
    chatBox.appendChild(userMsg);

    const cmd = command.toLowerCase();
    let response = "Befehl registriert. Ich analysiere die taktische Umsetzung...";
    
    // Prüfen ob Super-KI online ist (Status kommt aus checkAIStatus)
    const isSuperAI = window.aiOnline === true;

    // Taktische Intelligenz: Toni reagiert auf spezifische Trainings-Befehle
    if (cmd.includes("aufbau") || cmd.includes("übung") || cmd.includes("hütchen")) {
        response = "Materialkammer ist bereit. Ich empfehle, die Hütchen für ein kompaktes Verschieben im Zentrum zu platzieren.";
        toggleEquipmentPalette(true);
    } 
    else if (cmd.includes("pass") || cmd.includes("laufweg")) {
        response = "Verstanden. Die Taktik-Linien sind kalibriert. (Blau = Pass, Grün = Laufweg).";
        toggleEquipmentPalette(true);
    }
    else if (cmd.includes("torschuss") || cmd.includes("abschluss")) {
        response = "Abschluss-Modus aktiv. (Rote Linie). Ich tracke die Trefferquote.";
        toggleEquipmentPalette(true);
    }
    else if (cmd.includes("spiel") || cmd.includes("match") || cmd.includes("aufstellung")) {
        response = "Match-Modus kalibriert. Fokus auf die Startelf. Equipment wurde verstaut.";
        toggleEquipmentPalette(false);
    }
    else if (isSuperAI && (cmd.includes("warum") || cmd.includes("erklär") || cmd.includes("plan"))) {
        response = "Ich frage mein lokales Experten-Modell (A-Lizenz) nach einer detaillierten Analyse... (Verbindung steht!)";
        // Hier folgt später der API-Call an Ollama
    }

    const toniMsg = document.createElement('p');
    toniMsg.style.color = "var(--neon-green)";
    toniMsg.style.marginBottom = "15px";
    toniMsg.innerHTML = `<strong>Toni:</strong> ${response}`;
    chatBox.appendChild(toniMsg);
    
    document.getElementById('command-input').value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 5. KI-STATUS-PULS (Prüft ob Ollama lokal läuft)
window.aiOnline = false;
async function checkAIStatus() {
    const light = document.getElementById('ai-status-light');
    const label = document.getElementById('ai-status-label');
    if (!light || !label) return;

    try {
        // Wir pingen die lokale Ollama API an
        const response = await fetch('http://localhost:11434/api/tags');
        if (response.ok) {
            window.aiOnline = true;
            light.style.background = 'var(--neon-green)';
            light.style.boxShadow = '0 0 10px var(--neon-green)';
            label.innerText = 'ONLINE';
            label.style.color = 'var(--neon-green)';
        }
    } catch (err) {
        window.aiOnline = false;
        light.style.background = '#555';
        light.style.boxShadow = 'none';
        label.innerText = 'OFFLINE';
        label.style.color = '#555';
    }
}

// 6. Initialisierung beim Laden der Seite
window.onload = () => {
    console.log("TONI 2.0 Cockpit geladen. System-Check...");
    
    // KI-Status sofort und dann alle 10 Sekunden prüfen
    checkAIStatus();
    setInterval(checkAIStatus, 10000);

    if (window.Database) {
        window.Database.init();
        toggleEquipmentPalette(window.Database.activeMode === 'training');
    }

    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
        if (window.Database) {
            window.arena.syncFromDatabase(); 
        }
    }

    const input = document.getElementById('command-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCommand(input.value);
        });
    }
    
    console.log("System ONLINE. Horizontales Board bereit.");
};
