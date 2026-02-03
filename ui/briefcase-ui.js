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
        } else if (sektor === 'system') {
            title.innerText = "📁 SYSTEM-ORDNER";
            this.renderSystemOrdner();
        }
    },

    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:20px;">
                <div class="pro-player-list">
                    <div class="p-card add-btn" onclick="BriefcaseUI.addPlayerPrompt()" style="border:2px dashed #555; display:flex; align-items:center; justify-content:center;">
                        <b>+ NEUER SPIELER</b>
                    </div>
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openSetcard('${p.id}')">
                            <div style="color:var(--accent-orange); font-weight:900;">#${p.number || '00'}</div>
                            <b>${p.name}</b><br><small>${p.pos || 'Position?'}</small>
                        </div>
                    `).join('')}
                </div>
                <div class="taktik-sidebar" style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px;">
                    <h4>FORMATIONEN</h4>
                    <button class="login-btn" onclick="BriefcaseUI.applyFormation('433')">4-3-3 GINGA</button>
                    <button class="login-btn" style="margin-top:10px;" onclick="BriefcaseUI.applyFormation('352')">3-5-2 KOMPAKT</button>
                </div>
            </div>`;
    },

    openSetcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;
        document.getElementById('active-content').innerHTML = `
            <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border:1px solid var(--accent-orange);">
                <h3>SPIELER-MATRIX: ${p.name}</h3>
                <label>Nummer</label><input type="number" id="edit-num" class="login-input" value="${p.number||''}">
                <label>Ginga-Rating (1-5)</label><input type="range" id="edit-rate" min="1" max="5" value="${p.rating||3}" style="width:100%;">
                <button class="login-btn" style="margin-top:20px;" onclick="BriefcaseUI.savePlayer('${id}')">SPEICHERN</button>
                <button class="login-btn" style="background:#444; margin-top:10px;" onclick="BriefcaseUI.renderSporttasche()">ABBRECHEN</button>
            </div>`;
    },

    savePlayer(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        players[i].number = document.getElementById('edit-num').value;
        players[i].rating = document.getElementById('edit-rate').value;
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.renderSporttasche();
    },

    renderSystemOrdner() {
        const currentProvider = localStorage.getItem('toni_api_provider') || "openai";
        document.getElementById('active-content').innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                <div class="sponsoring-tool">
                    <h4>🔑 KI-SETUP</h4>
                    <select id="api-provider" class="login-input" style="background:#111;">
                        <option value="openai" ${currentProvider==='openai'?'selected':''}>OpenAI</option>
                        <option value="llama" ${currentProvider==='llama'?'selected':''}>Gemma 3 (MacBook)</option>
                    </select>
                    <button class="login-btn" style="margin-top:15px;" onclick="BriefcaseUI.saveSettings()">SPEICHERN</button>
                </div>
                <div class="sponsoring-tool" style="border-color:#ffcc00;">
                    <h4>ℹ️ MAC OLLAMA HILFE</h4>
                    <p style="font-size:0.7rem;">Terminal: <code>launchctl setenv OLLAMA_ORIGINS "*"</code><br>Danach Ollama & Browser Neustart!</p>
                </div>
            </div>`;
    },

    saveSettings() {
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        this.renderSystemOrdner();
    },

    renderMarketing() {
        document.getElementById('active-content').innerHTML = `<div class="magazine-view"><div class="mag-page"><h1>FC TONI 2.0</h1></div><button class="login-btn" onclick="window.print()">A5 DRUCK</button></div>`;
    },

    addPlayerPrompt() {
        const n = prompt("Name:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    },

    applyFormation(type) {
        if(window.arena) arena.animateFormation(type);
        this.toggle();
    }
};
