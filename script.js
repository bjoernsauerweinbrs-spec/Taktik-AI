/* ==========================================================================
   TONI 2.0 | NCOS MASTER SCRIPT V37.0
   AUTHENTISCH - ADAPTIV - PROFESSIONELL
   ========================================================================== */

// --- 1. GLOBALE DATENSTRUKTUR (STATE) ---
let NCOS = {
    state: { activeModule: 'press', isVoice: false, budget: 4500000 },
    config: {
        api: localStorage.getItem('TONI_API') || "",
        ollama: localStorage.getItem('TONI_OLLAMA') || "http://localhost:11434"
    },
    press: {
        title: "BEREIT FÜR RECHERCHE",
        issue: "FEBRUAR 2026",
        editorial: "Warten auf Redaktionsschluss...",
        sponsor: "PARTNER GESUCHT"
    }
};

// --- 2. SETUP & AUTHENTIFIZIERUNG ---
function saveAndBoot() {
    const api = document.getElementById('api-key').value;
    const ollama = document.getElementById('ollama-url').value;
    const pass = document.getElementById('passcode').value;

    localStorage.setItem('TONI_API', api);
    localStorage.setItem('TONI_OLLAMA', ollama);

    if(pass === "2026") {
        window.location.href = "dashboard.html";
    } else {
        alert("ZUGRIFF VERWEIGERT: Ungültiger Passcode.");
    }
}

// --- 3. NEURAL CORE (OLLAMA API) ---
async function askOllama(prompt) {
    const url = `${NCOS.config.ollama}/api/generate`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3', 
                prompt: `Du bist ein erfahrener Sportreporter. Antworte professionell und prägnant auf Deutsch. Thema: ${prompt}`,
                stream: false
            })
        });
        if (!response.ok) throw new Error("Ollama Offline");
        const data = await response.json();
        return data.response;
    } catch (e) {
        console.error("Neural Link Error:", e);
        return "System-Hinweis: Lokale KI (Ollama) antwortet nicht. Bitte prüfen Sie die Verbindung.";
    }
}

// --- 4. NAVIGATION & MODUL-ROUTER ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;
    
    NCOS.state.activeModule = name;

    // Sidebar-Aktivierung visuell
    document.querySelectorAll('.nav-item').forEach(btn => {
        const mod = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', mod === name);
    });

    // Modul-Inhalte rendern
    switch(name) {
        case 'press': renderPress(stage); break;
        case 'kader': renderPlaceholder(stage, "KABINE", "Live-Kader-Synchronisation aktiv."); break;
        case 'tactics': renderPlaceholder(stage, "TACTICS", "Taktikboard für 2026 bereit."); break;
        case 'office': renderPlaceholder(stage, "OFFICE", "ERP & Finanzverwaltung online."); break;
        case 'nlz': renderPlaceholder(stage, "NLZ", "Nachwuchs-Monitoring gestartet."); break;
        case 'video': renderPlaceholder(stage, "VIDEO", "Broadcast & Video-Analysen."); break;
    }
}

function renderPlaceholder(target, title, desc) {
    target.innerHTML = `<div style="padding:50px;"><h2 class="mag-headline" style="color:#fff; border-bottom-color:#222;">${title}</h2><p style="color:#666; font-family:'Orbitron'; font-size:12px;">${desc}</p></div>`;
}

// --- 5. PRESS BUREAU (REPRODUCTION) ---
function renderPress(target) {
    target.innerHTML = `
        <div class="magazine-viewport">
            <div class="magazine-page">
                <div class="page-half">
                    <div class="luxury-logo" style="font-size:24px; margin-bottom:20px;">TONI 2.0</div>
                    <h1 class="mag-headline" id="mag-title">${NCOS.press.title}</h1>
                    <p style="color:#888; font-family:'Orbitron'; font-size:10px;">MATCHDAY EDITION // 2026</p>
                </div>
                <div class="page-half">
                    <h2 class="mag-headline" style="font-size:24px;">REPORTER'S DESK</h2>
                    <div class="mag-article" id="mag-editorial">${NCOS.press.editorial}</div>
                </div>
            </div>
            <div class="magazine-page">
                <div class="page-half">
                    <h2 class="mag-headline" style="font-size:24px;">PARTNER</h2>
                    <div id="mag-sponsor" style="border:2px solid gold; padding:20px; text-align:center; margin-top:20px;">
                        <div class="luxury-logo" style="font-size:24px;">${NCOS.press.sponsor}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    adjustHeadline();
}

function adjustHeadline() {
    const el = document.getElementById('mag-title');
    if (el && el.innerText.length > 15) el.style.fontSize = "36px";
    if (el && el.innerText.length > 25) el.style.fontSize = "26px";
}

// --- 6. AI INTERVIEW ENGINE ---
let interviewStep = 0;

function startInterview() {
    interviewStep = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    const msg = "Coach, ich bin online. Welchen Verein nehmen wir heute für das Dossier?";
    addMsg("TONI", msg); speak(msg);
}

async function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if (interviewStep === 1) {
        NCOS.press.title = "MATCHDAY: " + val.toUpperCase();
        addMsg("TONI", "<i>Neural Core analysiert Daten...</i>");
        
        const aiResponse = await askOllama(`Der User möchte ein Magazin für ${val}. Begrüße ihn als Reporter und frage nach der Stimmung.`);
        addMsg("TONI", aiResponse); speak(aiResponse);
        interviewStep = 2;
    } else if (interviewStep === 2) {
        NCOS.press.editorial = `Exklusivbericht: "${val}".`;
        const msg = "Verstanden. Welchen Sponsor bringen wir auf die Rückseite?";
        addMsg("TONI", msg); speak(msg);
        interviewStep = 3;
    } else if (interviewStep === 3) {
        NCOS.press.sponsor = val.toUpperCase();
        const msg = "Das Heft ist fertig. Die Druckmaschine läuft!";
        addMsg("TONI", msg); speak(msg);
    }
    loadModule('press'); // Live-Update der Zeitung
}

// --- 7. VOICE & HELPERS ---
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'de-DE';

function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    window.speechSynthesis.speak(msg);
}

function toggleVoiceAI() {
    NCOS.state.isVoice = !NCOS.state.isVoice;
    const btn = document.getElementById('voice-btn');
    if(NCOS.state.isVoice) { btn.classList.add('active'); btn.innerText="HÖRT ZU..."; recognition.start(); }
    else { btn.classList.remove('active'); btn.innerText="VOICE MODE"; recognition.stop(); }
}

recognition.onresult = (e) => {
    document.getElementById('ai-input').value = e.results[0][0].transcript;
    processInterview();
};

function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) {
        log.innerHTML += `<div class="ai-bubble"><b>${s}:</b><br>${t}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}

// --- 8. INITIALISIERUNG ---
window.onload = () => {
    if(window.location.pathname.includes('dashboard.html')) {
        loadModule('press');
        setInterval(() => {
            const clock = document.getElementById('clock-display');
            if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE');
        }, 1000);
    }
};                <div class="luxury-logo" style="font-size:24px; margin-bottom:20px;">TONI 2.0</div>
                <h1 class="mag-headline" id="mag-title">${NCOS.press.title}</h1>
                <p style="color:#888; font-family:'Orbitron'; font-size:10px;">NR. 01 / FEBRUAR 2026</p>
            </div>
            <div class="page-half">
                <h2 class="mag-headline" style="font-size:24px;">REPORTER'S DESK</h2>
                <div class="mag-article" id="mag-editorial">${NCOS.press.editorial}</div>
            </div>
        </div>
        <div class="magazine-page">
            <div class="page-half">
                <h2 class="mag-headline" style="font-size:24px;">PARTNER</h2>
                <div id="mag-sponsor" style="border:2px solid gold; padding:30px; text-align:center; margin-top:20px;">
                    <div class="luxury-logo" style="font-size:24px;">${NCOS.press.sponsor}</div>
                </div>
            </div>
        </div>
    `;
    adjustHeadline();
}

function adjustHeadline() {
    const el = document.getElementById('mag-title');
    if (el && el.innerText.length > 15) el.style.fontSize = "38px";
    if (el && el.innerText.length > 25) el.style.fontSize = "28px";
}

// 4. INTERVIEW LOGIC
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    addMsg("TONI", "Coach, ich bin im Netz. Welchen Verein nehmen wir heute ins Visier?");
}

function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if(step === 1) {
        NCOS.press.title = "MATCHDAY: " + val.toUpperCase();
        addMsg("TONI", `Daten für ${val} geladen. Wie ist die Stimmung in der Kabine?`);
        step = 2;
    } else if(step === 2) {
        NCOS.press.editorial = `Exklusiv-Bericht: Der Trainer zur Lage der Mannschaft: "${val}".`;
        addMsg("TONI", "Verstanden. Wer ist unser Hauptsponsor für die Rückseite?");
        step = 3;
    } else if(step === 3) {
        NCOS.press.sponsor = val.toUpperCase();
        addMsg("TONI", "Das Heft ist fertig. Die Druckmaschine läuft!");
    }
    loadModule('press'); // Sofortiger Refresh der Zeitung
}

function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) {
        log.innerHTML += `<div class="ai-bubble"><b>${s}:</b><br>${t}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}

// 5. GLOBAL INITIALIZATION
if(window.location.pathname.includes('dashboard.html')) {
    window.onload = () => {
        loadModule('press');
        setInterval(() => { 
            const clock = document.getElementById('clock-display');
            if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE'); 
        }, 1000);
    };
}
