/**
 * TONI 2.0 – BRIEFCASE UI
 * Inklusive Spieler-Erstellung & Kader-Management
 */

(function() {
    window.BriefcaseUI = {
        kader: [],

        initKader() {
            const saved = localStorage.getItem('toni2_kader');
            if (saved) {
                this.kader = JSON.parse(saved);
            } else {
                this.kader = [
                    { id: 1, name: "David Luiz", number: 4, rating: 8, hr: 65, sleep: "7.5h", status: "Bereit", pos: "IV", x: 250, y: 350, team: 'home' },
                    { id: 2, name: "Max Miller", number: 10, rating: 6, hr: 72, sleep: "5.0h", status: "Müde", pos: "OM", x: 450, y: 300, team: 'home' }
                ];
                this.saveKader();
            }
        },

        saveKader() {
            localStorage.setItem('toni2_kader', JSON.stringify(this.kader));
        },

        addPlayer() {
            const name = document.getElementById('new-player-name').value;
            const num = document.getElementById('new-player-num').value;
            const pos = document.getElementById('new-player-pos').value;

            if(!name || !num) return alert("Name und Nummer angeben!");

            const newP = {
                id: Date.now(),
                name: name,
                number: num,
                pos: pos,
                rating: 5,
                hr: 70,
                sleep: "8h",
                status: "Bereit",
                x: 100 + (Math.random() * 200),
                y: 100 + (Math.random() * 200),
                team: 'home'
            };

            this.kader.push(newP);
            this.saveKader();
            this.renderSport(); // Refresh
        },

        renderSport() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div class="animate-fadeIn">
                    <h2 style="color:var(--accent-orange);">👟 Sporttasche: Kader & Training</h2>
                    
                    <div style="background:rgba(255,106,0,0.1); padding:15px; border-radius:10px; margin: 20px 0; display:flex; gap:10px;">
                        <input id="new-player-name" type="text" placeholder="Name" style="background:#1A2233; color:white; border:1px solid #333; padding:5px; border-radius:4px; flex:2;">
                        <input id="new-player-num" type="number" placeholder="Nr." style="background:#1A2233; color:white; border:1px solid #333; padding:5px; border-radius:4px; flex:1;">
                        <select id="new-player-pos" style="background:#1A2233; color:white; border:1px solid #333; padding:5px; border-radius:4px;">
                            <option>TW</option><option>IV</option><option>AV</option><option>ZM</option><option>ST</option>
                        </select>
                        <button onclick="BriefcaseUI.addPlayer()" style="background:var(--accent-orange); color:white; border:none; padding:5px 15px; border-radius:4px; cursor:pointer; font-weight:bold;">+</button>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        ${this.kader.map(p => `
                            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
                                <div><b>#${p.number} ${p.name}</b> <br><small style="color:var(--data-cyan);">${p.pos}</small></div>
                                <button onclick="BriefcaseUI.toBoard(${p.id})" style="background:var(--success-green); border:none; color:white; padding:6px 12px; border-radius:6px; cursor:pointer;">AUFS FELD</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        renderMedical() {
            document.getElementById('sub-content').innerHTML = `<h2 style="color:var(--data-cyan);">⌚ Medical Hub</h2><p>Lade Bio-Metriken...</p>`;
        },

        renderOrga() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div style="display:grid; grid-template-columns: 1fr 280px; gap:30px;">
                    <div>
                        <h2 style="color:#FFD166;">🏢 Geschäftszimmer: Redaktion</h2>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px;">
                            <div onclick="window.Stadionzeitung.render()" style="background:white; color:#1a1a1a; padding:30px; border-radius:12px; cursor:pointer; text-align:center;">
                                <div style="font-size:35px;">📰</div>
                                <strong>STADIONZEITUNG</strong>
                            </div>
                        </div>
                    </div>
                    <div style="background:rgba(255,106,0,0.1); border:1px solid var(--accent-orange); padding:20px; border-radius:15px;">
                        <h4 style="color:var(--accent-orange);">TONI-INPUT</h4>
                        <p style="font-size:11px; margin-top:10px;">Björn, die Zeitung wartet auf deine Taktik-Analyse.</p>
                    </div>
                </div>
            `;
        },

        toBoard(id) {
            const player = this.kader.find(p => p.id === id);
            if (!arena.players.find(ap => ap.id === id)) {
                arena.players.push({ ...player });
                toggleBriefcase();
            }
        }
    };

    window.showFullSetcard = function(player) {
        document.getElementById('setcard-content').innerHTML = `
            <div class="setcard-ui">
                <h3 style="color:var(--accent-orange);">${player.name}</h3>
                <div style="font-size:40px; font-weight:bold;">#${player.number}</div>
                <hr style="opacity:0.1; margin:15px 0;">
                <label style="font-size:11px;">FORM: ${player.rating}/10</label>
                <input type="range" min="1" max="10" value="${player.rating}" style="width:100%; accent-color:var(--data-cyan);">
                <div style="margin-top:20px; font-size:11px;">
                    <div>STATUS: ${player.status}</div>
                    <div>PULS: ${player.hr} BPM</div>
                </div>
            </div>
        `;
    };
})();
