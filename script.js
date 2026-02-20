/* --- DATENBANK (Das Gedächtnis) --- */
const teamData = [
    { id: 1, name: "Müller", pos: "ST", rating: 88, stats: { pac: 85, sho: 90, pas: 75, dri: 82, def: 40, phy: 80 } },
    { id: 2, name: "Schmidt", pos: "TW", rating: 91, stats: { pac: 88, sho: 50, pas: 60, dri: 55, def: 92, phy: 85 } },
    { id: 3, name: "Schneider", pos: "ZDM", rating: 84, stats: { pac: 70, sho: 65, pas: 88, dri: 75, def: 85, phy: 82 } },
    { id: 4, name: "Weber", pos: "IV", rating: 82, stats: { pac: 68, sho: 40, pas: 60, dri: 55, def: 88, phy: 90 } },
    { id: 5, name: "Fischer", pos: "LF", rating: 86, stats: { pac: 92, sho: 80, pas: 78, dri: 88, def: 45, phy: 60 } },
    { id: 6, name: "Meyer", pos: "RV", rating: 79, stats: { pac: 85, sho: 55, pas: 72, dri: 74, def: 78, phy: 75 } },
];

/* --- NAVIGATION LOGIK --- */
function showModule(moduleId) {
    // Alle verstecken
    document.querySelectorAll('.module-section').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Gewähltes zeigen
    document.getElementById(moduleId).classList.add('active');
    
    // Button markieren (einfache Logik)
    const btn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(moduleId));
    if(btn) btn.classList.add('active');
}

/* --- FIFA KARTEN LOGIK --- */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    container.innerHTML = '<div class="card-grid" id="card-grid"></div>';
    const grid = document.getElementById('card-grid');

    teamData.forEach(player => {
        grid.innerHTML += `
            <div class="fut-card" onclick="playerClick(${player.id})">
                <div class="card-top">
                    <div class="card-rating">${player.rating}</div>
                    <div class="card-position">${player.pos}</div>
                </div>
                <div class="card-image"></div>
                <div class="card-name">${player.name}</div>
                <div class="card-stats">
                    <div class="stat"><span class="stat-value">${player.stats.pac}</span> TEM</div>
                    <div class="stat"><span class="stat-value">${player.stats.sho}</span> SCH</div>
                    <div class="stat"><span class="stat-value">${player.stats.pas}</span> PAS</div>
                    <div class="stat"><span class="stat-value">${player.stats.dri}</span> DRI</div>
                    <div class="stat"><span class="stat-value">${player.stats.def}</span> DEF</div>
                    <div class="stat"><span class="stat-value">${player.stats.phy}</span> PHY</div>
                </div>
            </div>
        `;
    });
}

function playerClick(id) {
    const p = teamData.find(x => x.id === id);
    addMessageToChat(`Das ist <b>${p.name}</b> (${p.pos}). Aktuelle Formstärke: ${p.rating}.`, 'toni');
}

/* --- CHAT LOGIK --- */
const input = document.getElementById('text-input');
const chatHistory = document.getElementById('chat-history');

input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && input.value.trim() !== "") {
        addMessageToChat(input.value, 'user');
        input.value = '';
        
        // Simu-Antwort Toni
        setTimeout(() => {
            addMessageToChat("Verstanden. Ich speichere das in der Datenbank.", 'toni');
        }, 800);
    }
});

function addMessageToChat(text, sender) {
    const div = document.createElement('div');
    div.className = `message msg-${sender}`;
    div.innerHTML = text;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Start beim Laden
renderLockerRoom();
