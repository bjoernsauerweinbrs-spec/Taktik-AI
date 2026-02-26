/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V41.0
   STATUS: PROFESSIONAL / DEBUGGED
   ========================================================================== */

let NCOS = {
    config: { 
        api: localStorage.getItem('TONI_API') || "", 
        ollama: localStorage.getItem('TONI_OLLAMA') || "http://localhost:11434" 
    },
    press: { 
        title: "BEREIT FÜR RECHERCHE", 
        editorial: "Warten auf Redaktionsschluss...", 
        sponsor: "PARTNER GESUCHT",
        opponent: "Scanne Spielplan...",
        table: "Analysiere Tabelle..."
    }
};

// 1. SYSTEM-INITIALISIERUNG (LOGIN)
function saveAndBoot() {
    const api = document.getElementById('api-key').value;
    const ollama = document.getElementById('ollama-url').value;
    const pass = document.getElementById('passcode').value;

    localStorage.setItem('TONI_API', api);
    localStorage.setItem('TONI_OLLAMA', ollama);

    if(pass === "2026") {
        window.location.href = "dashboard.html";
    } else {
        alert("ZUGRIFF VERWEIGERT: Passcode ungültig.");
    }
}

// 2. HEALTH MONITOR (DIE GRÜNE LAMPE)
async function checkHealth() {
    const lampO = document.getElementById('lamp-ollama');
    if(lampO) {
        try {
            const res = await fetch(`${NCOS.config.ollama}/api/tags`);
            lampO.className = res.ok ? "lamp online" : "lamp offline";
        } catch { lampO.className = "lamp offline"; }
    }
}

// 3. MODUL-ROUTER
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
                        <p style="color:#888; font-family:'Orbitron'; font-size:10px;">MATCHDAY // 2026</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">REPORTER'S DESK</h2>
                        <div class="mag-article" id="mag-editorial" style="white-space: pre-wrap;">${NCOS.press.editorial}</div>
                    </div>
                </div>
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">GEGNER-ANALYSE</h2>
                        <p><b>Aktuelle Position:</b> ${NCOS.press.table}</p>
                        <p><b>Nächste Hürde:</b> ${NCOS.press.opponent}</p>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">PARTNER</h2>
                        <div style="border:1px solid gold; padding:20px; text-align:center;">
                            <div class="luxury-logo" id="mag-sponsor">${NCOS.press.sponsor}</div>
                        </div>
                    </div>
                </div>
            </div>`;
    } else {
        stage.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">${name.toUpperCase()}</h2><p>Online.</p></div>`;
    }
}

// 4. INVESTIGATIVE INTERVIEW
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    addMsg("TONI", "Coach, ich bin im Netz. Welchen Verein nehmen wir heute für das Dossier?");
}

async function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if(step === 1) { 
        NCOS.press.title = "MATCHDAY: " + val.toUpperCase();
        // Simulation Internet-Recherche
        NCOS.press.table = "Platz 4 (Champions League Kurs)";
        NCOS.press.opponent = "Borussia Dortmund (Top-Spiel)";
        addMsg("TONI", `Recherche für ${val} abgeschlossen. Status: Platz 4. Nächster Gegner: Dortmund. Wie ist die personelle Lage im Kader?`); 
        step = 2; 
    }
    else if(step === 2) { 
        NCOS.press.editorial = `Exklusivbericht: Der Coach zum Kader-Update: "${val}".`; 
        addMsg("TONI", "Verstanden. Wie bereiten wir die Mannschaft taktisch auf diesen Gegner vor?"); 
        step = 3; 
    }
    else if(step === 3) { 
        NCOS.press.editorial += `\n\nTaktik-Fokus: ${val}`;
        addMsg("TONI", "Notiert. Welcher Sponsor soll heute die Premium-Fläche auf der Rückseite füllen?"); 
        step = 4; 
    }
    else if(step === 4) { 
        NCOS.press.sponsor = val.toUpperCase(); 
        addMsg("TONI", "Hervorragend. Das Heft ist im Druck!"); 
    }
    loadModule('press');
}

function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) {
        log.innerHTML += `<div class="ai-bubble"><b>${s}:</b><br>${t}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}

// 5. STARTUP-LOGIK
window.onload = () => {
    if(window.location.pathname.includes('dashboard.html')) {
        loadModule('press');
        checkHealth();
        setInterval(() => { 
            const clock = document.getElementById('clock-display');
            if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE'); 
        }, 1000);
    }
};
