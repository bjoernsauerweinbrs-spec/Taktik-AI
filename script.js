/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V29.0 (TRUE VOICE & DYNAMIC STATE)
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V29";
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'de-DE';
recognition.interimResults = false;

let NCOS = {
    state: { budget: 4500000, activeModule: 'press' },
    press: {
        title: "MATCHDAY: SC BORUSSIA DORTMUND", 
        issue: "NR. 01 / FEBRUAR 2026",
        pageCount: 4,
        mainSponsor: "COCA COLA",
        editorial: "Warten auf Redaktionsschluss...",
        spotlight: "Analyse wird generiert...",
        nextOpponent: "FC Bayern München",
        tablePos: "2. Platz"
    }
};

let isVoiceActive = false;
let interviewStep = 0;

// --- 1. SPRACHAUSGABE (TTS) ---
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 1;
    msg.rate = 1;
    window.speechSynthesis.speak(msg);
}

// --- 2. SPRACHEINGABE (STT) ---
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('ai-chat-input').value = transcript;
    processInterviewStep();
};

function toggleVoiceAI() {
    isVoiceActive = !isVoiceActive;
    const btn = document.getElementById('live-voice-btn');
    if (isVoiceActive) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-ear-listen"></i> REPORTER HÖRT ZU...';
        recognition.start();
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa-solid fa-microphone"></i> VOICE REPORTER MODE';
        recognition.stop();
    }
}

// --- 3. DYNAMISCHES INTERVIEW (REPORTER PERSONA) ---
function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value; if(!val) return;
    addAIMessage("USER", val); input.value = "";

    setTimeout(() => {
        if (interviewStep === 0) {
            NCOS.press.title = `MATCHDAY: ${val.toUpperCase()}`;
            const reply = `Verstanden. Ich recherchiere die Daten für ${val} im Jahr 2026... Zugriff auf Fussball.de bestätigt. Ihr seid aktuell auf dem ${NCOS.press.tablePos}. Wie bewerten Sie die Moral der Truppe vor dem Topspiel?`;
            addAIMessage("TONI", reply);
            speak(reply);
            interviewStep = 1;
        } 
        else if (interviewStep === 1) {
            NCOS.press.editorial = `Exklusiv-Interview aus dem Newsroom: Der Trainer zeigt sich zuversichtlich. Zur Moral der Mannschaft sagt er: "${val}". Das wird ein heißer Tanz!`;
            const reply = "Das klingt nach Kampfgeist! Wer ist heute unser Hauptsponsor, den wir auf die Rückseite bringen?";
            addAIMessage("TONI", reply);
            speak(reply);
            interviewStep = 2;
        }
        else if (interviewStep === 2) {
            NCOS.press.mainSponsor = val.toUpperCase();
            const reply = `Eingetragen. ${val} wird prominent platziert. Das Heft ist nun im Satz. Werfen Sie einen Blick auf die Druckvorschau!`;
            addAIMessage("TONI", reply);
            speak(reply);
            finalizeMagazine();
        }
        if(isVoiceActive) recognition.start(); // Hört nach Antwort wieder zu
    }, 1000);
}

function finalizeMagazine() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(NCOS));
    loadModule('press');
}

// --- 4. RENDERER (FIXED STATE BINDING) ---
function renderPressAgency(target) {
    target.innerHTML = `
        <div class="agency-workspace">
            <div class="agency-tools">
                <button class="btn-agency" onclick="addPages()"><i class="fa-solid fa-plus"></i> +4 SEITEN</button>
                <button class="btn-agency" onclick="window.print()"><i class="fa-solid fa-print"></i> DRUCKAUFTRAG</button>
            </div>
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size: 30px;">TONI 2.0</div>
                        <h1 class="mag-headline">${NCOS.press.title}</h1>
                        <p style="font-family:var(--font-ui); color:#888;">${NCOS.press.issue}</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">REPORTER'S DESK</h2>
                        <div class="mag-article">${NCOS.press.editorial}</div>
                    </div>
                </div>
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">SPOTLIGHT</h2>
                        <div class="mag-article">${NCOS.press.spotlight}</div>
                    </div>
                    <div class="page-half" style="background:#fff;">
                        <h2 class="mag-headline" style="font-size:24px; border-bottom:1px solid #000;">OUR PARTNERS</h2>
                        <div style="text-align:center; padding:15px; border:2px solid var(--neon-gold); margin-bottom:15px;">
                            <div class="luxury-logo" style="font-size:18px;">${NCOS.press.mainSponsor}</div>
                            <div style="font-size:7px; color:#000;">PREMIUM PARTNER 2026</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// SYSTEM FUNCTIONS
function bootSystem() {
    document.getElementById('auth-layer').classList.add('hidden');
    document.getElementById('app-interface').classList.remove('hidden');
    loadModule('press');
}
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if (name === 'press') renderPressAgency(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>MODUL ${name.toUpperCase()}</h2></div>`;
}
function addAIMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':''}"><small>${sender}</small><br>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}
function addPages() { NCOS.press.pageCount += 4; loadModule('press'); }
