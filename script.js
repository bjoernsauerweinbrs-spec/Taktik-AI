/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT
 * Zentrale: Voice-Engine, Klopp-Nagelsmann Personality & Offline-Guide Logik.
 */

// --- 1. TONI VOICE ENGINE (STIMME & GEHÖR) ---
window.ToniVoice = {
    isListening: false,
    recognition: null,
    synth: window.speechSynthesis,

    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.interimResults = false;
            this.recognition.continuous = false;

            this.recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                console.log("Toni hat gehört:", text);
                handleCommand(text);
                this.stopListening();
            };

            this.recognition.onerror = () => this.stopListening();
            this.recognition.onend = () => this.stopListening();
        }
    },

    toggle() {
        if (this.isListening) this.stopListening();
        else this.startListening();
    },

    startListening() {
        if (!this.recognition) return alert("Spracherkennung wird von diesem Browser nicht unterstützt.");
        this.isListening = true;
        document.getElementById('mic-trigger').classList.add('mic-active');
        this.recognition.start();
    },

    stopListening() {
        this.isListening = false;
        document.getElementById('mic-trigger').classList.remove('mic-active');
        if (this.recognition) this.recognition.stop();
    },

    speak(text) {
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = this.synth.getVoices();
        utterance.voice = voices.find(v => v.name.includes("Yannick") || v.name.includes("Google Deutsch")) || voices[0];
        utterance.pitch = 0.9;
        utterance.rate = 1.0;
        this.synth.speak(utterance);
    }
};

// --- 2. NAVIGATION & UI ---
function toggleBriefcase() {
    if (window.BriefcaseUI) window.BriefcaseUI.toggle();
}

function openSection(name) {
    if (!window.BriefcaseUI.isOpen) window.BriefcaseUI.toggle();
    
    console.log("Navigiere zu Sektor:", name);
    const content = document.querySelector('.briefcase-window');
    
    if (name === 'kabine') { if (window.SektorSporttasche) window.SektorSporttasche.open(); } 
    else if (name === 'analyse') { if (window.SektorAnalyse) window.SektorAnalyse.open(); } 
    else if (name === 'stadion') { if (window.SektorStadion) window.SektorStadion.open(); }
    else if (name === 'settings') { if (window.SektorSettings) window.SektorSettings.open(); }
    else if (name === 'management') { if (window.SektorManagement) window.SektorManagement.open(); }
    else if (name === 'video') { if (window.SektorVideo) window.SektorVideo.open(); }
    else {
        content.innerHTML = `
            <div style="text-align:center; padding-top:100px; animation: fadeIn 0.5s;">
                <i class="fas fa-microchip" style="font-size:4rem; color:var(--neon-green); margin-bottom:20px; opacity:0.1;"></i>
                <h2 style="color:#fff; letter-spacing:2px;">SEKTOR ${name.toUpperCase()}</h2>
                <p style="color:#555;">Modul wird von Toni kalibriert...</p>
                <button class="pro-btn-gold" onclick="window.BriefcaseUI.renderMainGrid()" style="margin-top:30px; width:220px;">ZENTRALE</button>
            </div>
        `;
    }
}

// --- 3. TONI CORE LOGIK ---
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
    toniMsg.innerHTML = `<strong>Toni:</strong> <span class="thinking">Analysiere...</span>`;
    chatBox.appendChild(toniMsg);
    
    chatBox.scrollTop = chatBox.scrollHeight;
    inputField.value = "";

    // --- OFFLINE ASSISTENT LOGIK ---
    if (!isSuperAI) {
        let helpText = "Ich bin momentan <b>OFFLINE</b>, Coach. Mein Gehirn am MacBook schläft noch.";
        
        if (cmd.includes("hilfe") || cmd.includes("verbinden") || cmd.includes("online") || cmd.includes("wie")) {
            helpText = `
                <b>SCHLACHPLAN ZUM ONLINE-MODUS:</b><br><br>
                1. <b>MacBook Terminal:</b> Starte Ollama mit dem Befehl:<br>
                <code style="color:#fff; background:#222; padding:3px;">OLLAMA_HOST=0.0.0.0 OLLAMA_ORIGINS="*" ollama serve</code><br><br>
                2. <b>IP-Check:</b> Trage die IP deines MacBooks in den <b>SETUP-Settings</b> ein.<br><br>
                3. <b>Login:</b> Das Passwort für alle Trainer ist <b style="color:white;">toni2026</b>.<br><br>
                Soll ich den Setup-Sektor für dich öffnen?
            `;
            window.ToniVoice.speak("Ich bin offline, Coach. Bitte starte das Terminal am MacBook und prüfe die I P Adresse im Setup.");
        } else {
            window.ToniVoice.speak("Basis-System aktiv. Für Profi-Analysen muss ich online sein. Sag Hilfe für eine Anleitung.");
        }
        
        toniMsg.innerHTML = `<strong>Toni:</strong> ${helpText}`;
        chatBox.scrollTop = chatBox.scrollHeight;
        return; 
    }

    // --- ONLINE MODUS (PHI-3) ---
    if (cmd.includes("video") || cmd.includes("analyse") || cmd.includes("zeig mir") || cmd.includes("trick")) {
        let drillType = "Allround-Check";
        if (cmd.includes("zidane")) drillType = "Zidane Turn";
        if (cmd.includes("torschuss") || cmd.includes("abschluss")) drillType = "Torschuss";
        if (cmd.includes("annahme")) drillType = "Ballannahme";
        openSection('video');
        if (window.SektorVideo) window.SektorVideo.setupDrill(drillType);
    }

    const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';

    try {
        const response = await fetch(`http://${savedIP}:11434/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'phi3', 
                prompt: `Du bist TONI 2.0, ein Elite-Fußball-Analyst (Nagelsmann/Klopp Mix). 
                         WICHTIG: Wenn der Coach nach DRUCKEN fragt, erkläre das A5 Booklet (2 Seiten pro Blatt). 
                         Wenn du OFFLINE warst und jetzt ONLINE bist, begrüße den Coach kurz und knackig.
                         Coach sagt: ${command}`,
                stream: false
            })
        });
        const data = await response.json();
        const finalResponse = data.response;
        toniMsg.innerHTML = `<strong>Toni:</strong> ${finalResponse}`;
        window.ToniVoice.speak(finalResponse);
    } catch (err) {
        toniMsg.innerHTML = `<strong>Toni:</strong> Verbindung zum MacBook (${savedIP}) verloren. Bitte Terminal prüfen!`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 4. SYSTEM STATUS (DYNAMISCHE IP PRÜFUNG) ---
window.aiOnline = false;
async function checkAIStatus() {
    const light = document.getElementById('ai-status-light');
    const label = document.getElementById('ai-status-label');
    const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
    if (!light || !label) return;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        // Prüft die Verbindung zur konfigurierten IP
        const response = await fetch(`http://${savedIP}:11434/api/tags`, { signal: controller.signal });
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

// --- 5. INITIALISIERUNG ---
window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.init();
    checkAIStatus();
    setInterval(checkAIStatus, 5000);

    if (window.Database) window.Database.init();

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
