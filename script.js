/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT (ELITE RECOVERY)
 * Fokus: Rollenbasiertes Routing & Arena-Integration (Funino/Kleinfeld)
 * Status: 10.02.2026 - SYNCED WITH NEW HUB
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
            this.recognition.continuous = false;
            this.recognition.onresult = (e) => {
                const text = e.results[0][0].transcript;
                console.log("🎤 Voice-Input:", text);
                handleCommand(text);
            };
            this.recognition.onend = () => {
                if(this.isListening) {
                    try { this.recognition.start(); } catch(e) {}
                }
            };
        }
    },
    toggle() { this.isListening ? this.stopListening() : this.startListening(); },
    startListening() {
        if (!this.recognition) return;
        this.isListening = true;
        const micBtn = document.getElementById('main-mic-btn');
        if (micBtn) micBtn.style.color = 'var(--neon-green)';
        try { this.recognition.start(); } catch(e) {}
        console.log("🎙️ TONI hört jetzt live zu...");
    },
    stopListening() {
        this.isListening = false;
        const micBtn = document.getElementById('main-mic-btn');
        if (micBtn) micBtn.style.color = '';
        this.recognition?.stop();
    },
    speak(text) {
        this.synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        const voices = this.synth.getVoices();
        ut.voice = voices.find(v => v.lang.includes('de-DE')) || voices[0];
        ut.pitch = 0.9; 
        ut.rate = 1.0;
        this.synth.speak(ut);
    }
};

// --- 2. NAVIGATION & ROUTER (RESTRUCTURED) ---
window.openSection = function(name) {
    console.log("🛰️ Router empfängt Befehl für:", name);
    
    const nav = document.getElementById('briefcase-nav');
    const contentArea = document.getElementById('briefcase-content');
    const activeDiv = document.getElementById('active-content');
    const backBtn = document.getElementById('back-to-hub');

    if (!contentArea || !activeDiv) return;

    if (window.BriefcaseUI && !window.BriefcaseUI.isOpen) {
        window.BriefcaseUI.toggle();
    }

    if (nav) nav.style.display = 'none';
    contentArea.classList.remove('hidden');
    contentArea.style.display = 'block'; 
    if (backBtn) backBtn.classList.remove('hidden');
    
    activeDiv.innerHTML = `<div style="text-align:center; padding:50px; color:var(--neon-green); font-family:'Orbitron';">
        <i class="fas fa-sync fa-spin"></i> INITIALISIERE ${name.toUpperCase()}...
    </div>`;

    setTimeout(() => {
        try {
            const targetMap = {
                // PRO AREA
                'kabine': window.SektorSporttasche,
                'matchmappe': window.SektorMatchMappe,
                'training': window.SektorTraining,
                
                // ACADEMY
                'junioren_pool': window.SektorJunioren,
                'stammplatz': window.SektorTemplates,
                'scouting': window.SektorScouting,
                
                // BUSINESS
                'management': window.SektorManagement,
                'analyse': window.SektorAnalyse,
                'material': window.SektorMaterial,
                
                // MEDIA
                'stadionzeitung': window.SektorTemplates,
                'video': window.SektorVideo,
                
                // SYSTEM
                'settings': window.SektorSettings || window.SektorSystem,
                'system': window.SektorSettings
            };

            const target = targetMap[name];

            if (target && typeof target.open === 'function') {
                target.open();
                // Spezifische Tab-Logik für Templates
                if(name === 'stadionzeitung' && target.switchTab) target.switchTab('magazine');
                if(name === 'stammplatz' && target.switchTab) target.switchTab('stammplatz');
            } 
            else {
                throw new Error(`Sektor '${name}' ist noch nicht konfiguriert.`);
            }
        } catch (err) {
            console.error("🚨 ROUTING-FEHLER:", err.message);
            activeDiv.innerHTML = `
                <div style="background:rgba(255,0,0,0.1); border:1px solid var(--status-error); padding:30px; color:var(--status-error); border-radius:15px; text-align:center;">
                    <i class="fas fa-exclamation-triangle" style="font-size:2rem;"></i><br><br>
                    <b style="font-family:'Orbitron';">SYSTEM-HINWEIS</b><br>
                    <p style="font-size:0.8rem; margin:10px 0;">${err.message}</p>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()" style="margin-top:10px;">ZURÜCK ZUR ZENTRALE</button>
                </div>`;
        }
    }, 150);
};

// --- 3. TONI CORE COMMAND LOGIK ---
async function handleCommand(command) {
    if (!command || !command.trim()) return;
    const chatBox = document.getElementById('chat-box');
    const cmdLower = command.toLowerCase();
    
    // UI Feedback
    const userMsg = document.createElement('div');
    userMsg.style.marginBottom = "10px";
    userMsg.innerHTML = `<span style="color:var(--text-dim); font-size:0.7rem;">COACH:</span><br>${command}`;
    chatBox.appendChild(userMsg);

    const toniMsg = document.createElement('div');
    toniMsg.style.color = "var(--neon-green)";
    chatBox.appendChild(toniMsg);

    // SPEZIAL-BEFEHL: SPIELMODUS (Saved Info 2026-02-07)
    if (cmdLower.includes("spielmodus") || cmdLower.includes("starten")) {
        let resp = "Spielmodus aktiv. Toni-Elf im 4-4-2, Trainer-Elf im 3-4-3. Alle Systeme bereit.";
        toniMsg.innerHTML = `<strong>TONI:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        
        if(window.arena && window.arena.setupFormation) {
            window.arena.setupFormation('Toni', '4-4-2');
            window.arena.setupFormation('Trainer', '3-4-3');
        }
        return;
    }

    // PLATZ-MODIFIKATION (Voice Commands)
    if (cmdLower.includes("funino")) {
        window.arena.setPitchMode('funino');
        window.ToniVoice.speak("Platz auf Funino-Modus umgestellt.");
        return;
    }
    
    if (cmdLower.includes("kleinfeld")) {
        window.arena.setPitchMode('kleinfeld');
        window.ToniVoice.speak("Platz auf Kleinfeld umgestellt.");
        return;
    }

    // STANDARD AI ANFRAGE (Ollama)
    if (window.aiOnline) {
        toniMsg.innerHTML = `<strong>TONI:</strong> <span class="thinking">Denke nach...</span>`;
        try {
            const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
            const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                method: 'POST',
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Du bist TONI 2.0. Coach: ${window.coachInfo.name}. Befehl: ${command}`,
                    stream: false
                })
            });
            const data = await response.json();
            toniMsg.innerHTML = `<strong>TONI:</strong> ${data.response}`;
            window.ToniVoice.speak(data.response);
        } catch (e) {
            toniMsg.innerHTML = `<strong>TONI:</strong> Mac-Server offline.`;
        }
    } else {
        toniMsg.innerHTML = `<strong>TONI:</strong> Standby. Aktiviere mich im Setup.`;
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
    setInterval(checkAIStatus, 10000);
});
