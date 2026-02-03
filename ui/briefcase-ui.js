window.BriefcaseUI = {
    // Grundnavigation
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

    // --- SEKTOR 1: SPORTTASCHE (Kader & Training) ---
    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:30px;">
                <div>
                    <button class="login-btn" style="width:auto; padding:10px 20px;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER SPIELER</button>
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
                <div class="taktik-sidebar">
                    <h3>TAKTIK-BOARDS</h3>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('433')">FORMATION 4-3-3</button>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('352')">FORMATION 3-5-2</button>
                    <button class="login-btn" style="width:100%; background:#444;" onclick="arena.resetBoard()">FELD LEEREN</button>
                </div>
            </div>`;
    },

    // --- SEKTOR 2: MARKETING (Zeitung & Sponsoren) ---
    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="marketing-tabs" style="margin-bottom:20px;">
                <button class="login-btn" style="width:auto; margin-right:10px;" onclick="BriefcaseUI.toggleMarketing('zeitung')">STADIONZEITUNG</button>
                <button class="login-btn" style="width:auto; background:#222;" onclick="BriefcaseUI.toggleMarketing('sponsoring')">SPONSOREN-AGENTUR</button>
            </div>
            <div id="m-zeitung" class="magazine-view">
                <div class="mag-page"><b>SEITE 1: COVER</b><input type="text" placeholder="Vereinsname / Headline" class="mag-input"><p><small>Sponsoren-Slots aktiv</small></p></div>
                <div class="mag-page"><b>SEITE 2: TRAINER-TALK</b><textarea placeholder="Dein Grußwort zur Woche..." class="mag-area"></textarea></div>
                <div class="mag-page"><b>SEITE 3: RÜCKBLICK</b><textarea placeholder="Spielbericht & Tabelle..." class="mag-area"></textarea></div>
                <div class="mag-page"><b>SEITE 4: DANKSAGUNG</b><p>Wall of Fame für unsere Partner.</p></div>
                <button class="login-btn" style="grid-column: span 2;" onclick="window.print()">AUSGABE DRUCKEN (PDF)</button>
            </div>
            <div id="m-sponsoring" class="hidden">
                <div class="sponsoring-tool">
                    <h4>TONI'S SPONSOREN-CONSULTANT</h4>
                    <select id="s-package" onchange="BriefcaseUI.calcSponsor()" class="login-input" style="width:100%;">
                        <option value="0">Leistung wählen...</option>
                        <option value="450">Bandenwerbung (pro Saison)</option>
                        <option value="1500">Haupt-Trikotsponsor</option>
                        <option value="250">Anzeige Stadionzeitung</option>
                        <option value="750">Patenschaft Jugendturnier</option>
                    </select>
                    <div id="s-result" class="toni-speech-bubble" style="margin-top:20px;">Wähle ein Paket, damit Toni den Wert analysiert.</div>
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
        res.innerHTML = `<b>Toni's Paket-Analyse:</b><br>Empfohlener Preis: <b>${val} €</b><br><br><i>"Björn, dieses Paket ist für lokale Unternehmen attraktiv, weil es Reichweite bei Familien garantiert."</i>`;
    },

    // --- SEKTOR 3: ANALYSE (Matrix) ---
    renderAnalysezentrum() {
        const pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        const avg = pl.length > 0 ? (pl.reduce((a, b) => a + (b.rating_t || 0), 0) / pl.length).toFixed(1) : 0;
        document.getElementById('active-content').innerHTML = `
            <div class="analysis-grid">
                <div class="a-card"><h4>TEAM-PERFORMANCE</h4><div style="font-size:50px; color:var(--accent-orange);">${avg} / 5</div></div>
                <div class="a-card"><h4>SPORTUHR-STATUS</h4><p>Alle manuellen HF- und KM-Daten sind synchronisiert.</p></div>
            </div>`;
    },

    // --- PLAYER ACTIONS & SETCARD ---
    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(x => x.id === id);
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div class="setcard-header" style="margin-bottom:20px;">
                <button onclick="BriefcaseUI.switchSektor('sport')" class="login-btn" style="width:auto; background:#444;">← KADER</button>
                <div style="margin-top:20px;">
                    <button onclick="BriefcaseUI.toggleTab('front')" class="login-btn" style="width:auto; margin-right:10px;">BASICS</button>
                    <button onclick="BriefcaseUI.toggleTab('back')" class="login-btn" style="width:auto;">TRAINER-ANALYSE</button>
                </div>
            </div>
            <div id="sc-front">
                <h3>SPIELER: ${p.name} (#${p.number})</h3>
                <label>STATUS (Ampelsystem):</label><br>
                <select class="login-input" onchange="BriefcaseUI.upd(${p.id}, 'status', this.value)">
                    <option ${p.status==='Anwesend'?'selected':''}>Anwesend</option>
                    <option ${p.status==='Abwesend'?'selected':''}>Abwesend</option>
                    <option ${p.status==='Verletzt'?'selected':''}>Verletzt</option>
                </select><br>
                <label>TRAININGS-BEWERTUNG (1-5 Sterne):</label>
                <input type="range" min="1" max="5" value="${p.rating_t || 3}" onchange="BriefcaseUI.upd(${p.id}, 'rating_t', this.value)">
            </div>
            <div id="sc-back" class="hidden">
                <h4>⌚ SPORTUHR DATEN-EINGABE</h4>
                <label>KM-LEISTUNG:</label>
                <input type="number" step="0.1" class="login-input" value="${p.km || 0}" onchange="BriefcaseUI.upd(${p.id}, 'km', this.value)">
                <label>DURCHSCHNITTS-PULS (HF):</label>
                <input type="number" class="login-input" value="${p.hr || 0}" onchange="BriefcaseUI.upd(${p.id}, 'hr', this.value)">
                <div class="toni-speech-bubble" style="margin-top:20px;"><b>Toni:</b> Belastung bei ${p.km || 0}km ist ${p.km > 8 ? 'hoch' : 'moderat'}.</div>
            </div>`;
    },

    toggleTab(v) {
        document.getElementById('sc-front').classList.toggle('hidden', v==='back');
        document.getElementById('sc-back').classList.toggle('hidden', v==='front');
    },

    upd(id, k, v) {
        let pl = JSON.parse(localStorage.getItem('toni_players'));
        const p = pl.find(x => x.id === id);
        p[k] = isNaN(v) ? v : parseFloat(v);
        localStorage.setItem('toni_players', JSON.stringify(pl));
    },

    applyFormation(type) {
        const coords = {
            '433': [{x:400,y:540},{x:250,y:450},{x:550,y:450},{x:150,y:400},{x:650,y:400},{x:400,y:350},{x:300,y:300},{x:500,y:300},{x:400,y:100},{x:200,y:150},{x:600,y:150}],
            '352': [{x:400,y:540},{x:300,y:450},{x:500,y:450},{x:400,y:380},{x:200,y:300},{x:600,y:300},{x:300,y:250},{x:500,y:250},{x:400,y:280},{x:350,y:100},{x:450,y:100}]
        };
        if(window.arena) arena.animateFormation(coords[type]);
        this.toggle(); 
    },

    addPlayerPrompt() {
        const n = prompt("Name:"), num = prompt("Nummer:");
        if(!n || !num) return;
        let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        pl.push({id:Date.now(), name:n, number:num, status:"Anwesend", rating_t:3, km:0, hr:0});
        localStorage.setItem('toni_players', JSON.stringify(pl));
        this.renderSporttasche();
    }
};
