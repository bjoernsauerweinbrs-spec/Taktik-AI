/* ==========================================================================
   TONI 2.0 | NCOS MASTER SCRIPT V44.0 - PROFESSIONAL JOURNALIST
   ========================================================================== */

const NCOS = {
    config: { 
        api: localStorage.getItem('TONI_API') || "", 
        ollama: localStorage.getItem('TONI_OLLAMA') || "http://localhost:11434" 
    },
    press: { 
        title: "OFFIZIELLES DOSSIER", 
        editorial: "Warten auf journalistische Auswertung...", 
        sponsor: "PARTNER"
    }
};

// --- 1. PROFESSIONAL VOICE ENGINE ---
function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel();
    
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.9; // Tiefer, seriöser
    msg.rate = 1.0;  // Standard-Sprechtempo für Seriosität
    
    const voices = window.speechSynthesis.getVoices();
    // Versuche eine ruhige, tiefe Stimme zu finden
    const proVoice = voices.find(v => v.name.includes('Yannick') || v.name.includes('Google Deutsch')) || voices[0];
    if(proVoice) msg.voice = proVoice;

    window.speechSynthesis.speak(msg);
}

// --- 2. NEURAL INTERFACE (OLLAMA JOURNALIST) ---
async function askOllama(prompt) {
    try {
        const res = await fetch(`${NCOS.config.ollama}/api/generate`, {
            method: 'POST',
            body: JSON.stringify({ 
                model: 'llama3', 
                prompt: `Du bist ein erfahrener Sportjournalist einer renommierten Fachzeitung. Dein Interviewpartner ist ein Profitrainer. Antworte förmlich, analytisch und direkt auf Deutsch. Vermeide Smalltalk. Aufgabe: ${prompt}`, 
                stream: false 
            })
        });
        const data = await res.json();
        return data.response;
    } catch (e) { 
        return "System-Hinweis: Die Verbindung zum Neural Core wurde unterbrochen. Bitte prüfen Sie die Verbindung."; 
    }
}

// --- 3. SERIÖSES INTERVIEW (BRANCHING LOGIC) ---
let step = 0;
function startInterview() {
    step = 1;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('interview-ui').classList.remove('hidden');
    
    const intro = "Guten Abend, Coach. Hier spricht Toni vom Press Bureau. Wir führen heute das Exklusiv-Interview für die Matchday-Sonderausgabe. Welcher Club steht im Zentrum unserer heutigen Analyse?";
    
    addMsg("TONI", intro);
    speak(intro);
}

async function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if(step === 1) {
        NCOS.press.title = "FOKUS: " + val.toUpperCase();
        addMsg("TONI", `<i>Initialisiere Deep-Search für ${val}...</i>`);
        
        const aiResponse = await askOllama(`Der Trainer wählt den Verein ${val}. Bestätige dies kurz und frage gezielt nach dem taktischen Matchplan für die kommende Partie.`);
        
        addMsg("TONI", aiResponse);
        speak(aiResponse);
        step = 2;
    } else if(step === 2) {
        NCOS.press.editorial = `TAKTIK-ANALYSE:\n${val}`;
        const aiResponse = await askOllama(`Der Trainer erläutert seinen Matchplan: ${val}. Analysiere dies kurz journalistisch und frage nach der Belastungssteuerung des Kaders.`);
        
        addMsg("TONI", aiResponse);
        speak(aiResponse);
        step = 3;
    } else if(step === 3) {
        NCOS.press.editorial += `\n\nBELASTUNGSSTEUERUNG:\n${val}`;
        const final = "Besten Dank für diese Einblicke, Coach. Das Dossier wird nun finalisiert und für den Druck aufbereitet. Wer besetzt heute die Premium-Sponsorenfläche auf der Rückseite?";
        addMsg("TONI", final);
        speak(final);
        step = 4;
    } else if(step === 4) {
        NCOS.press.sponsor = val.toUpperCase();
        addMsg("TONI", "Das Dossier ist fertiggestellt. Alle Vektoren wurden in das Layout übertragen.");
        speak("Das Dossier ist fertiggestellt.");
    }
    loadModule('press');
}

// --- 4. SYSTEM-LOGIK (STABIL) ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;
    if(name === 'press') {
        stage.innerHTML = `
            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size:20px; margin-bottom:20px;">TONI 2.0 // BUREAU</div>
                        <h1 class="mag-headline" id="mag-title" style="font-size:38px;">${NCOS.press.title}</h1>
                        <p style="color:#888; font-size:10px; font-family:'Orbitron';">Sonderausgabe // Feb 2026</p>
                    </div>
                    <div class
