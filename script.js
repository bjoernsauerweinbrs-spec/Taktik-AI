/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT (ELITE RECOVERY)
 * Fokus: Sektor-Routing, Voice-Sync & Formations-Logik
 * Stand: 10.02.2026
 */

// --- 0. GLOBALE INITIALISIERUNG ---
window.coachInfo = JSON.parse(localStorage.getItem('toni_coach_data')) || { name: null, verein: null };
window.aiOnline = false;

// --- 1. TONI VOICE ENGINE (LIVE-SYNC) ---
window.ToniVoice = {
    isListening: false,
    recognition: null,
    synth: window.speechSynthesis,
    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.continuous = false; // Für präzise Befehle
            this.recognition.onresult = (e) => {
                const text = e.results[0][0].transcript;
                console.log("🎤 Voice-Input:", text);
                handleCommand(text);
            };
            this.recognition.onend = () => {
                if(this.isListening) this.recognition.start(); // Auto-Restart im Live-Modus
            };
        }
    },
    toggle() { this.isListening ? this.stopListening() : this.startListening(); },
    startListening() {
        if (!this.recognition) return;
        this.isListening = true;
        const mic = document.getElementById('mic-trigger');
        if (mic) mic.style.color = 'var(--neon-green)';
        this.recognition.start();
        console.log("🎙️ TONI hört jetzt live zu...");
    },
    stopListening() {
        this.isListening = false;
        const mic = document.getElementById('mic-trigger');
        if (mic) mic.style.color = '';
        this.recognition?.stop();
    },
    speak(text) {
        this.synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        const voices = this.synth.getVoices();
        ut.voice = voices.find(v => v.lang === 'de-DE') || voices[0];
        ut.pitch = 0.9; 
        ut.rate = 1.0;
        this.synth.speak(ut);
    }
};

// --- 2. NAVIGATION & ROUTER (ELITE MAPPING) ---
window.openSection = function(name) {
    console.log("🛰️ Bridge-Routing -> Sektor:", name);
    
    if (window.BriefcaseUI && !window.BriefcaseUI.isOpen) {
        window.BriefcaseUI.toggle();
    }

    setTimeout(() => {
        try {
            const targetMap = {
                'junioren': window.SektorJunioren,
                'kabine': window.SektorSporttasche,
                'analyse': window.SektorAnalyse,
                'management': window.SektorManagement,
                'stadion': window.SektorTemplates, // Umleitung auf Templates
                'stammplatz': window.SektorTemplates, // Sticker-Studio
                'material': window.SektorMaterial,
                'video': window.SektorVideo,
                'settings': window.SektorSettings || window.SektorSystem
            };

            const target = targetMap[name];

            if (target && typeof target.open === 'function') {
                target.open();
                // Spezial-Tab für Templates
                if(name === 'stadion' && target.switchTab) target.switchTab('magazine');
                if(name === 'stammplatz' && target.switchTab) target.switchTab('stammplatz');
            } else {
                throw new Error(`Sektor '${name}' nicht initialisiert.`);
            }
        } catch (err) {
            console.error("KRITISCH:", err);
            const chat = document.getElementById('chat-box');
            if(chat) chat.innerHTML += `<p style="color:red"><b>FEHLER:</b> ${err.message}</p>`;
        }
    }, 200);
};

// --- 3. TONI CORE COMMAND LOGIK ---
async function handleCommand(command) {
    if (!command || !command.trim()) return;
    const chatBox = document.getElementById('chat-box');
    const inputField = document.getElementById('command-input');
    const cmdLower = command.toLowerCase();
    
    // Chat-Eintrag
    const userMsg = document.createElement('p');
    userMsg.innerHTML = `<span style="color:var(--text-dim)">Coach:</span> ${command}`;
    chatBox.appendChild(userMsg);
    if(inputField) inputField.value = ""; 

    const toniMsg = document.createElement('p');
    toniMsg.style.color = "var(--neon-green)";
    chatBox.appendChild(toniMsg);

    // SPEZIAL-BEFEHL: SPIELMODUS (Saved Info 2026-02-07)
    if (cmdLower.includes("spielmodus") || cmdLower.includes("starten")) {
        let resp = "Spielmodus wird aktiviert. Toni-Elf steht im 4-4-2, Trainer-Team im 3-4-3. Alle Systeme bereit.";
        toniMsg.innerHTML = `<strong>Toni:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        
        if(window.arena && window.arena.setupFormation) {
            window.arena.setupFormation('Toni', '4-4-2');
            window.arena.setupFormation('Trainer', '3-4-3');
        }
        return;
    }

    // COACH-SETUP LOGIK
    if (!window.coachInfo.name) {
        window.coachInfo.name = command;
        localStorage.setItem('toni_coach_data', JSON.stringify(window.coachInfo));
        let resp = `Sehr angenehm, Coach ${command}! Von welchem Verein reden wir heute?`;
        toniMsg.innerHTML = `<strong>Toni:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        return;
    }

    // AI OFFLINE/ONLINE LOGIK (Ollama phi3)
    if (window.aiOnline) {
        toniMsg.innerHTML = `<strong>Toni:</strong> <span class="thinking">Denke nach...</span>`;
        try {
            const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
            const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                method: 'POST',
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Antworte als TONI 2.0 Fußball-KI. Kurz und präzise. Coach: ${window.coachInfo.name}. Verein: ${window.coachInfo.verein}. Befehl: ${command}`,
                    stream: false
                })
            });
            const data = await response.json();
            toniMsg.innerHTML = `<strong>Toni:</strong> ${data.response}`;
            window.ToniVoice.speak(data.response);
        } catch (e) {
            toniMsg.innerHTML = `<strong>Toni:</strong> Verbindung zum Mac-Server unterbrochen.`;
        }
    } else {
        toniMsg.innerHTML = `<strong>Toni:</strong> Ich bin aktuell offline. Aktiviere mich im Setup-Sektor!`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 4. STATUS-CHECK (AI ENGINE) ---
async function checkAIStatus() {
    const light = document.getElementById('ai-status-light');
    const label = document.getElementById('ai-status-label');
    const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';

    try {
        const response = await fetch(`http://${savedIP}:11434/api/tags`);
        if (response.ok) {
            window.aiOnline = true;
            if(light) light.style.background = 'var(--neon-green)';
            if(label) label.innerText = 'ONLINE';
        } else { throw new Error(); }
    } catch (err) {
        window.aiOnline = false;
        if(light) light.style.background = '#555';
        if(label) label.innerText = 'OFFLINE';
    }
}

// --- 5. INITIALISIERUNG ---
window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.init();
    checkAIStatus();
    setInterval(checkAIStatus, 8000);

    if (window.Database && typeof window.Database.init === 'function') {
        window.Database.init();
    }

    // Arena-Start mit Sicherheits-Timeout
    setTimeout(() => {
        if (window.arena && typeof window.arena.init === 'function') {
            window.arena.init('main-canvas');
        }
    }, 500);

    const cmdInput = document.getElementById('command-input');
    if (cmdInput) {
        cmdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCommand(e.target.value);
        });
    }
});
