/* ==========================================================================
   TONI 2.0 | NCOS V31.2 - REDEMPTION & DATA BINDING
   ========================================================================== */

let NCOS = {
    state: { activeModule: 'press', isVoice: false },
    press: {
        title: "BEREIT FÜR RECHERCHE",
        issue: "SAISON 2026",
        pageCount: 4,
        editorial: "Warten auf Redaktionsschluss...",
        mainSponsor: "PARTNER GESUCHT"
    }
};

// VOICE ENGINE
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'de-DE';

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    window.speechSynthesis.speak(msg);
}

recognition.onresult = (event) => {
    document.getElementById('ai-chat-input').value = event.results[0][0].transcript;
    processInterviewStep();
};

function toggleVoiceAI() {
    NCOS.state.isVoice = !NCOS.state.isVoice;
    const btn = document.getElementById('live-voice-btn');
    if(NCOS.state.isVoice) {
        btn.classList.add('active'); btn.innerText = "REPORTER HÖRT...";
        recognition.start();
    } else {
        btn.classList.remove('active'); btn.innerText = "VOICE REPORTER MODE";
        recognition.stop();
    }
}

// REPORTER LOGIC (ECHTER INTERNET-SCAN SIMULATION)
let interviewStep = 0;

function startAIBriefing() {
    interviewStep = 1;
    document.getElementById('btn-start-briefing').classList.add('hidden');
    document.getElementById('interview-controls').classList.remove('hidden');
    addMessage("TONI", "Coach, ich bin im Netz. Welchen Verein nehmen wir heute für das Dossier?");
    speak("Coach, ich bin im Netz. Welchen Verein nehmen wir heute für das Dossier?");
}

async function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value; if(!val) return;
    addMessage("USER", val); input.value = "";

    if (interviewStep === 1) {
        NCOS.press.title = `MATCHDAY: ${val.toUpperCase()}`;
        const reply = `Daten für <b>${val}</b> geladen. Aktuelle Tabelle und News sind im System. Wie ist die personelle Lage vor dem nächsten Spiel?`;
        addMessage("TONI", reply);
        speak(reply);
        interviewStep = 2;
    } else if (interviewStep === 2) {
        NCOS.press.editorial = `Exklusivbericht: Der Trainer zur personellen Lage: "${val}".`;
        const reply = "Verstanden. Wer ist unser Hauptsponsor für die Rückseite?";
        addMessage("TONI", reply);
        speak(reply);
        interviewStep = 3;
    } else if (interviewStep === 3) {
        NCOS.press.mainSponsor = val.toUpperCase();
        addMessage("TONI", "Das Heft ist fertig. Ich werfe die Druckmaschine an!");
        speak("Das Heft ist fertig. Ich werfe die Druckmaschine an!");
        loadModule('press');
    }
    if(NCOS.state.isVoice) recognition.start();
}

// MODULES ROUTER
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;

    document.querySelectorAll('.nav-item').forEach(btn => {
        const mod = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', mod === name);
    });

    if (name === 'press') renderPress(stage);
    else if (name === 'kader') renderKader(stage);
    else if (name === 'nlz') renderNLZ(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>Modul: ${name.toUpperCase()}</h2><p>Neural OS System stabil.</p></div>`;
}

function renderPress(target) {
    target.innerHTML = `
        <div class="agency-workspace" style="display:flex; height:100%;">
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div style="font-family:var(--font-ui); font-weight:900; background:linear-gradient(to right, #bf953f, #fcf6ba); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:30px; margin-bottom:20px;">TONI 2.0</div>
                        <h1 class="mag-headline">${NCOS.press.title}</h1>
                        <p style="color:#888; font-family:var(--font-ui);">${NCOS.press.issue}</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">REPORTER'S DESK</h2>
                        <div class="mag-article">${NCOS.press.editorial}</div>
                    </div>
                </div>
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">PARTNER</h2>
                        <div style="border:2px solid var(--neon-gold); padding:20px; text-align:center;">
                            <div style="font-family:var(--font-ui); font-weight:900; background:linear-gradient(to right, #bf953f, #fcf6ba); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:24px;">${NCOS.press.mainSponsor}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderKader(target) { target.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">MANNSCHAFTSKABINE</h2><p>Datenzugriff über Neural Core erfolgt...</p></div>`; }
function renderNLZ(target) { target.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">ACADEMY HUB (NLZ)</h2><p>FIFA-Sticker Karten werden geladen...</p></div>`; }

function addMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':''}"><b>${sender}:</b><br>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}

window.onload = () => {
    loadModule('press');
    setInterval(() => { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE'); }, 1000);
};// REAL INTERNET SEARCH (Simuliert via API/Ollama)
async function fetchRealFootballData(club) {
    // Hier binden wir später die Ollama-API oder Football-Data.org ein
    return { pos: "oben dabei", next: "einem harten Gegner" };
}

async function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value; if(!val) return;
    addMessage("USER", val); input.value = "";

    // KI-Reporter Logik
    const data = await fetchRealFootballData(val);
    NCOS.press.title = `FOKUS: ${val.toUpperCase()}`;
    const reply = `Ich habe das Netz nach ${val} durchsucht. Ihr seid ${data.pos}. Wie bereiten wir uns auf den nächsten Gegner vor?`;
    
    addMessage("TONI", reply);
    speak(reply);
    loadModule('press');
}

// NAVIGATION
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(name === 'press') renderPress(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>Modul: ${name.toUpperCase()}</h2><p>Vollständig geladen.</p></div>`;
}

function renderPress(target) {
    target.innerHTML = `
        <div class="agency-workspace" style="display:flex; height:100%;">
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo">TONI 2.0</div>
                        <h1 class="mag-headline">${NCOS.press.title}</h1>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">EDITORIAL</h2>
                        <div class="mag-article">${NCOS.press.editorial}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':''}"><b>${sender}:</b><br>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}

window.onload = () => loadModule('press');
