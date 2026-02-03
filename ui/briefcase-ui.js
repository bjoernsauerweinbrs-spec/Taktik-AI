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
            title.innerText = "👟 SPORTTASCHE";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerText = "📢 MARKETING";
            this.renderMarketing();
        } else if (sektor === 'system') {
            title.innerText = "📁 SYSTEM-ORDNER";
            this.renderSystemOrdner();
        }
    },

    renderSystemOrdner() {
        const currentKey = localStorage.getItem('toni_api_key') || "";
        const currentProvider = localStorage.getItem('toni_api_provider') || "llama";
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                <div class="sponsoring-tool" style="border-color: var(--data-cyan); background: rgba(0,209,255,0.02); padding: 25px; border-radius: 15px;">
                    <h4 style="color: var(--data-cyan); margin-top:0;">🔑 KI-SETUP</h4>
                    <select id="api-provider" class="login-input" style="width:100%; margin-bottom:15px; background:#111; border:1px solid #444;">
                        <option value="llama" ${currentProvider === 'llama' ? 'selected' : ''}>Gemma 3 (MacBook)</option>
                        <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI (Cloud)</option>
                    </select>
                    <input type="password" id="api-key-input" class="login-input" style="width:100%; margin-bottom:15px;" value="${currentKey}" placeholder="sk-...">
                    <button class="login-btn" style="width:100%; background: var(--accent-orange); color:#000;" onclick="BriefcaseUI.saveSettings()">KONFIGURATION SPEICHERN</button>
                    <p id="save-status" style="margin-top:10px; font-size:0.8rem; font-weight:bold; color:#4CD964;"></p>
                </div>
                <div class="sponsoring-tool" style="border-color: #ffcc00; background: rgba(255,204,0,0.05); padding: 25px; border-radius: 15px;">
                    <h4 style="color: #ffcc00; margin-top:0;">ℹ️ MAC OLLAMA HILFE</h4>
                    <p style="font-size:0.75rem;">Terminal: <code>launchctl setenv OLLAMA_ORIGINS "*"</code><br>Danach Ollama neu starten!</p>
                </div>
            </div>`;
    },

    saveSettings() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        document.getElementById('save-status').innerText = "✅ Gespeichert!";
    },

    renderSporttasche() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:20px;">
                <div class="pro-player-list">
                    <div class="p-card add-btn" onclick="BriefcaseUI.addPlayerPrompt()" style="border:2px dashed #555; display:flex; align-items:center; justify-content:center; height:100px;">
                        <b>+ NEUEN SPIELER ANLEGEN</b>
                    </div>
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openSetcard('${p.id}')">
                            <div style="color:var(--accent-orange); font-weight:900;">#${p.number || '??'}</div>
                            <b>${p.name}</b>
                        </div>
                    `).join('')}
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:10px; border:1px solid #333;">
                    <h4 style="margin:0 0 10px 0;">Formation</h4>
                    <button class="login-btn" onclick="BriefcaseUI.applyFormation('433')">4-3-3 GINGA</button>
                </div>
            </div>`;
    },

    openSetcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;
        document.getElementById('active-content').innerHTML = `
            <div style="background:rgba(255,255,255,0.05); padding:30px; border-radius:15px; border:1px solid var(--accent-orange); max-width:500px;">
                <h3 style="color:var(--accent-orange); margin-top:0;">SPIELER: ${p.name}</h3>
                <label>Nummer</label>
                <input type="number" id="edit-num" class="login-input" value="${p.number||''}">
                <button class="login-btn" style="margin-top:20px;" onclick="BriefcaseUI.savePlayer('${id}')">SPEICHERN</button>
                <button class="login-btn" style="background:#444; margin-top:10px;" onclick="BriefcaseUI.renderSporttasche()">ZURÜCK</button>
            </div>`;
    },

    savePlayer(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        players[i].number = document.getElementById('edit-num').value;
        localStorage.setItem('toni_players', JSON.stringify(players));
        if(window.arena) window.arena.loadPlayersFromStorage(); // UPDATE BOARD
        this.renderSporttasche();
    },

    renderMarketing() {
        document.getElementById('active-content').innerHTML = `<h1>MARKETING</h1><button onclick="window.print()">DRUCK</button>`;
    },

    addPlayerPrompt() {
        const n = prompt("Name:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, rating:3});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            if(window.arena) window.arena.loadPlayersFromStorage(); // UPDATE BOARD
            this.renderSporttasche();
        }
    },

    applyFormation(type) {
        if(window.arena) arena.animateFormation(type);
        this.toggle();
    }
};
