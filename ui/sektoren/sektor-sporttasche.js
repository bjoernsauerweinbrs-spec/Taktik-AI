/**
 * TONI 2.0 - MANNSCHAFTSKABINE
 * FIFA-Setcard Design & Kader-Logik
 */
window.SektorSporttasche = {
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                    <div>
                        <h2 style="color:var(--accent-orange); letter-spacing:2px; margin:0;">MANNSCHAFTSKABINE</h2>
                        <p style="font-size:0.7rem; color:var(--text-dim); margin:5px 0 0 0;">Kader-Status & FIFA-Performance-Karten</p>
                    </div>
                    <button class="login-btn" style="width:auto; padding:10px 25px; font-size:0.8rem;" onclick="SektorSporttasche.addPlayer()">
                        <i class="fas fa-plus-circle"></i> NEUER PROFI
                    </button>
                </div>
                <div class="pro-player-list">
                    ${players.length > 0 
                        ? players.map(p => this.renderFifaCard(p)).join('') 
                        : `<div style="grid-column: 1/-1; text-align:center; padding:50px; color:var(--text-dim);">Keine Profis in der Kabine. Lege jetzt dein Team an!</div>`
                    }
                </div>
            </div>`;
    },

    renderFifaCard: function(p) {
        // Datensicherung gegen "undefined"
        const id = p.id || Date.now();
        const name = p.name || "UNBEKANNT";
        const num = p.number || p.nr || "??";
        const rating = p.rating || 75;
        const pos = p.pos || "ZM";
        const status = p.status || "FIT";
        
        // BMI Kalkulation
        const bmi = (p.weight && p.height) 
            ? (p.weight / ((p.height/100)**2)).toFixed(1) 
            : "--";
            
        // Status-Farbe basierend auf CSS-Variablen
        const statusColor = (status === 'Verletzt') ? 'var(--status-error)' : 
                           (status === 'Abwesend') ? 'var(--status-warn)' : 'var(--status-fit)';

        return `
            <div class="fifa-card" onclick="SektorSporttasche.edit('${id}')">
                <div class="ginga-bg">GINGA</div>
                
                <div class="rating-box">
                    <div class="rating-num">${rating}</div>
                    <div class="rating-pos">${pos}</div>
                </div>

                <div class="status-dot" style="background: ${statusColor}; box-shadow: 0 0 10px ${statusColor};"></div>

                <div style="margin-top: 60px; text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: 900; letter-spacing: 1px; color:#fff;">${name.toUpperCase()}</div>
                    <div style="font-size: 0.7rem; color: var(--accent-gold); margin-top: 5px; font-weight:bold;">
                        NR: ${num} | BMI: ${bmi}
                    </div>
                </div>
                
                <div style="margin-top:15px; display:flex; justify-content:center; gap:5px;">
                    <div style="width:20px; height:12px; background:linear-gradient(to bottom, #009b3a, #fedf00, #002776); border-radius:2px; opacity:0.6;" title="Style: Brasil"></div>
                </div>
            </div>`;
    },

    addPlayer: function() {
        const name = prompt("Name des Profis:");
        if (!name) return;
        const num = prompt("Rückennummer:", "10");
        const pos = prompt("Position (z.B. ZM, ST, IV):", "ZM");
        
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({
            id: 'p_' + Date.now(),
            name: name,
            number: num,
            pos: pos,
            rating: 80,
            status: 'FIT',
            weight: 75,
            height: 180
        });
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.render();
        if(window.ToniTTS) ToniTTS.speak(`${name} wurde in die Kabine gerufen.`, 'warm');
    },

    edit: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; max-width:600px; margin:0 auto; background:rgba(0,0,0,0.3); border-radius:15px; border:1px solid var(--accent-orange);">
                <button class="tactic-btn" style="width:auto; margin-bottom:20px;" onclick="SektorSporttasche.render()">
                    <i class="fas fa-arrow-left"></i> ZURÜCK
                </button>
                
                <h2 style="color:var(--accent-orange); margin-bottom:20px;">PROFI-PROFILE: ${p.name}</h2>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div>
                        <label style="font-size:0.7rem; color:var(--text-dim);">STATUS</label>
                        <select id="edit-status" class="login-input" style="width:100%; text-align:left;">
                            <option value="FIT" ${p.status==='FIT'?'selected':''}>Top-Fit</option>
                            <option value="Abwesend" ${p.status==='Abwesend'?'selected':''}>Abwesend</option>
                            <option value="Verletzt" ${p.status==='Verletzt'?'selected':''}>Verletzt</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.7rem; color:var(--text-dim);">FIFA RATING (1-99)</label>
                        <input type="number" id="edit-rating" value="${p.rating || 80}" class="login-input" style="width:100%; text-align:left;">
                    </div>
                    <div>
                        <label style="font-size:0.7rem; color:var(--text-dim);">GEWICHT (KG)</label>
                        <input type="number" id="edit-weight" value="${p.weight || 75}" class="login-input" style="width:100%; text-align:left;">
                    </div>
                    <div>
                        <label style="font-size:0.7rem; color:var(--text-dim);">GRÖSSE (CM)</label>
                        <input type="number" id="edit-height" value="${p.height || 180}" class="login-input" style="width:100%; text-align:left;">
                    </div>
                </div>
                
                <button class="login-btn" style="width:100%; margin-top:25px;" onclick="SektorSporttasche.save('${p.id}')">ÄNDERUNGEN ÜBERNEHMEN</button>
                <button class="tactic-btn reset" style="width:100%; margin-top:10px; border-color:var(--status-error); color:var(--status-error);" onclick="SektorSporttasche.delete('${p.id}')">SPIELER ENTFERNEN</button>
            </div>`;
    },

    save: function(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(x => x.id == id);
        if(idx > -1) {
            players[idx].status = document.getElementById('edit-status').value;
            players[idx].rating = document.getElementById('edit-rating').value;
            players[idx].weight = document.getElementById('edit-weight').value;
            players[idx].height = document.getElementById('edit-height').value;
            
            localStorage.setItem('toni_players', JSON.stringify(players));
            if(window.ToniTTS) ToniTTS.speak("Änderungen in der Kabine gespeichert.", "warm");
            this.render();
        }
    },

    delete: function(id) {
        if(confirm("Spieler wirklich aus dem Kader entfernen?")) {
            let players = JSON.parse(localStorage.getItem('toni_players')) || [];
            players = players.filter(p => p.id != id);
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.render();
        }
    }
};
