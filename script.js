/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V27.0 (NEURAL REPORTER & INFINITE PAGES)
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V27_FINAL";

let NCOS = {
    state: { budget: 4500000, activeModule: 'press' },
    academy: { players: [{ id: 101, name: "Julian Weber", stats: { pac: 75, sho: 68, pas: 62, dri: 71, def: 34, phy: 60 } }] },
    press: {
        title: "TONI NEWS", issue: "NR. 01 / 2026", pageCount: 4,
        mainSponsor: "COCA COLA",
        editorial: "Willkommen zur neuen Ära...",
        spotlight: "Die KI-Analyse zeigt...",
        reportersLead: "Exklusives Briefing aktiv."
    }
};

let interviewStep = 0;
let interviewTranscript = { club: "", coachMood: "", injuryInfo: "", star: "", sponsor: "" };

// --- SYSTEM BOOT ---
function bootSystem() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) NCOS = JSON.parse(saved);
    document.getElementById('auth-layer').classList.add('hidden');
    document.getElementById('app-interface').classList.remove('hidden');
    updateGlobalHUD();
    loadModule(NCOS.state.activeModule);
    setInterval(() => { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE'); }, 1000);
}

// --- NAVIGATION ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.getAttribute('onclick').includes(name)));
    
    if (name === 'press') renderPressAgency(stage);
    else if (name === 'nlz') renderNLZ(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>MODUL ${name.toUpperCase()}</h2><p>Neural Core aktiv.</p></div>`;
}

// --- PRESS AGENCY (INFINITE PAGES) ---
function renderPressAgency(target) {
    let pagesHTML = `
        <div class="agency-workspace">
            <div class="agency-tools">
                <div class="tool-section">
                    <span class="tool-label">LAYOUT</span>
                    <button class="btn-agency" onclick="addPages()"><i class="fa-solid fa-plus"></i> ${NCOS.press.pageCount + 4} SEITEN</button>
                    <button class="btn-agency" onclick="window.print()"><i class="fa-solid fa-print"></i> DRUCKAUFTRAG</button>
                </div>
            </div>
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size: 40px; margin-bottom: 20px;">TONI 2.0</div>
                        <h1 class="mag-headline" contenteditable="true">${NCOS.press.title}</h1>
                        <p class="mag-subline">${NCOS.press.issue}</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">EDITORIAL</h2>
                        <div class="mag-article" contenteditable="true">${NCOS.press.editorial}</div>
                    </div>
                </div>`;

    // Dynamische Zwischenseiten (8, 12, 16...)
    for (let i = 4; i < NCOS.press.pageCount; i += 2) {
        pagesHTML += `
            <div class="magazine-page">
                <div class="page-half">
                    <h2 class="mag-headline" style="font-size:24px;">REPORTER INSIGHTS</h2>
                    <div class="mag-article" contenteditable="true">Zusätzlicher redaktioneller Inhalt für Seite ${i-1}.</div>
                </div>
                <div class="page-half">
                    <h2 class="mag-headline" style="font-size:24px;">STATISTIKEN</h2>
                    <div style="background:#f9f9f9; height:150px; display:flex; align-items:center; justify-content:center; border:1px dashed #ccc;">[KI-CHART SEITE ${i}]</div>
                </div>
            </div>`;
    }

    // Letztes Blatt: Spotlight & Partner
    pagesHTML += `
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">SPOTLIGHT</h2>
                        <div class="mag-article" contenteditable="true">${NCOS.press.spotlight}</div>
                    </div>
                    <div class="page-half" style="background:#fff;">
                        <h2 class="mag-headline" style="font-size:24px; border-bottom:1px solid #000;">PARTNER</h2>
                        <div style="text-align:center; padding:15px; border:2px solid var(--neon-gold); margin-bottom:15px;">
                            <div class="luxury-logo" style="font-size:18px;">${NCOS.press.mainSponsor}</div>
                            <div style="font-size:7px; margin-top:3px;">PREMIUM SPONSOR</div>
                        </div>
                        <div class="partner-grid">
                            <div class="partner-box">PARTNER A</div><div class="partner-box">PARTNER B</div>
                            <div class="partner-box">PARTNER C</div><div class="partner-box">PARTNER D</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    target.innerHTML = pagesHTML;
}

// --- NEURAL REPORTER ENGINE ---
function startAIBriefing() {
    interviewStep = 1;
    document.getElementById('btn-start-briefing').classList.add('hidden');
    document.getElementById('interview-controls').classList.remove('hidden');
    addAIMessage("TONI", "Coach, ich scanne die Datenbank... Für welchen <b>Verein</b> erstellen wir das heutige Dossier?");
}

function processInterviewStep() {
    const el = document.getElementById('ai-chat-input');
    const val = el.value; if(!val) return;
    addAIMessage("YOU", val); el.value = "";

    setTimeout(() => {
        switch(interviewStep) {
            case 1:
                interviewTranscript.club = val;
                addAIMessage("TONI", `Recherche für <b>${val}</b> abgeschlossen. Tabellenstand 2026: Gesichert. <br><br>Wie ist die aktuelle <b>Stimmung</b> im Team vor dem nächsten Spiel?`);
                interviewStep = 2; break;
            case 2:
                interviewTranscript.coachMood = val;
                addAIMessage("TONI", "Verstanden. Gibt es wichtige <b>Personalinfol</b> (Verletzte oder Rückkehrer), die wir erwähnen müssen?");
                interviewStep = 3; break;
            case 3:
                interviewTranscript.injuryInfo = val;
                addAIMessage("TONI", "Notiert. Welcher <b>Sponsor</b> soll heute die Premium-Fläche auf der Rückseite füllen?");
                interviewStep = 4; break;
            case 4:
                interviewTranscript.sponsor = val;
                addAIMessage("TONI", "Sehr gut. Letzte Frage: Welchen <b>Spieler</b> nehmen wir ins Spotlight für die Bio-Analyse?");
                interviewStep = 5; break;
            case 5:
                interviewTranscript.star = val;
                addAIMessage("TONI", "Briefing beendet. Ich kompiliere die Artikel und ziehe die Daten von Football.de... Fertig.");
                finalizeMagazine(); break;
        }
    }, 1200);
}

function finalizeMagazine() {
    NCOS.press.title = `MATCHDAY: ${interviewTranscript.club.toUpperCase()}`;
    NCOS.press.mainSponsor = interviewTranscript.sponsor.toUpperCase();
    NCOS.press.editorial = `Exklusivbericht: ${interviewTranscript.club} bereitet sich vor. Der Coach sagt zur Stimmung: "${interviewTranscript.coachMood}". Personelle Lage: ${interviewTranscript.injuryInfo}.`;
    NCOS.press.spotlight = `Unser Fokus heute liegt auf ${interviewTranscript.star}. Die KI-Werte versprechen eine dominante Leistung im kommenden Match.`;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(NCOS));
    loadModule('press');
}

// --- HELPERS ---
function addAIMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':''}">
        <small>${sender}</small><br>${text}
    </div>`;
    log.scrollTop = log.scrollHeight;
}

function addPages() { NCOS.press.pageCount += 4; loadModule('press'); }
function updateGlobalHUD() { document.getElementById('budget-display').innerText = NCOS.state.budget.toLocaleString() + " €"; }
function toggleModal(id, show) { document.getElementById(id).classList.toggle('hidden', !show); }
function renderNLZ(target) { target.innerHTML = `<div style="padding:40px;"><h2>NLZ AKTIV</h2></div>`; }
