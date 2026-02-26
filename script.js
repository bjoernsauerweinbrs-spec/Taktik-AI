/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V28.0 (INVESTIGATIVE AI REPORTER)
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V28_ELITE";

let NCOS = {
    state: { budget: 4500000, activeModule: 'press' },
    academy: { players: [{ id: 101, name: "Julian Weber", stats: { pac: 75, sho: 68, pas: 62, dri: 71, def: 34, phy: 60 } }] },
    press: {
        title: "MATCHDAY: SC BORUSSIA DORTMUND", // Standardwert nach User-Input Fix
        issue: "NR. 01 / FEBRUAR 2026",
        pageCount: 4,
        mainSponsor: "COCA COLA",
        editorial: "Warten auf Redaktionsschluss...",
        spotlight: "Analyse wird generiert...",
        nextOpponent: "Bayern München", // Simuliertes Recherche-Ergebnis
        tablePos: "2. Platz"
    }
};

let interviewStep = 0;
let isVoiceActive = false;

// --- BOOT ---
function bootSystem() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) NCOS = JSON.parse(saved);
    document.getElementById('auth-layer').classList.add('hidden');
    document.getElementById('app-interface').classList.remove('hidden');
    updateGlobalHUD();
    loadModule(NCOS.state.activeModule);
    setInterval(() => { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE'); }, 1000);
}

// --- MODULE ROUTER ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.getAttribute('onclick').includes(name)));
    
    if (name === 'press') renderPressAgency(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>MODUL ${name.toUpperCase()}</h2></div>`;
}

// --- PRESS AGENCY (FULL RENDERER) ---
function renderPressAgency(target) {
    let pagesHTML = `
        <div class="agency-workspace">
            <div class="agency-tools">
                <div class="tool-section">
                    <span class="tool-label">PAGE MANAGEMENT</span>
                    <button class="btn-agency" onclick="addPages()"><i class="fa-solid fa-plus"></i> +4 SEITEN</button>
                    <button class="btn-agency" onclick="window.print()"><i class="fa-solid fa-print"></i> DRUCKAUFTRAG</button>
                </div>
                <div class="tool-section" style="margin-top:auto;">
                    <p style="font-size:9px; color:#444;">AGENCY STATUS: ONLINE</p>
                </div>
            </div>
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size: 40px; margin-bottom: 20px;">TONI 2.0</div>
                        <h1 class="mag-headline" contenteditable="true" onblur="NCOS.press.title=this.innerText; saveData();">${NCOS.press.title}</h1>
                        <p style="font-family:var(--font-ui); color:#888; letter-spacing:2px;">${NCOS.press.issue}</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">REPORTER'S DESK</h2>
                        <div class="mag-article" contenteditable="true" onblur="NCOS.press.editorial=this.innerText; saveData();">
                            ${NCOS.press.editorial}
                        </div>
                    </div>
                </div>`;

    // Dynamische Zwischenseiten (8, 12...)
    for (let i = 4; i < NCOS.press.pageCount; i += 2) {
        pagesHTML += `
            <div class="magazine-page">
                <div class="page-half">
                    <h2 class="mag-headline" style="font-size:24px;">LIVE INSIGHTS</h2>
                    <div class="mag-article" contenteditable="true">Exklusive Einblicke aus der Kabine...</div>
                </div>
                <div class="page-half">
                    <h2 class="mag-headline" style="font-size:24px;">GEGNER-CHECK</h2>
                    <p><b>Aktueller Tabellenplatz:</b> ${NCOS.press.tablePos}</p>
                    <p><b>Nächster Gegner:</b> ${NCOS.press.nextOpponent}</p>
                    <div style="background:#f4f4f4; height:150px; margin-top:10px; border:1px dashed #ccc;"></div>
                </div>
            </div>`;
    }

    // Letztes Blatt (Spotlight & Partner)
    pagesHTML += `
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:24px;">SPOTLIGHT</h2>
                        <div class="mag-article" contenteditable="true" onblur="NCOS.press.spotlight=this.innerText; saveData();">
                            ${NCOS.press.spotlight}
                        </div>
                    </div>
                    <div class="page-half" style="background:#fff;">
                        <h2 class="mag-headline" style="font-size:24px; border-bottom:1px solid #000;">PARTNER</h2>
                        <div style="text-align:center; padding:15px; border:2px solid var(--neon-gold); margin-bottom:15px;">
                            <div class="luxury-logo" style="font-size:18px;">${NCOS.press.mainSponsor}</div>
                            <div style="font-size:7px; margin-top:3px;">PREMIUM SPONSOR</div>
                        </div>
                        <div class="partner-grid">
                            <div class="partner-box">LOGO 1</div><div class="partner-box">LOGO 2</div>
                            <div class="partner-box">LOGO 3</div><div class="partner-box">LOGO 4</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    target.innerHTML = pagesHTML;
}

// --- INVESTIGATIVE AI REPORTER ---
function startAIBriefing() {
    interviewStep = 1;
    document.getElementById('btn-start-briefing').classList.add('hidden');
    document.getElementById('interview-controls').classList.remove('hidden');
    addAIMessage("TONI", "Coach, wir brauchen Schlagzeilen. Welchen <b>Verein</b> nehmen wir heute ins Visier? Ich bereite die Live-Recherche vor.");
}

function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value; if(!val) return;
    addAIMessage("USER", val); input.value = "";

    setTimeout(() => {
        if (interviewStep === 1) {
            NCOS.press.title = `MATCHDAY: ${val.toUpperCase()}`;
            addAIMessage("TONI", `Recherchiere Daten für <b>${val}</b>... Zugriff auf Fussball.de erfolgreich. Ihr seid momentan auf dem ${NCOS.press.tablePos}. <br><br>Ganz unter uns: Wie steht es um die <b>physische Verfassung</b> nach der intensiven Trainingswoche?`);
            interviewStep = 2;
        } 
        else if (interviewStep === 2) {
            addAIMessage("TONI", `Spannend. Ich notiere: <i>"${val}"</i>. Wer ist heute unser <b>'Man of the Hour'</b>? Ich brauche Daten für die Spotlight-Analyse.`);
            interviewStep = 3;
        }
        else if (interviewStep === 3) {
            addAIMessage("TONI", `Exzellente Wahl. Ich ziehe die Statistiken für ${val} und baue das Layout... Fertig. Werfen Sie einen Blick auf das Deckblatt.`);
            finalizeAgencyWork();
        }
    }, 1200);
}

function finalizeAgencyWork() {
    NCOS.press.editorial = "Exklusives Interview aus dem Newsroom. Wir sprachen über die aktuelle Verfassung und die Ambitionen für das kommende Spiel.";
    NCOS.press.spotlight = "Die KI hat die Laufwege und die Effizienz analysiert. Unser Star zeigt eine aufsteigende Formkurve.";
    saveData();
    loadModule('press');
}

// --- HELPERS ---
function toggleVoiceMode() {
    isVoiceActive = !isVoiceActive;
    const btn = document.getElementById('live-voice-btn');
    btn.style.background = isVoiceActive ? "var(--path-vector)" : "var(--neon-alert)";
    btn.innerHTML = isVoiceActive ? '<i class="fa-solid fa-ear-listen"></i> REPORTER HÖRT ZU...' : '<i class="fa-solid fa-microphone-lines"></i> LIVE REPORTER MODE';
    if(isVoiceActive) startAIBriefing();
}

function addAIMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':'user'}"><small>${sender}</small>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}

function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(NCOS)); }
function updateGlobalHUD() { document.getElementById('budget-display').innerText = NCOS.state.budget.toLocaleString() + " €"; }
function addPages() { NCOS.press.pageCount += 4; loadModule('press'); }
