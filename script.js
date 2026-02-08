/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT
 * Zentrale: Voice-Engine, Klopp-Nagelsmann Personality & Elite-Analyse.
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
        // Voice-Output stoppen, falls er noch redet
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = this.synth.getVoices();
        
        // Suche nach einer kraftvollen männlichen Stimme (z.B. Yannick oder Google Deutsch)
        utterance.voice = voices.find(v => v.name.includes("Yannick") || v.name.includes("Google Deutsch")) || voices[0];
        utterance.pitch = 0.9; // Etwas tiefer = kraftvoller
        utterance.rate = 1.0;  // Normales Tempo
        
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
    toniMsg.innerHTML = `<strong>Toni:</strong> <span class="thinking">Analysiere Taktik...</span>`;
    chatBox.appendChild(toniMsg);
    
    chatBox.scrollTop = chatBox.scrollHeight;
    inputField.value = "";

    let finalResponse = "Ich habe den Befehl registriert.";

    if (isSuperAI) {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Du bist TONI 2.0, ein Elite-Fußball-Analyst. 
                             DEINE PERSÖNLICHKEIT: Eine Mischung aus der taktischen Genialität von Julian Nagelsmann und der motivierenden Leidenschaft von Jürgen Klopp. 
                             DEIN STIL: Fachlich knallhart, international orientiert, präzise, aber mit Charisma. 
                             FORMALE VORGABE: Wenn nach Übungen gefragt wird: 1. Kurzanalyse, 2. Übung, 3. Ablauf, 4. Coaching Points.
                             
                             Coach sagt: ${command}`,
                    stream: false
                })
            });
            const data = await response.json();
            finalResponse = data.response;
        } catch (err) {
            finalResponse = "Coach, Verbindung zum Phi-3 Modell unterbrochen. Bitte Terminal prüfen.";
        }
    } else {
        finalResponse = "Basis-System aktiv. Für Profi-Analysen starte bitte Ollama.";
    }

    // Antwort anzeigen & SPRECHEN
    toniMsg.innerHTML = `<strong>Toni:</strong> ${finalResponse}`;
    window.ToniVoice.speak(finalResponse);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 4. SYSTEM STATUS ---
window.aiOnline = false;
async function checkAIStatus() {
    const light = document.getElementById('ai-status-light');
    const label = document.getElementById('ai-status-label');
    if (!light || !label) return;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const response = await fetch('http://localhost:11434/api/tags', { signal: controller.signal });
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
