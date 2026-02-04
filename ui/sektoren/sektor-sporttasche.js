window.SektorSporttasche = { // Wir behalten den Dateinamen bei, ändern aber das UI
    render: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                    <h2 style="color:var(--accent-orange); letter-spacing:2px;">MANNSCHAFTSKABINE</h2>
                    <button class="login-btn" style="width:auto; padding:10px 20px;" onclick="SektorSporttasche.addPlayer()">+ NEUER PROFI</button>
                </div>
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px;">
                    ${players.map(p => this.renderFifaCard(p)).join('')}
                </div>
            </div>`;
    },

    renderFifaCard: function(p) {
        // Fallback für fehlende Daten (verhindert #undefined)
        const num = p.number || p.nr || "00";
        const rating = p.rating || 75;
        const statusColor = p.status === 'Verletzt' ? '#FF3B30' : '#4CD964';
        const bmi = p.weight && p.height ? (p.weight / ((p.height/100)**2)).toFixed(1) : "--";

        return `
            <div class="fifa-card" onclick="SektorSporttasche.edit('${p.id}')" 
                 style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); 
                        border: 2px solid #d4af37; border-radius: 15px; padding: 20px; 
                        position: relative; overflow: hidden; color: #fff; cursor: pointer;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                
                <div style="position: absolute; left: 15px; top: 15px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 900; line-height: 1;">${rating}</div>
                    <div style="font-size: 0.8rem; font-weight: bold; color: #d4af37;">${p.pos || 'ZM'}</div>
                </div>

                <div style="position: absolute; right: 15px; top: 15px; width: 12px; height: 12px; background: ${statusColor}; border-radius: 50%; box-shadow: 0 0 10px ${statusColor};"></div>

                <div style="margin-top: 50px; text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: 900; letter-spacing: 1px;">${p.name.toUpperCase()}</div>
                    <div style="font-size: 0.7rem; color: #888; margin-top: 5px;">BMI: ${bmi} | NR: ${num}</div>
                </div>

                <div style="position: absolute; bottom: -10px; right: -10px; font-size: 4rem; opacity: 0.05; font-style: italic; font-weight: 900;">GINGA</div>
            </div>`;
    }
    // ... restliche Logik (edit, save) bleibt gleich
};
