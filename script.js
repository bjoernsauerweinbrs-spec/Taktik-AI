/* TONI 2.0 | NCOS LOGIC V36.0 */

let NCOS = {
    press: { title: "OFFICIAL NEWS", editorial: "Warten auf Redaktionsschluss...", sponsor: "PARTNER GESUCHT" }
};

// 1. SETUP & AUTH
function saveAndBoot() {
    localStorage.setItem('TONI_API', document.getElementById('api-key').value);
    localStorage.setItem('TONI_OLLAMA', document.getElementById('ollama-url').value);
    if(document.getElementById('passcode').value === "2026") {
        window.location.href = "dashboard.html";
    } else {
        alert("ACCESS DENIED");
    }
}

// 2. MODULAR CONTENT ENGINE
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        const mod = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', mod === name);
    });

    if (name === 'press') renderPress(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline" style="color:#fff; border-color:#222;">MODUL: ${name.toUpperCase()}</h2><p style="color:#666; font-family:'Orbitron';">Neural Sync aktiv.</p></div>`;
}

// 3. MAGAZINE RENDERER (LIVE UPDATE)
function renderPress(target) {
    target.innerHTML = `
        <div class="magazine-page">
            <div class="page-half">
                <div class="luxury-logo" style="font-size:24px; margin-bottom:20px;">TONI 2.0</div>
                <h1 class="mag-headline" id="mag-title">${NCOS.press.title}</h1>
                <p style="color:#888; font-family:'Orbitron'; font-size:10px;">NR. 01 / FEBRUAR 2026</p>
            </div>
            <div class="page-half">
                <h2 class="mag-headline" style="font-size:24px;">REPORTER'S DESK</h2>
                <div class="mag-article" id="mag-editorial">${NCOS.press.editorial}</div>
            </div>
        </div>
        <div class="magazine-page">
            <div class="page-half">
                <h2 class="mag-headline" style="font-size:24px;">PARTNER</h2>
                <div id="mag-sponsor" style="border:2px solid gold; padding:30px; text-align:center; margin-top:20px;">
                    <div class="luxury-logo" style="font-size:24px;">${NCOS.press.sponsor}</div>
                </div>
            </div>
        </div>
    `;
    adjustHeadline();
}

function adjustHeadline() {
    const el = document.getElementById('mag-title');
    if (el && el.innerText.length > 15) el.style.fontSize = "38px";
    if (el && el.innerText.length > 25) el.style.fontSize = "28px";
}

// 4. INTERVIEW LOGIC
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    addMsg("TONI", "Coach, ich bin im Netz. Welchen Verein nehmen wir heute ins Visier?");
}

function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if(step === 1) {
        NCOS.press.title = "MATCHDAY: " + val.toUpperCase();
        addMsg("TONI", `Daten für ${val} geladen. Wie ist die Stimmung in der Kabine?`);
        step = 2;
    } else if(step === 2) {
        NCOS.press.editorial = `Exklusiv-Bericht: Der Trainer zur Lage der Mannschaft: "${val}".`;
        addMsg("TONI", "Verstanden. Wer ist unser Hauptsponsor für die Rückseite?");
        step = 3;
    } else if(step === 3) {
        NCOS.press.sponsor = val.toUpperCase();
        addMsg("TONI", "Das Heft ist fertig. Die Druckmaschine läuft!");
    }
    loadModule('press'); // Sofortiger Refresh der Zeitung
}

function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) {
        log.innerHTML += `<div class="ai-bubble"><b>${s}:</b><br>${t}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}

// 5. GLOBAL INITIALIZATION
if(window.location.pathname.includes('dashboard.html')) {
    window.onload = () => {
        loadModule('press');
        setInterval(() => { 
            const clock = document.getElementById('clock-display');
            if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE'); 
        }, 1000);
    };
}
