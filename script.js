/**
 * TONI 2.0 - MASTER BRIDGE SCRIPT
 * Version: 3.1 (Stability & Routing Recovery)
 */

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
        document.getElementById('mic-trigger').classList.add('mic-active');
        this.recognition.start();
    },
    stopListening() {
        this.isListening = false;
        document.getElementById('mic-trigger')?.classList.remove('mic-active');
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

// --- 2. NAVIGATION & ROUTER (FIX FÜR TOTE BUTTONS) ---
function openSection(name) {
    console.log("Routing aktiv -> Sektor:", name);
    
    // 1. Briefcase öffnen, falls zu
    if (!window.BriefcaseUI.isOpen) {
        window.BriefcaseUI.toggle();
    }

    // 2. Sektor-Inhalt laden (Verbindung zu den Sektor-Dateien)
    setTimeout(() => {
        try {
            switch(name) {
                case 'kabine': window.SektorSporttasche.open(); break;
                case 'analyse': window.SektorAnalyse.open(); break;
                case 'management': window.SektorManagement.open(); break;
                case 'stadion': window.SektorStadion.open(); break;
                case 'training': window.SektorTraining.open(); break;
                case 'material': window.SektorMaterial.open(); break;
                case 'video': window.SektorVideo.open(); break;
                case 'matchday': window.SektorMatchday.open(); break;
                case 'taktik': window.SektorTaktik.open(); break;
                case 'settings': window.SektorSettings.open(); break;
                default: console.warn("Sektor unbekannt:", name);
            }
        } catch (err) {
            console.error("Sektor-Ladefehler:", err);
            alert("Sektor " + name + " konnte nicht gestartet werden. Prüfe die Datei!");
        }
    }, 50);
}

// --- 3. TONI CORE LOGIK (CHAT & ONBOARDING) ---
async function handleCommand(command) {
    if (!command || !command.trim()) return;
    const chatBox = document.getElementById('chat-box');
    const inputField = document.getElementById('command-input');
    
    // User Nachricht anzeigen
    const userMsg = document.createElement('p');
    userMsg.innerHTML = `<span style="color:var(--accent-gold)">Coach:</span> ${command}`;
    chatBox.appendChild(userMsg);
    inputField.value = ""; // Feld leeren

    const toniMsg = document.createElement('p');
    toniMsg.style.color = "var(--neon-green)";
    chatBox.appendChild(toniMsg);

    // --- ONBOARDING FLOW ---
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
        let resp = `Alles klar, ${window.coachInfo.verein} also. Aktiviere mich jetzt im Setup, damit ich online gehen kann!`;
        toniMsg.innerHTML = `<strong>Toni:</strong> ${resp}`;
        window.ToniVoice.speak(resp);
        setTimeout(() => openSection('settings'), 2500);
        return;
    }

    // --- KI ABFRAGE (WENN ONLINE) ---
    if (window.aiOnline) {
        toniMsg.innerHTML = `<strong>Toni:</strong> <span class="thinking">Analysiere...</span>`;
        try {
            const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
            const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                method: 'POST',
                body: JSON.stringify({
                    model: 'phi3', 
                    prompt: `Kurz-Antwort (max 2 Sätze) als Fußball-Analyst. Coach: ${window.coachInfo.name}. Befehl: ${command}`,
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
        toniMsg.innerHTML = `<strong>Toni:</strong> Ich bin offline. Geh ins Setup, um mich zu aktivieren!`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 4. STATUS-CHECK (OLLAMA) ---
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

// --- 5. INITIALISIERUNG ---
window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.init();
    checkAIStatus();
    setInterval(checkAIStatus, 5000);

    // Arena Start: Spielfeld erzwingen
    setTimeout(() => {
        if (window.arena) {
            window.arena.init('main-canvas');
            window.arena.resize();
        }
    }, 300);

    // Erstbegrüßung & Bestätigen-Button
    if (!window.coachInfo.name) {
        const chatBox = document.getElementById('chat-box');
        const toniMsg = document.createElement('p');
        toniMsg.style.color = "var(--neon-green)";
        toniMsg.innerHTML = `<strong>Toni:</strong> Willkommen! Ich bin Toni 2.0. Wie ist dein Name?<br>
            <button class="onboarding-confirm-btn" onclick="handleCommand(document.getElementById('command-input').value)">BESTÄTIGEN</button>`;
        chatBox.appendChild(toniMsg);
        window.ToniVoice.speak("Willkommen! Ich bin Toni 2.0. Wie ist dein Name?");
    }

    // Enter-Taste
    document.getElementById('command-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCommand(e.target.value);
    });

    if (window.Database) window.Database.init();
});
