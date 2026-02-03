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

    // --- SEKTOR 1: SPORTTASCHE (Kader, Status, Uhr-Daten) ---
    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        target.innerHTML = `
            <div class="sport-layout">
                <div class="player-management">
                    <button class="login-btn" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER SPIELER</button>
                    <div class="pro-player-list">
                        ${players.map(p => `
                            <div class="p-card ${p.status || 'Anwesend'}" onclick="BriefcaseUI.openSetcard(${p.id})">
                                <div class="p-status-dot"></div>
                                <b>#${p.number} ${p.name}</b>
                                <span>${p.status || 'Anwesend'}</span>
                                <div class="p-stars"> ${'★'.repeat(p.rating_t || 0)}${'☆'.repeat(5 - (p.rating_t || 0))}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="taktik-sidebar">
                    <h3>FORMATIONEN</h3>
                    <button class="board-btn" onclick="BriefcaseUI.applyFormation('433')">4-3-3 GLEITEN</button>
                    <button class="board-btn" onclick="BriefcaseUI.applyFormation('352')">3-5-2 GLEITEN</button>
                </div>
            </div>`;
    },

    // --- SEKTOR 2: MARKETING (Stadionzeitung & Sponsoring) ---
    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="marketing-tabs">
                <button class="tab-pill active" id="tab-zeitung" onclick="BriefcaseUI.toggleMarketing('zeitung')">STADIONZEITUNG (4 SEITEN)</button>
                <button class="tab-pill" id="tab-sponsoring" onclick="BriefcaseUI.toggleMarketing('sponsoring')">SPONSOREN-AGENTUR</button>
            </div>
            <div id="m-zeitung" class="magazine-view">
                <div class="mag-page"><b>SEITE 1: COVER</b><br><small>Logo & Top-Sponsoren</small><input type="text" placeholder="Vereinsname" class="mag-input"></div>
                <div class="mag-page"><b>SEITE 2: TRAINER-TALK</b><br><textarea placeholder="Dein Grußwort..." class="mag-area"></textarea></div>
                <div class="mag-page"><b>SEITE 3: RÜCKBLICK</b><br><textarea placeholder="Spielbericht & Tabelle" class="mag-area"></textarea></div>
                <div class="mag-page"><b>SEITE 4: DANKSAGUNG</b><br><small>Sponsoren-Wall</small></div>
                <button class="login-btn" onclick="window.print()">ALS PDF / DRUCK EXPORTIEREN</button>
            </div>
            <div id="m-sponsoring" class="hidden">
                <div class="sponsoring-tool">
                    <h4>TONI'S PAKET-RECHNER</h4>
                    <select id="s-package" onchange="BriefcaseUI.calcSponsor()">
                        <option value="0">Paket wählen...</option>
                        <option value="500">Bandenwerbung (Saison)</option>
                        <option value="1200">Trikot-Branding</option>
                        <option value="300">Stadionzeitung Anzeige</option>
                        <option value="800">Turnier-Patenschaft</option>
                    </select>
                    <div id="s-result" class="toni-speech-bubble" style="margin-top:20px;">Wähle ein Modul. Ich berechne den fairen Marktwert.</div>
                </div>
            </div>`;
    },

    toggleMarketing(view) {
        document.getElementById('m-zeitung').classList.toggle('hidden', view === 'sponsoring');
        document.getElementById('m-sponsoring').classList.toggle('hidden', view === 'zeitung');
        document.getElementById('tab-zeitung').classList.toggle('active', view === 'zeitung');
        document.getElementById('tab-sponsoring').classList.toggle('active', view === 'sponsoring');
    },

    calcSponsor() {
        const val = document.getElementById('s-package').value;
        const res = document.getElementById('s-result');
        if(val == 0) return;
        res.innerHTML = `<b>Toni's Empfehlung:</b> Basierend auf regionalen Daten empfehle ich einen Preis von <b>${val} €</b>. <br><br><i>Argument: "Durch das Kinderturnier erreichen wir direkt 200+ Familien der Region."</i>`;
    },

    // --- SEKTOR 3: ANALYSE (Team-Matrix) ---
    renderAnalysezentrum() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const avgRating = players.length > 0 ? (players.reduce((acc, p) => acc + (p.rating_t || 0), 0) / players.length).toFixed(1) : 0;
        
        document.getElementById('active-content').innerHTML = `
            <div class="analysis-grid">
                <div class="a-card"><h4>TEAM-PERFORMANCE</h4><div style="font-size:40px; color:var(--accent-orange);">${avgRating} / 5 ★</div></div>
                <div class="a-card"><h4>BELASTUNGS-CHECK</h4><p>Toni prüft km-Daten & Pulswerte aus der Sporttasche...</p></div>
            </div>`;
    },

    // --- SETCARD: DER DETAIIL-BEREICH (Soll-Erfüllung) ---
    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(x => x.id === id);
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div class="setcard-header">
                <button onclick="BriefcaseUI.switchSektor('sport')" class="back-btn-ui">← ZURÜCK</button>
                <div class="tab-pill-box">
                    <button onclick="BriefcaseUI.toggleTab('front')" id="t-front" class="tab-pill active">STRECKBRIEF</button>
                    <button onclick="BriefcaseUI.toggleTab('back')" id="t-back" class="tab-pill">TRAINER-ANALYSE (UHR-DATEN)</button>
                </div>
            </div>
            <div id="sc-front" class="sc-content">
                <h3>${p.name} (#${p.number})</h3>
                <label>STATUS:</label>
                <select onchange="BriefcaseUI.upd(${p.id}, 'status', this.value)">
                    <option ${p.status==='Anwesend'?'selected':''}>Anwesend</option>
                    <option ${p.status==='Abwesend'?'selected':''}>Abwesend</option>
                    <option ${p.status==='Verletzt'?'selected':''}>Verletzt</option>
                </select>
                <br><br>
                <label>TRAININGS-BEWERTUNG:</label>
                <input type="range" min="1" max="5" value="${p.rating_t || 3}" onchange="BriefcaseUI.upd(${p.id}, 'rating_t', this.value)">
            </div>
            <div id="sc-back" class="sc-content hidden">
                <h4>⌚ SPORTUHR-IMPORT (MANUELL)</h4>
                <label>DURCHSCHNITTSPULS (HF):</label>
                <input type="number" value="${p.hr || 0}" onchange="BriefcaseUI.upd(${p.id}, 'hr', this.value)">
                <label>LAUFLEISTUNG (KM):</label>
                <input type="number" step="0.1" value="${p.km || 0}" onchange="BriefcaseUI.upd(${p.id}, 'km', this.value)">
                <div class="toni-speech-bubble" style="margin-top:20px;">
                    <b>Toni's Analyse:</b> ${p.km > 10 ? 'Hohe Belastung! Morgen Regeneration.' : 'Gute Basiswerte.'}
                </div>
            </div>`;
    },

    toggleTab(view) {
        document.getElementById('sc-front').classList.toggle('hidden', view === 'back');
        document.getElementById('sc-back').classList.toggle('hidden', view === 'front');
        document.getElementById('t-front').classList.toggle('active', view === 'front');
        document.getElementById('t-back').classList.toggle('active', view === 'back');
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
        pl.push({id:Date.now(), name:n, number:num, pos:"ZDM", status:"Anwesend", rating_t:3});
        localStorage.setItem('toni_players', JSON.stringify(pl));
        this.renderSporttasche();
    }
};
