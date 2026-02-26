/* ==========================================================================
   TONI 2.0 | NCOS MASTER SCRIPT V45.0 - ELITE EDITOR
   ========================================================================== */

let NCOS = {
    config: { 
        api: localStorage.getItem('TONI_API') || "", 
        ollama: localStorage.getItem('TONI_OLLAMA') || "http://localhost:11434" 
    },
    press: { 
        title: "OFFIZIELLES DOSSIER", 
        editorial: "Warten auf journalistische Analyse...", 
        sponsor: "PARTNER GESUCHT",
        club: ""
    }
};

// --- 1. PROFESSIONAL ANALYST VOICE ---
function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.85; // Tieferer, autoritärer Ton
    msg.rate = 1.0;
    window.speechSynthesis.speak(msg);
}

// --- 2. THE NEURAL EDITOR (OLLAMA) ---
async function askOllama(task, input) {
    const prompt = `Du bist Chefredakteur eines Sportmagazins. 
    Aufgabe: ${task}. 
    Trainer-Input: "${input}". 
    Schreibe 2-3 hochprofessionelle, sachliche Sätze für den Leitartikel. Keine Floskeln.`;

    try {
        const res = await fetch(`${NCOS.config.ollama}/api/generate`, {
            method: 'POST',
            body: JSON.stringify({ model: 'llama3', prompt: prompt, stream: false })
        });
        const data = await res.json();
        return data.response;
    } catch (e) {
        return `Analyse zu: ${input}`;
    }
}

// --- 3. THE CONTROLLED INTERVIEW (LINEAR) ---
let step = 0;

function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    
    const intro = "Guten Abend, Coach. Das Press Bureau ist bereit. Welcher Club steht heute im Zentrum unserer Analyse?";
    addMsg("TONI", intro);
    speak(intro);
}

async function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if(step === 1) {
        NCOS.press.club = val;
        NCOS.press.title = "FOKUS: " + val.toUpperCase();
        addMsg("TONI", `Dossier für ${val} wird angelegt. Coach, wie bewerten Sie die aktuelle tabellarische Situation und die Moral?`);
        speak("Wie bewerten Sie die tabellarische Situation?");
        step = 2;
    } 
    else if(step === 2) {
        addMsg("TONI", "<i>Journalistische Analyse läuft...</i>");
        const summary = await askOllama("Analysiere die aktuelle Stimmungslage", val);
        NCOS.press.editorial = summary;
        
        addMsg("TONI", "Verstanden. Kommen wir zum Sportlichen: Welche taktische Marschroute geben Sie für das kommende Match vor?");
        speak("Welche taktische Marschroute geben Sie vor?");
        step = 3;
    } 
    else if(step === 3) {
        addMsg("TONI", "<i>Taktik-Vektoren werden kompiliert...</i>");
        const tactics = await askOllama("Fasse den taktischen Matchplan zusammen", val);
        NCOS.press.editorial += "\n\n" + tactics;
        
        addMsg("TONI", "Präzise Vorgabe. Wer besetzt heute die exklusive Partner-Fläche auf der Rückseite?");
        speak("Wer besetzt die Partner-Fläche?");
        step = 4;
    } 
    else if(step === 4) {
        NCOS.press.sponsor = val.toUpperCase();
        addMsg("TONI", "Das Dossier ist fertiggestellt und für den Druck aufbereitet.");
        speak("Das Dossier ist fertiggestellt.");
        step = 5;
    }
    
    loadModule('press'); // Update der Zeitung nach jedem Schritt
}

// --- 4. RENDER ENGINE (FIXED STAGE) ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;

    if(name === 'press') {
        stage.innerHTML = `
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size:18px;">TONI 2.0 // BUREAU</div>
                        <h1 class="mag-headline" style="font-size:34px; margin-top:20px;">${NCOS.press.title}</h1>
                        <p style="color:#888; font-family:'Orbitron'; font-size:10px;">NR. 01 / SAISON 2026</p>
                        <div style="margin-top:auto; font-family:'Orbitron'; font-size:9px; color:#ccc;">
                            REDAKTION: NEURAL CORE V.45
                        </div>
                    </div>
                    <div class="page-half" style="border-left:1px solid #eee;">
                        <h2 class="mag-headline" style="font-size:20px; border-bottom-width:2px;">LEITARTIKEL</h2>
                        <div class="mag-article" style="white-space: pre-wrap; font-size:12px; font-style: italic; line-height:1.6;">${NCOS.press.editorial}</div>
                    </div>
                </div>
                <div class="magazine-page">
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px; border-bottom-width:2px;">PARTNER</h2>
                        <div style="border:1px solid #000; padding:40px; text-align:center; margin-top:40px;">
                            <div class="luxury-logo" style="font-size:32px;">${NCOS.press.sponsor}</div>
                        </div>
                    </div>
                </div>
            </div>`;
    } else {
        stage.innerHTML = `<div style="padding:40px;"><h2>${name.toUpperCase()}</h2><p>Neural Sync online.</p></div>`;
    }
}

// Hilfsfunktionen (CheckHealth, addMsg etc.)
function addMsg(s, t) {
    const log = document.getElementById('ai-log');
    if(log) {
        log.innerHTML += `<div class="ai-bubble ${s==='TONI'?'toni':''}"><b>${s}:</b><br>${t}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}

window.onload = () => {
    if(window.location.pathname.includes('dashboard.html')) {
        loadModule('press');
        setInterval(() => { 
            const clock = document.getElementById('clock-display');
            if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE'); 
        }, 1000);
    }
};
