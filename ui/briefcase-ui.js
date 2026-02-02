/**
 * =========================================
 * TONI 2.0 – BRIEFCASE UI (FINISH)
 * Die zentrale Schaltstelle inklusive Redaktion
 * =========================================
 */

(function() {
    window.BriefcaseUI = {
        kader: [
            { id: 1, name: "David Luiz", number: 4, rating: 8, hr: 65, sleep: "7.5h", status: "Bereit", pos: "IV", x: 250, y: 350, team: 'home' },
            { id: 2, name: "Max Miller", number: 10, rating: 6, hr: 72, sleep: "5.0h", status: "Müde", pos: "OM", x: 450, y: 300, team: 'home' }
        ],

        renderSport() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div class="animate-fadeIn">
                    <h2 style="color:var(--accent-orange); margin-bottom:15px;">👟 Sporttasche: Kader</h2>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        ${this.kader.map(p => `
                            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,106,0,0.2); padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
                                <span>#${p.number} ${p.name}</span>
                                <button onclick="window.BriefcaseUI.toBoard(${p.id})" style="background:var(--success-green); border:none; color:white; padding:6px 12px; border-radius:6px; cursor:pointer;">AUFS FELD</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        renderMedical() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `<h2 style="color:var(--data-cyan);">⌚ Medical Hub: Sportuhr Sync</h2><p>Lade biometrische Daten von David Luiz...</p>`;
        },

        renderOrga() {
            const target = document.getElementById('sub-content');
            target.innerHTML = `
                <div class="animate-fadeIn" style="display:grid; grid-template-columns: 1fr 280px; gap:30px;">
                    <div>
                        <h2 style="color:#FFD166; margin-bottom:10px;">🏢 Geschäftszimmer: Redaktion</h2>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px;">
                            <div onclick="window.Stadionzeitung.render()" style="background:white; color:#1a1a1a; padding:30px; border-radius:12px; cursor:pointer; text-align:center;">
                                <div style="font-size:35px;">📰</div>
                                <strong>STADIONZEITUNG</strong><br>Editor öffnen
                            </div>
                            <div style="background:rgba(255,255,255,0.03); padding:30px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center;">
                                <div style="font-size:35px;">💰</div>
                                <strong>SPONSOREN</strong><br>Assets
                            </div>
                        </div>
                    </div>
                    <div style="background:rgba(255,106,0,0.1); border:1px solid var(--accent-orange); padding:20px; border-radius:15px;">
                        <h4 style="color:var(--accent-orange);">TONI REDAKTEUR-MODUS</h4>
                        <p style="font-size:11px; margin-top:15px;">Björn, die Formwerte von Max Miller sind gesunken. Erwähne ihn in der Zeitung als "Kämpfer für die zweite Halbzeit", um ihn zu motivieren!</p>
                        <button class="tool-btn" style="width:100%; margin-top:15px;" onclick="Stadionzeitung.addBlock('tactics')">TIPP ÜBERNEHMEN</button>
                    </div>
                </div>
            `;
            if (window.Stadionzeitung) window.Stadionzeitung.init();
        },

        toBoard(id) {
            const player = this.kader.find(p => p.id === id);
            if (!arena.players.find(ap => ap.id === id)) {
                arena.players.push({ ...player });
                if (window.toniSpeak) toniSpeak(player.name + " auf dem Feld.");
                toggleBriefcase();
            }
        }
    };
})();
