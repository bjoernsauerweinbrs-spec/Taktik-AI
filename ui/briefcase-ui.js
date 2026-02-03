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
            title.innerHTML = "👟 SPORTTASCHE // KADER & TRAINING";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerHTML = "📢 MARKETING // BUSINESS & ORGA";
            this.renderMarketing();
        } else if (sektor === 'analyse') {
            title.innerHTML = "📊 ANALYSEZENTRUM // TIEFEN-DATEN";
            this.renderAnalysezentrum();
        }
    },

    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        let html = `
            <div class="pro-header">
                <button onclick="BriefcaseUI.addPlayerPrompt()" class="action-btn">+ NEUER SPIELER</button>
            </div>
            <div class="player-grid-pro">`;
        players.forEach(p => {
            html += `
                <div class="player-row-pro" onclick="BriefcaseUI.openSetcard(${p.id})">
                    <div class="p-identity"><span class="p-num">#${p.number || '0'}</span> <b>${p.name}</b></div>
                    <div class="p-meta"><span>${p.pos || 'ZDM'}</span> <div class="status-indicator"></div></div>
                </div>`;
        });
        html += `</div>`;
        target.innerHTML = html;
    },

    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        const target = document.getElementById('active-content');
        const ovr = Math.round(((p.pac||50)+(p.sho||50)+(p.pas||50)+(p.dri||50)+(p.def||50)+(p.phy||50))/6);

        target.innerHTML = `
            <div class="setcard-interface">
                <div class="setcard-nav-pro">
                    <button onclick="BriefcaseUI.switchSektor('sport')" class="back-btn-small">← ZURÜCK</button>
                    <div class="tab-pill-box">
                        <button onclick="BriefcaseUI.toggleTab('front')" id="t-front" class="tab-pill active">FIFA-LOOK</button>
                        <button onclick="BriefcaseUI.toggleTab('back')" id="t-back" class="tab-pill">TRAINER-ANALYSE</button>
                    </div>
                </div>

                <div id="sc-front" class="sc-side">
                    <div class="fifa-pro-layout">
                        <div class="fifa-card-pro gold-theme">
                            <div class="c-rating">${ovr}</div>
                            <div class="c-pos">${p.pos}</div>
                            <div class="c-avatar">👤</div>
                            <div class="c-name">${p.name.toUpperCase()}</div>
                            <div class="c-stats-grid">
                                <div><span>${p.pac}</span> PAC</div><div><span>${p.sho}</span> SHO</div>
                                <div><span>${p.pas}</span> PAS</div><div><span>${p.dri}</span> DRI</div>
                                <div><span>${p.def}</span> DEF</div><div><span>${p.phy}</span> PHY</div>
                            </div>
                        </div>
                        <div class="quick-edit">
                            <h4>KERN-ATTRIBUTE</h4>
                            <div class="input-row">
                                <label>PAC</label><input type="number" value="${p.pac}" onchange="BriefcaseUI.updateStat(${p.id}, 'pac', this.value)">
                                <label>SHO</label><input type="number" value="${p.sho}" onchange="BriefcaseUI.updateStat(${p.id}, 'sho', this.value)">
                            </div>
                            <div class="input-row">
                                <label>PAS</label><input type="number" value="${p.pas}" onchange="BriefcaseUI.updateStat(${p.id}, 'pas', this.value)">
                                <label>DRI</label><input type="number" value="${p.dri}" onchange="BriefcaseUI.updateStat(${p.id}, 'dri', this.value)">
                            </div>
                        </div>
                    </div>
                </div>

                <div id="sc-back" class="sc-side hidden">
                    <div class="trainer-analysis-pro">
                        <div class="analysis-box">
                            <h5>🏃 PHYSIS & PULS</h5>
                            <label>HF MAX</label><input type="number" value="${p.hr || 0}" onchange="BriefcaseUI.updateStat(${p.id}, 'hr', this.value)">
                            <label>DISTANZ (KM)</label><input type="number" value="${p.dist || 0}" onchange="BriefcaseUI.updateStat(${p.id}, 'dist', this.value)">
                        </div>
                        <div class="analysis-box">
                            <h5>🧠 PSYCHOLOGIE</h5>
                            <label>STATUS</label>
                            <select onchange="BriefcaseUI.updateStat(${p.id}, 'mental', this.value)">
                                <option ${p.mental==='Fokussiert'?'selected':''}>Fokussiert</option>
                                <option ${p.mental==='Lethargisch'?'selected':''}>Lethargisch</option>
                                <option ${p.mental==='Frustriert'?'selected':''}>Frustriert</option>
                            </select>
                            <button class="toni-advice-btn" onclick="BriefcaseUI.triggerToniAdvice(${p.id})">TONI UM RAT FRAGEN</button>
                        </div>
                    </div>
                </div>
            </div>`;
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

    triggerToniAdvice(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        const panel = document.getElementById('setcard-content');
        let txt = p.mental === 'Frustriert' ? "Björn, er braucht ein Einzelgespräch. Fokus auf seine Führungsrolle legen!" : "Status stabil. Brazilian Style Training kann intensiviert werden.";
        panel.innerHTML = `<div class="toni-speech-bubble"><b>TONI:</b> ${txt}</div>`;
    },

    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="marketing-dashboard">
                <div class="m-card blue">
                    <h4>📰 STADIONZEITUNG</h4>
                    <textarea id="m-notes" class="m-area"></textarea>
                    <button onclick="BriefcaseUI.saveM()" class="action-btn">TEXT SICHERN</button>
                </div>
                <div class="m-card gold">
                    <h4>🤝 SPONSOREN-STATUS</h4>
                    <div class="sponsor-list">Logos werden hier synchronisiert...</div>
                </div>
            </div>`;
        const saved = localStorage.getItem('toni_marketing');
        if(saved) document.getElementById('m-notes').value = saved;
    },

    saveM() { localStorage.setItem('toni_marketing', document.getElementById('m-notes').value); alert("Marketing-Daten gesichert."); },

    renderAnalysezentrum() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div class="analysis-pro-hub">
                <div class="hub-card"><h4>TEAM-MORAL</h4><div class="gauge">Stabil</div></div>
                <div class="hub-card"><h4>BELASTUNGS-RADAR</h4><div class="gauge">Optimal</div></div>
            </div>`;
    },

    addPlayerPrompt() {
        const name = prompt("Name:");
        const num = prompt("Nummer:");
        if(!name || !num) return;
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({id: Date.now(), name, number: num, pos: "ZDM", pac:50, sho:50, pas:50, dri:50, def:50, phy:50, mental:'Fokussiert'});
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderSporttasche();
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
