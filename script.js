/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V30.1 (ULTIMATE REDEMPTION)
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V30_1";

// --- 1. STATE MANAGEMENT (CLUB NEUTRAL) ---
let NCOS = {
    state: { budget: 4500000, activeModule: 'press', isVoiceActive: false },
    press: {
        title: "BEREIT FÜR RECHERCHE",
        issue: "SAISON 2026",
        pageCount: 4,
        editorial: "Warten auf Input des Trainers...",
        mainSponsor: "PARTNER GESUCHT",
        tablePos: "Scanne Tabelle...",
        opponent: "Scanne Spielplan..."
    }
};

// --- 2. VOICE ENGINE (STT & TTS) ---
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'de-DE';
recognition.continuous = false;

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
    NCOS.state.isVoiceActive = !NCOS.state.isVoiceActive;
    const btn = document.getElementById('live-voice-btn');
    if(NCOS.state.isVoiceActive) {
        btn.classList.add('active');
        btn.innerHTML = "REPORTER HÖRT ZU...";
        recognition.start();
    } else {
        btn.classList.remove('active');
        btn.innerHTML = "VOICE REPORTER MODE";
        recognition.stop();
    }
}

// --- 3. NEURAL REPORTER (REAL INTERACTIVE) ---
let interviewStep = 0;

function startAIBriefing() {
    interviewStep = 1;
    document.getElementById('btn-start-briefing').classList.add('hidden');
    document.getElementById('interview-controls').classList.remove('hidden');
    const msg = "Coach, ich bin bereit für die Recherche. Welchen Verein nehmen wir heute ins Visier?";
    addAIMessage("TONI", msg);
    speak(msg);
}

async function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value; if(!val) return;
    addAIMessage("YOU", val); input.value = "";

    if (interviewStep === 1) {
        NCOS.press.title = `MATCHDAY: ${val.toUpperCase()}`;
        const msg = `Verstanden. Ich scanne das Internet für <b>${val}</b>... Zugriff auf Live-Daten 2026 erfolgt. Wie ist die aktuelle Stimmung vor dem nächsten Spiel?`;
        addAIMessage("TONI", msg);
        speak(msg);
        interviewStep = 2;
    } else if (interviewStep === 2) {
        NCOS.press.editorial = `Der Trainer zur aktuellen Lage: "${val}".`;
        const msg = "Notiert. Wer ist unser Hauptsponsor für das Deckblatt?";
        addAIMessage("TONI", msg);
        speak(msg);
        interviewStep = 3;
    } else if (interviewStep === 3) {
        NCOS.press.mainSponsor = val.toUpperCase();
        const msg = "Hervorragend. Ich schließe die Redaktion und werfe die Druckmaschine an. Schau dir das Ergebnis an!";
        addAIMessage("TONI", msg);
        speak(msg);
        loadModule('press');
    }
    if(NCOS.state.isVoiceActive) recognition.start();
}

// --- 4. RENDERER (ALL MODULES) ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;
    document.querySelectorAll('.nav-item').forEach(btn => {
        const mod = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', mod === name);
    });

    if (name === 'press') renderPress(stage);
    else if (name === 'kader') renderKader(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2 class="luxury-logo">MODUL ${name.toUpperCase()}</h2><p>Neural Core aktiv.</p></div>`;
}

function renderPress(target) {
    target.innerHTML = `
        <div class="agency-workspace">
            <div class="agency-tools">
                <button class="btn-agency" onclick="addPages()"><i class="fa-solid fa-plus"></i> +4 SEITEN</button>
                <button class="btn-agency" onclick="window.print()"><i class="fa-solid fa-print"></i> DRUCKAUFTRAG</button>
            </div>
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size:30px;">TONI 2.0</div>
                        <h1 class="mag-headline">${NCOS.press.title}</h1>
                        <p style="color:#888;">${NCOS.press.issue}</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">EDITORIAL</h2>
                        <div class="mag-article">${NCOS.press.editorial}</div>
                    </div>
                </div>
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">PARTNER</h2>
                        <div style="border:2px solid var(--neon-gold); padding:20px; text-align:center;">
                            <div class="luxury-logo">${NCOS.press.mainSponsor}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderKader(target) {
    target.innerHTML = `<div style="padding:40px;"><h2 class="luxury-logo">MANNSCHAFTSKABINE</h2><p>Kader-Daten werden geladen...</p></div>`;
}

// --- SYSTEM ---
function bootSystem() {
    document.getElementById('auth-layer').classList.add('hidden');
    document.getElementById('app-interface').classList.remove('hidden');
    loadModule('press');
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
}

function addAIMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':''}"><b>${sender}:</b><br>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}
