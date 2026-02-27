/* ==========================================================================
   TONI 2.0 | NCOS MASTER SCRIPT V46.0 - UNIVERSAL SCOUT
   ========================================================================== */

let NCOS = {
    currentClub: { name: "", type: "unknown", squad: [] },
    press: { title: "DOKUMENTATION", editorial: "", sponsor: "PARTNER" }
};

// 1. DYNAMISCHE DATEN-LOGIK
async function searchClubData(clubName) {
    addMsg("TONI", `<i>Initialisiere Global Search für ${clubName}...</i>`);
    
    // Simulation: Suche in Profi-Datenbanken
    const isPro = false; // Im Fall von Heenes/Kalkobes false

    if(isPro) {
        return { type: "pro", data: { /* API DATA */ } };
    } else {
        // AMATEUR MODUS
        return { 
            type: "amateur", 
            msg: "Coach, für diesen Verein liegen keine globalen Profi-Daten vor. Wir wechseln in den manuellen Scouting-Modus für das FIFA-Kader-Design." 
        };
    }
}

// 2. INTERVIEW LOGIC (Smarter & Analytischer)
let step = 0;

async function processInterview() {
    const input = document.getElementById('ai-input');
    const val = input.value.trim(); if(!val) return;
    addMsg("YOU", val); input.value = "";

    if(step === 0) {
        NCOS.currentClub.name = val;
        const result = await searchClubData(val);
        
        if(result.type === "amateur") {
            addMsg("TONI", result.msg);
            speak(result.msg);
            addMsg("TONI", "Wer sind Ihre 3 wichtigsten Schlüsselspieler und deren Positionen? (Beispiel: Müller-ST, Meier-ZM, Schulze-IV)");
            step = 10; // Wechsel in Scouting-Zweig
        }
    } 
    else if(step === 10) {
        // Spieler-Input verarbeiten: "Müller-ST, Meier-ZM"
        const players = val.split(',').map(p => p.trim());
        players.forEach(p => {
            const [name, pos] = p.split('-');
            NCOS.currentClub.squad.push({ name: name || "Spieler", pos: pos || "??", rat: 75 });
        });
        
        addMsg("TONI", "Kader-Vektoren für die Kabine generiert. Kommen wir zur Zeitung: Wie bewerten Sie die aktuelle Moral?");
        speak("Kader generiert. Wie bewerten Sie die aktuelle Moral?");
        step = 2; // Zurück zum Zeitungs-Workflow
    }
    // ... restliche Zeitungs-Steps (Taktik, Sponsor) wie gehabt
    loadModule(NCOS.state.activeModule);
}

// 3. FIFA-CARD RENDERER
function renderKader(target) {
    if(NCOS.currentClub.squad.length === 0) {
        target.innerHTML = `<div style="padding:40px;"><h2 class="mag-headline">KABINE</h2><p>Keine Kaderdaten vorhanden. Starten Sie das Scouting-Interview.</p></div>`;
        return;
    }

    let cardsHTML = NCOS.currentClub.squad.map(player => `
        <div class="fifa-card">
            <div class="card-rating">${player.rat}</div>
            <div class="card-pos">${player.pos}</div>
            <div class="card-pic"></div>
            <div class="card-name">${player.name}</div>
            <div class="card-stats">
                <div>PAC 70</div><div>SHO 65</div>
                <div>PAS 72</div><div>DRI 68</div>
            </div>
        </div>
    `).join('');

    target.innerHTML = `
        <div style="padding:40px;">
            <h2 class="mag-headline">MANNSCHAFTSKABINE // ${NCOS.currentClub.name}</h2>
            <div class="kader-grid">${cardsHTML}</div>
        </div>
    `;
}

// 4. MODULE ROUTER UPDATE
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    if(!stage) return;
    NCOS.state.activeModule = name;

    if(name === 'press') renderPress(stage);
    else if(name === 'kader') renderKader(stage);
    else stage.innerHTML = `<div style="padding:40px;"><h2>${name.toUpperCase()}</h2></div>`;
}
