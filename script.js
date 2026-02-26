/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V26.0 (AI REPORTER & SPONSORS)
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V26_FINAL";

let NCOS = {
    state: { budget: 4500000, activeModule: 'press', isMicActive: false },
    academy: {
        players: [
            { id: 101, name: "Julian Weber", birthDate: "2011-05-15", position: "ST", stats: { pac: 75, sho: 68, pas: 62, dri: 71, def: 34, phy: 60 }, promotedTo: null, stickers: [true, true, false], aiReview: "Herausragender Torinstinkt." }
        ]
    },
    finance: [{ id: 1, date: "26.02.", desc: "Sponsoring: Neural Gear", val: 1500000, cat: "Income" }],
    press: {
        title: "TONI NEWS", issue: "NR. 01 / 2026", pageCount: 4,
        mainSponsor: "NEURAL GEAR",
        articles: [{ headline: "DER GIGANT ERWACHT", content: "Die neue Ära im Club hat begonnen..." }]
    }
};

let interviewStep = 0;
let interviewData = { club: "", topic: "", player: "", sponsor: "" };

// --- BOOT & DATA ---
function bootSystem() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) NCOS = JSON.parse(saved);
    document.getElementById('auth-layer').classList.add('hidden');
    document.getElementById('app-interface').classList.remove('hidden');
    initClock();
    loadModule(NCOS.state.activeModule);
    updateGlobalHUD();
}

function initClock() { setInterval(() => { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE'); }, 1000); }

function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.getAttribute('onclick').includes(name)));
    if (name === 'press') renderPressAgency(stage);
    else if (name === 'nlz') renderNLZ(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>MODUL ${name.toUpperCase()}</h2><p>System online.</p></div>`;
}

// --- PRESS AGENCY ---
function renderPressAgency(target) {
    target.innerHTML = `
        <div class="agency-workspace">
            <div class="agency-tools">
                <div class="tool-section">
                    <span class="tool-label">PAGE MANAGEMENT</span>
                    <button class="btn-agency" onclick="addPages()"><i class="fa-solid fa-plus"></i> +4 SEITEN</button>
                    <button class="btn-agency" onclick="window.print()"><i class="fa-solid fa-print"></i> DRUCKAUFTRAG</button>
                </div>
            </div>
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size: 50px; margin-bottom: 20px;">TONI 2.0</div>
                        <h1 class="mag-headline" contenteditable="true">${NCOS.press.title}</h1>
                        <p class="mag-subline">${NCOS.press.issue}</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">EDITORIAL</h2>
                        <div class="mag-article" contenteditable="true">${NCOS.press.articles[0].content}</div>
                    </div>
                </div>
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">SPOTLIGHT</h2>
                        <div class="mag-article" contenteditable="true">Hier folgt die KI-Analyse zum Spieler...</div>
                    </div>
                    <div class="page-half" style="background:#fff;">
                        <h2 class="mag-headline" style="font-size:24px; border-bottom:1px solid #000;">OUR PARTNERS</h2>
                        <div style="text-align:center; padding:20px; border:2px solid var(--neon-gold); margin-bottom:20px;">
                            <div class="luxury-logo" style="font-size:20px;">${NCOS.press.mainSponsor}</div>
                            <div style="font-size:8px; margin-top:5px;">PREMIUM PARTNER</div>
                        </div>
                        <div class="partner-grid">
                            <div class="partner-box">LOGO 1</div><div class="partner-box">LOGO 2</div>
                            <div class="partner-box">LOGO 3</div><div class="partner-box">LOGO 4</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- AI REPORTER INTERVIEW ---
function startAIBriefing() {
    interviewStep = 1;
    document.getElementById('btn-start-briefing').classList.add('hidden');
    document.getElementById('interview-controls').classList.remove('hidden');
    addAIMessage("TONI", "Coach, ich erstelle die neue Ausgabe. Für welchen <b>Verein</b> recherchiere ich heute?");
}

function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value; if(!val) return;
    addAIMessage("YOU", val); input.value = "";

    setTimeout(() => {
        if(interviewStep === 1) { 
            interviewData.club = val; 
            addAIMessage("TONI", `Recherchiere Daten für ${val}... Gefunden! Wer ist unser <b>Hauptsponsor</b> für diese Ausgabe?`); 
            interviewStep = 2; 
        }
        else if(interviewStep === 2) { 
            interviewData.sponsor = val; 
            addAIMessage("TONI", "Eingetragen. Welcher <b>Spieler</b> soll heute die Bio-Seite füllen?"); 
            interviewStep = 3; 
        }
        else if(interviewStep === 3) { 
            interviewData.player = val; 
            addAIMessage("TONI", "Perfekt. Ich generiere das Layout..."); 
            finishMagazine(); 
        }
    }, 1000);
}

function finishMagazine() {
    NCOS.press.title = `MATCHDAY: ${interviewData.club.toUpperCase()}`;
    NCOS.press.mainSponsor = interviewData.sponsor.toUpperCase();
    NCOS.press.articles[0].content = `Ein exklusives Interview über die Entwicklung bei ${interviewData.club}. Wir setzen voll auf ${interviewData.player}. Dank der Unterstützung von ${interviewData.sponsor} blicken wir positiv in die Zukunft.`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(NCOS));
    loadModule('press');
}

function addAIMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div style="margin-bottom:10px; border-left:2px solid ${sender==='TONI'?'var(--neon-cyan)':'#444'}; padding-left:10px;"><small style="color:#666;">${sender}</small><br>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}

// --- NLZ ---
function renderNLZ(target) {
    target.innerHTML = `<div class="nlz-background" style="padding:40px;"><div class="panini-album">${NCOS.academy.players.map(p => `<div class="panini-card" style="padding:20px;"><div class="luxury-logo">${p.name}</div></div>`).join('')}</div></div>`;
}

function updateGlobalHUD() { document.getElementById('budget-display').innerText = NCOS.state.budget.toLocaleString() + " €"; }
function toggleModal(id, show) { document.getElementById(id).classList.toggle('hidden', !show); }
function addPages() { NCOS.press.pageCount += 4; loadModule('press'); }
