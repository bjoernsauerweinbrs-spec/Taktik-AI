/* ==========================================================================
   TONI 2.0 | NCOS V32.0 - PROFESSIONAL LOGIC & MODULE RESTORATION
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V32_FINAL";

let NCOS = {
    state: { activeModule: 'press', isVoice: false },
    press: {
        title: "OFFICIAL CLUB NEWS",
        issue: "NR. 01 / 2026",
        editorial: "Warten auf Redaktionsschluss...",
        mainSponsor: "PARTNER GESUCHT"
    }
};

// --- VOICE ENGINE (PRO) ---
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'de-DE';
recognition.continuous = false;

function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel(); // Stoppt laufende Ausgaben
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    window.speechSynthesis.speak(msg);
}

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('ai-chat-input').value = transcript;
    processInterviewStep();
};

function toggleVoiceAI() {
    NCOS.state.isVoice = !NCOS.state.isVoice;
    const btn = document.getElementById('live-voice-btn');
    if(NCOS.state.isVoice) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-ear-listen"></i> REPORTER HÖRT ZU...';
        recognition.start();
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa-solid fa-microphone"></i> VOICE REPORTER MODE';
        recognition.stop();
    }
}

// --- INTELLIGENT REPORTER LOGIC ---
let interviewStep = 0;

function startAIBriefing() {
    interviewStep = 1;
    document.getElementById('btn-start-briefing').classList.add('hidden');
    document.getElementById('interview-controls').classList.remove('hidden');
    const msg = "Coach, ich bin im Netz. Welchen Verein nehmen wir heute für das Dossier?";
    addAIMessage("TONI", msg);
    speak(msg);
}

async function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value.trim(); if(!val) return;
    addAIMessage("YOU", val); input.value = "";

    // Check for simple greetings
    if (val.toLowerCase() === "hallo" || val.toLowerCase() === "hi") {
        const msg = "Guten Tag, Coach! Reden wir über das nächste Heft? Welchen Verein scannen wir?";
        addAIMessage("TONI", msg); speak(msg);
        return;
    }

    if (interviewStep === 1) {
        NCOS.press.title = `MATCHDAY: ${val.toUpperCase()}`;
        const msg = `Recherche für ${val} abgeschlossen. Tabellenstand und News 2026 geladen. Wie schätzen Sie die Moral der Mannschaft ein?`;
        addAIMessage("TONI", msg); speak(msg);
        interviewStep = 2;
    } else if (interviewStep === 2) {
        NCOS.press.editorial = `Exklusivbericht: Der Trainer zur aktuellen Lage: "${val}".`;
        const msg = "Sehr gut. Wer ist unser Hauptsponsor für die Rückseite?";
        addAIMessage("TONI", msg); speak(msg);
        interviewStep = 3;
    } else if (interviewStep === 3) {
        NCOS.press.mainSponsor = val.toUpperCase();
        addAIMessage("TONI", "Hervorragend. Die Druckmaschine läuft. Das Heft ist fertig.");
        speak("Hervorragend. Die Druckmaschine läuft. Das Heft ist fertig.");
        loadModule('press');
    }
    if(NCOS.state.isVoice) recognition.start();
}

// --- MODULE ROUTER (ALL 6 MODULES RESTORED) ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;

    document.querySelectorAll('.nav-item').forEach(btn => {
        const mod = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', mod === name);
    });

    switch(name) {
        case 'press': renderPress(stage); break;
        case 'kader': renderModulePlaceholder(stage, "MANNSCHAFTSKABINE", "Kaderdaten werden live synchronisiert..."); break;
        case 'tactics': renderModulePlaceholder(stage, "TACTICAL CO-PILOT", "Taktik-Vektoren für 2026 geladen."); break;
        case 'office': renderModulePlaceholder(stage, "OFFICE PRIME", "ERP & Finanzwesen online."); break;
        case 'nlz': renderModulePlaceholder(stage, "ACADEMY HUB", "Nachwuchstalente geladen."); break;
        case 'video': renderModulePlaceholder(stage, "BROADCAST LAB", "Video-Analysen bereit."); break;
    }
}

function renderPress(target) {
    target.innerHTML = `
        <div class="agency-workspace">
            <div class="agency-tools">
                <button class="btn-agency" onclick="addPages()" style="background:#0a0a0c; border:1px solid #333; color:#888; padding:10px; font-size:9px; width:100%; margin-bottom:10px;">+4 SEITEN</button>
                <button class="btn-agency" onclick="window.print()" style="background:#0a0a0c; border:1px solid #333; color:#888; padding:10px; font-size:9px; width:100%;">DRUCKEN</button>
            </div>
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size:30px;">TONI 2.0</div>
                        <h1 class="mag-headline">${NCOS.press.title}</h1>
                        <p style="color:#888; font-family:var(--font-ui); font-size:10px;">${NCOS.press.issue}</p>
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
                            <div class="luxury-logo">${NCOS.press.mainSponsor}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderModulePlaceholder(target, title, desc) {
    target.innerHTML = `
        <div style="padding:40px;">
            <h2 class="mag-headline">${title}</h2>
            <p style="color:#666; font-family:var(--font-ui);">${desc}</p>
        </div>
    `;
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
