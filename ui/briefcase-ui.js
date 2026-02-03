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
        // Hier setzen wir die Musterinhalte direkt ein
        const musterClub = "FC TONI 2.0 - MATCHDAY MAG";
        const musterTalk = "Willkommen in der neuen Ära! Wir setzen heute auf brasilianische Technik. Gruß, Trainer Björn.";
        const musterBericht = "Sieg im letzten Spiel! Die 4-3-3 Formation hat die Räume perfekt genutzt.";

        target.innerHTML = `
            <div style="margin-bottom:20px; display:flex; gap:10px;">
                <button class="login-btn" style="width:auto;" onclick="BriefcaseUI.toggleMarketing('zeitung')">STADIONZEITUNG</button>
                <button class="login-btn" style="width:auto; background:#222;" onclick="BriefcaseUI.toggleMarketing('sponsoring')">SPONSOREN-AGENTUR</button>
            </div>
            
            <div id="m-zeitung" class="magazine-view">
                <div class="mag-page">
                    <b>SEITE 1: COVER</b>
                    <input type="text" class="mag-area" style="height:auto; font-weight:bold; font-size:1.2rem;" value="${musterClub}">
                    <div style="margin:10px 0; border:1px solid #ccc; height:100px; background:#f0f0f0; display:flex; align-items:center; justify-content:center;">LOGO: FC TONI 2.0</div>
                    <p style="font-size:0.7rem;">TOP-SPONSOR: TONI AI SYSTEMS</p>
                </div>
                <div class="mag-page">
                    <b>SEITE 2: TRAINER-TALK</b>
                    <textarea class="mag-area">${musterTalk}</textarea>
                </div>
                <div class="mag-page">
                    <b>SEITE 3: RÜCKBLICK</b>
                    <textarea class="mag-area">${musterBericht}</textarea>
                </div>
                <div class="mag-page">
                    <b>SEITE 4: SPONSOREN</b>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; font-size:0.6rem;">
                        <div style="border:1px solid #ccc; padding:5px;">GINGA SPORTS</div>
                        <div style="border:1px solid #ccc; padding:5px;">BRAZIL-FOOTWEAR</div>
                    </div>
                    <p style="margin-top:auto; font-size:0.8rem; text-align:center;">Powered by Björn & Toni 2.0</p>
                </div>
                <button class="login-btn" style="grid-column: span 2;" onclick="window.print()">ZEITUNG JETZT DRUCKEN</button>
            </div>

            <div id="m-sponsoring" class="hidden">
                <div class="sponsoring-tool">
                    <h4>SPONSOREN-RECHNER</h4>
                    <select id="s-package" class="login-input" onchange="BriefcaseUI.calcSponsor()">
                        <option value="0">Wähle Paket...</option>
                        <option value="500">Bandenwerbung</option>
                        <option value="1200">Trikotsponsor</option>
                    </select>
                    <div id="s-result" class="toni-speech-bubble" style="margin-top:20px;">Toni berechnet den Wert...</div>
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
        res.innerHTML = `Toni empfiehlt: <b>${val} €</b>. Björn, das Paket stärkt unsere lokale Präsenz!`;
    },

    renderAnalysezentrum() {
        document.getElementById('active-content').innerHTML = `<p>Analyse-Matrix geladen. Alle Systeme im grünen Bereich.</p>`;
    },

    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(x => x.id === id);
        document.getElementById('active-content').innerHTML = `
            <button onclick="BriefcaseUI.switchSektor('sport')" class="login-btn" style="width:auto;">← KADER</button>
            <h3>${p.name} (#${p.number})</h3>
            <p>KM: ${p.km || 0} | HF: ${p.hr || 0}</p>
        `;
    }
};
