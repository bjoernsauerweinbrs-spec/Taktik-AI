window.BriefcaseUI = {
    // Grundlegende Navigation der Aktentasche
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

    // --- SEKTOR 1: SPORTTASCHE (Kader, Status, Uhr-Daten) ---
    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:30px;">
                <div class="player-management">
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
                <div class="taktik-sidebar">
                    <h3 style="color:var(--accent-orange);">TAKTIK-BOARDS</h3>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('433')">4-3-3 GLEITEN</button>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('352')">3-5-2 GLEITEN</button>
                    <button class="login-btn" style="width:100%; background:#444;" onclick="arena.resetBoard()">FELD LEEREN</button>
                </div>
            </div>`;
    },

    // --- SEKTOR 2: MARKETING (Stadionzeitung & Sponsoring) ---
    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="marketing-tabs" style="margin-bottom:20px; display:flex; gap:10px;">
                <button class="login-btn" style="width:auto;" onclick="BriefcaseUI.toggleMarketing('zeitung')">STADIONZEITUNG (4 SEITEN)</button>
                <button class="login-btn" style="width:auto; background:#222;" onclick="BriefcaseUI.toggleMarketing('sponsoring')">SPONSOREN-AGENTUR</button>
            </div>
            <div id="m-zeitung" class="magazine-view">
                <div class="mag-page"><b>SEITE 1: COVER</b><input type="text" placeholder="Vereinsname / Headline" class="mag-area" style="height:auto;"></div>
                <div class="mag-page"><b>SEITE 2: TRAINER-TALK</b><textarea placeholder="Dein Grußwort..." class="mag-area"></textarea></div>
                <div class="mag-page"><b>SEITE 3: RÜCKBLICK</b><textarea placeholder="Spielbericht & Tabelle..." class="mag-area"></textarea></div>
                <div class="mag-page"><b>SEITE 4: DANKSAGUNG</b><p style="color:#333;">Sponsoren Wall of Fame</p></div>
                <button class="login-btn" style="grid-column: span 2;" onclick="window.print()">ALS PDF / DRUCK EXPORTIEREN</button>
            </div>
            <div id="m-sponsoring" class="hidden">
                <div class="sponsoring-tool">
                    <h4>TONI'S PAKET-RECHNER</h4>
                    <select id="s-package" class="login-input" style="width:100%;" onchange="BriefcaseUI.calcSponsor()">
                        <option value="0">Leistung wählen...</option>
                        <option value="500">Bandenwerbung (Saison)</option>
                        <option value="1250">Trikot-Sponsoring</option>
                        <option value="300">Stadionzeitung Anzeige</option>
                        <option value="800">Jugendturnier-Patenschaft</option>
                    </select>
                    <div id="s-result" class="toni-speech-bubble" style="margin-top:20px;">Wähle ein Modul für Toni's Analyse.</div>
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
        res.innerHTML = `<b>Toni's Empfehlung:</b><br>Ein fairer Preis liegt bei <b>${val} €</b>.<br><br><i>"Björn, das ist attraktiv für lokale Partner, da wir über das Magazin direkt die Fans erreichen."</i>`;
    },

    // --- SEKTOR 3: ANALYSE (Team-Matrix) ---
    renderAnalysezentrum() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const avgRating = players.length > 0 ? (players.reduce((acc, p) => acc + (p.rating_t || 0), 0) / players.length).toFixed(1) : 0;
        document.getElementById('active-content').innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="p-card" style="padding:40px;"><h4>TEAM-PERFORMANCE</h4><div style="font-size:50px; color:var(--accent-orange);">${avgRating} / 5</div></div>
                <div class="p-card" style="padding:40px;"><h4>STATUS-CHECK</h4><p>Alle Sportuhr-Daten (km/HF) sind im System hinterlegt.</p></div>
            </div>`;
    },

    // --- DETAIL-ANSICHT SPIELER (Setcard mit Uhr-Daten) ---
    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(x => x.id === id);
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div class="content-header" style="margin-bottom:20px;">
                <button onclick="BriefcaseUI.switchSektor('sport')" class="login-btn" style="width:auto; background:#444;">← KADER</button>
            </div>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <button onclick="BriefcaseUI.toggleTab('front')" class="login-btn" style="width:auto;">STRECKBRIEF</button>
                <button onclick="BriefcaseUI.toggleTab('back')" class="login-btn" style="width:auto; background:#222;">TRAINER-ANALYSE (UHR)</button>
            </div>
            <div id="sc-front">
                <h3>${p.name} (#${p.number})</h3>
                <label>STATUS:</label>
                <select class="login-input" onchange="BriefcaseUI.upd(${p.id}, 'status', this.value)">
                    <option ${p.status==='Anwesend'?'selected':''}>Anwesend</option>
                    <option ${p.status==='Abwesend'?'selected':''}>Abwesend</option>
                    <option ${p.status==='Verletzt'?'selected':''}>Verletzt</option>
                </select>
                <label>BEWERTUNG (1-5 Sterne):</label>
                <input type="range" min="1" max="5" value="${p.rating_t || 3}" onchange="BriefcaseUI.upd(${p.id}, 'rating_t', this.value)" style="width:100%;">
            </div>
            <div id="sc-back" class="hidden">
                <h4>⌚ SPORTUHR-IMPORT</h4>
                <label>KM-LEISTUNG:</label>
                <input type="number" step="0.1" class="login-input" value="${p.km || 0}" onchange="BriefcaseUI.upd(${p.id}, 'km', this.value)">
                <label>PULS (HF):</label>
                <input type="number" class="login-input" value="${p.hr || 0}" onchange="BriefcaseUI.upd(${p.id}, 'hr', this.value)">
                <div class="toni-speech-bubble" style="margin-top:20px;">
                    <b>Toni:</b> Belastung bei ${p.km || 0}km ist ${p.km > 10 ? 'hoch' : 'gut'}.
                </div>
            </div>`;
    },

    toggleTab(view) {
        document.getElementById('sc-front').classList.toggle('hidden', view === 'back');
        document.getElementById('sc-back').classList.toggle('hidden', view === 'front');
    },

    upd(id, key, val) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(x => x.id === id);
        p[key] = isNaN(val) ? val : parseFloat(val);
        localStorage.setItem('toni_players', JSON.stringify(players));
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
