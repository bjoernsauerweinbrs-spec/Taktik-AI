(function() {
    window.Aktentasche = {
        renderSporttasche() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px;">
                    <h3>👟 Sporttasche: Aktueller Kader</h3>
                    <p style="font-size:12px; color:#667085; margin-bottom:20px;">Spieler sind automatisch auf dem Feld aktiv.</p>
                    <div style="display:grid; gap:10px;">
                        <div style="padding:10px; border-bottom:1px solid #333;">#4 David Luiz - IV</div>
                        <div style="padding:10px; border-bottom:1px solid #333;">#10 Max Miller - OM</div>
                    </div>
                </div>
            `;
        },
        renderOrga() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `<h3>🏢 Geschäftszimmer</h3><p>Sponsoring & Media in Vorbereitung...</p>`;
        }
    };

    window.showSetcard = function(player) {
        document.getElementById('setcard-content').innerHTML = `
            <div class="setcard-ui">
                <h3>${player.name}</h3>
                <div style="font-size:30px; margin:10px 0;">#${player.number}</div>
                <label>FORM: ${player.rating}/10</label>
                <input type="range" min="1" max="10" value="${player.rating}" style="width:100%;">
                <p style="margin-top:15px; font-size:12px;">Position: ${player.pos}</p>
            </div>
        `;
    };
})();
