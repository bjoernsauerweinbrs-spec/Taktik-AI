/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT
 * Fokus: Deep Voice, Onboarding-Logik & High-Speed Performance.
 */

// --- 1. TONI VOICE ENGINE (DEEP VOICE UPGRADE) ---
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
        if (!this.recognition) return alert("Browser-Support fehlt.");
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
        
        // Suche nach einer tiefen, männlichen Stimme
        let eliteVoice = voices.find(v => v.name.includes("Yannick") || v.name.includes("Stefan") || v.name.includes("Google Deutsch")) || voices[0];
        
        utterance.voice = eliteVoice;
        utterance.pitch = 0.85; // Tieferer Sound
        utterance.rate = 1.0;   // Normale Geschwindigkeit
        utterance.volume = 1.0;
        this.synth.speak(utterance);
    }
};

// --- 2. COACH-DATEN SPEICHER ---
window.coachInfo = JSON.parse(localStorage.getItem('toni_coach_data')) || { name: null, verein: null, step: 0 };

function saveCoach() {
    localStorage.setItem('toni_coach_data', JSON.stringify(window.coachInfo));
}

// --- 3. NAVIGATION ---
function openSection(name) {
    if (!window.BriefcaseUI.isOpen) window.BriefcaseUI.toggle();
    const content = document.querySelector('.briefcase-window');
    
    if (name === 'kabine') { if (window.SektorSporttasche) window.SektorSporttasche.open(); } 
    else if (name === 'analyse') { if (window.SektorAnalyse) window.SektorAnalyse.open(); } 
    else if (name === 'stadion') { if (window.SektorStadion) window.SektorStadion.open(); }
    else if (name === 'settings') { if (window.SektorSettings) window.SektorSettings.open(); }
    else if (name === 'management') { if (window.SektorManagement) window.SektorManagement.open(); }
    else if (name === 'video') { if (window.SektorVideo) window.SektorVideo.open(); }
}

// --- 4. TONI CORE LOGIK (CONVERSATIONAL) ---
async function handleCommand(command) {
    if (!command.trim()) return;
    const chatBox = document.getElementById('chat-box');
    const inputField = document.getElementById('command-input');
    
    const userMsg = document.createElement('p');
    userMsg.style.color = "#fff";
    userMsg.innerHTML = `<strong>Coach:</strong> ${command}`;
    chatBox.appendChild(userMsg);
    inputField.value = "";

    const cmd = command.toLowerCase();
    const isOnline = window.aiOnline === true;
    const toniMsg = document.createElement('p');
    toniMsg.style.color = "var(--neon-green)";
    chatBox.appendChild(toniMsg);

    // --- ONBOARDING FLOW (SMALLTALK) ---
    if (!window.coachInfo.name) {
        window.coachInfo.name = command;
        saveCoach();
        let resp = `Sehr angenehm! Welchen Verein führen wir heute zum Sieg?`;
        toniMsg.innerHTML = `<strong>Toni:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        return;
    } 
    
    if (!window.coachInfo.verein) {
        window.coachInfo.verein = command;
        saveCoach();
        let resp = `Alles klar, ${window.coachInfo.verein} also. Sobald wir online sind, scanne ich die Vereinsdaten. Aktiviere jetzt die Super-KI im Setup!`;
        toniMsg.innerHTML = `<strong>Toni:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        setTimeout(() => openSection('settings'), 3000);
        return;
    }

    // --- KI PERFORMANCE LOGIK ---
    if (isOnline) {
        toniMsg.innerHTML = `<strong>Toni:</strong> <span class="thinking">Denke nach...</span>`;
        const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
        try {
            const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Antworte extrem kurz (max 2 Sätze) als Fußball-Analyst. 
                             Coach: ${window.coachInfo.name}, Verein: ${window.coachInfo.verein}. 
                             Befehl: ${command}`,
                    stream: false
                })
            });
            const data = await response.json();
            toniMsg.innerHTML = `<strong>Toni:</strong> ${data.response}`;
            window.ToniVoice.speak(data.response);
        } catch (err) {
            toniMsg.innerHTML = `<strong>Toni:</strong> Offline. Check das Terminal!`;
        }
    } else {
        // Basis-Antworten wenn offline
        let offResp = "Ich bin im Energiesparmodus. Starte Ollama am Mac, damit ich mein volles Wissen für den Verein nutzen kann!";
        toniMsg.innerHTML = `<strong>Toni:</strong> ${offResp}`;
        window.ToniVoice.speak(offResp);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 5. SYSTEM STATUS ---
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
            label.innerText = 'ONLINE';
        } else { throw new Error(); }
    } catch (err) {
        window.aiOnline = false;
        light.style.background = '#555';
        label.innerText = 'OFFLINE';
    }
}

// --- 6. INITIALISIERUNG ---
window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.init();
    checkAIStatus();
    setInterval(checkAIStatus, 5000);

    // Erstbegrüßung nur wenn noch kein Name da ist
    if (!window.coachInfo.name) {
        setTimeout(() => {
            const intro = "Hallo! Ich bin Toni 2.0. Nenn mir doch bitte mal deinen Namen.";
            const chatBox = document.getElementById('chat-box');
            const toniMsg = document.createElement('p');
            toniMsg.style.color = "var(--neon-green)";
            toniMsg.innerHTML = `<strong>Toni:</strong> ${intro}`;
            chatBox.appendChild(toniMsg);
            window.ToniVoice.speak(intro);
        }, 1500);
    }

    if (window.Database) window.Database.init();
    if (window.arena) window.arena.init('main-canvas');

    document.getElementById('command-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCommand(e.target.value);
    });
});
