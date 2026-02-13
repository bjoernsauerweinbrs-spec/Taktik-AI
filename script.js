/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT (ELITE CHOREOGRAPHY)
 * Fokus: Stabiler Router, Voice-Control & AI-Sync
 */

// --- 0. GLOBALE INITIALISIERUNG ---
window.coachInfo = JSON.parse(localStorage.getItem('toni_coach_data')) || { name: "Coach", verein: "Mein Verein" };
window.aiOnline = false;

// --- 1. TONI VOICE ENGINE ---
window.ToniVoice = {
    isListening: false,
    recognition: null,
    synth: window.speechSynthesis,
    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.continuous = false;
            this.recognition.onresult = (e) => {
                const text = e.results[0][0].transcript;
                handleCommand(text);
            };
        }
    },
    speak(text) {
        this.synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'de-DE';
        ut.pitch = 0.95; 
        this.synth.speak(ut);
        
        // Anzeige im Chat
        const chatBox = document.getElementById('chat-box');
        if(chatBox) {
            chatBox.innerHTML += `<div class="chat-msg system"><b>TONI:</b> ${text}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }
};

// --- 2. NAVIGATION & ROUTER (REPARIERT) ---
window.openSection = function(name) {
    console.log("🛰️ Router aktiviert Sektor:", name);
    const activeDiv = document.getElementById('active-content');
    const nav = document.getElementById('briefcase-nav');
    const contentArea = document.getElementById('briefcase-content');

    if (!activeDiv || !contentArea) return;

    // UI-Vorbereitung
    if (nav) nav.style.display = 'none';
    contentArea.style.display = 'block';
    contentArea.classList.remove('hidden');

    activeDiv.innerHTML = `<div style="text-align:center; padding:50px; color:var(--neon-green); font-family:'Orbitron';">SYNCING ${name.toUpperCase()}...</div>`;

    // Das Herzstück: Die Sektor-Verknüpfung
    setTimeout(() => {
        const targetMap = {
            'kabine': window.SektorSporttasche,
            'analyse': window.SektorAnalyse,
            'junioren_pool': window.SektorJugendbereich,
            'stadionzeitung': window.SektorStadionzeitung,
            'finanzen': window.SektorSponsoring,
            'video': window.SektorVideo,
            'settings': window.SektorSettings,
            'system': window.SektorSettings
        };

        const target = targetMap[name];

        if (target && typeof target.open === 'function') {
            target.open();
            console.log(`✅ Sektor ${name} erfolgreich gestartet.`);
        } else {
            console.error(`❌ Fehler: Sektor ${name} ist nicht geladen oder fehlerhaft.`);
            activeDiv.innerHTML = `
                <div style="text-align:center; padding:40px;">
                    <h3 style="color:#ff3131; font-family:'Orbitron';">SEKTOR-CRASH</h3>
                    <p style="color:#666; font-size:0.8rem;">Die Datei für '${name}' wurde nicht gefunden oder enthält Syntax-Fehler.</p>
                    <button class="tactic-btn" onclick="location.reload()" style="margin-top:20px;">SYSTEM REBOOT</button>
                </div>`;
        }
    }, 100);
};

// --- 3. KI-STATUS & INITIALISIERUNG ---
async function checkAIStatus() {
    const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
    const light = document.getElementById('ai-status-light');
    const label = document.getElementById('ai-status-label');

    try {
        const response = await fetch(`http://${savedIP}:11434/api/tags`);
        window.aiOnline = response.ok;
        if(light) light.style.background = response.ok ? 'var(--neon-green)' : '#555';
        if(label) label.innerText = response.ok ? 'ONLINE' : 'OFFLINE';
    } catch (err) {
        window.aiOnline = false;
        if(light) light.style.background = '#555';
        if(label) label.innerText = 'OFFLINE';
    }
}

// Globaler Command-Handler
window.handleCommand = handleCommand;

window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.init();
    checkAIStatus();
    setInterval(checkAIStatus, 10000);
});
