// ui/sektoren/sektor-sporttasche.js
window.SektorSporttasche = {
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                    <h3 style="color:var(--accent-orange);">KADER-MANAGEMENT</h3>
                    <button class="login-btn" style="width:auto; padding:10px;" onclick="SektorSporttasche.addPlayer()">+ NEUER SPIELER</button>
                </div>
                <div class="pro-player-list">
                    ${players.map(p => this.renderCard(p)).join('')}
                </div>
            </div>`;
    },

    renderCard: function(p) {
        // BMI Kalkulation (Soll-Ist Punkt: Analysezentrum)
        const bmi = p.weight && p.height ? (p.weight / ((p.height/100)**2)).toFixed(1) : "--";
        const statusClass = p.status === 'Verletzt' ? 'status-error' : (p.status === 'Abwesend' ? 'status-warn' : 'status-fit');

        return `
            <div class="p-card" onclick="SektorSporttasche.edit('${p.id}')">
                <div class="status-indicator ${statusClass}"></div>
                <div style="font-size:1.5rem; font-weight:900; color:var(--accent-orange);">#${p.number}</div>
                <div style="font-weight:bold;">${p.name.toUpperCase()}</div>
                <div style="font-size:0.7rem; color:var(--text-dim);">BMI: ${bmi} | ${p.pos || 'ZM'}</div>
                <div class="bmi-bar"><div class="bmi-fill" style="width:${Math.min(bmi*3, 100)}%"></div></div>
            </div>`;
    },

    edit: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; background:var(--panel-dark); border-radius:15px; border:1px solid var(--accent-orange);">
                <h3 style="color:var(--accent-orange);">${p.name} bearbeiten</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                    <div>
                        <label>STATUS</label>
                        <select id="edit-status" class="login-input" style="width:100%;">
                            <option value="Anwesend" ${p.status==='Anwesend'?'selected':''}>Anwesend</option>
                            <option value="Abwesend" ${p.status==='Abwesend'?'selected':''}>Abwesend</option>
                            <option value="Verletzt" ${p.status==='Verletzt'?'selected':''}>Verletzt</option>
                        </select>
                    </div>
                    <div>
                        <label>POSITION</label>
                        <input type="text" id="edit-pos" value="${p.pos || 'ZM'}" class="login-input" style="width:100%;">
                    </div>
                    <div>
                        <label>GEWICHT (KG)</label>
                        <input type="number" id="edit-weight" value="${p.weight || 75}" class="login-input" style="width:100%;">
                    </div>
                    <div>
                        <label>GRÖSSE (CM)</label>
                        <input type="number" id="edit-height" value="${p.height || 180}" class="login-input" style="width:100%;">
                    </div>
                </div>
                <button class="login-btn" style="width:100%; margin-top:20px;" onclick="SektorSporttasche.save('${p.id}')">SPEICHERN</button>
            </div>`;
    },

    save: function(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(x => x.id == id);
        if(idx > -1) {
            players[idx].status = document.getElementById('edit-status').value;
            players[idx].pos = document.getElementById('edit-pos').value;
            players[idx].weight = document.getElementById('edit-weight').value;
            players[idx].height = document.getElementById('edit-height').value;
            localStorage.setItem('toni_players', JSON.stringify(players));
            
            // Trigger für Toni-Stimme & Board-Update
            if(window.ToniTTS) ToniTTS.speak(`Daten für ${players[idx].name} wurden aktualisiert.`);
            this.render();
        }
    }
};
