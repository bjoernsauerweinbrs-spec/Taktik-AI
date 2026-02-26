/* ==========================================================================
   TONI 2.0 | NCOS LOGIC V33.5 (MODULAR & INTELLIGENT)
   ========================================================================== */

let NCOS = {
    state: { budget: 4500000, activeModule: 'press', isVoice: false },
    press: {
        title: "OFFICIAL CLUB NEWS",
        issue: "FEBRUAR 2026",
        editorial: "Redaktionsschluss steht bevor. Warten auf Interview-Daten...",
        mainSponsor: "PARTNER GESUCHT",
        tablePos: "Scanne Tabelle...",
        nextOpp: "Analysiere Spielplan..."
    }
};

// VOICE
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'de-DE';

function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel();
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
    if(NCOS.state.isVoice) { btn.classList.add('active'); btn.innerHTML = "REPORTER HÖRT ZU..."; recognition.start(); }
    else { btn.classList.remove('active'); btn.innerHTML = "VOICE REPORTER MODE"; recognition.stop(); }
}

// REPORTER LOGIC
let interviewStep = 0;
let interviewData = { club: "", mood: "", news: "", sponsor: "" };

function startAIBriefing() {
    interviewStep = 1;
    document.getElementById('btn-start-briefing').classList.add('hidden');
    document.getElementById('interview-controls').classList.remove('hidden');
    const msg = "Coach, ich bin im Netz. Welcher Verein steht heute im Fokus unserer Recherche?";
    addAIMessage("TONI", msg); speak(msg);
}

async function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value.trim(); if(!val) return;
    addAIMessage("YOU", val); input.value = "";

    switch(interviewStep) {
        case 1:
            interviewData.club = val;
            NCOS.press.title = `MATCHDAY: ${val.toUpperCase()}`;
            const msg1 = `Daten für ${val} geladen. Tabellenplatz 2026: Gesichert. Wie schätzen Sie die Moral vor dem nächsten Spiel ein?`;
            addAIMessage("TONI", msg1); speak(msg1);
            interviewStep = 2; break;
        case 2:
            interviewData.mood = val;
            const msg2 = "Spannend. Gibt es personelle Neuigkeiten oder Verletzungen, die wir vermelden müssen?";
            addAIMessage("TONI", msg2); speak(msg2);
            interviewStep = 3; break;
        case 3:
            interviewData.news = val;
            const msg3 = "Notiert. Wer ist unser Hauptsponsor für die Rückseite des Hefts?";
            addAIMessage("TONI", msg3); speak(msg3);
            interviewStep = 4; break;
        case 4:
            interviewData.sponsor = val;
            NCOS.press.mainSponsor = val.toUpperCase();
            const msg4 = "Das Interview ist beendet. Ich schreibe die Artikel und bereite den Druck vor!";
            addAIMessage("TONI", msg4); speak(msg4);
            finalizeMagazine(); break;
    }
    if(NCOS.state.isVoice) recognition.start();
}

function finalizeMagazine() {
    NCOS.press.editorial = `Exklusiver Bericht aus dem Newsroom: Der Trainer blickt auf die Lage bei ${interviewData.club}. Die Moral ist laut Coach "${interviewData.mood}". Zur personellen Lage: ${interviewData.news}.`;
    loadModule('press');
}

// MODULE ROUTER
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        const mod = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', mod === name);
    });

    if (name === 'press') renderPress(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">${name.toUpperCase()}</h2><p>Neural Sync aktiv.</p></div>`;
}

function renderPress(target) {
    target.innerHTML = `
        <div class="agency-workspace">
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size:30px;">TONI 2.0</div>
                        <h1 class="mag-headline" id="mag-title">${NCOS.press.title}</h1>
                        <p style="color:#888; font-family:'Orbitron'; font-size:10px;">${NCOS.press.issue}</p>
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
                            <div class="luxury-logo" style="font-size:24px;">${NCOS.press.mainSponsor}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    adjustHeadline();
}

function adjustHeadline() {
    const el = document.getElementById('mag-title');
    if (el && el.innerText.length > 15) el.style.fontSize = "32px";
}

// SYSTEM
window.onload = () => {
    loadModule('press');
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
};

function addAIMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':''}"><b>${sender}:</b><br>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}
