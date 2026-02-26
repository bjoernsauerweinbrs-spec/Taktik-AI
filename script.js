/* ==========================================================================
   TONI 2.0 | NEURAL CORE V42.0 - DEBUGGED & STABILIZED
   ========================================================================== */

const NCOS = {
    config: { 
        api: localStorage.getItem('TONI_API') || "", 
        ollama: localStorage.getItem('TONI_OLLAMA') || "http://localhost:11434" 
    },
    press: { 
        title: "BEREIT FÜR RECHERCHE", 
        editorial: "Warten auf Redaktionsschluss...", 
        sponsor: "PARTNER GESUCHT",
        table: "Analysiere Tabelle...",
        opponent: "Scanne Spielplan..."
    }
};

// 1. LOGIN LOGIC
function saveAndBoot() {
    const api = document.getElementById('api-key').value;
    const ollama = document.getElementById('ollama-url').value;
    const pass = document.getElementById('passcode').value;
    localStorage.setItem('TONI_API', api);
    localStorage.setItem('TONI_OLLAMA', ollama);
    if(pass === "2026") { window.location.href = "dashboard.html"; } 
    else { alert("Passcode 2026 erforderlich."); }
}

// 2. HEALTH MONITOR (DIE LAMPE)
async function checkHealth() {
    const lampO = document.getElementById('lamp-ollama');
    if(!lampO) return;
    try {
        const res = await fetch(`${NCOS.config.ollama}/api/tags`);
        lampO.className = res.ok ? "lamp online" : "lamp offline";
    } catch (e) { lampO.className = "lamp offline"; }
}

// 3. MODULE ROUTER
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(name));
    });

    if(name === 'press') {
        stage.innerHTML = `
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size:24px; margin-bottom:20px;">TONI 2.0</div>
                        <h1 class="mag-headline" id="mag-title">${NCOS.press.title}</h1>
                        <p style="color:#888; font-size:10px;">NR. 01 / 2026</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">REPORTER'S DESK</h2>
                        <div class="mag-article" id="mag-editorial">${NCOS.press.editorial}</div>
                    </div>
                </div>
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">GEGNER-ANALYSE</h2>
                        <p><b>Position:</b> ${NCOS.press.table}</p>
                        <p><b>Nächster Gegner:</b> ${NCOS.press.opponent}</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">PARTNER</h2>
                        <div style="border:2px solid gold; padding:20px; text-align:center;">
                            <div class="luxury-logo" id="mag-sponsor">${NCOS.press.sponsor}</div>
                        </div>
                    </div>
                </div>
            </div>`;
    } else {
        stage.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">${name.toUpperCase()}</h2><p>Neural Core aktiv.</p></div>`;
    }
}

// 4. KI-REPORTER (OLLAMA)
async function askOllama(prompt) {
    try {
        const res = await fetch(`${NCOS.config.ollama}/api/generate`, {
            method: 'POST',
            body: JSON.stringify({ model: 'llama3', prompt: prompt, stream: false })
        });
        const data = await res.json();
        return data.response;
    } catch (e) { return "KI Offline. Prüfe Ollama."; }
}

// 5. INTERVIEW LOGIC
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    addMsg("TONI", "Coach, welcher Verein steht heute im Fokus?");
}

async function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if(step === 1) {
        NCOS.press.title = "MATCHDAY: " + val.toUpperCase();
        addMsg("TONI", `Recherche für ${val}... Wie ist die Moral der Truppe?`);
        step = 2;
    } else if(step === 2) {
        NCOS.press.editorial = `Exklusivbericht: "${val}".`;
        addMsg("TONI", "Verstanden. Wer ist der Hauptsponsor?");
        step = 3;
    } else if(step === 3) {
        NCOS.press.sponsor = val.toUpperCase();
        addMsg("TONI", "Heft im Druck!");
    }
    loadModule('press');
}

function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) { log.innerHTML += `<div class="ai-bubble"><b>${s}:</b><br>${t}</div>`; log.scrollTop = log.scrollHeight; }
}

// INITIALISIERUNG
window.onload = () => {
    if(window.location.pathname.includes('dashboard.html')) {
        loadModule('press');
        checkHealth();
        setInterval(checkHealth, 5000);
        setInterval(() => { 
            const clock = document.getElementById('clock-display');
            if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE');
        }, 1000);
    }
};
