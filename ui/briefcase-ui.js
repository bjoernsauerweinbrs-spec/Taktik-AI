window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        if (overlay) {
            overlay.classList.toggle('hidden');
            // Reset to grid view when opening
            if (!overlay.classList.contains('hidden')) {
                nav.classList.remove('hidden');
                content.classList.add('hidden');
                document.getElementById('sector-title').innerText = "ZENTRALE";
                this.renderInitialGrid();
            }
        }
    },

    renderInitialGrid() {
        const nav = document.getElementById('briefcase-nav');
        nav.innerHTML = `
            <div class="folder-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; padding: 20px; width: 100%;">
                <div class="folder-card" onclick="BriefcaseUI.switchSektor('sport')" style="background: rgba(255,149,0,0.05); border: 1px solid var(--accent-orange); padding: 40px; border-radius: 15px; text-align: center; cursor: pointer; transition: 0.3s;">
                    <i class="fas fa-vest" style="font-size: 3rem; color: var(--accent-orange); display: block; margin-bottom: 15px;"></i>
                    <b style="color: white; letter-spacing: 1px;">SPORTTASCHE</b>
                </div>
                <div class="folder-card" onclick="BriefcaseUI.switchSektor('marketing')" style="background: rgba(0,209,255,0.05); border: 1px solid var(--data-cyan); padding: 40px; border-radius: 15px; text-align: center; cursor: pointer; transition: 0.3s;">
                    <i class="fas fa-ad" style="font-size: 3rem; color: var(--data-cyan); display: block; margin-bottom: 15px;"></i>
                    <b style="color: white; letter-spacing: 1px;">MARKETING</b>
                </div>
                <div class="folder-card" onclick="BriefcaseUI.switchSektor('system')" style="background: rgba(255,255,255,0.03); border: 1px solid #444; padding: 40px; border-radius: 15px; text-align: center; cursor: pointer; transition: 0.3s;">
                    <i class="fas fa-cogs" style="font-size: 3rem; color: #888; display: block; margin-bottom: 15px;"></i>
                    <b style="color: white; letter-spacing: 1px;">SYSTEM</b>
                </div>
            </div>`;
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
        document.getElementById('sector-title').innerText = "ZENTRALE";
        this.renderInitialGrid();
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
        document.getElementById('active-content').innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px; padding:20px;">
                <div class="sponsoring-tool" style="border: 1px solid var(--data-cyan); background: rgba(0,209,255,0.05); padding: 25px; border-radius: 15px;">
                    <h4 style="color: var(--data-cyan); margin-top:0;">🔑 KI-SETUP</h4>
                    <select id="api-provider" class="login-input" style="width:100%; margin-bottom:20px; background:#000; color:#fff;">
                        <option value="llama" ${currentProvider === 'llama' ? 'selected' : ''}>Gemma 3 (MacBook)</option>
                        <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI (Cloud)</option>
                    </select>
                    <input type="password" id="api-key-input" class="login-input" style="width:100%; margin-bottom:20px; background:#000; color:#fff;" value="${currentKey}" placeholder="API Key...">
                    <button class="login-btn" style="width:100%; background: var(--accent-orange); color:#000;" onclick="BriefcaseUI.saveSettings()">SPEICHERN</button>
                </div>
            </div>`;
    },

    saveSettings() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        alert("Konfiguration gespeichert!");
    },

    renderSporttasche() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:20px; padding:20px;">
                <div class="pro-player-list">
                    <div class="p-card add-btn" onclick="BriefcaseUI.addPlayerPrompt()" style="border:2px dashed #444; display:flex; align-items:center; justify-content:center; cursor:pointer; min-height:80px;">
                        <b style="color:var(--accent-orange);">+ NEUER SPIELER</b>
                    </div>
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openSetcard('${p.id}')" style="background:rgba(255,255,255,0.03); border:1px solid #333; padding:15px; border-radius:10px;">
                            <div style="color:var(--accent-orange); font-weight:900; font-size:1.2rem;">#${p.number || '??'}</div>
                            <b style="font-size:0.9rem;">${p.name}</b>
                        </div>`).join('')}
                </div>
            </div>`;
    },

    renderMarketing() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:40px; text-align:center; background:white; color:black; border-radius:10px;">
                <h1>FC TONI 2.0</h1><p>STADIONZEITUNG</p>
                <button class="login-btn" style="background:var(--accent-orange); margin-top:20px;" onclick="window.print()">A5 DRUCK</button>
            </div>`;
    },

    addPlayerPrompt() {
        const n = prompt("Name:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, rating:3, number:""});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            if(window.arena) window.arena.loadPlayersFromStorage();
            this.renderSporttasche();
        }
    }
};
