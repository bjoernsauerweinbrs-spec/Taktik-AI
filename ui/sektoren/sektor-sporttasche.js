/**
 * TONI 2.0 - MANNSCHAFTSKABINE (FIFA-STYLE)
 */
window.SektorSporttasche = {
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                    <h2 style="color:var(--accent-gold); letter-spacing:4px; margin:0; text-shadow: 0 0 15px rgba(212,175,55,0.3);">MANNSCHAFTSKABINE</h2>
                    <button class="login-btn" style="width:auto; padding:15px 35px; background:var(--neon-green); color:#000; font-weight:900;" onclick="SektorSporttasche.addPlayer()">+ PROFI REKRUTIEREN</button>
                </div>
                <div class="pro-player-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:30px;">
                    ${players.map(p => this.renderFifaCard(p)).join('')}
                </div>
            </div>`;
    },

    renderFifaCard: function(p) {
        const rating = p.rating || 85;
        const bmi = (p.weight && p.height) ? (p.weight / ((p.height/100)**2)).toFixed(1) : "22.8";
        
        return `
            <div class="fifa-card" onclick="SektorSporttasche.edit('${p.id}')">
                <div class="rating-num">${rating}</div>
                <div style="font-size: 0.9rem; color: var(--accent-gold); margin-top: 5px; font-weight:bold;">${p.pos || 'ZM'}</div>
                <div style="margin-top: 60px; font-size: 1.4rem; font-weight: 900; color:#fff;">${p.name.toUpperCase()}</div>
                <div style="margin-top: 10px; padding-top:10px; border-top: 1px solid rgba(212,175,55,0.2); font-size: 0.8rem; color:var(--text-dim);">
                    NR: ${p.number || '10'} | BMI: ${bmi}
                </div>
                <div style="position:absolute; bottom:10px; right:15px; font-size:3rem; opacity:0.03; font-weight:900; font-style:italic;">GINGA</div>
            </div>`;
    },

    addPlayer: function() {
        const name = prompt("Name:");
        if(!name) return;
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({ id: Date.now(), name: name, number: "10", pos: "ST", rating: 85, weight: 78, height: 182 });
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.render();
    }
};
