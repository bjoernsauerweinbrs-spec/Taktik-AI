window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },

    switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const target = document.getElementById('active-content');
        
        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') { this.renderSporttasche(); }
        else if (sektor === 'marketing') { this.renderMarketing(); }
        else if (sektor === 'analyse') { this.renderAnalysezentrum(); }
    },

    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        let html = `
            <button onclick="BriefcaseUI.addPlayerPrompt()" class="action-btn" style="margin-bottom:20px;">+ SPIELER ANLEGEN</button>
            <div class="player-list">`;
        players.forEach(p => {
            html += `
                <div class="player-entry" onclick="BriefcaseUI.openSetcard(${p.id})">
                    <b>#${p.number || '0'}</b> ${p.name} <span>${p.pos || 'ZDM'}</span>
                </div>`;
        });
        html += `</div>`;
        target.innerHTML = html;
    },

    // FIX: Setcard-Funktion wiederhergestellt
    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        const target = document.getElementById('active-content');
        const ovr = Math.round(((p.pac||50)+(p.sho||50)+(p.pas||50)+(p.dri||50)+(p.def||50)+(p.phy||50))/6);

        target.innerHTML = `
            <button onclick="BriefcaseUI.switchSektor('sport')" class="back-btn">← ZURÜCK</button>
            <div style="display:flex; gap:30px;">
                <div class="fifa-card" style="width:230px; height:340px; background:var(--gold); border-radius:10px; padding:5px; position:relative;">
                    <div style="background:#1a1a1a; height:100%; padding:20px; text-align:center;">
                        <div style="font-size:40px; font-weight:900; color:#f8b500;">${ovr}</div>
                        <div style="font-size:80px;">👤</div>
                        <div style="font-weight:bold; border-bottom:2px solid #f8b500; margin-bottom:10px;">${p.name.toUpperCase()}</div>
                    </div>
                </div>
                <div class="edit-area">
                    <h3>TRAINER-ANALYSE</h3>
                    <p>Psychologie, Physis und Taktik-Werte hier bearbeiten...</p>
                </div>
            </div>`;
    },

    renderAnalysezentrum() {
        document.getElementById('active-content').innerHTML = `<h3>📊 ANALYSEZENTRUM</h3><p>Hier laufen alle Daten zusammen.</p>`;
    },

    renderMarketing() {
        document.getElementById('active-content').innerHTML = `<h3>📢 MARKETING</h3><p>Sponsoren und Stadionzeitung.</p>`;
    },

    addPlayerPrompt() {
        const name = prompt("Name:");
        const num = prompt("Rückennummer:");
        if(!name || !num) return;
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({id: Date.now(), name, number: num, pos: "ZDM", pac:50, sho:50, pas:50, dri:50, def:50, phy:50});
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderSporttasche();
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
