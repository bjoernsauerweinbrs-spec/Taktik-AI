/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT (RECOVERY UPDATE)
 * Fokus: Junioren-Routing & CoachInfo Fix
 */

// --- 0. GLOBALE INITIALISIERUNG ---
window.coachInfo = JSON.parse(localStorage.getItem('toni_coach_data')) || { name: null, verein: null };

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
            this.recognition.onresult = (e) => handleCommand(e.results[0][0].transcript);
        }
    },
    toggle() { this.isListening ? this.stopListening() : this.startListening(); },
    startListening() {
        if (!this.recognition) return;
        this.isListening = true;
        const mic = document.getElementById('mic-trigger');
        if (mic) mic.classList.add('mic-active');
        this.recognition.start();
    },
    stopListening() {
        this.isListening = false;
        const mic = document.getElementById('mic-trigger');
        if (mic) mic.classList.remove('mic-active');
        this.recognition?.stop();
    },
    speak(text) {
        this.synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        const voices = this.synth.getVoices();
        ut.voice = voices.find(v => v.lang === 'de-DE') || voices[0];
        ut.pitch = 0.85; 
        this.synth.speak(ut);
    }
};

// --- 2. NAVIGATION & ROUTER (JUNIOREN-UPDATE) ---
function openSection(name) {
    console.log("Routing aktiv -> Sektor:", name);
    
    // Sicherstellen, dass die Aktentasche offen ist
    if (window.BriefcaseUI && !window.BriefcaseUI.isOpen) {
        window.BriefcaseUI.toggle();
    }

    setTimeout(() => {
        try {
            // Die "Ziele-Map" - Hier habe ich 'junioren' hinzugefügt!
            const targetMap = {
                'junioren': window.SektorJunioren,
                'kabine': window.SektorSporttasche,
                'analyse': window.SektorAnalyse,
                'management': window.SektorManagement,
                'stadion': window.SektorStadion,
                'training': window.SektorTraining,
                'material': window.SektorMaterial,
                'video': window.SektorVideo,
                'matchday': window.SektorMatchday,
                'taktik': window.SektorTaktik,
                'settings': window.SektorSettings
            };

            const target = targetMap[name];

            if (target && typeof target.open === 'function') {
                target.open();
            } else {
                throw new Error(`Sektor '${name}' nicht bereit oder Objekt fehlt.`);
            }
        } catch (err) {
            console.error("KRITISCH: Sektor-Ladefehler:", err);
            alert("Fehler: " + err.message);
        }
    }, 150);
}

// --- 3. TONI CORE LOGIK ---
async function handleCommand(command) {
    if (!command || !command.trim()) return;
    const chatBox = document.getElementById('chat-box');
    const inputField = document.getElementById('command-input');
    
    const userMsg = document.createElement('p');
    userMsg.innerHTML = `<span style="color:var(--accent-gold)">Coach:</span> ${command}`;
    chatBox.appendChild(userMsg);
    inputField.value = ""; 

    const toniMsg = document.createElement('p');
    toniMsg.style.color = "var(--neon-green)";
    chatBox.appendChild(toniMsg);

    if (!window.coachInfo.name) {
        window.coachInfo.name = command;
        localStorage.setItem('toni_coach_data', JSON.stringify(window.coachInfo));
        let resp = `Sehr angenehm, Coach ${command}! Von welchem Verein reden wir heute?`;
        toniMsg.innerHTML = `<strong>Toni:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        return;
    }

    if (!window.coachInfo.verein) {
        window.coachInfo.verein = command;
        localStorage.setItem('toni_coach_data', JSON.stringify(window.coachInfo));
        let resp = `Alles klar, ${window.coachInfo.verein}! Aktiviere mich jetzt im Setup für den Online-Modus!`;
        toniMsg.innerHTML = `<strong>Toni:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        setTimeout(() => openSection('settings'), 2000);
        return;
    }

    if (window.aiOnline) {
        toniMsg.innerHTML = `<strong>Toni:</strong> <span class="thinking">Analysiere...</span>`;
        try {
            const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
            const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                method: 'POST',
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Kurz-Antwort als Fußball-Analyst. Coach: ${window.coachInfo.name}. Befehl: ${command}`,
                    stream: false
                })
            });
            const data = await response.json();
            toniMsg.innerHTML = `<strong>Toni:</strong> ${data.response}`;
            window.ToniVoice.speak(data.response);
        } catch (e) {
            toniMsg.innerHTML = `<strong>Toni:</strong> Verbindung zum Mac unterbrochen.`;
        }
    } else {
        toniMsg.innerHTML = `<strong>Toni:</strong> Ich bin offline. Geh ins Setup zur Aktivierung!`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 4. STATUS-CHECK ---
window.aiOnline = false;
async function checkAIStatus() {
    const light = document.getElementById('ai-status-light');
    const label = document.getElementById('ai-status-label');
    const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
    if (!light || !label) return;

    try {
        const response = await fetch(`http://${savedIP}:11434/api/tags`);
        if (response.ok) {
            window.aiOnline = true;
            light.style.background = 'var(--neon-green)';
            if(label) label.innerText = 'ONLINE';
        } else { throw new Error(); }
    } catch (err) {
        window.aiOnline = false;
        light.style.background = '#555';
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

    setTimeout(() => {
        if (window.arena && typeof window.arena.init === 'function') {
            console.log("Arena wird scharf geschaltet...");
            window.arena.init('main-canvas');
            window.arena.resize();
        }
    }, 800);

    if (window.coachInfo && !window.coachInfo.name) {
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            const toniMsg = document.createElement('p');
            toniMsg.style.color = "var(--neon-green)";
            toniMsg.innerHTML = `<strong>Toni:</strong> Willkommen! Ich bin Toni 2.0. Wie ist dein Name?`;
            chatBox.appendChild(toniMsg);
            window.ToniVoice.speak("Willkommen! Ich bin Toni 2.0. Wie ist dein Name?");
        }
    }

    const cmdInput = document.getElementById('command-input');
    if (cmdInput) {
        cmdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCommand(e.target.value);
        });
    }
});
