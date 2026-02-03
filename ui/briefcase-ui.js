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
        const target = document.getElementById('active-content');
        const title = document.getElementById('sector-title');

        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            title.innerText = "👟 SPORTTASCHE";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerText = "📢 MARKETING";
            this.renderMarketing();
        } else if (sektor === 'analyse') {
            title.innerText = "📊 ANALYSEZENTRUM";
            this.renderAnalysezentrum();
        }
    },

    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:20px;">
                <div class="player-list-area">
                    <h3>KADER</h3>
                    <div class="pro-scroll-list">
                        ${players.map(p => `
                            <div class="player-row-pro" onclick="BriefcaseUI.openSetcard(${p.id})">
                                <b>#${p.number}</b> ${p.name} <span>${p.pos}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="login-btn" style="width:auto; padding:10px 20px; margin-top:20px;" onclick="BriefcaseUI.addPlayerPrompt()">+ SPIELER HINZUFÜGEN</button>
                </div>
                <div class="taktik-area">
                    <h3>FORMATIONEN</h3>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('433')">4 - 3 - 3</button>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('352')">3 - 5 - 2</button>
                    <button class="login-btn" style="width:100%; background:#444;" onclick="arena.resetBoard()">FELD LEEREN</button>
                </div>
            </div>`;
    },

    applyFormation(type) {
        const coords = {
            '433': [{x:400,y:540},{x:250,y:450},{x:550,y:450},{x:150,y:400},{x:650,y:400},{x:400,y:350},{x:300,y:300},{x:500,y:300},{x:400,y:100},{x:200,y:150},{x:600,y:150}],
            '352': [{x:400,y:540},{x:300,y:450},{x:500,y:450},{x:400,y:380},{x:200,y:300},{x:600,y:300},{x:300,y:250},{x:500,y:250},{x:400,y:280},{x:350,y:100},{x:450,y:100}]
        };
        if(window.arena) arena.animateFormation(coords[type]);
        this.toggle(); 
    },

    openSetcard(id) {
        const p = (JSON.parse(localStorage.getItem('toni_players'))).find(x => x.id === id);
        const target = document.getElementById('active-content');
        const ovr = Math.round(((p.pac||50)+(p.sho||50)+(p.pas||50)+(p.dri||50)+(p.def||50)+(p.phy||50))/6);
        target.innerHTML = `
            <div class="tab-pill-box">
                <button onclick="BriefcaseUI.toggleTab('front')" id="t-front" class="tab-pill active">FIFA-LOOK</button>
                <button onclick="BriefcaseUI.toggleTab('back')" id="t-back" class="tab-pill">TRAINER-ANALYSE</button>
            </div>
            <div id="sc-front" class="sc-side-box">
                <div class="fifa-card-pro">
                    <div style="background:#111; height:100%; border-radius:10px; padding:20px; text-align:center; color:#f8b500;">
                        <div style="font-size:40px; font-weight:900;">${ovr}</div>
                        <div style="font-size:60px;">👤</div>
                        <div style="font-weight:900; color:#fff;">${p.name.toUpperCase()}</div>
                    </div>
                </div>
                <div class="stats-edit-grid">
                    <label>PAC</label><input type="number" value="${p.pac}" onchange="BriefcaseUI.upd(${p.id},'pac',this.value)">
                    <label>PHY</label><input type="number" value="${p.phy}" onchange="BriefcaseUI.upd(${p.id},'phy',this.value)">
                </div>
            </div>
            <div id="sc-back" class="sc-side-box hidden">
                <div class="analysis-box">
                    <h4>🧠 PSYCHOLOGIE & TONI'S RAT</h4>
                    <p id="toni-secret-tip">Klicke auf Analyse, um Toni's Meinung zu hören.</p>
                    <button class="login-btn" onclick="BriefcaseUI.getToniAdvice(${p.id})">ANALYSE STARTEN</button>
                </div>
            </div>
            <button onclick="BriefcaseUI.switchSektor('sport')" class="login-btn" style="margin-top:20px; background:#444;">ZURÜCK</button>`;
    },

    toggleTab(s) {
        document.getElementById('sc-front').classList.toggle('hidden', s==='back');
        document.getElementById('sc-back').classList.toggle('hidden', s==='front');
        document.getElementById('t-front').classList.toggle('active', s==='front');
        document.getElementById('t-back').classList.toggle('active', s==='back');
    },

    upd(id,s,v) {
        let pl = JSON.parse(localStorage.getItem('toni_players'));
        pl.find(x=>x.id===id)[s] = parseInt(v);
        localStorage.setItem('toni_players', JSON.stringify(pl));
    },

    getToniAdvice(id) {
        const tips = ["Brazilian Style: Mehr Ginga im Dribbling!", "Fokus auf die Defensive heute.", "Motivation hoch halten!"];
        document.getElementById('toni-secret-tip').innerText = tips[Math.floor(Math.random()*tips.length)];
    },

    renderMarketing() {
        document.getElementById('active-content').innerHTML = `<h3>📢 MARKETING & SPONSOREN</h3><textarea id="m-text" class="login-input" style="width:100%; height:200px; text-align:left;">${localStorage.getItem('toni_m')||''}</textarea><button class="login-btn" onclick="localStorage.setItem('toni_m', document.getElementById('m-text').value); alert('Gesichert!')">SPEICHERN</button>`;
    },

    renderAnalysezentrum() {
        document.getElementById('active-content').innerHTML = `<div class="analysis-dashboard"><div class="dashboard-card"><h4>TEAM-STRENGTH</h4><div style="font-size:50px; color:#f8b500;">84%</div></div><div class="dashboard-card"><h4>BELASTUNG</h4><p>Alle Spieler im grünen Bereich.</p></div></div>`;
    },

    addPlayerPrompt() {
        const n = prompt("Name:"), num = prompt("Nummer:");
        if(!n || !num) return;
        let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        pl.push({id:Date.now(), name:n, number:num, pos:"ZDM", pac:50, phy:50});
        localStorage.setItem('toni_players', JSON.stringify(pl));
        this.renderSporttasche();
    }
};
