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
        
        // Hier ist das Herzstück: Das Key-Eingabefeld
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px; animation: fadeIn 0.3s;">
                <div class="sponsoring-tool" style="border-color: var(--data-cyan); background: rgba(0,209,255,0.05); padding: 25px; border-radius: 15px; border: 1px solid var(--data-cyan);">
                    <h4 style="color: var(--data-cyan); margin-top:0;">🔑 KI-KONFIGURATION</h4>
                    
                    <label style="font-size:0.8rem; color:#fff; display:block; margin-bottom:10px;">KI-ANBIETER WÄHLEN:</label>
                    <select id="api-provider" class="login-input" style="width:100%; margin-bottom:20px; background:#000; color:#fff; border:1px solid #444; height:40px; padding:0 10px;">
                        <option value="llama" ${currentProvider === 'llama' ? 'selected' : ''}>Gemma 3 (Lokal via Ollama)</option>
                        <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI (GPT-4o-mini)</option>
                        <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                    </select>

                    <label style="font-size:0.8rem; color:#fff; display:block; margin-bottom:10px;">API KEY (Cloud):</label>
                    <input type="text" id="api-key-input" class="login-input" 
                           style="width:100%; margin-bottom:20px; background:#000; color:#fff; border:1px solid #444; height:40px; padding:0 10px;" 
                           value="${currentKey}" placeholder="Hier sk-... Key einfügen">
                    
                    <button class="login-btn" style="width:100%; background: var(--accent-orange); color:#000; font-weight:bold;" 
                            onclick="BriefcaseUI.saveSettings()">KONFIGURATION SPEICHERN</button>
                    
                    <p id="save-status" style="margin-top:15px; font-size:0.9rem; font-weight:bold; color:#4CD964; text-align:center;"></p>
                </div>
                
                <div class="sponsoring-tool" style="border-color: #ffcc00; background: rgba(255,204,0,0.05); padding: 25px; border-radius: 15px; border: 1px solid #ffcc00;">
                    <h4 style="color: #ffcc00; margin-top:0;">ℹ️ HILFE</h4>
                    <p style="font-size:0.8rem; line-height:1.5; color:#ccc;">
                        1. Wähle <b>Gemma 3</b>, wenn du Ollama auf deinem Mac nutzt (Kein Key nötig).<br><br>
                        2. Wähle <b>OpenAI</b>, wenn du den Key oben eingibst.<br><br>
                        3. Klicke auf <b>Speichern</b>, damit Toni die Änderungen übernimmt.
                    </p>
                </div>
            </div>
        `;
    },

    saveSettings() {
        const key = document.getElementById('api-key-input').value;
        const prov = document.getElementById('api-provider').value;
        
        localStorage.setItem('toni_api_key', key);
        localStorage.setItem('toni_api_provider', prov);
        
        const status = document.getElementById('save-status');
        status.innerText = "✅ Konfiguration im Browser gesichert!";
        
        // ToniAI kurz anstupsen, falls er schon geladen ist
        if (window.ToniAI) console.log("ToniAI: Provider gewechselt zu " + prov);
    },

    renderSporttasche() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:20px;">
                <div class="pro-player-list">
                    <div class="p-card add-btn" onclick="BriefcaseUI.addPlayerPrompt()" style="border:2px dashed #555; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                        <b>+ NEUER SPIELER</b>
                    </div>
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openSetcard('${p.id}')">
                            <div style="color:var(--accent-orange); font-weight:900;">#${p.number || '00'}</div>
                            <b>${p.name}</b>
                        </div>
                    `).join('')}
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:10px; border:1px solid #333;">
                    <h4 style="margin:0 0 10px 0;">Board-Steuerung</h4>
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
                <input type="number" id="edit-num" class="login-input" value="${p.number||''}" style="width:100%; background:#000; color:#fff; border:1px solid #444; margin-top:10px;">
                <div style="margin-top:25px; display:flex; gap:10px;">
                    <button class="login-btn" onclick="BriefcaseUI.savePlayer('${id}')">SPEICHERN</button>
                    <button class="login-btn" style="background:#444;" onclick="BriefcaseUI.renderSporttasche()">ZURÜCK</button>
                </div>
            </div>`;
    },

    savePlayer(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        players[i].number = document.getElementById('edit-num').value;
        localStorage.setItem('toni_players', JSON.stringify(players));
        if(window.arena) window.arena.loadPlayersFromStorage();
        this.renderSporttasche();
    },

    renderMarketing() {
        document.getElementById('active-content').innerHTML = `
            <div class="magazine-view">
                <div class="mag-page"><h1>FC TONI 2.0</h1><p>STADIONZEITUNG</p></div>
                <button class="login-btn" style="grid-column: span 2;" onclick="window.print()">🖨️ A5 DRUCK</button>
            </div>`;
    },

    addPlayerPrompt() {
        const n = prompt("Name des Spielers:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, rating:3});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            if(window.arena) window.arena.loadPlayersFromStorage();
            this.renderSporttasche();
        }
    },

    applyFormation(type) {
        if(window.arena) arena.animateFormation(type);
        this.toggle();
    }
};
