/* ==========================================================================
   TONI 2.0 | NCOS MASTER SCRIPT V47.1 - COMPLETE INTEGRATED
   ========================================================================== */

let NCOS = {
    state: { activeModule: 'press', isVoice: false },
    config: { 
        api: localStorage.getItem('TONI_API') || "", 
        ollama: localStorage.getItem('TONI_OLLAMA') || "http://localhost:11434" 
    },
    currentClub: { name: "SG HEENES/KALKOBES", squad: [] },
    press: { title: "OFFIZIELLES DOSSIER", editorial: "Warten auf Analyse...", sponsor: "PARTNER GESUCHT" }
};

// --- 1. VOICE & NEURAL ENGINE ---
function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.9;
    window.speechSynthesis.speak(msg);
}

async function askOllama(prompt) {
    try {
        const res = await fetch(`${NCOS.config.ollama}/api/generate`, {
            method: 'POST',
            body: JSON.stringify({ 
                model: 'llama3', 
                prompt: `Du bist ein erfahrener Sportjournalist. Antworte förmlich und direkt. Thema: ${prompt}`, 
                stream: false 
            })
        });
        const data = await res.json();
        return data.response;
    } catch (e) { return "System-Hinweis: Neural Core nicht erreichbar."; }
}

// --- 2. INTERVIEW ENGINE ---
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    const intro = "Guten Abend, Coach. Hier spricht Toni vom Bureau. Welchen Club analysieren wir heute?";
    addMsg("TONI", intro); speak(intro);
}

async function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if(step === 1) {
        NCOS.currentClub.name = val;
        NCOS.press.title = "FOKUS: " + val.toUpperCase();
        addMsg("TONI", `Dossier für ${val} angelegt. Wer sind Ihre 3 Schlüsselspieler? (Format: Name-POS, Name-POS)`);
        step = 10;
    } else if(step === 10) {
        const entries = val.split(',').map(e => e.trim());
        NCOS.currentClub.squad = [];
        entries.forEach(e => {
            const [name, pos] = e.split('-');
            NCOS.currentClub.squad.push({ 
                name: name || "Spieler", pos: pos || "ZM", rat: 75, 
                stats: { pac: 70, sho: 65, pas: 72, dri: 68 } 
            });
        });
        addMsg("TONI", "Kader-Vektoren generiert. Wie ist die aktuelle Moral im Team?");
        step = 2;
    } else if(step === 2) {
        const aiResponse = await askOllama(`Der Trainer sagt zur Stimmung: ${val}. Schreibe einen journalistischen Leitartikel-Satz.`);
        NCOS.press.editorial = aiResponse;
        addMsg("TONI", "Verstanden. Wer ist der Partner für die Rückseite?");
        step = 3;
    } else if(step === 3) {
        NCOS.press.sponsor = val.toUpperCase();
        addMsg("TONI", "Das Dossier ist fertiggestellt.");
    }
    loadModule(NCOS.state.activeModule);
}

// --- 3. MODULE ROUTER & RENDERERS ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;
    NCOS.state.activeModule = name;

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(name));
    });

    if(name === 'press') renderPress(stage);
    else if(name === 'kader') renderKader(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">${name.toUpperCase()}</h2><p>Online.</p></div>`;
}

function renderPress(target) {
    target.innerHTML = `
        <div class="magazine-page">
            <div class="page-half">
                <div class="luxury-logo" style="font-size:24px;">TONI 2.0</div>
                <h1 class="mag-headline">${NCOS.press.title}</h1>
            </div>
            <div class="page-half">
                <h2 class="mag-headline" style="font-size:20px;">LEITARTIKEL</h2>
                <div class="mag-article">${NCOS.press.editorial}</div>
            </div>
        </div>
        <div class="magazine-page">
            <div class="page-half">
                <h2 class="mag-headline" style="font-size:20px;">PARTNER</h2>
                <div style="border:2px solid gold; padding:20px; text-align:center; margin-top:20px;">
                    <div class="luxury-logo" style="font-size:24px;">${NCOS.press.sponsor}</div>
                </div>
            </div>
        </div>`;
}

function renderKader(target) {
    let cards = NCOS.currentClub.squad.map(p => `
        <div class="fifa-card">
            <div class="card-rating">${p.rat}</div>
            <div class="card-pos">${p.pos}</div>
            <div class="card-name">${p.name}</div>
            <div class="card-stats"><div>PAC ${p.stats.pac}</div><div>PAS ${p.stats.pas}</div></div>
        </div>`).join('');
    
    target.innerHTML = `
        <div style="padding:40px; width:100%;">
            <h2 class="mag-headline">KABINE // ${NCOS.currentClub.name}</h2>
            <div class="kader-grid">${cards || "<p>Kein Kader geladen.</p>"}</div>
        </div>`;
}

// --- 4. SYSTEM & HELPERS ---
async function checkHealth() {
    const lamp = document.getElementById('lamp-ollama');
    if(!lamp) return;
    try {
        const res = await fetch(`${NCOS.config.ollama}/api/tags`);
        lamp.className = res.ok ? "lamp online" : "lamp offline";
    } catch { lamp.className = "lamp offline"; }
}

function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) { log.innerHTML += `<div class="ai-bubble"><b>${s}:</b><br>${t}</div>`; log.scrollTop = log.scrollHeight; }
}

function saveAndBoot() {
    localStorage.setItem('TONI_API', document.getElementById('api-key').value);
    localStorage.setItem('TONI_OLLAMA', document.getElementById('ollama-url').value);
    if(document.getElementById('passcode').value === "2026") window.location.href = "dashboard.html";
}

window.onload = () => {
    if(window.location.pathname.includes('dashboard.html')) {
        loadModule('press');
        checkHealth();
        setInterval(checkHealth, 5000);
        setInterval(() => { 
            const c = document.getElementById('clock-display');
            if(c) c.innerText = new Date().toLocaleTimeString('de-DE'); 
        }, 1000);
    }
};
