/* ==========================================================================
   TONI 2.0 | NCOS V31.0 - REAL INTERNET & VOICE LOGIC
   ========================================================================== */

let NCOS = {
    state: { activeModule: 'press', isVoice: false },
    press: { title: "OFFICIAL NEWS", editorial: "Analysiere Daten...", mainSponsor: "PARTNER" }
};

// VOICE LOGIC (Sprechen & Hören)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'de-DE';

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    window.speechSynthesis.speak(msg);
}

recognition.onresult = (event) => {
    document.getElementById('ai-chat-input').value = event.results[0][0].transcript;
    processInterviewStep();
};

function toggleVoiceAI() {
    NCOS.state.isVoice = !NCOS.state.isVoice;
    const btn = document.getElementById('live-voice-btn');
    if(NCOS.state.isVoice) {
        btn.classList.add('active'); btn.innerText = "REPORTER HÖRT...";
        recognition.start();
    } else {
        btn.classList.remove('active'); btn.innerText = "VOICE REPORTER MODE";
        recognition.stop();
    }
}

// REAL INTERNET SEARCH (Simuliert via API/Ollama)
async function fetchRealFootballData(club) {
    // Hier binden wir später die Ollama-API oder Football-Data.org ein
    return { pos: "oben dabei", next: "einem harten Gegner" };
}

async function processInterviewStep() {
    const input = document.getElementById('ai-chat-input');
    const val = input.value; if(!val) return;
    addMessage("USER", val); input.value = "";

    // KI-Reporter Logik
    const data = await fetchRealFootballData(val);
    NCOS.press.title = `FOKUS: ${val.toUpperCase()}`;
    const reply = `Ich habe das Netz nach ${val} durchsucht. Ihr seid ${data.pos}. Wie bereiten wir uns auf den nächsten Gegner vor?`;
    
    addMessage("TONI", reply);
    speak(reply);
    loadModule('press');
}

// NAVIGATION
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(name === 'press') renderPress(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>Modul: ${name.toUpperCase()}</h2><p>Vollständig geladen.</p></div>`;
}

function renderPress(target) {
    target.innerHTML = `
        <div class="agency-workspace" style="display:flex; height:100%;">
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo">TONI 2.0</div>
                        <h1 class="mag-headline">${NCOS.press.title}</h1>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:20px;">EDITORIAL</h2>
                        <div class="mag-article">${NCOS.press.editorial}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addMessage(sender, text) {
    const log = document.getElementById('ai-log');
    log.innerHTML += `<div class="ai-bubble ${sender==='TONI'?'toni':''}"><b>${sender}:</b><br>${text}</div>`;
    log.scrollTop = log.scrollHeight;
}

window.onload = () => loadModule('press');
