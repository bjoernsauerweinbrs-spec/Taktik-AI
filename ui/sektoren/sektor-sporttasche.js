/**
 * TONI 2.0 - MANNSCHAFTSKABINE PRO
 * FIFA-Karten mit Neon-Ginga Hover-Effekt & Sortier-Logik
 */
window.SektorSporttasche = {
    // Standardmäßig nach Stärke sortieren
    currentSort: 'rating', 

    render: function() {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        // Automatisches Sortieren nach Rating (Absteigend)
        if (this.currentSort === 'rating') {
            players.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                    <div>
                        <h2 style="color:var(--accent-gold); letter-spacing:3px; margin:0; text-shadow: 0 0 15px rgba(212,175,55,0.3);">MANNSCHAFTSKABINE</h2>
                        <p style="font-size:0.8rem; color:var(--neon-green); font-weight:bold; margin-top:5px;">GINGA PERFORMANCE SELECTION</p>
                    </div>
                    <div style="display:flex; gap:15px;">
                        <div style="background:rgba(255,255,255,0.05); padding:10px 20px; border-radius:10px; border:1px solid var(--accent-gold); display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-sort-amount-down" style="color:var(--accent-gold);"></i>
                            <span style="font-size:0.7rem; font-weight:bold; color:#fff;">SORTIERT NACH: RATING</span>
                        </div>
                        <button class="login-btn" style="width:auto; padding:12px 30px; background:var(--neon-green); color:#000; font-weight:900;" onclick="SektorSporttasche.addPlayer()">
                            <i class="fas fa-plus"></i> NEUER PROFI
                        </button>
                    </div>
                </div>
                
                <div class="pro-player-list">
                    ${players.length > 0 
                        ? players.map(p => this.renderFifaCard(p)).join('') 
                        : `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:var(--text-dim); border:1px dashed #333;">Der Kabinengang ist noch leer, Coach.</div>`
                    }
                </div>
            </div>`;
    },

    renderFifaCard: function(p) {
        const id = p.id || Date.now();
        const rating = p.rating || 82;
        const name = p.name || "MUSTERPROFI";
        const num = p.number || p.nr || "10";
        const pos = p.pos || "ZM";
        const status = p.status || "FIT";
        const bmi = (p.weight && p.height) ? (p.weight / ((p.height/100)**2)).toFixed(1) : "22.5";
        
        // Dynamische Statusfarbe
        const statusColor = (status === 'Verletzt') ? 'var(--status-error)' : 'var(--status-fit)';

        return `
            <div class="fifa-card" onclick="SektorSporttasche.edit('${id}')">
                <div class="rating-num" style="position: absolute; top: 15px; left: 15px; font-size: 2.2rem; font-weight: 900; color: #fff; line-height:1;">
                    ${rating}
                    <div style="font-size: 0.8rem; color: var(--accent-gold); text-align:center;">${pos}</div>
                </div>

                <div class="status-dot" style="position: absolute; top: 15px; right: 15px; width: 12px; height: 12px; background: ${statusColor}; border-radius: 50%; box-shadow: 0 0 10px ${statusColor};"></div>

                <div style="margin-top: 70px; text-align: center;">
                    <div style="font-size: 1.3rem; font-weight: 900; letter-spacing: 2px; color:#fff;">${name.toUpperCase()}</div>
                    <div style="margin-top: 10px; padding: 10px 0; border-top: 1px solid rgba(212,175,55,0.2); font-size: 0.75rem; color: var(--accent-gold); font-weight: 800;">
                        NR: ${num} | BMI: ${bmi}
                    </div>
                </div>

                <div style="display: flex; justify-content: center; margin-top: 10px;">
                    <div style="width: 30px; height: 18px; background: linear-gradient(to bottom, #009b3a, #fedf00, #002776); border-radius: 3px; opacity: 0.7;"></div>
                </div>

                <div class="ginga-bg" style="position: absolute; bottom: 5px; right: 10px; font-size: 3rem; opacity: 0.05; font-weight: 900; font-style: italic;">GINGA</div>
            </div>`;
    },

    addPlayer: function() {
        const name = prompt("Vollständiger Name des Profis:");
        if (!name) return;
        
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({
            id: 'p_' + Date.now(),
            name: name,
            number: prompt("Rückennummer:", "10"),
            pos: prompt("Position (ST, ZM, IV, TW):", "ZM"),
            rating: parseInt(prompt("Rating (1-99):", "80")),
            status: 'FIT',
            weight: 75,
            height: 180
        });
        
        localStorage.setItem('toni_players', JSON.stringify(players));
        if(window.ToniTTS) ToniTTS.speak(`${name} wurde dem Kader hinzugefügt.`, "warm");
        this.render();
    },

    edit: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; max-width:600px; margin:0 auto; background:rgba(0,0,0,0.6); border:2px solid var(--accent-gold); border-radius:20px;">
                <button class="tactic-btn" style="width:auto; margin-bottom:25px;" onclick="SektorSporttasche.render()">
                    <i class="fas fa-chevron-left"></i> ZURÜCK ZUR KABINE
                </button>
                
                <h2 style="color:var(--accent-gold); margin-bottom:20px;">PROFI-DOSSIER: ${p.name.toUpperCase()}</h2>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div>
                        <label style="font-size:0.7rem; color:var(--text-dim);">STATUS</label>
                        <select id="edit-status" class="login-input" style="width:100%;">
                            <option value="FIT" ${p.status==='FIT'?'selected':''}>EINSATZBEREIT</option>
                            <option value="Verletzt" ${p.status==='Verletzt'?'selected':''}>VERLETZT</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.7rem; color:var(--text-dim);">RATING (1-99)</label>
                        <input type="number" id="edit-rating" value="${p.rating}" class="login-input" style="width:100%;">
                    </div>
                    <div>
                        <label style="font-size:0.7rem; color:var(--text-dim);">GEWICHT (KG)</label>
                        <input type="number" id="edit-weight" value="${p.weight}" class="login-input" style="width:100%;">
                    </div>
                    <div>
                        <label style="font-size:0.7rem; color:var(--text-dim);">GRÖSSE (CM)</label>
                        <input type="number" id="edit-height" value="${p.height}" class="login-input" style="width:100%;">
                    </div>
                </div>
                
                <button class="login-btn" style="width:100%; margin-top:30px; background:var(--neon-green); color:#000;" onclick="SektorSporttasche.save('${p.id}')">ÄNDERUNGEN SPEICHERN</button>
            </div>`;
    },

    save: function(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(x => x.id == id);
        if(idx > -1) {
            players[idx].status = document.getElementById('edit-status').value;
            players[idx].rating = parseInt(document.getElementById('edit-rating').value);
            players[idx].weight = document.getElementById('edit-weight').value;
            players[idx].height = document.getElementById('edit-height').value;
            
            localStorage.setItem('toni_players', JSON.stringify(players));
            if(window.ToniTTS) ToniTTS.speak("Daten im System gesichert.", "warm");
            this.render();
        }
    }
};
