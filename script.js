/* TONI 2.0 | NCOS MASTER SCRIPT V39.0 */

let NCOS = {
    config: {
        api: localStorage.getItem('TONI_API'),
        ollama: localStorage.getItem('TONI_OLLAMA') || "http://localhost:11434"
    },
    press: {
        title: "BEREIT FÜR RECHERCHE",
        editorial: "Warten auf Redaktionsschluss...",
        sponsor: "PARTNER GESUCHT"
    }
};

// 1. HEALTH MONITOR (DIE GRÜNE LAMPE)
async function checkHealth() {
    const lampOllama = document.getElementById('lamp-ollama');
    const lampApi = document.getElementById('lamp-api');

    if (lampOllama) {
        try {
            const res = await fetch(`${NCOS.config.ollama}/api/tags`);
            lampOllama.className = res.ok ? "lamp online" : "lamp offline";
        } catch { lampOllama.className = "lamp offline"; }
    }
    if (lampApi) {
        lampApi.className = NCOS.config.api && NCOS.config.api.length > 5 ? "lamp online" : "lamp offline";
    }
}

// 2. MODUL RENDERER (VERHINDERT BLACK SCREEN)
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(name));
    });

    if (name === 'press') renderPress(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>MODUL: ${name.toUpperCase()}</h2></div>`;
}

function renderPress(target) {
    target.innerHTML = `
        <div class="magazine-page">
            <div class="page-half">
                <div class="luxury-logo" style="font-size:24px; margin-bottom:20px;">TONI 2.0</div>
                <h1 class="mag-headline">${NCOS.press.title}</h1>
                <p style="color:#888; font-family:'Orbitron'; font-size:10px;">MATCHDAY EDITION // 2026</p>
            </div>
            <div class="page-half">
                <h2 class="mag-headline" style="font-size:24px;">REPORTER'S DESK</h2>
                <div class="mag-article">${NCOS.press.editorial}</div>
            </div>
        </div>
        <div class="magazine-page">
            <div class="page-half">
                <h2 class="mag-headline" style="font-size:24px;">PARTNER</h2>
                <div style="border:2px solid gold; padding:20px; text-align:center; margin-top:20px;">
                    <div class="luxury-logo" style="font-size:24px;">${NCOS.press.sponsor}</div>
                </div>
            </div>
        </div>
    `;
}

// 3. INTERVIEW LOGIC
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    addMsg("TONI", "Coach, ich bin bereit. Welchen Verein nehmen wir heute für das Dossier?");
}

async function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if (step === 1) {
        NCOS.press.title = "MATCHDAY: " + val.toUpperCase();
        addMsg("TONI", `Recherche für ${val} läuft... Wie ist die personelle Lage?`);
        step = 2;
    } else if (step === 2) {
        NCOS.press.editorial = `Exklusivbericht: Der Trainer zur Lage der Mannschaft: "${val}".`;
        addMsg("TONI", "Verstanden. Wer ist unser Hauptsponsor?");
        step = 3;
    } else if (step === 3) {
        NCOS.press.sponsor = val.toUpperCase();
        addMsg("TONI", "Heft wird gedruckt!");
    }
    loadModule('press'); // ZEITUNG LIVE AKTUALISIEREN
}

function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) { log.innerHTML += `<div class="ai-bubble"><b>${s}:</b><br>${t}</div>`; log.scrollTop = log.scrollHeight; }
}

// STARTUP
window.onload = () => {
    loadModule('press');
    checkHealth();
    setInterval(() => { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE'); }, 1000);
};
