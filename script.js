const eliteStore = {
    config: { passkey: "1234" },
    mgmt: { budget: 4850000, morale: 88 },
    players: [
        { id: 1, name: "NEUER", pos: "TW", rating: 89, stats: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 } },
        { id: 10, name: "KANE", pos: "ST", rating: 90, stats: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 } }
    ]
};

function systemBootSequence() {
    const val = document.getElementById('passkey').value;
    if (val === eliteStore.config.passkey) {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('main-interface').classList.remove('hidden');
        initDashboard();
    } else { alert("FALSCHER KEY."); }
}

function initDashboard() {
    document.getElementById('kpi-budget').innerText = eliteStore.mgmt.budget.toLocaleString() + " €";
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
    switchModule('kader');
}

function switchModule(mod) {
    const stage = document.getElementById('module-content');
    if (mod === 'kader') {
        stage.innerHTML = `
            <div class="kader-grid">
                ${eliteStore.players.map(p => `
                    <div class="fifa-card">
                        <div class="card-inner">
                            <div class="card-rating">${p.rating}</div>
                            <div class="card-name">${p.name}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        stage.innerHTML = `<div style="padding:20px;">MODUL ${mod.toUpperCase()} AKTIV.</div>`;
    }
}
