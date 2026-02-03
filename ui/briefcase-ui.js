window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },

    async switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const target = document.getElementById('active-content');
        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            this.renderSquadList();
        } else if (sektor === 'orga') {
            target.innerHTML = `
                <h3>🏢 GESCHÄFTSZIMMER</h3>
                <p style="font-size:12px; color:var(--data-cyan);">STADIONZEITUNG & ORGANISATION</p>
                <textarea id="stadion-notes" class="orga-box" style="width:100%; height:300px; margin-top:15px;"></textarea>
                <button onclick="BriefcaseUI.saveOrga()" class="action-btn" style="margin-top:10px;">NOTIZ SPEICHERN</button>
            `;
            const saved = localStorage.getItem('toni_orga_notes');
            if(saved) document.getElementById('stadion-notes').value = saved;
        }
    },

    renderSquadList() {
        const target = document.getElementById('active-content');
        let players = JSON.parse(localStorage.getItem('toni_players')) || [
            {id: 1, name: "David Luiz", pos: "IV", pac: 70, sho: 65, pas: 80, dri: 72, def: 85, phy: 88},
            {id: 2, name: "Neuer Spieler", pos: "ST", pac: 50, sho: 50, pas: 50, dri: 50, def: 50, phy: 50}
        ];

        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3>👟 SPORTTASCHE // KADER</h3>
                <button onclick="BriefcaseUI.addPlayerPrompt()" class="action-btn" style="background:var(--data-cyan)">+ SPIELER HINZUFÜGEN</button>
            </div>
            <div class="player-grid-view">`;
        
        players.forEach(p => {
            html += `
                <div class="player-card red-border">
                    <div style="flex:1;" onclick="BriefcaseUI.openSetcard(${p.id})"><b>${p.name}</b> (${p.pos})</div>
                    <button onclick="BriefcaseUI.removePlayer(${p.id})" style="background:none; border:none; color:red; cursor:pointer;">✖</button>
                </div>`;
        });
        html += `</div>`;
        target.innerHTML = html;
    },

    addPlayerPrompt() {
        const name = prompt("Name des Spielers:");
        if(!name) return;
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({id: Date.now(), name: name, pos: "ZDM", pac: 50, sho: 50, pas: 50, dri: 50, def: 50, phy: 50});
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderSquadList();
    },

    removePlayer(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players = players.filter(p => p.id !== id);
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderSquadList();
    },

    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(player => player.id === id);
        const target = document.getElementById('active-content');
        
        // Berechnung des Gesamtwerts (OVR)
        const ovr = Math.round((p.pac + p.sho + p.pas + p.dri + p.def + p.phy) / 6);

        target.innerHTML = `
            <button onclick="BriefcaseUI.switchSektor('sport')" class="back-btn">← ZURÜCK</button>
            <div class="fifa-card-container">
                <div class="fifa-card gold">
                    <div class="card-inner">
                        <div class="card-rating" id="display-ovr">${ovr}</div>
                        <div class="card-pos">${p.pos}</div>
                        <div class="card-pic">👤</div>
                        <div class="card-name">${p.name.toUpperCase()}</div>
                        <div class="card-stats">
                            <div><span id="val-pac">${p.pac}</span> PAC</div><div><span id="val-sho">${p.sho}</span> SHO</div>
                            <div><span id="val-pas">${p.pas}</span> PAS</div><div><span id="val-dri">${p.dri}</span> DRI</div>
                            <div><span id="val-def">${p.def}</span> DEF</div><div><span id="val-phy">${p.phy}</span> PHY</div>
                        </div>
                    </div>
                </div>
                <div class="card-controls">
                    <h3>WERTE BEARBEITEN</h3>
                    <div class="edit-grid">
                        ${['pac','sho','pas','dri','def','phy'].map(stat => `
                            <label>${stat.toUpperCase()}</label>
                            <input type="number" value="${p[stat]}" min="1" max="99" 
                                   onchange="BriefcaseUI.updateStat(${p.id}, '${stat}', this.value)">
                        `).join('')}
                    </div>
                    <label style="margin-top:20px;">ERNÄHRUNGSPLAN / NOTIZEN</label>
                    <textarea id="player-note-${p.id}" placeholder="Notizen...">${p.notes || ''}</textarea>
                    <button class="action-btn" style="width:100%; margin-top:10px;" onclick="BriefcaseUI.savePlayer(${p.id})">ÄNDERUNGEN SPEICHERN</button>
                </div>
            </div>
        `;
    },

    updateStat(id, stat, value) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        p[stat] = parseInt(value);
        localStorage.setItem('toni_players', JSON.stringify(players));
        
        // Live-Update des OVR auf der Karte
        const newOvr = Math.round((p.pac + p.sho + p.pas + p.dri + p.def + p.phy) / 6);
        document.getElementById('display-ovr').innerText = newOvr;
        document.getElementById(`val-${stat}`).innerText = value;
    },

    savePlayer(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        p.notes = document.getElementById(`player-note-${id}`).value;
        localStorage.setItem('toni_players', JSON.stringify(players));
        alert("Daten gespeichert!");
    },

    saveOrga() {
        const text = document.getElementById('stadion-notes').value;
        localStorage.setItem('toni_orga_notes', text);
        alert("Geschäftszimmer aktualisiert!");
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
