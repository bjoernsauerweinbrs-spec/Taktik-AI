/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT (ELITE RECOVERY)
 * Fokus: Sektor-Routing, Voice-Sync & Formations-Logik
 * Status: 10.02.2026 - ROUTER REPARIERT
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

// --- 2. NAVIGATION & ROUTER (BULLETPROOF VERSION) ---
window.openSection = function(name) {
    console.log("🛰️ Router empfängt Befehl für:", name);
    
    // 1. UI-Referenzen sicherstellen
    const nav = document.getElementById('briefcase-nav');
    const contentArea = document.getElementById('briefcase-content');
    const activeDiv = document.getElementById('active-content');
    const backBtn = document.getElementById('back-to-hub');

    // Sicherheits-Check
    if (!contentArea || !activeDiv) {
        console.error("KRITISCH: HTML-Container fehlen!");
        return;
    }

    // Aktentasche öffnen, falls geschlossen
    if (window.BriefcaseUI && !window.BriefcaseUI.isOpen) {
        window.BriefcaseUI.toggle();
    }

    // UI umschalten: Hub aus, Content an
    if (nav) nav.style.display = 'none';
    contentArea.classList.remove('hidden');
    contentArea.style.display = 'block'; 
    if (backBtn) backBtn.classList.remove('hidden');
    
    // Kurzzeitiges Feedback
    activeDiv.innerHTML = `<div style="text-align:center; padding:50px; color:var(--neon-green); font-family:'Orbitron';">
        <i class="fas fa-sync fa-spin"></i> LADE SEKTOR: ${name.toUpperCase()}...
    </div>`;

    setTimeout(() => {
        try {
            const targetMap = {
                'junioren': window.SektorJunioren,
                'kabine': window.SektorSporttasche,
                'analyse': window.SektorAnalyse,
                'management': window.SektorManagement,
                'stadion': window.SektorTemplates,
                'stammplatz': window.SektorTemplates,
                'material': window.SektorMaterial,
                'video': window.SektorVideo,
                'settings': window.SektorSettings || window.SektorSystem,
                'system': window.SektorSettings
            };

            const target = targetMap[name];

            if (name === 'transfer') {
                if(window.BriefcaseUI && window.BriefcaseUI.renderTransferCenter) {
                    window.BriefcaseUI.renderTransferCenter();
                } else { throw new Error("Transfer-Logik nicht in BriefcaseUI gefunden."); }
            } 
            else if (target && typeof target.open === 'function') {
                target.open();
                // Tab-Steuerung für Templates
                if(name === 'stadion' && target.switchTab) target.switchTab('magazine');
                if(name === 'stammplatz' && target.switchTab) target.switchTab('stammplatz');
            } 
            else {
                throw new Error(`Sektor '${name}' ist nicht bereit oder das Skript wurde nicht geladen.`);
            }
        } catch (err) {
            console.error("🚨 ROUTING-FEHLER:", err.message);
            activeDiv.innerHTML = `
                <div style="background:rgba(255,0,0,0.1); border:1px solid var(--status-error); padding:30px; color:var(--status-error); border-radius:15px; text-align:center;">
                    <i class="fas fa-exclamation-triangle" style="font-size:2rem;"></i><br><br>
                    <b style="font-family:'Orbitron';">LADE-FEHLER</b><br>
                    <p style="font-size:0.8rem; margin:10px 0;">${err.message}</p>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()" style="margin-top:10px;">ZURÜCK ZUM HUB</button>
                </div>`;
        }
    }, 150);
};

// --- 3. TONI CORE COMMAND LOGIK ---
async function handleCommand(command) {
    if (!command || !command.trim()) return;
    const chatBox = document.getElementById('chat-box');
    const inputField = document.getElementById('command-input');
    const cmdLower = command.toLowerCase();
    
    const userMsg = document.createElement('div');
    userMsg.style.marginBottom = "10px";
    userMsg.innerHTML = `<span style="color:var(--text-dim); font-size:0.7rem;">COACH:</span><br>${command}`;
    chatBox.appendChild(userMsg);
    if(inputField) inputField.value = ""; 

    const toniMsg = document.createElement('div');
    toniMsg.style.color = "var(--neon-green)";
    toniMsg.style.marginBottom = "15px";
    chatBox.appendChild(toniMsg);

    if (cmdLower.includes("spielmodus") || cmdLower.includes("starten")) {
        let resp = "Spielmodus initiiert. Toni-Elf rückt ein ins 4-4-2. Trainer-Team formiert sich im 3-4-3. Alle Analyse-Systeme sind live.";
        toniMsg.innerHTML = `<strong>TONI:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        
        if(window.arena && window.arena.setupFormation) {
            window.arena.setupFormation('Toni', '4-4-2');
            window.arena.setupFormation('Trainer', '3-4-3');
        }
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    if (!window.coachInfo.name) {
        window.coachInfo.name = command;
        localStorage.setItem('toni_coach_data', JSON.stringify(window.coachInfo));
        let resp = `Sehr angenehm, Coach ${command}! Für welchen Verein ziehen wir heute die Fäden?`;
        toniMsg.innerHTML = `<strong>TONI:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    if (!window.coachInfo.verein) {
        window.coachInfo.verein = command;
        localStorage.setItem('toni_coach_data', JSON.stringify(window.coachInfo));
        let resp = `Alles klar, ${window.coachInfo.verein} ist registriert. Aktiviere mich im Setup für die volle Mac-Power!`;
        toniMsg.innerHTML = `<strong>TONI:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }

    if (window.aiOnline) {
        toniMsg.innerHTML = `<strong>TONI:</strong> <span class="thinking">Verarbeite Daten...</span>`;
        try {
            const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
            const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                method: 'POST',
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Du bist TONI 2.0, eine loyale und intelligente Fußball-KI. Coach: ${window.coachInfo.name}. Verein: ${window.coachInfo.verein}. Befehl: ${command}`,
                    stream: false
                })
            });
            const data = await response.json();
            toniMsg.innerHTML = `<strong>TONI:</strong> ${data.response}`;
            window.ToniVoice.speak(data.response);
        } catch (e) {
            toniMsg.innerHTML = `<strong>TONI:</strong> Verbindung zum Mac-Backend verloren. Check die IP im Setup!`;
        }
    } else {
        toniMsg.innerHTML = `<strong>TONI:</strong> Ich bin im Standby. Aktiviere die Online-Schnittstelle im Setup!`;
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

    if (window.Database && typeof window.Database.init === 'function') {
        window.Database.init();
    }

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
