/**
 * TONI 2.0 - MANNSCHAFTSKABINE (FIFA-STYLE)
 */
window.SektorSporttasche = {
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:35px;">
                    <div>
                        <h2 style="color:var(--accent-gold); letter-spacing:3px; margin:0;">MANNSCHAFTSKABINE</h2>
                        <p style="font-size:0.75rem; color:var(--neon-green); font-weight:bold;">FIFA PERFORMANCE CARDS | GINGA STYLE</p>
                    </div>
                    <button class="login-btn" style="width:auto; padding:12px 30px; font-size:0.8rem; background:var(--accent-gold); color:#000;" onclick="SektorSporttasche.addPlayer()">
                        <i class="fas fa-plus"></i> NEUER PROFI
                    </button>
                </div>
                <div class="pro-player-list">
                    ${players.length > 0 
                        ? players.map(p => this.renderFifaCard(p)).join('') 
                        : `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:var(--text-dim); border:1px dashed #333;">Kabinengang ist leer. Bitte Profis anlegen.</div>`
                    }
                </div>
            </div>`;
    },

    renderFifaCard: function(p) {
        const id = p.id || Date.now();
        const name = p.name || "UNBEKANNT";
        const num = p.number || p.nr || "10";
        const rating = p.rating || 80;
        const pos = p.pos || "ZM";
        const status = p.status || "FIT";
        const bmi = (p.weight && p.height) ? (p.weight / ((p.height/100)**2)).toFixed(1) : "22.5";
        const sCol = (status === 'Verletzt') ? 'var(--status-error)' : (status === 'Abwesend' ? 'var(--status-warn)' : 'var(--status-fit)');

        return `
            <div class="fifa-card" onclick="SektorSporttasche.edit('${id}')">
                <div class="ginga-bg">GINGA</div>
                <div class="rating-box">
                    <div class="rating-num">${rating}</div>
                    <div class="rating-pos">${pos}</div>
                </div>
                <div class="status-dot" style="background: ${sCol}; box-shadow: 0 0 12px ${sCol};"></div>
                <div style="margin-top: 65px; text-align: center;">
                    <div style="font-size: 1.3rem; font-weight: 900; letter-spacing: 1.5px; color:#fff;">${name.toUpperCase()}</div>
                    <div style="font-size: 0.75rem; color: var(--accent-gold); margin-top: 8px; font-weight:800;">
                        NR: ${num} | BMI: ${bmi}
                    </div>
                </div>
                <div style="margin-top:15px; display:flex; justify-content:center;">
                    <div style="width:25px; height:15px; background:linear-gradient(to bottom, #009b3a, #fedf00, #002776); border-radius:3px; opacity:0.8;"></div>
                </div>
            </div>`;
    },

    addPlayer: function() {
        const name = prompt("Name des Profis:");
        if (!name) return;
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({
            id: 'p_' + Date.now(),
            name: name,
            number: prompt("Rückennummer:", "10"),
            pos: prompt("Position:", "ZM"),
            rating: 82,
            status: 'FIT',
            weight: 78,
            height: 182
        });
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.render();
    },

    edit: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:40px; max-width:650px; margin:0 auto; background:rgba(0,0,0,0.5); border-radius:20px; border:2px solid var(--accent-gold);">
                <button class="tactic-btn" style="width:auto; margin-bottom:30px;" onclick="SektorSporttasche.render()">
                    <i class="fas fa-chevron-left"></i> KABINE
                </button>
                <h2 style="color:var(--accent-gold); margin-bottom:25px;">DOSSIER: ${p.name.toUpperCase()}</h2>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div><label>STATUS</label><select id="edit-status" class="login-input"><option value="FIT" ${p.status==='FIT'?'selected':''}>FIT</option><option value="Verletzt" ${p.status==='Verletzt'?'selected':''}>VERLETZT</option></select></div>
                    <div><label>RATING</label><input type="number" id="edit-rating" value="${p.rating}" class="login-input"></div>
                    <div><label>GEWICHT (KG)</label><input type="number" id="edit-weight" value="${p.weight}" class="login-input"></div>
                    <div><label>GRÖSSE (CM)</label><input type="number" id="edit-height" value="${p.height}" class="login-input"></div>
                </div>
                <button class="login-btn" style="width:100%; margin-top:30px; background:var(--neon-green); color:#000;" onclick="SektorSporttasche.save('${p.id}')">PROFIL AKTUALISIEREN</button>
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
            this.render();
        }
    }
};
