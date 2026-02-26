/* ==========================================================================
   TONI 2.0 | NCOS MASTER SCRIPT V43.0 - PERSONA & VOICE
   ========================================================================== */

const NCOS = {
    config: { 
        api: localStorage.getItem('TONI_API') || "", 
        ollama: localStorage.getItem('TONI_OLLAMA') || "http://localhost:11434" 
    },
    press: { 
        title: "BEREIT FÜR RECHERCHE", 
        editorial: "Warten auf Redaktionsschluss...", 
        sponsor: "PARTNER GESUCHT"
    }
};

// --- 1. PERSONA SPRACH-ENGINE ---
function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel(); // Stoppt laufende Sprache
    
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 1.1; // Etwas sympathischer/höher
    msg.rate = 0.95;  // Etwas ruhigeres Sprechtempo
    
    // Wir versuchen eine männliche, professionelle Stimme zu finden
    const voices = window.speechSynthesis.getVoices();
    const proVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('de')) || voices[0];
    if(proVoice) msg.voice = proVoice;

    window.speechSynthesis.speak(msg);
}

// --- 2. NEURAL INTERFACE (OLLAMA) ---
async function askOllama(prompt) {
    try {
        const res = await fetch(`${NCOS.config.ollama}/api/generate`, {
            method: 'POST',
            body: JSON.stringify({ 
                model: 'llama3', 
                prompt: `Du bist Toni, ein sympathischer Mitarbeiter der Presseabteilung eines Profi-Fussballclubs. Dein Chef ist der Coach. Antworte kurz, motiviert und professionell auf Deutsch. Aufgabe: ${prompt}`, 
                stream: false 
            })
        });
        const data = await res.json();
        return data.response;
    } catch (e) { 
        return "Coach, ich habe gerade ein technisches Problem mit dem Neural Core. Können wir ohne KI weitermachen?"; 
    }
}

// --- 3. INTERVIEW START (MIT PERSONA-EINFÜHRUNG) ---
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    
    const intro = "Guten Tag, Coach. Hier ist Toni aus der Presseabteilung. Ich bin bereit für unser Briefing für das neue Matchday-Magazin. Welchen Verein nehmen wir heute für das Dossier ins Visier?";
    
    addMsg("TONI", intro);
    speak(intro); // Erste Sprachausgabe wird durch Klick ausgelöst
}

async function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if(step === 1) {
        NCOS.press.title = "MATCHDAY: " + val.toUpperCase();
        addMsg("TONI", `<i>Toni recherchiert für ${val}...</i>`);
        
        // KI generiert eine sympathische Antwort
        const aiResponse = await askOllama(`Der Coach möchte ein Magazin für den Verein ${val} erstellen. Bestätige das und frage sympathisch nach der aktuellen Stimmung im Team.`);
        
        addMsg("TONI", aiResponse);
        speak(aiResponse);
        step = 2;
    } else if(step === 2) {
        NCOS.press.editorial = `Exklusivbericht: "${val}".`;
        const aiResponse = await askOllama(`Der Coach sagt, die Stimmung ist: ${val}. Kommentiere das kurz und frage dann nach dem Hauptsponsor.`);
        
        addMsg("TONI", aiResponse);
        speak(aiResponse);
        step = 3;
    } else if(step === 3) {
        NCOS.press.sponsor = val.toUpperCase();
        const final = "Hervorragend, Coach. Ich habe alle Daten. Die Druckmaschine im Bureau läuft bereits. Das Heft ist fertig zur Ansicht!";
        addMsg("TONI", final);
        speak(final);
    }
    loadModule('press');
}

// --- 4. SYSTEM-LOGIK (BLEIBT STABIL) ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;
    if(name === 'press') {
        stage.innerHTML = `
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size:24px; margin-bottom:20px;">TONI 2.0</div>
                        <h1 class="mag-headline" id="mag-title" style="font-size:32px;">${NCOS.press.title}</h1>
                        <p style="color:#888; font-size:10px;">MATCHDAY // 2026</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">REPORTER'S DESK</h2>
                        <div class="mag-article" id="mag-editorial" style="white-space: pre-wrap;">${NCOS.press.editorial}</div>
                    </div>
                </div>
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">PARTNER</h2>
                        <div style="border:2px solid gold; padding:20px; text-align:center; margin-top:20px;">
                            <div class="luxury-logo" id="mag-sponsor" style="font-size:24px;">${NCOS.press.sponsor}</div>
                        </div>
                    </div>
                </div>
            </div>`;
    } else {
        stage.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">${name.toUpperCase()}</h2><p>Online.</p></div>`;
    }
}

function saveAndBoot() {
    const api = document.getElementById('api-key').value;
    const ollama = document.getElementById('ollama-url').value;
    const pass = document.getElementById('passcode').value;
    localStorage.setItem('TONI_API', api);
    localStorage.setItem('TONI_OLLAMA', ollama);
    if(pass === "2026") { window.location.href = "dashboard.html"; } 
    else { alert("Passcode 2026 erforderlich."); }
}

async function checkHealth() {
    const lampO = document.getElementById('lamp-ollama');
    if(!lampO) return;
    try {
        const res = await fetch(`${NCOS.config.ollama}/api/tags`);
        lampO.className = res.ok ? "lamp online" : "lamp offline";
    } catch (e) { lampO.className = "lamp offline"; }
}

function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) { log.innerHTML += `<div class="ai-bubble ${s==='TONI'?'toni':''}"><b>${s}:</b><br>${t}</div>`; log.scrollTop = log.scrollHeight; }
}

window.onload = () => {
    if(window.location.pathname.includes('dashboard.html')) {
        loadModule('press');
        checkHealth();
        setInterval(checkHealth, 5000);
        setInterval(() => { 
            const clock = document.getElementById('clock-display');
            if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE');
        }, 1000);
    }
};
