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
            title.innerText = "👟 SPORTTASCHE: KADER";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerText = "📢 MARKETING: A5 MAGAZIN";
            this.renderMarketing();
        } else if (sektor === 'analyse') {
            title.innerText = "⚙️ SYSTEM-EINSTELLUNGEN";
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
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="taktik-sidebar">
                    <h3 style="color:var(--accent-orange);">FORMATIONEN</h3>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('433')">4-3-3 GINGA</button>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('352')">3-5-2 KOMPAKT</button>
                </div>
            </div>`;
    },

    renderMarketing() {
        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div style="margin-bottom:20px; display:flex; gap:10px;">
                <button class="login-btn" style="width:auto; background:var(--accent-orange);">📄 DIN A5 EDITOR</button>
            </div>
            <div id="m-zeitung" class="magazine-view">
                <div class="mag-page">
                    <div style="background:#000; color:#fff; text-align:center; padding:10px; border-bottom:5px solid var(--accent-orange);">
                        <h1 contenteditable="true" style="margin:0; font-size:1.1rem;">FC TONI 2.0</h1>
                    </div>
                    <div style="flex:1; display:flex; align-items:center; justify-content:center; flex-direction:column; border:1px solid #eee; margin:10px 0;">
                        <span contenteditable="true" style="font-weight:900;">[ DEIN LOGO ]</span>
                    </div>
                    <div contenteditable="true" style="font-size:0.8rem; text-align:center; font-style:italic;">"Brasilianische Taktik für Profis"</div>
                </div>
                <div class="mag-page">
                    <h3 style="border-bottom:2px solid #000; font-size:1rem;">🎤 TRAINER-TALK</h3>
                    <div contenteditable="true" style="font-size:0.8rem; line-height:1.5;">
                        Willkommen Björn! Hier kannst du deine heutige Ansprache direkt eintippen. Das Format ist perfekt auf DIN A5 optimiert.
                    </div>
                </div>
                <div class="mag-page">
                    <h3 style="border-bottom:2px solid #000; font-size:1rem;">📊 ANALYSE</h3>
                    <div contenteditable="true" style="font-size:0.8rem;">Letztes Spiel: 3:0 Sieg. Die km-Leistung war hervorragend.</div>
                </div>
                <div class="mag-page">
                    <h3 style="text-align:center; font-size:1rem;">🤝 PARTNER</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; flex:1;">
                        <div contenteditable="true" style="border:1px dashed #ccc; padding:5px; font-size:0.6rem; text-align:center;">SPONSOR 1</div>
                        <div contenteditable="true" style="border:1px dashed #ccc; padding:5px; font-size:0.6rem; text-align:center;">SPONSOR 2</div>
                    </div>
                    <div style="background:#000; color:#00D1FF; padding:10px; border-radius:5px; text-align:center; margin-top:10px;">
                        <b style="font-size:0.7rem; color:#fff;">POWERED BY TONI 2.0</b><br>
                        <small style="font-size:0.5rem;">PERFEKT FÜR TRAINER & MANAGER</small>
                    </div>
                </div>
                <button class="login-btn" style="grid-column: span 2; background:var(--accent-orange);" onclick="window.print()">🖨️ DIN A5 DRUCK STARTEN</button>
            </div>`;
    },

    renderAnalysezentrum() {
        const currentKey = localStorage.getItem('toni_api_key') || "";
        document.getElementById('active-content').innerHTML = `
            <div style="max-width:500px; background:rgba(255,255,255,0.05); padding:30px; border-radius:15px; border:1px solid var(--accent-orange);">
                <h4 style="color:var(--accent-orange);">KI-KONFIGURATION</h4>
                <p style="font-size:0.8rem;">Hinterlege deinen API-Key für echte Web-Recherche.</p>
                <input type="password" id="api-key-input" class="login-input" style="width:100%; margin:20px 0;" value="${currentKey}" placeholder="OpenAI / Gemini Key...">
                <button class="login-btn" onclick="BriefcaseUI.saveApiKey()">KEY SPEICHERN</button>
                <p id="save-status" style="margin-top:15px; font-size:0.8rem; color:var(--data-cyan);"></p>
            </div>`;
    },

    saveApiKey() {
        const val = document.getElementById('api-key-input').value;
        localStorage.setItem('toni_api_key', val);
        document.getElementById('save-status').innerText = "✅ System bereit für Web-Abfragen!";
    },

    applyFormation(type) {
        if(window.arena) arena.animateFormation(type);
        this.toggle();
    },

    addPlayerPrompt() {
        const n = prompt("Name:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, number:"?", status:"Anwesend"});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    },

    openSetcard(id) {
        this.switchSektor('sport');
    }
};
