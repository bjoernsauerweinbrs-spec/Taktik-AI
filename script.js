/* TONI 2.0 | FINAL LOGIC V40.0 */
let NCOS = {
    config: { api: localStorage.getItem('TONI_API'), ollama: localStorage.getItem('TONI_OLLAMA') || "http://localhost:11434" },
    press: { title: "BEREIT", editorial: "Warten auf Redaktionsschluss...", sponsor: "PARTNER" }
};

// 1. LOGIN LOGIC (Wichtig!)
function saveAndBoot() {
    const api = document.getElementById('api-key').value;
    const ollama = document.getElementById('ollama-url').value;
    const pass = document.getElementById('passcode').value;

    localStorage.setItem('TONI_API', api);
    localStorage.setItem('TONI_OLLAMA', ollama);

    if(pass === "2026") {
        window.location.href = "dashboard.html";
    } else {
        alert("ZUGRIFF VERWEIGERT.");
    }
}

// 2. HEALTH CHECK
async function checkHealth() {
    const lampO = document.getElementById('lamp-ollama');
    if(lampO) {
        try {
            const res = await fetch(`${NCOS.config.ollama}/api/tags`);
            lampO.className = res.ok ? "lamp online" : "lamp offline";
        } catch { lampO.className = "lamp offline"; }
    }
}

// 3. RENDER MODULE
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;
    if(name === 'press') {
        stage.innerHTML = `
            <div class="magazine-page">
                <div class="page-half">
                    <div class="luxury-logo" style="font-size:24px; margin-bottom:20px;">TONI 2.0</div>
                    <h1 class="mag-headline">${NCOS.press.title}</h1>
                </div>
                <div class="page-half"><h2 class="mag-headline" style="font-size:20px;">REPORTER'S DESK</h2><div class="mag-article">${NCOS.press.editorial}</div></div>
            </div>
            <div class="magazine-page"><div class="page-half"><h2 class="mag-headline" style="font-size:20px;">PARTNER</h2><div style="border:1px solid gold; padding:20px; text-align:center;"><div class="luxury-logo">${NCOS.press.sponsor}</div></div></div></div>`;
    } else {
        stage.innerHTML = `<div style="padding:40px;"><h2>MODUL: ${name.toUpperCase()}</h2></div>`;
    }
}

// 4. INTERVIEW
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    addMsg("TONI", "Coach, für welchen Verein scannen wir heute?");
}

function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value; if(!val) return;
    addMsg("YOU", val); input.value = "";
    if(step === 1) { NCOS.press.title = "MATCHDAY: " + val.toUpperCase(); addMsg("TONI", "Daten geladen. Wie ist die Stimmung?"); step = 2; }
    else if(step === 2) { NCOS.press.editorial = val; addMsg("TONI", "Wer ist der Sponsor?"); step = 3; }
    else if(step === 3) { NCOS.press.sponsor = val.toUpperCase(); addMsg("TONI", "Druckfertig!"); }
    loadModule('press');
}

function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) log.innerHTML += `<div class="ai-bubble"><b>${s}:</b><br>${t}</div>`;
}

// STARTUP
window.onload = () => {
    if(window.location.pathname.includes('dashboard.html')) {
        loadModule('press');
        checkHealth();
        setInterval(() => { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString(); }, 1000);
    }
};        btn.classList.toggle('active', btn.getAttribute('onclick').includes(name));
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
