/**
 * TONI 2.0 - BRIDGE SCRIPT (MASTER UPDATE)
 * Zentrale Steuerung: Verbindet UI-Sektoren, Arena-Tools und lokale Super-KI.
 * Optimiert auf Performance (Phi-3 Turbo) & Profi-Analyse.
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

// 3. Equipment-Palette Steuerung
function toggleEquipmentPalette(show) {
    const palette = document.getElementById('equipment-palette');
    if (!palette) return;
    if (show) palette.classList.add('open');
    else palette.classList.remove('open');
}

// 4. Toni Chat-Logik & Lokale KI-Anbindung (Ollama)
async function handleCommand(command) {
    if (!command.trim()) return;
    
    const chatBox = document.getElementById('chat-box');
    const inputField = document.getElementById('command-input');
    
    const userMsg = document.createElement('p');
    userMsg.style.color = "#fff";
    userMsg.style.marginBottom = "10px";
    userMsg.innerHTML = `<strong>Coach:</strong> ${command}`;
    chatBox.appendChild(userMsg);

    const cmd = command.toLowerCase();
    const isSuperAI = window.aiOnline === true;

    const toniMsg = document.createElement('p');
    toniMsg.style.color = "var(--neon-green)";
    toniMsg.style.marginBottom = "15px";
    toniMsg.innerHTML = `<strong>Toni:</strong> <span class="thinking">Analysiere Taktik...</span>`;
    chatBox.appendChild(toniMsg);
    
    chatBox.scrollTop = chatBox.scrollHeight;
    inputField.value = "";

    let finalResponse = "Ich habe den Befehl registriert.";

    if (cmd.includes("aufbau") || cmd.includes("hütchen")) {
        finalResponse = "Materialkammer ausgefahren. Hütchen und Bälle liegen bereit.";
        toggleEquipmentPalette(true);
    } 
    else if (cmd.includes("spiel") || cmd.includes("match")) {
        finalResponse = "Match-Modus aktiv. Equipment verstaut.";
        toggleEquipmentPalette(false);
    }
    else if (isSuperAI) {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Du bist TONI 2.0, ein Elite-Fußball-Analyst mit UEFA-Pro-Lizenz. 
                             Dein Stil: Analytisch, präzise, direkt. Keine Floskeln.
                             Wenn nach Übungen gefragt wird, antworte immer so:
                             1. KURZANALYSE: Warum gibt es das Problem?
                             2. ÜBUNG: (Name der Übung)
                             3. ABLAUF: (Kurze Schritte)
                             4. COACHING POINTS: (Worauf achten?)
                             
                             Coach sagt: ${command}`,
                    stream: false
                })
            });
            const data = await response.json();
            finalResponse = data.response;
        } catch (err) {
            finalResponse = "Coach, Verbindung zum Phi-3 Modell unterbrochen. Bitte Terminal prüfen.";
        }
    } 
    else {
        finalResponse = "Basis-System aktiv. Für Profi-Analysen starte bitte Ollama auf deinem Mac.";
    }

    toniMsg.innerHTML = `<strong>Toni:</strong> ${finalResponse}`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 5. KI-STATUS-PULS (Ollama Heartbeat)
window.aiOnline = false;
async function checkAIStatus() {
    const light = document.getElementById('ai-status-light');
    const label = document.getElementById('ai-status-label');
    if (!light || !label) return;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch('http://localhost:11434/api/tags', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
            window.aiOnline = true;
            light.style.background = 'var(--neon-green)';
            light.style.boxShadow = '0 0 10px var(--neon-green)';
            label.innerText = 'ONLINE';
            label.style.color = 'var(--neon-green)';
        } else { throw new Error(); }
    } catch (err) {
        window.aiOnline = false;
        light.style.background = '#555';
        light.style.boxShadow = 'none';
        label.innerText = 'OFFLINE';
        label.style.color = '#555';
    }
}

// 6. Initialisierung beim Start
window.addEventListener('DOMContentLoaded', () => {
    checkAIStatus();
    setInterval(checkAIStatus, 5000);

    if (window.Database) {
        window.Database.init();
        toggleEquipmentPalette(window.Database.activeMode === 'training');
    }

    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
        setTimeout(() => window.arena.syncFromDatabase(), 100);
    }

    const input = document.getElementById('command-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCommand(input.value);
        });
    }
});
