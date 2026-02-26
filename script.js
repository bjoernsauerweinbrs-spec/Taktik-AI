let NCOS = {
    press: { title: "BEREIT", editorial: "Warten...", sponsor: "PARTNER" }
};

// 1. BOOT & SETUP
function saveAndBoot() {
    localStorage.setItem('TONI_API', document.getElementById('api-key').value);
    if(document.getElementById('passcode').value === "2026") {
        window.location.href = "dashboard.html";
    }
}

// 2. MODULE LOADING (Ensures nothing disappears)
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if (name === 'press') renderPress(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>MODUL: ${name.toUpperCase()}</h2><p>Online.</p></div>`;
}

// 3. MAGAZINE RENDERER (LIVE)
function renderPress(target) {
    target.innerHTML = `
        <div class="magazine-page">
            <div class="page-half">
                <div class="luxury-logo" style="font-size:24px;">TONI 2.0</div>
                <h1 class="mag-headline" id="mag-title">${NCOS.press.title}</h1>
            </div>
            <div class="page-half">
                <h2 style="font-family:'Playfair Display';">EDITORIAL</h2>
                <div id="mag-edit" style="margin-top:10px;">${NCOS.press.editorial}</div>
            </div>
        </div>
        <div class="magazine-page">
            <div class="page-half">
                <h2 style="font-family:'Playfair Display';">PARTNER</h2>
                <div id="mag-sponsor" style="border:1px solid gold; padding:20px; text-align:center;">${NCOS.press.sponsor}</div>
            </div>
        </div>
    `;
}

// 4. INTERVIEW LOGIC (INTELLIGENT)
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    addMsg("TONI", "Coach, welcher Verein steht heute im Fokus?");
}

function processInterview() {
    const val = document.getElementById('ai-input').value;
    if(!val) return;
    addMsg("YOU", val);
    document.getElementById('ai-input').value = "";

    if(step === 1) {
        NCOS.press.title = "MATCHDAY: " + val.toUpperCase();
        addMsg("TONI", `Recherche für ${val} läuft... Wie ist die Stimmung?`);
        step = 2;
    } else if(step === 2) {
        NCOS.press.editorial = val;
        addMsg("TONI", "Verstanden. Wer ist der Sponsor?");
        step = 3;
    } else if(step === 3) {
        NCOS.press.sponsor = val;
        addMsg("TONI", "Heft wird gedruckt!");
    }
    loadModule('press'); // Refresh Zeitung
}

function addMsg(s, t) {
    document.getElementById('ai-log').innerHTML += `<div class="ai-bubble"><b>${s}:</b><br>${t}</div>`;
}

if(window.location.pathname.includes('dashboard')) {
    window.onload = () => {
        loadModule('press');
        setInterval(() => { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString(); }, 1000);
    };
}
