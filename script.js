/* ==========================================================================
   TONI 2.0 | NCOS MASTER SCRIPT V47.0 - VISUAL SCOUT
   ========================================================================== */

// Erweitere das Kader-Objekt um Bild-Support
NCOS.currentClub = { 
    name: "", 
    squad: [] 
};

// 1. DYNAMISCHE KADER-ERSTELLUNG
function addPlayerToSquad(name, pos, rating = 75, photoUrl = null) {
    NCOS.currentClub.squad.push({
        name: name,
        pos: pos,
        rat: rating,
        photo: photoUrl,
        stats: {
            pac: Math.floor(Math.random() * (90 - 60) + 60),
            sho: Math.floor(Math.random() * (90 - 50) + 50),
            pas: Math.floor(Math.random() * (90 - 60) + 60),
            dri: Math.floor(Math.random() * (90 - 60) + 60)
        }
    });
}

// 2. KADER RENDERER (MIT FOTO-CHECK)
function renderKader(target) {
    if(NCOS.currentClub.squad.length === 0) {
        target.innerHTML = `
            <div style="padding:40px;">
                <h2 class="mag-headline">KABINE</h2>
                <p style="color:#666;">Keine Kaderdaten aktiv. Bitte führen Sie das Scouting-Interview durch.</p>
            </div>`;
        return;
    }

    let cardsHTML = NCOS.currentClub.squad.map(player => {
        // Falls kein Foto da ist, nutzen wir ein Icon
        const photoContent = player.photo 
            ? `<div class="card-pic" style="background-image: url('${player.photo}')"></div>`
            : `<div class="card-pic-placeholder"><i class="fa-solid fa-user"></i></div>`;

        return `
        <div class="fifa-card">
            <div class="card-rating">${player.rat}</div>
            <div class="card-pos">${player.pos}</div>
            ${photoContent}
            <div class="card-name">${player.name}</div>
            <div class="card-stats">
                <div>PAC ${player.stats.pac}</div><div>SHO ${player.stats.sho}</div>
                <div>PAS ${player.stats.pas}</div><div>DRI ${player.stats.dri}</div>
            </div>
        </div>`;
    }).join('');

    target.innerHTML = `
        <div style="padding:40px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <h2 class="mag-headline" style="margin-bottom:0; border:none;">MANNSCHAFTSKABINE // ${NCOS.currentClub.name}</h2>
                <div style="font-family:'Orbitron'; font-size:10px; color:var(--neon-gold);">KADER-STATUS: BEREIT</div>
            </div>
            <div class="kader-grid">${cardsHTML}</div>
        </div>
    `;
}

// 3. ERWEITERTE INTERVIEW-LOGIK FÜR AMATEUR-VEREINE
// (In der processInterview() Funktion bei step 10 anzupassen)
async function processInterview() {
    // ... bisherige Logik ...
    
    if(step === 10) {
        // Spieler-Input verarbeiten: "Sauerwein-ST, Wagner-ZM"
        const entries = val.split(',').map(e => e.trim());
        entries.forEach(entry => {
            const [name, pos] = entry.split('-');
            addPlayerToSquad(name || "Unbekannt", pos || "??");
        });
        
        const msg = `Ich habe ${entries.length} Akteure für die Kabine erfasst und ihre Vektoren auf FIFA-Niveau berechnet. Sollen wir nun mit der taktischen Analyse fortfahren?`;
        addMsg("TONI", msg);
        speak(msg);
        step = 2; // Zurück zum Haupt-Flow
    }
    
    // ...
}
