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
            title.innerText = "👟 SPORTTASCHE: KADER & PERFORMANCE";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerText = "📢 MARKETING: ZEITUNG & SPONSOREN";
            this.renderMarketing();
        } else if (sektor === 'analyse') {
            title.innerText = "📊 ANALYSEZENTRUM: TIEFEN-MATRIX";
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
                                <div class="p-stars">${'★'.repeat(p.rating_t || 0)}${'☆'.repeat(5 - (p.rating_t || 0))}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <h3 style="color:var(--accent-orange);">TAKTIK-BOARDS</h3>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('433')">4-3-3 GLEITEN</button>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('352')">3-5-2 GLEITEN</button>
                </div>
            </div>`;
    },

    renderMarketing() {
        const target = document.getElementById('active-content');
        
        // Mustertexte für die Zeitung
        const musterClub = "FC TONI 2.0 — HIGH-TECH SOCCER";
        const musterTalk = "Willkommen in der neuen Ära, Björn! Wir setzen heute auf brasilianische Technik und absolute Disziplin. Heute zählt nur der Sieg. Gruß, Trainer Björn.";
        const musterBericht = "Das letzte Spiel war ein Lehrstück in Sachen Effizienz. Die 4-3-3 Formation hat die Räume perfekt genutzt und den Gegner kontrolliert.";

        target.innerHTML = `
            <div style="margin-bottom:20px; display:flex; gap:10px;">
                <button class="login-btn" style="width:auto;" onclick="BriefcaseUI.toggleMarketing('zeitung')">STADIONZEITUNG</button>
                <button class="login-btn" style="width:auto; background:#222;" onclick="BriefcaseUI.toggleMarketing('sponsoring')">SPONSOREN-AGENTUR</button>
            </div>
            
            <div id="m-zeitung" class="magazine-view">
                <div class="mag-page">
                    <div style="text-align:center; padding: 20px 0;">
                        <div style="display:inline-block; padding: 10px 20px; background: #000; border: 3px solid #FF6A00; border-radius: 50% 50% 0 0; box-shadow: 0 4px 15px rgba(255,106,0,0.4);">
                            <span style="color:#FFF; font-weight:900; font-size:1.5rem; letter-spacing:2px;">FC TONI</span>
                            <div style="color:#FF6A00; font-size:0.8rem; font-weight:bold; border-top:1px solid #FF6A00; padding-top:2px;">2.0 PRO OS</div>
                        </div>
                    </div>
                    <b style="text-align:center; display:block; margin-top:10px;">MATCHDAY MAG #01</b>
                    <input type="text" class="mag-area" style="height:auto; font-weight:bold; font-size:1.1rem; margin-top:15px; text-align:center;" value="${musterClub}">
                    <div style="margin-top:auto; border-top:1px solid #eee; padding-top:10px;">
                        <p style="font-size:0.7rem; color:#666;">TOP-PARTNER: <b>CYBER-TACTICS</b></p>
                        <p style="font-size:0.7rem; color:#666;">OFFIZIELLER COACH: <b>BJÖRN</b></p>
                    </div>
                </div>

                <div class="mag-page">
                    <b>🎤 TRAINER-TALK</b>
                    <textarea class="mag-area" style="line-height:1.5;">${musterTalk}</textarea>
                    <div style="font-size:0.7rem; margin-top:10px; text-align:right;">— Gezeichnet: Björn</div>
                </div>

                <div class="mag-page">
                    <b>📊 ANALYSE-RÜCKBLICK</b>
                    <textarea class="mag-area" style="line-height:1.5;">${musterBericht}</textarea>
                </div>

                <div class="mag-page">
                    <b>🤝 SPONSOREN & PARTNER</b>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; flex:1; margin-top:15px;">
                        <div style="border:1px solid #eee; padding:10px; text-align:center; font-size:0.6rem; background:#fafafa;">GINGA SPORTS</div>
                        <div style="border:1px solid #eee; padding:10px; text-align:center; font-size:0.6rem; background:#fafafa;">DATA-FUTURES</div>
                        <div style="border:1px solid #eee; padding:10px; text-align:center; font-size:0.6rem; background:#fafafa;">BJÖRNS COFFEE</div>
                        <div style="border:1px solid #eee; padding:10px; text-align:center; font-size:0.6rem; background:#fafafa;">TONI OS AI</div>
                    </div>
                    <p style="margin-top:auto; font-size:0.7rem; text-align:center; border-top:1px solid #eee; padding-top:10px;">Created for Trainer Björn</p>
                </div>
                
                <button class="login-btn" style="grid-column: span 2; background: #FF6A00;" onclick="window.print()">ZEITUNG JETZT DRUCKEN</button>
            </div>

            <div id="m-sponsoring" class="hidden">
                <div class="sponsoring-tool">
                    <h4>SPONSOREN-RECHNER</h4>
                    <select id="s-package" class="login-input" onchange="BriefcaseUI.calcSponsor()">
                        <option value="0">Wähle Paket...</option>
                        <option value="600">Bandenwerbung (Saison)</option>
                        <option value="1500">Trikotsponsor (Haupt)</option>
                        <option value="400">Anzeige im Matchday Mag</option>
                    </select>
                    <div id="s-result" class="toni-speech-bubble" style="margin-top:20px;">Toni berechnet den Marktwert...</div>
                </div>
            </div>`;
    },

    toggleMarketing(view) {
        document.getElementById('m-zeitung').classList.toggle('hidden', view === 'sponsoring');
        document.getElementById('m-sponsoring').classList.toggle('hidden', view === 'zeitung');
    },

    calcSponsor() {
        const val = document.getElementById('s-package').value;
        const res = document.getElementById('s-result');
        if(val == 0) return;
        res.innerHTML = `Toni empfiehlt: <b>${val} €</b>.<br><br><i>"Björn, dieser Preis ist absolut wettbewerbsfähig für unseren FC Toni 2.0."</i>`;
    },

    renderAnalysezentrum() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; background:rgba(255,255,255,0.05); border-radius:10px; border:1px solid rgba(0,209,255,0.2);">
                <h4>SYSTEM-STATUS: ONLINE</h4>
                <p>Analyse-Matrix geladen. Alle taktischen Bewegungsdaten sind synchronisiert.</p>
            </div>`;
    },

    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(x => x.id === id);
        document.getElementById('active-content').innerHTML = `
            <button onclick="BriefcaseUI.switchSektor('sport')" class="login-btn" style="width:auto;">← ZURÜCK ZUM KADER</button>
            <div style="margin-top:30px; background:rgba(255,255,255,0.02); padding:20px; border-radius:15px;">
                <h3>${p.name} (#${p.number})</h3>
                <hr style="border:0; border-top:1px solid #333; margin:20px 0;">
                <p>Status: <b>${p.status}</b></p>
                <p>Leistung (km): <b>${p.km || 0}</b></p>
                <p>Puls (HF): <b>${p.hr || 0}</b></p>
            </div>
        `;
    },

    addPlayerPrompt() {
        const n = prompt("Name:");
        const num = prompt("Nummer:");
        if(!n || !num) return;
        let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        pl.push({id:Date.now(), name:n, number:num, status:"Anwesend", rating_t:3, km:0, hr:0});
        localStorage.setItem('toni_players', JSON.stringify(pl));
        this.renderSporttasche();
    }
};
