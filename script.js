/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT (ELITE CHOREOGRAPHY)
 * Fokus: Drill-Scripting, KI-Übungs-Generator & YouTube Deep Links
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

// --- 2. DRILL-BIBLIOTHEK (STATISCHE SCRIPTS) ---
const DRILL_LIBRARY = {
    'rondo': [
        { type: 'speak', text: 'Okay Coach, wir bauen ein Rondo auf. Achte auf die Abstände.', delay: 0 },
        { type: 'place', obj: 'cone', x: 250, y: 150, delay: 1000 },
        { type: 'place', obj: 'cone', x: 550, y: 150, delay: 500 },
        { type: 'place', obj: 'cone', x: 250, y: 400, delay: 500 },
        { type: 'place', obj: 'cone', x: 550, y: 400, delay: 500 },
        { type: 'speak', text: 'Zwei Spieler gehen in die Mitte, vier an die Außenseiten.', delay: 1500 },
        { type: 'deploy', count: 6, positions: [
            {x: 400, y: 250}, {x: 400, y: 300}, 
            {x: 250, y: 275}, {x: 550, y: 275}, {x: 400, y: 150}, {x: 400, y: 400} 
        ], delay: 1000 },
        { type: 'path', mode: 'pass', x1: 250, y1: 275, x2: 400, y2: 150, delay: 2000 },
        { type: 'speak', text: 'Der Ball muss schnell zirkulieren. Schau dir die Passwege an.', delay: 1000 },
        { type: 'pass', x1: 250, y1: 275, x2: 400, y2: 150, delay: 500 }
    ],
    'demo': [
        { type: 'speak', text: 'Willkommen zur TONI 2.0 Master-Demo. Ich zeige dir jetzt einen koordinierten Flügelangriff.', delay: 0 },
        { type: 'clear', delay: 1000 },
        { type: 'speak', text: 'Zuerst markiere ich die Angriffszone mit Hütchen.', delay: 2000 },
        { type: 'place', obj: 'cone', x: 600, y: 100, delay: 1000 },
        { type: 'place', obj: 'cone', x: 600, y: 400, delay: 500 },
        { type: 'speak', text: 'Ich hole drei Spieler aus deiner Kabine.', delay: 1500 },
        { type: 'deploy', count: 3, positions: [{x: 400, y: 250}, {x: 450, y: 100}, {x: 550, y: 250}], delay: 1000 },
        { type: 'speak', text: 'Der Spielmacher passt nach außen.', delay: 3000 },
        { type: 'path', mode: 'pass', x1: 400, y1: 250, x2: 450, y2: 100, delay: 500 },
        { type: 'pass', x1: 400, y1: 250, x2: 450, y2: 100, delay: 500 },
        { type: 'speak', text: 'Jetzt erfolgt das Hinterlaufen. Achte auf den goldenen Vektor.', delay: 2500 },
        { type: 'path', mode: 'run', x1: 420, y1: 270, x2: 650, y2: 100, delay: 500 },
        { type: 'move', id: 'player-1', x: 650, y: 100, delay: 1000 },
        { type: 'speak', text: 'Flanke in den Rückraum und Abschluss. Tor.', delay: 2500 },
        { type: 'path', mode: 'pass', x1: 650, y1: 100, x2: 550, y2: 250, delay: 500 },
        { type: 'pass', x1: 650, y1: 100, x2: 550, y2: 250, delay: 500 },
        { type: 'speak', text: 'Das ist die Power von TONI 2.0. Übung beendet.', delay: 2000 }
    ]
};

// --- 3. TONI CORE COMMAND LOGIK (THE BRAIN) ---
async function handleCommand(command) {
    if (!command || !command.trim()) return;
    const cmdLower = command.toLowerCase();
    
    const chatBox = document.getElementById('chat-box');
    if(chatBox) {
        const msg = document.createElement('div');
        msg.innerHTML = `<span style="color:var(--neon-green);">COACH:</span> ${command}`;
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // A. ÜBUNGS-CHOREOGRAFIEN (STATISCH & DEMO)
    if (cmdLower.includes("demo") || cmdLower.includes("was du kannst")) {
        window.arena.playDrill(DRILL_LIBRARY['demo']);
        return;
    }

    if (cmdLower.includes("rondo") || cmdLower.includes("kreisspiel")) {
        window.arena.playDrill(DRILL_LIBRARY['rondo']);
        return;
    }

    // B. DYNAMISCHE KI-ÜBUNGEN (SUPER-KI MODUS)
    if (cmdLower.includes("suche übung") || cmdLower.includes("generiere übung")) {
        const drillName = cmdLower.replace("suche übung", "").replace("generiere übung", "").trim();
        generateDynamicDrill(drillName);
        return;
    }

    // C. YOUTUBE SYNC LOGIK
    if (cmdLower.includes("youtube") || cmdLower.includes("video")) {
        const query = cmdLower.replace("youtube", "").replace("video", "").trim();
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        window.ToniVoice.speak(`Ich öffne YouTube für ${query}. Logge dich dort ein für den TV-Sync.`);
        window.open(searchUrl, '_blank');
        return;
    }

    // D. ARENA SETUP
    if (cmdLower.includes("funino")) {
        window.arena.setPitchMode('funino');
        window.ToniVoice.speak("Stelle Platz auf Funino um.");
        return;
    }

    // E. STANDARD KI ANFRAGE
    if (window.aiOnline) {
        try {
            const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
            const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                method: 'POST',
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Du bist TONI 2.0. Coach: ${window.coachInfo.name}. Befehl: ${command}. Antworte kurz.`,
                    stream: false
                })
            });
            const data = await response.json();
            window.ToniVoice.speak(data.response);
        } catch (e) {
            window.ToniVoice.speak("Mac-Server offline. Ich nutze lokales Protokoll.");
        }
    }
}

// --- HILFSFUNKTION: DYNAMISCHER KI-GENERATOR ---
async function generateDynamicDrill(drillName) {
    if (!window.aiOnline) {
        window.ToniVoice.speak("Coach, für neue Übungen benötige ich die Online-KI.");
        return;
    }
    window.ToniVoice.speak(`Analysiere Übung ${drillName} und erstelle Animation...`);

    const prompt = `Erstelle NUR ein JSON-Array für "${drillName}". Nutze: {"type":"speak","text":""}, {"type":"place","obj":"cone","x":100,"y":100}, {"type":"deploy","count":2,"positions":[{"x":1,"y":1}]}, {"type":"pass","x1":1,"y1":1,"x2":1,"y2":1}. Keine Erklärungen davor/danach.`;

    try {
        const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
        const response = await fetch(`http://${savedIP}:11434/api/generate`, {
            method: 'POST',
            body: JSON.stringify({ model: 'phi3', prompt: prompt, stream: false })
        });
        const data = await response.json();
        const dynamicScript = JSON.parse(data.response);
        window.arena.playDrill(dynamicScript);
    } catch (e) {
        window.ToniVoice.speak("Fehler beim Generieren der Übung.");
    }
}

// --- 4. NAVIGATION & ROUTER (STABILISIERT) ---
window.openSection = function(name) {
    console.log("🛰️ Router ->", name);
    const nav = document.getElementById('briefcase-nav');
    const contentArea = document.getElementById('briefcase-content');
    const activeDiv = document.getElementById('active-content');
    const backBtn = document.getElementById('back-to-hub');

    if (!contentArea || !activeDiv) return;

    if (window.BriefcaseUI && !window.BriefcaseUI.isOpen) window.BriefcaseUI.toggle();

    if (nav) nav.style.display = 'none';
    contentArea.classList.remove('hidden');
    contentArea.style.display = 'block'; 
    if (backBtn) backBtn.classList.remove('hidden');
    
    activeDiv.innerHTML = `<div style="text-align:center; padding:50px; color:var(--neon-green); font-family:'Orbitron';">LADE ${name.toUpperCase()}...</div>`;

    setTimeout(() => {
        try {
            const targetMap = {
                'kabine': window.SektorSporttasche,
                'matchmappe': window.SektorMatchMappe,
                'training': window.SektorTraining,
                'junioren_pool': window.SektorJunioren,
                'stammplatz': window.SektorTemplates,
                'scouting': window.SektorScouting,
                'management': window.SektorManagement,
                'analyse': window.SektorAnalyse,
                'material': window.SektorMaterial,
                'stadionzeitung': window.SektorTemplates,
                'video': window.SektorVideo,
                'settings': window.SektorSettings || window.SektorSystem,
                'system': window.SektorSettings
            };
            const target = targetMap[name];
            if (target && typeof target.open === 'function') {
                target.open();
                if(name === 'stadionzeitung' && target.switchTab) target.switchTab('magazine');
                if(name === 'stammplatz' && target.switchTab) target.switchTab('stammplatz');
            } else { throw new Error(`Sektor '${name}' nicht bereit.`); }
        } catch (err) {
            activeDiv.innerHTML = `<div style="color:red; text-align:center;">FEHLER: ${err.message}</div>`;
        }
    }, 150);
};

// --- 5. INITIALISIERUNG & STATUS ---
async function checkAIStatus() {
    const light = document.getElementById('ai-status-light');
    const label = document.getElementById('ai-status-label');
    const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
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

window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.init();
    checkAIStatus();
    setInterval(checkAIStatus, 10000);
});
