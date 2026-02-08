/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT
 * Version: 3.0 (Onboarding-Fix, Arena-Recovery & Manual Data)
 */

// --- 1. TONI VOICE ENGINE (STABILISIERT) ---
window.ToniVoice = {
    isListening: false,
    recognition: null,
    synth: window.speechSynthesis,

    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.onresult = (event) => {
                handleCommand(event.results[0][0].transcript);
                this.stopListening();
            };
            this.recognition.onend = () => this.stopListening();
        }
    },

    toggle() { this.isListening ? this.stopListening() : this.startListening(); },
    startListening() {
        if (!this.recognition) return;
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
        utterance.voice = voices.find(v => v.name.includes("Google Deutsch") || v.lang === 'de-DE') || voices[0];
        utterance.pitch = 0.85;
        this.synth.speak(utterance);
    }
};

// --- 2. COACH & DATA MANAGEMENT ---
window.coachInfo = JSON.parse(localStorage.getItem('toni_coach_data')) || { name: null, verein: null };

function saveCoach() {
    localStorage.setItem('toni_coach_data', JSON.stringify(window.coachInfo));
}

/**
 * NEU: Manuelles Update für Analyse-Daten (Körperfett etc.)
 */
window.updateBodyStats = function(playerId, key, value) {
    if(window.Database) {
        window.Database.updatePlayer(playerId, key, parseFloat(value));
        console.log(`Update: Spieler ${playerId} -> ${key}: ${value}`);
    }
};

// --- 3. NAVIGATION (HUB-RECOVERY) ---
function openSection(name) {
    // Falls die Mappe zu ist, öffnen
    if (!window.BriefcaseUI.isOpen) window.BriefcaseUI.toggle();
    
    // Direkter Aufruf des Routers (aus aktentasche-ui.js)
    if (window.openSection) {
        window.openSection(name);
    }
}

// --- 4. TONI CORE LOGIK (ONBOARDING & CHAT) ---
async function handleCommand(command) {
    if (!command || !command.trim()) return;
    const chatBox = document.getElementById('chat-box');
    const inputField = document.getElementById('command-input');
    
    // User Message
    const userMsg = document.createElement('p');
    userMsg.style.padding = "5px 0";
    userMsg.innerHTML = `<span style="color:var(--accent-gold)">Coach:</span> ${command}`;
    chatBox.appendChild(userMsg);
    inputField.value = "";

    const toniMsg = document.createElement('p');
    toniMsg.style.color = "var(--neon-green)";
    chatBox.appendChild(toniMsg);

    // --- ONBOARDING FLOW ---
    if (!window.coachInfo.name) {
        window.coachInfo.name = command;
        saveCoach();
        let resp = `Sehr angenehm, Coach ${command}! Von welchem Verein reden wir?`;
        toniMsg.innerHTML = `<strong>Toni:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        return;
    } 
    
    if (!window.coachInfo.verein) {
        window.coachInfo.verein = command;
        saveCoach();
        let resp = `Alles klar, ${window.coachInfo.verein}. Ich lade das Stadion-Modul. Aktiviere jetzt die KI im Setup!`;
        toniMsg.innerHTML = `<strong>Toni:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        setTimeout(() => openSection('settings'), 2500);
        return;
    }

    // --- AI RESPONSE (OLLAMA) ---
    if (window.aiOnline) {
        toniMsg.innerHTML = `<strong>Toni:</strong> <span class="thinking">Analysiere...</span>`;
        const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
        try {
            const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                method: 'POST',
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Analysten-Modus. Coach: ${window.coachInfo.name}. Befehl: ${command}`,
                    stream: false
                })
            });
            const data = await response.json();
            toniMsg.innerHTML = `<strong>Toni:</strong> ${data.response}`;
            window.ToniVoice.speak(data.response);
        } catch (err) {
            toniMsg.innerHTML = `<strong>Toni:</strong> Verbindung zum Mac verloren.`;
        }
    } else {
        toniMsg.innerHTML = `<strong>Toni:</strong> Ich bin offline. Aktiviere mich im Setup!`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 5. INITIALISIERUNG (RECOVERY ENGINE) ---
window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.init();
    
    // Arena Recovery: Spielfeld erzwingen
    setTimeout(() => {
        if (window.arena) {
            window.arena.init('main-canvas');
            window.arena.resize(); // Resize erzwingen für Sichtbarkeit
        }
    }, 500);

    // Erstbegrüßung & Confirm-Button Fix
    if (!window.coachInfo.name) {
        const chatBox = document.getElementById('chat-box');
        const intro = "Hallo! Ich bin Toni 2.0. Wie ist dein Name, Coach?";
        const toniMsg = document.createElement('p');
        toniMsg.style.color = "var(--neon-green)";
        toniMsg.innerHTML = `<strong>Toni:</strong> ${intro}<br>
            <button class="onboarding-confirm-btn" onclick="handleCommand(document.getElementById('command-input').value)">BESTÄTIGEN</button>`;
        chatBox.appendChild(toniMsg);
        window.ToniVoice.speak(intro);
    }

    // Enter-Taste für Chat
    document.getElementById('command-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCommand(e.target.value);
    });

    // Datenbank laden
    if (window.Database) window.Database.init();
});
