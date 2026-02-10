/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT (ELITE CHOREOGRAPHY)
 * Fokus: Drill-Scripting, Voice-to-Arena Sync & YouTube Deep Links
 * Status: MASTER-UPDATE - 10.02.2026
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
        ut.pitch = 0.95; 
        ut.rate = 1.0;
        this.synth.speak(ut);
    }
};

// --- 2. DRILL-BIBLIOTHEK (SCRIPTS FÜR TONI) ---
const DRILL_LIBRARY = {
    'rondo': [
        { type: 'speak', text: 'Okay Coach, wir bauen ein Rondo auf. Achte auf die Abstände.', delay: 0 },
        { type: 'place', obj: 'cone', x: 250, y: 150, delay: 1000 },
        { type: 'place', obj: 'cone', x: 550, y: 150, delay: 500 },
        { type: 'place', obj: 'cone', x: 250, y: 400, delay: 500 },
        { type: 'place', obj: 'cone', x: 550, y: 400, delay: 500 },
        { type: 'speak', text: 'Zwei Spieler gehen in die Mitte, vier an die Außenseiten.', delay: 1500 },
        { type: 'deploy', count: 6, positions: [
            {x: 400, y: 250}, {x: 400, y: 300}, // Jäger
            {x: 250, y: 275}, {x: 550, y: 275}, {x: 400, y: 150}, {x: 400, y: 400} // Außen
        ], delay: 1000 },
        { type: 'path', mode: 'pass', x1: 250, y1: 275, x2: 400, y2: 150, delay: 2000 },
        { type: 'speak', text: 'Der Ball muss schnell zirkulieren. Schau dir die Passwege an.', delay: 1000 },
        { type: 'pass', x1: 250, y1: 275, x2: 400, y2: 150, delay: 500 }
    ],
    'funino': [
        { type: 'speak', text: 'Funino-System wird vorbereitet. Vier Tore, volle Action.', delay: 0 },
        { type: 'clear', delay: 500 },
        { type: 'speak', text: 'Der Greenkeeper markiert jetzt die Schusszonen.', delay: 1000 }
        // Hier wird über handleCommand zusätzlich window.arena.setPitchMode('funino') aufgerufen
    ]
};

// --- 3. TONI CORE COMMAND LOGIK (THE BRAIN) ---
async function handleCommand(command) {
    if (!command || !command.trim()) return;
    const cmdLower = command.toLowerCase();
    
    // UI Feedback (Chat)
    const chatBox = document.getElementById('chat-box');
    if(chatBox) {
        const msg = document.createElement('div');
        msg.innerHTML = `<span style="color:var(--neon-green);">TONI:</span> Verstanden, führe aus...`;
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // A. ÜBUNGS-CHOREOGRAFIEN
    if (cmdLower.includes("rondo") || cmdLower.includes("kreisspiel")) {
        window.arena.playDrill(DRILL_LIBRARY['rondo']);
        return;
    }

    if (cmdLower.includes("funino")) {
        window.arena.setPitchMode('funino');
        window.arena.playDrill(DRILL_LIBRARY['funino']);
        return;
    }

    // B. YOUTUBE SYNC LOGIK (DEEP LINK)
    if (cmdLower.includes("youtube") || cmdLower.includes("video")) {
        const query = cmdLower.replace("youtube", "").replace("video", "").trim();
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        
        window.ToniVoice.speak(`Ich öffne die Suche für ${query}. Wenn du am TV eingeloggt bist, erscheint es sofort in deinem Verlauf.`);
        
        // Öffnet YouTube in einem neuen Tab für den vollen Account-Sync
        window.open(searchUrl, '_blank');
        return;
    }

    // C. NAVIGATION
    if (cmdLower.includes("öffne") || cmdLower.includes("gehe zu")) {
        if(cmdLower.includes("kabine")) window.openSection('kabine');
        if(cmdLower.includes("training")) window.openSection('training');
        if(cmdLower.includes("junioren")) window.openSection('junioren_pool');
        return;
    }

    // D. STANDARD KI (Ollama / Phi-3)
    if (window.aiOnline) {
        try {
            const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
            const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                method: 'POST',
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Du bist TONI 2.0. Coach: ${window.coachInfo.name}. Befehl: ${command}. Antworte kurz und fußball-spezifisch.`,
                    stream: false
                })
            });
            const data = await response.json();
            window.ToniVoice.speak(data.response);
        } catch (e) {
            window.ToniVoice.speak("Der Mac-Server ist offline, Coach. Ich arbeite im lokalen Modus.");
        }
    }
}

// --- 4. NAVIGATION & ROUTER (BLEIBT GLEICH) ---
window.openSection = function(name) {
    // (Deine bestehende openSection-Logik hier einfügen)
    console.log("🛰️ Router ->", name);
    // ...
};

// --- 5. INITIALISIERUNG ---
window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.init();
    // (Deine bestehende checkAIStatus Logik)
});
