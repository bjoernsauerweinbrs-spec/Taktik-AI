window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },
 
    switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const target = document.getElementById('active-content');
        const title = document.getElementById('sector-title');

        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            title.innerText = "👟 SPORTTASCHE";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerText = "📢 MARKETING & ORGA";
            this.renderMarketing();
        } else if (sektor === 'analyse') {
            title.innerText = "📊 ANALYSEZENTRUM";
            this.renderAnalysezentrum();
        }
    },

    // --- SEKTOR: SPORTTASCHE ---
    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        let html = `
            <div class="sport-grid">
                <div class="squad-list">
                    <h3>KADER-VERWALTUNG</h3>
                    <button onclick="BriefcaseUI.addPlayerPrompt()" class="action-btn">+ SPIELER ANLEGEN</button>
                    <div class="player-list-scroll">`;
        players.forEach(p => {
            html += `
                <div class="player-entry" onclick="BriefcaseUI.openSetcard(${p.id})">
                    <b>#${p.number}</b> ${p.name} <span>${p.pos}</span>
                </div>`;
        });
        html += `</div></div>
                <div class="board-controls">
                    <h3>BOARD-TOOLS</h3>
                    <button class="board-btn" onclick="arena.resetBoard()">Spielfeld leeren</button>
                    <button class="board-btn">Formation: 4-3-3</button>
                    <button class="board-btn">Formation: 3-5-2</button>
                </div>
            </div>`;
        target.innerHTML = html;
    },

    // --- SEKTOR: MARKETING ---
    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="marketing-grid">
                <div class="marketing-box">
                    <h3>📰 STADIONZEITUNG</h3>
                    <textarea id="orga-notes" class="orga-box" placeholder="Schreibe hier den Leitartikel..."></textarea>
                    <button onclick="BriefcaseUI.saveOrga()" class="action-btn">TEXT SPEICHERN</button>
                </div>
                <div class="marketing-box">
                    <h3>🤝 SPONSOREN-HUB</h3>
                    <div class="sponsor-placeholder">Platzhalter: Sponsoren-Logos</div>
                    <p style="font-size:12px; color:gray;">Toni's Tipp: Brazilian Style Marketing steigert den Markenwert um 20%.</p>
                </div>
            </div>`;
        const saved = localStorage.getItem('toni_orga_notes');
        if(saved) document.getElementById('orga-notes').value = saved;
    },

    // --- SEKTOR: ANALYSEZENTRUM ---
    renderAnalysezentrum() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        // Berechnung Team-Durchschnitt
        const avgOvr = players.length > 0 ? Math.round(players.reduce((acc, p) => acc + ((p.pac||50)+(p.sho||50)+(p.pas||50)+(p.dri||50)+(p.def||50)+(p.phy||50))/6, 0) / players.length) : 0;

        target.innerHTML = `
            <div class="analysis-dashboard">
                <div class="dashboard-card health">
                    <h4>TEAM-GESUNDHEIT</h4>
                    <div class="big-stat">${avgOvr} <span>OVR</span></div>
                    <p>Kader: ${players.length} Spieler aktiv</p>
                </div>
                <div class="dashboard-card brain">
                    <h4>TONI'S TIEFENANALYSE</h4>
                    <div id="toni-deep-advice">Wähle einen Spieler in der Sporttasche für eine Detail-Analyse aus.</div>
                </div>
                <div class="dashboard-card charts">
                    <h4>FORM-KURVE</h4>
                    <div class="chart-placeholder">Grafik-Engine wird geladen...</div>
                </div>
            </div>`;
    },

    // Hilfsfunktionen
    saveOrga() {
        localStorage.setItem('toni_orga_notes', document.getElementById('orga-notes').value);
        alert("Marketing-Daten gesichert.");
    },

    addPlayerPrompt() {
        const name = prompt("Name:");
        const num = prompt("Nummer:");
        if(!name || !num) return;
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({id: Date.now(), name, number: num, pos: "IV", pac:50, sho:50, pas:50, dri:50, def:50, phy:50});
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderSporttasche();
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
