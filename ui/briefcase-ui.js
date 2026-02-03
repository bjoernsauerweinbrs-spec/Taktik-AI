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
            this.renderAnalysisCenter();
        } else if (sektor === 'orga') {
            this.renderOrga();
        }
    },

    // ANALYSEZENTRUM: Die zentrale Schnittstelle
    renderAnalysisCenter() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        // Berechnung Durchschnittswerte für das Team
        const avgOvr = players.length > 0 ? Math.round(players.reduce((acc, p) => acc + this.calcOvr(p), 0) / players.length) : 0;

        let html = `
            <div class="analysis-header">
                <div>
                    <h3>📊 ANALYSEZENTRUM</h3>
                    <p style="color:var(--data-cyan)">TEAM-STATUS: ${avgOvr} OVR | KADERGRÖSSE: ${players.length}</p>
                </div>
                <button onclick="BriefcaseUI.showAddPlayerForm()" class="action-btn">+ NEUER SPIELER</button>
            </div>
            
            <div id="dynamic-sub-content">
                <div class="player-grid-view">`;
        
        players.forEach(p => {
            const ovr = this.calcOvr(p);
            html += `
                <div class="player-card red-border">
                    <div style="flex:1" onclick="BriefcaseUI.openSetcard(${p.id})">
                        <span class="p-number">#${p.number}</span> 
                        <b>${p.name}</b> 
                        <span class="p-pos">${p.pos}</span>
                    </div>
                    <div class="p-ovr-small">${ovr}</div>
                    <button onclick="BriefcaseUI.removePlayer(${p.id})" class="delete-btn">✖</button>
                </div>`;
        });
        
        html += `</div></div>`;
        target.innerHTML = html;
    },

    calcOvr(p) {
        return Math.round((p.pac + p.sho + p.pas + p.dri + p.def + p.phy) / 6);
    },

    // FORMULAR FÜR NEUE SPIELER (Name, Nummer, Position)
    showAddPlayerForm() {
        const sub = document.getElementById('dynamic-sub-content');
        sub.innerHTML = `
            <div class="form-container">
                <h4>SPIELER-DATENSATZ ANLEGEN</h4>
                <div class="edit-grid">
                    <label>NAME</label><input type="text" id="new-name" placeholder="z.B. David Luiz">
                    <label>NUMMER</label><input type="number" id="new-number" placeholder="4">
                    <label>POSITION</label>
                    <select id="new-pos">
                        <option value="TW">Torwart</option><option value="IV">Innenverteidiger</option>
                        <option value="LV">Linksverteidiger</option><option value="RV">Rechtsverteidiger</option>
                        <option value="ZDM">Zentrales Mittelfeld</option><option value="ST">Stürmer</option>
                    </select>
                </div>
                <div style="margin-top:20px; display:flex; gap:10px;">
                    <button onclick="BriefcaseUI.saveNewPlayer()" class="action-btn">SPEICHERN</button>
                    <button onclick="BriefcaseUI.renderAnalysisCenter()" class="action-btn" style="background:#444">ABBRECHEN</button>
                </div>
            </div>
        `;
    },

    saveNewPlayer() {
        const name = document.getElementById('new-name').value;
        const number = document.getElementById('new-number').value;
        const pos = document.getElementById('new-pos').value;
        if(!name || !number) return alert("Bitte alle Felder füllen!");

        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({
            id: Date.now(), name, number, pos, 
            pac: 50, sho: 50, pas: 50, dri: 50, def: 50, phy: 50,
            notes: "", status: "Anwesend"
        });
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderAnalysisCenter();
    },

    removePlayer(id) {
        if(!confirm("Spieler wirklich löschen?")) return;
        let players = JSON.parse(localStorage.getItem('toni_players'));
        players = players.filter(p => p.id !== id);
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderAnalysisCenter();
    },

    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        const ovr = this.calcOvr(p);
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <button onclick="BriefcaseUI.renderAnalysisCenter()" class="back-btn">← ZURÜCK ZUR ANALYSE</button>
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
                    <h3>SETCARD BEARBEITEN #&nbsp;${p.number}</h3>
                    <div class="edit-grid">
                        ${['pac','sho','pas','dri','def','phy'].map(stat => `
                            <label>${stat.toUpperCase()}</label>
                            <input type="number" value="${p[stat]}" min="1" max="99" 
                                   onchange="BriefcaseUI.updateLiveStat(${p.id}, '${stat}', this.value)">
                        `).join('')}
                    </div>
                    <label style="margin-top:20px;">ERNÄHRUNG & FITNESS</label>
                    <textarea id="player-note-${p.id}" placeholder="Notizen...">${p.notes || ''}</textarea>
                    <button class="action-btn" style="width:100%; margin-top:10px;" onclick="BriefcaseUI.saveSetcard(${p.id})">DATEN SICHERN</button>
                </div>
            </div>
        `;
    },

    updateLiveStat(id, stat, value) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        p[stat] = parseInt(value);
        localStorage.setItem('toni_players', JSON.stringify(players));
        const newOvr = this.calcOvr(p);
        document.getElementById('display-ovr').innerText = newOvr;
        document.getElementById(`val-${stat}`).innerText = value;
    },

    saveSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        p.notes = document.getElementById(`player-note-${id}`).value;
        localStorage.setItem('toni_players', JSON.stringify(players));
        alert("Setcard für " + p.name + " gespeichert.");
    },

    renderOrga() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <h3>🏢 GESCHÄFTSZIMMER</h3>
            <textarea id="stadion-notes" class="orga-box" style="width:100%; height:350px; margin-top:15px;"></textarea>
            <button onclick="BriefcaseUI.saveOrga()" class="action-btn" style="margin-top:10px;">STADIONZEITUNG SPEICHERN</button>
        `;
        const saved = localStorage.getItem('toni_orga_notes');
        if(saved) document.getElementById('stadion-notes').value = saved;
    },

    saveOrga() {
        localStorage.setItem('toni_orga_notes', document.getElementById('stadion-notes').value);
        alert("Organisationstext gespeichert.");
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
