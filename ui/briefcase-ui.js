window.BriefcaseUI = {
    // Grundfunktionen
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
        const target = document.getElementById('active-content');
        const title = document.getElementById('sector-title');

        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            title.innerText = "👟 SPORTTASCHE // TRAINING & KADER";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerText = "📢 MARKETING // SPONSOREN & PR";
            this.renderMarketing();
        } else if (sektor === 'analyse') {
            title.innerText = "📊 ANALYSEZENTRUM // PERFORMANCE";
            this.renderAnalysezentrum();
        }
    },

    // --- SEKTOR 1: SPORTTASCHE (Inkl. gleitende Formationen) ---
    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:30px;">
                <div>
                    <h3>KADER-VERWALTUNG</h3>
                    <div class="player-list-pro">
                        ${players.map(p => `
                            <div class="player-row-pro" onclick="BriefcaseUI.openSetcard(${p.id})">
                                <b>#${p.number}</b> ${p.name} <span>${p.pos}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="action-btn" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER SPIELER</button>
                </div>
                <div class="formation-box">
                    <h3>TAKTIK-BOARDS</h3>
                    <button class="board-btn" onclick="BriefcaseUI.applyFormation('433')">Formation 4-3-3</button>
                    <button class="board-btn" onclick="BriefcaseUI.applyFormation('352')">Formation 3-5-2</button>
                    <button class="board-btn" onclick="arena.resetBoard()">Feld leeren</button>
                </div>
            </div>`;
    },

    applyFormation(type) {
        if(!window.arena) return;
        const coords = {
            '433': [
                {x: 400, y: 550}, {x: 300, y: 450}, {x: 500, y: 450}, {x: 200, y: 450}, {x: 600, y: 450},
                {x: 400, y: 300}, {x: 300, y: 320}, {x: 500, y: 320},
                {x: 400, y: 100}, {x: 250, y: 150}, {x: 550, y: 150}
            ],
            '352': [
                {x: 400, y: 550}, {x: 400, y: 450}, {x: 250, y: 450}, {x: 550, y: 450},
                {x: 400, y: 300}, {x: 250, y: 300}, {x: 550, y: 300}, {x: 320, y: 350}, {x: 480, y: 350},
                {x: 350, y: 100}, {x: 450, y: 100}
            ]
        };
        // Signal an arena.js zum Gleiten der roten Spieler
        arena.animateFormation(coords[type]);
        this.toggle(); // Schließt die Tasche, um die Animation zu sehen
    },

    // --- SEKTOR 2: MARKETING (Toni als Berater) ---
    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="m-box">
                    <h4>📰 STADIONZEITUNG</h4>
                    <textarea id="stadion-text" class="orga-box"></textarea>
                    <button class="action-btn" onclick="BriefcaseUI.saveMarketing()">TEXT SPEICHERN</button>
                </div>
                <div class="m-box">
                    <h4>🤝 TONI'S SPONSOREN-STRATEGIE</h4>
                    <div class="toni-speech-bubble" style="font-size:12px;">
                        "Björn, für neue Sponsoren empfehle ich das 'Ginga-Paket'. Zeige ihnen exklusive Daten der Technik-Werte. Unternehmen lieben die Verbindung von Innovation und brasilianischem Flair."
                    </div>
                </div>
            </div>`;
        document.getElementById('stadion-text').value = localStorage.getItem('toni_marketing') || "";
    },

    saveMarketing() {
        localStorage.setItem('toni_marketing', document.getElementById('stadion-text').value);
        alert("Inhalte gesichert.");
    },

    // --- SEKTOR 3: ANALYSEZENTRUM (Graphen & Durchschnitt) ---
    renderAnalysezentrum() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        const avgFitness = players.length > 0 ? Math.round(players.reduce((acc, p) => acc + (p.phy || 50), 0) / players.length) : 0;

        target.innerHTML = `
            <div class="analysis-dashboard">
                <div class="dashboard-card">
                    <h4>TEAM-DURCHSCHNITT</h4>
                    <div style="font-size:48px; color:var(--f8b500); font-weight:900;">${avgFitness}%</div>
                    <p>Physische Gesamtverfassung</p>
                </div>
                <div class="dashboard-card">
                    <h4>FITNESS-BAROMETER (KADER)</h4>
                    <div class="bar-chart">
                        ${players.slice(0, 5).map(p => `
                            <div class="bar-container">
                                <div class="bar" style="height:${p.phy}%"></div>
                                <span>#${p.number}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
    },

    // --- PLAYER & SETCARD LOGIK ---
    openSetcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        const target = document.getElementById('active-content');
        const ovr = Math.round(((p.pac||50)+(p.sho||50)+(p.pas||50)+(p.dri||50)+(p.def||50)+(p.phy||50))/6);

        target.innerHTML = `
            <div class="tab-pill-box">
                <button onclick="BriefcaseUI.toggleTab('front')" id="t-front" class="tab-pill active">FIFA-LOOK</button>
                <button onclick="BriefcaseUI.toggleTab('back')" id="t-back" class="tab-pill">TRAINER-ANALYSE</button>
            </div>
            <div id="sc-front" class="sc-side">
                <div class="fifa-card-pro">
                    <div style="background:#111; height:100%; border-radius:10px; padding:20px; text-align:center;">
                        <div style="font-size:35px; font-weight:900; color:#f8b500;">${ovr}</div>
                        <div style="font-size:60px;">👤</div>
                        <div style="font-weight:900; font-size:18px; color:#fff;">${p.name.toUpperCase()}</div>
                    </div>
                </div>
                <div class="edit-panel">
                    <h3>KERN-STATS</h3>
                    <label>PAC</label><input type="number" value="${p.pac}" onchange="BriefcaseUI.updateStat(${p.id}, 'pac', this.value)">
                    <label>PHY</label><input type="number" value="${p.phy}" onchange="BriefcaseUI.updateStat(${p.id}, 'phy', this.value)">
                </div>
            </div>
            <div id="sc-back" class="sc-side hidden">
                <div class="analysis-box">
                    <h4>🧠 PSYCHOLOGIE & TONI'S RAT</h4>
                    <label>MOTIVATION (0-100)</label>
                    <input type="range" value="${p.motivation || 50}" onchange="BriefcaseUI.updateStat(${p.id}, 'motivation', this.value)">
                    <div class="toni-secret-tip" id="toni-tip-field">
                        "Björn, klicke auf 'ANALYSE', um meinen Tipp zu hören."
                    </div>
                    <button class="action-btn" onclick="BriefcaseUI.generateToniTip(${p.id})">ANALYSE STARTEN</button>
                </div>
            </div>
            <button onclick="BriefcaseUI.switchSektor('sport')" class="back-btn-ui" style="margin-top:20px;">ZURÜCK</button>`;
    },

    toggleTab(side) {
        document.getElementById('sc-front').classList.toggle('hidden', side === 'back');
        document.getElementById('sc-back').classList.toggle('hidden', side === 'front');
        document.getElementById('t-front').classList.toggle('active', side === 'front');
        document.getElementById('t-back').classList.toggle('active', side === 'back');
    },

    updateStat(id, stat, value) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        p[stat] = isNaN(value) ? value : parseFloat(value);
        localStorage.setItem('toni_players', JSON.stringify(players));
    },

    generateToniTip(id) {
        const p = JSON.parse(localStorage.getItem('toni_players')).find(player => player.id === id);
        const tipField = document.getElementById('toni-tip-field');
        const tips = [
            `Björn, ${p.name} braucht heute das 'Ginga'-Gefühl. Weniger Taktik, mehr Freiheit.`,
            `Vorsicht: Die Belastungswerte von #${p.number} sind kritisch. Ein lockeres Auslaufen ist ratsam.`,
            `Motivation ist der Schlüssel. Erinnere ihn an seine Stärken im 1-gegen-1.`
        ];
        tipField.innerText = tips[Math.floor(Math.random()*tips.length)];
    },

    addPlayerPrompt() {
        const name = prompt("Name:");
        const num = prompt("Nummer:");
        if(!name || !num) return;
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({id: Date.now(), name, number: num, pos: "ZDM", pac:50, sho:50, pas:50, dri:50, def:50, phy:50, motivation:50});
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderSporttasche();
    }
};
