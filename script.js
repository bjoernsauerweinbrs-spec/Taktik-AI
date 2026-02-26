/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V30.0 (FULL INTEGRATION & API ENGINE)
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V30_ELITE";

// --- 1. CORE DATA ARCHITECTURE (RESTORED ALL MODULES) ---
let NCOS = {
    state: {
        budget: 4500000,
        activeModule: 'press',
        isVoiceActive: false,
        apiStatus: 'OFFLINE'
    },
    config: {
        apiKey: "", // Dein Football-Data.org oder Google Search API Key
        ollamaUrl: "http://localhost:11434/api/generate"
    },
    // Profi-Mannschaft (Kabine)
    pro: {
        players: [
            { id: 1, name: "Manuel Neuer", pos: "TW", rating: 89 },
            { id: 2, name: "Harry Kane", pos: "ST", rating: 91 }
        ]
    },
    // Nachwuchs (NLZ)
    academy: {
        players: [
            { id: 101, name: "Julian Weber", birthDate: "2011-05-15", position: "ST", stats: { pac: 75, sho: 68, pas: 62, dri: 71, def: 34, phy: 60 }, promotedTo: null, stickers: [true, true, false] }
        ]
    },
    // Zeitungs-Daten
    press: {
        title: "OFFICIAL NEWS",
        issue: "NR. 01 / 2026",
        pageCount: 4,
        editorial: "Warte auf Redaktionsschluss...",
        mainSponsor: "COCA COLA"
    }
};

// --- 2. VOICE & SPEECH ENGINE ---
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'de-DE';
recognition.continuous = false;

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.rate = 1.0;
    window.speechSynthesis.speak(msg);
}

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('ai-chat-input').value = transcript;
    processInterviewStep(); // Automatische Verarbeitung nach Spracheingabe
};

// --- 3. INTERNET API ENGINE (REAL DATA FETCH) ---
async function fetchLiveFootballData(clubName) {
    if (!NCOS.config.apiKey) {
        return { table: "3. Platz", opponent: "FC Bayern München", news: "Top-Spiel steht bevor." };
    }
    try {
        // Beispiel-Endpoint für echte Daten (benötigt Key)
        const response = await fetch(`https://api.football-data.org/v4/competitions/BL1/standings`, {
            headers: { 'X-Auth-Token': NCOS.config.apiKey }
        });
        const data = await response.json();
        NCOS.state.apiStatus = 'ONLINE';
        return data;
    } catch (e) {
        console.error("API Error:", e);
        return null;
    }
}

// --- 4. NAVIGATION & MODULE ROUTER (RE-RESTORATION) ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;

    // Sidebar-Aktivierung
    document.querySelectorAll('.nav-item').forEach(btn => {
        const mod = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', mod === name);
    });

    document.getElementById('active-mod-name').innerText = "// " + name.toUpperCase();

    // Dynamisches Rendering
    switch(name) {
        case 'tactics': renderTactics(stage); break;
        case 'kader': renderKader(stage); break;
        case 'office': renderOffice(stage); break;
        case 'nlz': renderNLZ(stage); break;
        case 'press': renderPressAgency(stage); break;
        case 'video': renderVideo(stage); break;
    }
}

// --- 5. RENDER-FUNKTIONEN (Detailliert) ---

function renderKader(target) {
    target.innerHTML = `
        <div style="padding:40px;">
            <h2 class="luxury-logo" style="font-size:32px; margin-bottom:20px;">MANNSCHAFTS-KABINE</h2>
            <div class="panini-album">
                ${NCOS.pro.players.map(p => `
                    <div class="panini-card" style="height:200px;">
                        <div style="padding:20px; text-align:center;">
                            <div style="font-size:24px; color:var(--neon-gold);">${p.rating}</div>
                            <div style="margin:10px 0; font-family:var(--font-ui);">${p.name}</div>
                            <div style="color:#666;">${p.pos}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderPressAgency(target) {
    target.innerHTML = `
        <div class="agency-workspace">
            <div class="agency-tools">
                <span class="tool-label">NEWS-DESK</span>
                <button class="btn-agency" onclick="addPages()"><i class="fa-solid fa-plus"></i> +4 SEITEN</button>
                <button class="btn-agency" onclick="window.print()"><i class="fa-solid fa-print"></i> DRUCKEN</button>
            </div>
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size:40px;">TONI 2.0</div>
                        <h1 class="mag-headline" id="mag-title">${NCOS.press.title}</h1>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">EDITORIAL</h2>
                        <div class="mag-article" id="mag-editorial">${NCOS.press.editorial}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- 6. NEURAL REPORTER (INTERVIEW LOGIC) ---
let interviewStep = 0;

function startAIBriefing() {
    interviewStep = 1;
    document.getElementById('btn-start-briefing').classList.add('hidden');
    document.getElementById('interview-controls').classList.remove('hidden');
    const msg = "Coach, ich bin bereit. Für welchen Verein scannen wir heute das Netz?";
    addAIMessage("TONI", msg);
    if(NCOS.state.isVoiceActive) speak(msg);
}

async function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value; if(!val) return;
    addAIMessage("USER", val); input.value = "";

    if (interviewStep === 1) {
        addAIMessage("TONI", `Verstanden. Ich kontaktiere die Server für <b>${val}</b>...`);
        const liveData = await fetchLiveFootballData(val);
        
        NCOS.press.title = `MATCHDAY: ${val.toUpperCase()}`;
        const reply = `Analyse abgeschlossen. Ihr steht momentan auf dem ${liveData.table}. Der nächste Gegner ist ${liveData.opponent}. Wie schätzen Sie die Chancen ein?`;
        
        addAIMessage("TONI", reply);
        if(NCOS.state.isVoiceActive) speak(reply);
        interviewStep = 2;
    } else if (interviewStep === 2) {
        NCOS.press.editorial = `Der Coach zur aktuellen Lage: "${val}".`;
        const reply = "Das wird die Fans begeistern. Ich schließe die Redaktion und bereite das Layout vor.";
        addAIMessage("TONI", reply);
        if(NCOS.state.isVoiceActive) speak(reply);
        loadModule('press');
    }
}

// --- 7. UTILS & SYSTEM ---
function bootSystem() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) NCOS = JSON.parse(saved);
    document.getElementById('auth-layer').classList.add('hidden');
    document.getElementById('app-interface').classList.remove('hidden');
    loadModule('press');
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
}

function toggleVoiceAI() {
    NCOS.state.isVoiceActive = !NCOS.state.isVoiceActive;
    const btn = document.getElementById('live-voice-btn');
    if(NCOS.state.isVoiceActive) {
        btn.innerHTML = "REPORTER HÖRT ZU...";
        btn.style.color = "#0aff60";
        recognition.start();
    } else {
        btn.innerHTML = "VOICE REPORTER MODE";
        btn.style.color = "#fff";
        recognition.stop();
    }
}

function addAIMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':''}"><b>${sender}:</b><br>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}

function updateGlobalHUD() {
    document.getElementById('budget-display').innerText = NCOS.state.budget.toLocaleString() + " €";
}
