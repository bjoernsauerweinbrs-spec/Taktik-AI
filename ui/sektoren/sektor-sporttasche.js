/**
 * TONI 2.0 - MANNSCHAFTSKABINE
 * Visualisiert den Kader als FIFA-Pro-Cards.
 * Steuert Anwesenheit und synchronisiert mit dem Board.
 */
window.SektorSporttasche = {
    render: function() {
        const players = window.ToniDB.getPlayers().filter(p => p.team === 'home');
        const container = document.getElementById('active-content');

        container.innerHTML = `
            <div style="padding:30px; animation: fadeIn 0.4s ease-out;">
                <div style="margin-bottom:30px;">
                    <h2 style="color:var(--neon-green); letter-spacing:3px; margin:0;">MANNSCHAFTSKABINE</h2>
                    <p style="font-size:0.6rem; color:var(--text-dim); text-transform:uppercase;">Kader-Status & Nominierung</p>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:20px;">
                    ${players.map(p => this.renderFifaCard(p)).join('')}
                </div>
            </div>
        `;
    },

    renderFifaCard: function(p) {
        const glowColor = p.isPresent ? 'var(--neon-green)' : '#444';
        const opacity = p.isPresent ? '1' : '0.5';

        return `
            <div onclick="SektorSporttasche.togglePresence('${p.id}')" 
                 style="position:relative; width:180px; height:260px; background:#111; border-radius:15px; border:2px solid ${glowColor}; 
                        box-shadow: 0 0 20px ${glowColor}44; cursor:pointer; transition:0.3s; opacity:${opacity}; overflow:hidden;">
                
                <div style="padding:15px; color:#fff;">
                    <div style="font-size:1.5rem; font-weight:900; line-height:1;">${p.rat}</div>
                    <div style="font-size:0.7rem; font-weight:bold; color:var(--accent-gold);">${p.pos}</div>
                </div>

                <div style="text-align:center; margin-top:-10px;">
                    <i class="fas fa-user-ninja" style="font-size:5rem; color:#222;"></i>
                </div>

                <div style="position:absolute; bottom:0; width:100%; background:linear-gradient(transparent, #000); padding:15px; text-align:center; color:#fff;">
                    <div style="font-weight:900; font-size:0.9rem; letter-spacing:1px;">${p.name.toUpperCase()}</div>
                    <div style="font-size:0.6rem; color:var(--neon-green); margin-top:5px;">NR. ${p.nr} | ELITE PRO</div>
                </div>

                <div style="position:absolute; top:10px; right:10px; width:12px; height:12px; border-radius:50%; background:${p.isPresent ? 'var(--neon-green)' : 'red'}; border:2px solid #fff;"></div>
            </div>
        `;
    },

    togglePresence: function(id) {
        const players = window.ToniDB.getPlayers();
        const p = players.find(x => x.id === id);
        if (p) {
            window.ToniDB.updatePlayer(id, { isPresent: !p.isPresent });
            this.render(); // Sofort neu zeichnen
            if (window.ToniTTS) window.ToniTTS.speak(p.name + " Status geändert.", "calm");
        }
    }
};
