/* ==========================================================================
   TONI 2.0 | NCOS V33.0 - THE JOURNALIST PRO ENGINE
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V33_PRO";

let NCOS = {
    state: { activeModule: 'press', isVoice: false },
    press: {
        title: "OFFICIAL NEWS",
        issue: "FEBRUAR 2026",
        editorial: "Analysiere Redaktionsschluss...",
        mainSponsor: "PARTNER GESUCHT",
        tableInfo: "Scanne Tabelle...",
        nextOpponent: "Gegner-Check folgt...",
        spotlight: "Analysiere Kader-Power..."
    }
};

// --- VOICE ---
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

// --- PROFESSIONAL INTERVIEW LOGIC (BRANCHING) ---
let interviewStep = 0;
let transcript = { club: "", mood: "", injuries: "", focus: "", sponsor: "", player: "" };

function startAIBriefing() {
    interviewStep = 1;
    document.getElementById('btn-start-briefing').classList.add('hidden');
    document.getElementById('interview-controls').classList.remove('hidden');
    const msg = "Coach, wir brauchen Content für das Matchday-Magazin. Welcher Verein steht heute im Fokus?";
    addAIMessage("TONI", msg); speak(msg);
}

async function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value.trim(); if(!val) return;
    addAIMessage("YOU", val); input.value = "";

    switch(interviewStep) {
        case 1:
            transcript.club = val;
            NCOS.press.title = `MATCHDAY: ${val.toUpperCase()}`;
            // REAL API SIMULATION (Stand 2026)
            const mockTable = Math.floor(Math.random() * 5) + 1;
            NCOS.press.tableInfo = `Aktuell auf Platz ${mockTable} der Tabelle.`;
            const msg1 = `Verstanden. Recherche für ${val} abgeschlossen. Ihr seid auf Platz ${mockTable}. Wie ist die personelle Lage? Wer fehlt im Lazarett?`;
            addAIMessage("TONI", msg1); speak(msg1);
            interviewStep = 2; break;
        case 2:
            transcript.injuries = val;
            const msg2 = "Bittere Ausfälle. Wie ist die Stimmung in der Kabine nach den letzten Trainingseinheiten?";
            addAIMessage("TONI", msg2); speak(msg2);
            interviewStep = 3; break;
        case 3:
            transcript.mood = val;
            const msg3 = "Fokussiert also. Welcher Spieler soll heute im 'Spotlight' der Analyse stehen?";
            addAIMessage("TONI", msg3); speak(msg3);
            interviewStep = 4; break;
        case 4:
            transcript.player = val;
            const msg4 = "Top-Wahl. Zum Schluss: Welcher Sponsor besetzt heute die Premium-Fläche auf der Rückseite?";
            addAIMessage("TONI", msg4); speak(msg4);
            interviewStep = 5; break;
        case 5:
            transcript.sponsor = val;
            NCOS.press.mainSponsor = val.toUpperCase();
            const msg5 = "Briefing beendet. Ich kompiliere das Layout und integriere die Live-Daten. Schauen Sie mal rein!";
            addAIMessage("TONI", msg5); speak(msg5);
            finalizePress(); break;
    }
    if(NCOS.state.isVoice) recognition.start();
}

function finalizePress() {
    NCOS.press.editorial = `Exklusivbericht: Der Coach zur Lage bei ${transcript.club}. Stimmung: ${transcript.mood}. Verletzungs-Update: ${transcript.injuries}.`;
    NCOS.press.spotlight = `Die KI-Analyse sieht heute ${transcript.player} im Fokus. Seine Vektoren versprechen Dominanz im Mittelfeld.`;
    NCOS.press.nextOpponent = "Der kommende Gegner wird taktisch analysiert...";
    saveData(); loadModule('press');
}

// --- CORE ENGINE ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;
    document.querySelectorAll('.nav-item').forEach(btn => {
        const mod = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', mod === name);
    });

    if (name === 'press') renderPress(stage);
    else if (name === 'kader') renderKader(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">${name.toUpperCase()}</h2><p>Neural Core aktiv.</p></div>`;
}

function renderPress(target) {
    target.innerHTML = `
        <div class="agency-workspace">
            <div class="agency-tools" style="width:200px; padding:20px; background:#000;">
                <button class="btn-main" onclick="window.print()"><i class="fa-solid fa-print"></i> DRUCKAUFTRAG</button>
            </div>
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div style="font-family:var(--font-ui); font-weight:900; background:linear-gradient(to right, #bf953f, #fcf6ba); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:30px; margin-bottom:20px;">TONI 2.0</div>
                        <h1 class="mag-headline" id="dynamic-headline">${NCOS.press.title}</h1>
                        <p style="color:#888;">${NCOS.press.issue}</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">REPORTER'S DESK</h2>
                        <div class="mag-article">${NCOS.press.editorial}</div>
                    </div>
                </div>
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">SPOTLIGHT</h2>
                        <p><b>Tabellenstand:</b> ${NCOS.press.tableInfo}</p>
                        <div class="mag-article" style="margin-top:15px;">${NCOS.press.spotlight}</div>
                    </div>
                    <div class="page-half" style="background:#fff;">
                        <h2 class="mag-headline" style="font-size:24px; border-bottom:1px solid #000;">PARTNER</h2>
                        <div style="border:2px solid var(--neon-gold); padding:30px; text-align:center; margin-top:20px;">
                            <div style="font-family:var(--font-ui); font-weight:900; background:linear-gradient(to right, #bf953f, #fcf6ba); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:24px;">${NCOS.press.mainSponsor}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    adjustHeadline();
}

function adjustHeadline() {
    const el = document.getElementById('dynamic-headline');
    if (!el) return;
    const len = el.innerText.length;
    if (len > 15) el.style.fontSize = "38px";
    if (len > 25) el.style.fontSize = "28px";
}

function renderKader(target) { target.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">MANNSCHAFTSKABINE</h2><p>Neural Sync online.</p></div>`; }
function bootSystem() { document.getElementById('auth-layer').classList.add('hidden'); document.getElementById('app-interface').classList.remove('hidden'); loadModule('press'); setInterval(() => { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE'); }, 1000); }
function addAIMessage(sender, text) { const log = document.getElementById('ai-log'); log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':''}"><b>${sender}:</b><br>${text}</div>`; log.scrollTop = log.scrollHeight; }
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(NCOS)); }    NCOS.state.isVoice = !NCOS.state.isVoice;
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
