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

        if (sektor === 'sport') this.renderSporttasche();
        else if (sektor === 'marketing') this.renderMarketing();
        else if (sektor === 'analyse') this.renderAnalysezentrum();
    },

    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        let html = `<h3>KADER</h3><div class="player-grid">`;
        players.forEach(p => {
            html += `<div class="player-entry" onclick="BriefcaseUI.openSetcard(${p.id})" style="cursor:pointer; padding:15px; background:rgba(255,255,255,0.05); margin-bottom:10px; border-radius:8px;">
                        <b>#${p.number}</b> ${p.name} (${p.pos})
                     </div>`;
        });
        html += `</div><button onclick="BriefcaseUI.addPlayerPrompt()" class="action-btn">+ SPIELER</button>`;
        target.innerHTML = html;
    },

    openSetcard(id) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
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
                    <div class="c-inner">
                        <div style="font-size:40px; font-weight:900;">${ovr}</div>
                        <div style="font-size:80px;">👤</div>
                        <div style="font-weight:bold; font-size:20px;">${p.name.toUpperCase()}</div>
                        <div style="font-size:12px; margin-top:10px;">PAC ${p.pac} | SHO ${p.sho} | PAS ${p.pas}</div>
                    </div>
                </div>
                <div class="edit-stats">
                    <h4>WERTE ANPASSEN</h4>
                    <label>PAC</label> <input type="number" value="${p.pac}" onchange="BriefcaseUI.updateStat(${p.id}, 'pac', this.value)">
                    <label>SHO</label> <input type="number" value="${p.sho}" onchange="BriefcaseUI.updateStat(${p.id}, 'sho', this.value)">
                </div>
            </div>

            <div id="sc-back" class="sc-side hidden">
                <div class="analysis-box">
                    <h4>🏃 PHYSISCHE DATEN</h4>
                    <label>HERZFREQUENZ (PULS)</label>
                    <input type="number" value="${p.hr || 0}" onchange="BriefcaseUI.updateStat(${p.id}, 'hr', this.value)">
                    <label>LAUFLEISTUNG (KM)</label>
                    <input type="number" step="0.1" value="${p.dist || 0}" onchange="BriefcaseUI.updateStat(${p.id}, 'dist', this.value)">
                </div>
                <div class="analysis-box">
                    <h4>🧠 PSYCHOLOGIE</h4>
                    <label>MENTALER STATUS</label>
                    <select onchange="BriefcaseUI.updateStat(${p.id}, 'mental', this.value)">
                        <option ${p.mental==='Fokussiert'?'selected':''}>Fokussiert</option>
                        <option ${p.mental==='Frustriert'?'selected':''}>Frustriert</option>
                        <option ${p.mental==='Lethargisch'?'selected':''}>Lethargisch</option>
                    </select>
                    <button class="action-btn" style="margin-top:20px; width:100%;" onclick="BriefcaseUI.triggerToniAdvice(${p.id})">TONI FRAGEN</button>
                </div>
            </div>
            <button onclick="BriefcaseUI.switchSektor('sport')" class="back-btn" style="margin-top:20px;">← ZURÜCK ZUM KADER</button>
        `;
    },

    toggleTab(side) {
        // Explizites Umschalten der Klassen
        const front = document.getElementById('sc-front');
        const back = document.getElementById('sc-back');
        const btnFront = document.getElementById('t-front');
        const btnBack = document.getElementById('t-back');

        if(side === 'front') {
            front.classList.remove('hidden');
            back.classList.add('hidden');
            btnFront.classList.add('active');
            btnBack.classList.remove('active');
        } else {
            front.classList.add('hidden');
            back.classList.remove('hidden');
            btnFront.classList.remove('active');
            btnBack.classList.add('active');
        }
    },

    updateStat(id, stat, value) {
        let players = JSON.parse(localStorage.getItem('toni_players'));
        const p = players.find(player => player.id === id);
        p[stat] = isNaN(value) ? value : parseFloat(value);
        localStorage.setItem('toni_players', JSON.stringify(players));
    },

    triggerToniAdvice(id) {
        alert("Toni analysiert... (Check das Panel rechts für die Antwort!)");
        // Logik für das rechte Panel hier einfügen
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
