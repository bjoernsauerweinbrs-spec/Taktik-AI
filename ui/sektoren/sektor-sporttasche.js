/**
 * TONI 2.0 - SEKTOR SPORTTASCHE
 * Verwaltung der Spielerakte inkl. Status-Flags und BMI-Kalkulation.
 */

window.SektorSporttasche = {
    // Liste der verfügbaren Status-Typen (Soll-Ist Punkt 4)
    statusTypes: {
        FIT: { label: 'Fit', class: 'status-fit', icon: 'fa-check-circle' },
        WARN: { label: 'Angeschlagen', class: 'status-warn', icon: 'fa-exclamation-triangle' },
        OFF: { label: 'Verletzt / Abwesend', class: 'status-error', icon: 'fa-times-circle' }
    },

    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        let html = `
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <h3 style="color:var(--accent-orange); margin:0;">KADER-MANAGEMENT</h3>
                    <button class="login-btn" style="width:auto; padding:10px 20px; font-size:0.8rem;" onclick="SektorSporttasche.addPlayerPrompt()">+ PRO-PLAYER ANLEGEN</button>
                </div>

                <div class="pro-player-list">
                    ${players.map(p => this.renderPlayerCard(p)).join('')}
                </div>
            </div>
        `;
        document.getElementById('active-content').innerHTML = html;
    },

    renderPlayerCard: function(p) {
        // BMI Kalkulation (Soll-Ist Analysezentrum)
        const weight = p.weight || 75;
        const height = p.height || 180;
        const bmi = (weight / ((height/100) * (height/100))).toFixed(1);
        const status = p.status || 'FIT';
        const currentStatus = this.statusTypes[status];

        return `
            <div class="p-card" onclick="SektorSporttasche.openDetails('${p.id}')">
                <div class="status-indicator ${currentStatus.class}"></div>
                <div style="font-size:1.5rem; font-weight:900; color:var(--accent-orange);">#${p.number || '00'}</div>
                <div style="font-weight:bold; margin:5px 0;">${p.name.toUpperCase()}</div>
                <div style="font-size:0.7rem; color:var(--text-dim);">${p.pos || 'POS'} | BMI: ${bmi}</div>
                
                <div class="bmi-bar">
                    <div class="bmi-fill" style="width: ${Math.min(bmi * 3, 100)}%;"></div>
                </div>
            </div>
        `;
    },

    openDetails: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; background:var(--panel-dark); border:1px solid var(--accent-orange); border-radius:15px;">
                <button onclick="SektorSporttasche.render()" style="background:none; border:none; color:var(--text-dim); cursor:pointer; margin-bottom:20px;">
                    <i class="fas fa-arrow-left"></i> ZURÜCK ZUM KADER
                </button>

                <div style="display:grid; grid-template-columns: 200px 1fr; gap:30px;">
                    <div style="background:linear-gradient(145deg, #d4af37, #b8860b); padding:20px; border-radius:10px; text-align:center; color:#000;">
                        <div style="font-size:3rem; font-weight:900;">${p.rating || 80}</div>
                        <div style="width:120px; height:120px; background:#222; margin:15px auto; border-radius:50%; border:3px solid #000; overflow:hidden;">
                            ${p.photo ? `<img src="${p.photo}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user" style="font-size:4rem; color:#444; margin-top:25px;"></i>`}
                        </div>
                        <div style="font-weight:900; font-size:1.2rem;">${p.name}</div>
                        <div style="font-size:0.8rem; opacity:0.7;">${p.pos || 'UNBEKANNT'}</div>
                    </div>

                    <div>
                        <h4 style="color:var(--accent-orange); margin-top:0;">SPIELER-STATUS (EVENT-SYNC)</h4>
                        <div style="display:flex; gap:10px; margin-bottom:25px;">
                            ${Object.keys(this.statusTypes).map(key => `
                                <button onclick="SektorSporttasche.updateStatus('${p.id}', '${key}')" 
                                    style="flex:1; padding:10px; border-radius:5px; border:1px solid #333; cursor:pointer; 
                                    background: ${status === key ? 'var(--accent-orange)' : '#000'}; 
                                    color: ${status === key ? '#000' : '#fff'};">
                                    <i class="fas ${this.statusTypes[key].icon}"></i><br>${this.statusTypes[key].label}
                                </button>
                            `).join('')}
                        </div>

                        <h4 style="color:var(--accent-orange);">PHYSIK & BMI</h4>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                            <div>
                                <label style="font-size:0.6rem; color:var(--text-dim);">GRÖSSE (CM)</label>
                                <input type="number" id="edit-height" value="${p.height || 180}" class="login-input" style="width:100%; text-align:left;">
                            </div>
                            <div>
                                <label style="font-size:0.6rem; color:var(--text-dim);">GEWICHT (KG)</label>
                                <input type="number" id="edit-weight" value="${p.weight || 75}" class="login-input" style="width:100%; text-align:left;">
                            </div>
                        </div>
                        <button class="login-btn" style="width:100%; margin-top:20px;" onclick="SektorSporttasche.saveData('${p.id}')">ÄNDERUNGEN SPEICHERN</button>
                    </div>
                </div>
            </div>
        `;
    },

    updateStatus: function(id, newStatus) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        let pIndex = players.findIndex(x => x.id == id);
        if(pIndex > -1) {
            players[pIndex].status = newStatus;
            localStorage.setItem('toni_players', JSON.stringify(players));
            
            // Event feuern für Board-Sync (Soll-Ist Punkt 3)
            document.dispatchEvent(new CustomEvent('playerStatusChanged', { detail: { id, status: newStatus } }));
            
            if(window.ToniTTS) ToniTTS.speak(`Status für ${players[pIndex].name} auf ${this.statusTypes[newStatus].label} geändert.`, 'system');
            this.openDetails(id);
        }
    },

    saveData: function(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        let pIndex = players.findIndex(x => x.id == id);
        if(pIndex > -1) {
            players[pIndex].height = document.getElementById('edit-height').value;
            players[pIndex].weight = document.getElementById('edit-weight').value;
            localStorage.setItem('toni_players', JSON.stringify(players));
            if(window.ToniTTS) ToniTTS.speak("Physikdaten aktualisiert. BMI wird neu berechnet.", "warm");
            this.render();
        }
    },

    addPlayerPrompt: function() {
        const name = prompt("Name des Spielers:");
        const num = prompt("Rückennummer:");
        if(name && num) {
            let players = JSON.parse(localStorage.getItem('toni_players')) || [];
            players.push({ id: Date.now(), name, number: num, status: 'FIT', weight: 75, height: 180, pos: 'ZM' });
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.render();
        }
    }
};
