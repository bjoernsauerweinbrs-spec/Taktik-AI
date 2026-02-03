window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    },

    switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            title.innerText = "👟 SPORTTASCHE";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerText = "📢 MARKETING";
            this.renderMarketing();
        } else if (sektor === 'analyse') {
            title.innerText = "📊 ANALYSE";
            this.renderAnalysezentrum();
        }
    },

    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:30px;">
                <div>
                    <button class="login-btn" style="width:auto; margin-bottom:20px;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER SPIELER</button>
                    <div class="pro-player-list">
                        ${players.map(p => `
                            <div class="p-card ${p.status || 'Anwesend'}" onclick="BriefcaseUI.openSetcard(${p.id})">
                                <b>#${p.number} ${p.name}</b><br>
                                <small>${p.status || 'Anwesend'}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
    },

    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="marketing-tabs" style="margin-bottom:20px; display:flex; gap:10px;">
                <button class="login-btn" style="width:auto;" onclick="BriefcaseUI.toggleMarketing('zeitung')">📄 A5 MAGAZIN EDITOR</button>
                <button class="login-btn" style="width:auto; background:#222;" onclick="BriefcaseUI.toggleMarketing('sponsoring')">💰 SPONSOREN</button>
            </div>
            
            <div id="m-zeitung" class="magazine-view" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                
                <div class="mag-page" style="background:#fff; color:#000; border:1px solid #ddd; display:flex; flex-direction:column;">
                    <div style="background:#000; color:#fff; text-align:center; padding:10px; border-bottom:5px solid var(--accent-orange);">
                        <h1 contenteditable="true" style="margin:0; font-size:1.2rem;">FC TONI 2.0</h1>
                        <small>MATCHDAY MAG | NR. 1</small>
                    </div>
                    <div style="flex:1; display:flex; align-items:center; justify-content:center; flex-direction:column;">
                        <div style="width:80px; height:80px; border:3px solid #000; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:20px;">
                            <b style="font-size:0.7rem;">LOGO</b>
                        </div>
                        <h2 contenteditable="true" style="text-align:center; font-size:1.1rem; font-style:italic;">"Brasilianischer Zauber am Spieltag"</h2>
                    </div>
                    <div style="background:#f9f9f9; padding:10px; border-top:1px solid #eee;">
                        <b contenteditable="true" style="font-size:0.8rem;">HEUTE: FC TONI vs. BOT-UNITED</b>
                    </div>
                </div>

                <div class="mag-page" style="background:#fff; color:#000; border:1px solid #ddd;">
                    <h3 style="border-bottom:2px solid #000; font-size:1rem;">🎤 TRAINER-WORT</h3>
                    <p contenteditable="true" style="font-size:0.8rem; line-height:1.5;">
                        Willkommen Björn! Heute zählen nur die drei Punkte. Wir haben an der Taktik gefeilt und sind bereit.
                        <br><br>
                        Klicke hier, um deine Ansprache für die Fans zu schreiben. Halte sie kurz und motivierend für das A5 Format!
                    </p>
                    <div style="margin-top:20px; padding:10px; background:#f0f0f0; font-size:0.75rem;">
                        <b>GEHEIMTIPP:</b> "Achtet auf die Flügel!"
                    </div>
                </div>

                <div class="mag-page" style="background:#fff; color:#000; border:1px solid #ddd;">
                    <h3 style="border-bottom:2px solid #000; font-size:1rem;">📊 ANALYSE</h3>
                    <p contenteditable="true" style="font-size:0.8rem;">Die Formkurve zeigt nach oben. Unsere km-Leistung war im letzten Spiel überragend.</p>
                    <div style="margin-top:auto;">
                        <table style="width:100%; font-size:0.7rem;">
                            <tr style="background:#eee;"><td><b>POS</b></td><td><b>TEAM</b></td><td><b>PKT</b></td></tr>
                            <tr contenteditable="true"><td>1.</td><td>FC TONI 2.0</td><td>24</td></tr>
                            <tr contenteditable="true"><td>2.</td><td>GEGNER X</td><td>21</td></tr>
                        </table>
                    </div>
                </div>

                <div class="mag-page" style="background:#fff; color:#000; border:1px solid #ddd; display:flex; flex-direction:column;">
                    <h3 style="text-align:center; font-size:1rem;">🤝 PARTNER</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; flex:1;">
                        <div contenteditable="true" style="border:1px dashed #ccc; padding:5px; font-size:0.6rem; text-align:center;">DEIN SPONSOR</div>
                        <div contenteditable="true" style="border:1px dashed #ccc; padding:5px; font-size:0.6rem; text-align:center;">LOKALER PARTNER</div>
                    </div>
                    
                    <div style="background:#000; color:#00D1FF; padding:10px; border-radius:5px; text-align:center; margin-top:10px;">
                        <b style="font-size:0.8rem; color:#fff;">POWERED BY TONI 2.0</b><br>
                        <p style="font-size:0.6rem; margin:3px 0;">Das digitale Gehirn für Trainer Björn.</p>
                    </div>
                </div>
                
                <button class="login-btn" style="grid-column: span 2; background:var(--accent-orange);" onclick="window.print()">🖨️ DIN A5 DRUCK STARTEN</button>
            </div>
            
            <div id="m-sponsoring" class="hidden">
                <div class="sponsoring-tool">
                    <h4>SPONSOREN-RECHNER</h4>
                    <select id="s-package" class="login-input" onchange="BriefcaseUI.calcSponsor()">
                        <option value="0">Modul wählen...</option>
                        <option value="400">A5 Anzeige</option>
                        <option value="1000">Trikot</option>
                    </select>
                    <div id="s-result" class="toni-speech-bubble" style="margin-top:20px;">Berechnung aktiv...</div>
                </div>
            </div>`;
    },

    toggleMarketing(view) {
        document.getElementById('m-zeitung').classList.toggle('hidden', view === 'sponsoring');
        document.getElementById('m-sponsoring').classList.toggle('hidden', view === 'zeitung');
    },

    calcSponsor() {
        const val = document.getElementById('s-package').value;
        document.getElementById('s-result').innerHTML = `Empfehlung: <b>${val} €</b>. Björn, das passt perfekt ins Budget!`;
    },

    renderAnalysezentrum() {
        document.getElementById('active-content').innerHTML = `<h3>Matrix online.</h3>`;
    },

    openSetcard(id) {
        this.switchSektor('sport');
    },

    addPlayerPrompt() {
        const n = prompt("Name:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, number:"?", status:"Anwesend"});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    }
};
