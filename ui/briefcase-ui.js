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
            title.innerText = "👟 SPORTTASCHE: KADER-MATRIX";
            this.renderSporttasche();
        } else if (sektor === 'marketing') {
            title.innerText = "📢 MARKETING: A5 MAGAZIN";
            this.renderMarketing();
        } else if (sektor === 'system') {
            title.innerText = "📁 SYSTEM-ORDNER: KI-SETUP";
            this.renderSystemOrdner();
        }
    },

    // OPTIMIERT: Permanent sichtbares Key-Feld & Mac-Hilfe
    renderSystemOrdner() {
        const currentKey = localStorage.getItem('toni_api_key') || "";
        const currentProvider = localStorage.getItem('toni_api_provider') || "llama";
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px; padding:20px;">
                <div class="sponsoring-tool" style="border: 2px solid var(--data-cyan); background: rgba(0,209,255,0.05); padding: 25px; border-radius: 15px;">
                    <h4 style="color: var(--data-cyan); margin-top:0;">🔑 KI-KONFIGURATION</h4>
                    
                    <label style="font-size:0.8rem; color:#aaa;">ANBIETER WÄHLEN</label>
                    <select id="api-provider" class="login-input" style="width:100%; margin:10px 0 20px 0; background:#000; color:#fff;">
                        <option value="llama" ${currentProvider === 'llama' ? 'selected' : ''}>Gemma 3 (MacBook - Lokal)</option>
                        <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI (Cloud - API Key nötig)</option>
                    </select>

                    <label style="font-size:0.8rem; color:#aaa;">API-KEY HINTERLEGEN</label>
                    <input type="password" id="api-key-input" class="login-input" style="width:100%; margin:10px 0 20px 0; background:#000; color:#fff;" value="${currentKey}" placeholder="sk-...">
                    
                    <button class="login-btn" style="width:100%; background: var(--accent-orange); color:#000; font-weight:bold;" onclick="BriefcaseUI.saveSettings()">KONFIGURATION SPEICHERN</button>
                    <p id="save-status" style="margin-top:15px; font-size:0.9rem; font-weight:bold; color:#4CD964; text-align:center;"></p>
                </div>
                
                <div class="sponsoring-tool" style="border: 2px solid #ffcc00; background: rgba(255,204,0,0.05); padding: 25px; border-radius: 15px;">
                    <h4 style="color: #ffcc00; margin-top:0;">ℹ️ MAC OLLAMA HILFE</h4>
                    <p style="font-size:0.8rem; line-height:1.6; color:#ddd;">
                        Wenn du <b>Gemma 3</b> nutzt, muss Ollama auf deinem Mac CORS-Anfragen erlauben. <br><br>
                        1. Terminal öffnen<br>
                        2. Befehl eingeben: <br><code style="background:#000; padding:5px; display:block; margin:10px 0; font-size:0.7rem;">launchctl setenv OLLAMA_ORIGINS "*"</code>
                        3. Ollama & Browser neu starten.
                    </p>
                </div>
            </div>
        `;
    },

    saveSettings() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        document.getElementById('save-status').innerText = "✅ System-Konfiguration aktualisiert!";
    },

    // OPTIMIERT: Übersichtliche Spielerliste mit Nummern
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
                        </div>
                    `).join('')}
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:15px; border:1px solid #444;">
                    <h4 style="margin:0 0 15px 0; color:var(--accent-orange);">BOARD-STEUERUNG</h4>
                    <button class="login-btn" onclick="BriefcaseUI.applyFormation('433')">4-3-3 GINGA</button>
                    <p style="font-size:0.7rem; color:#666; margin-top:20px;">Toni nutzt diese Daten, um die roten Spieler auf dem Board zu positionieren.</p>
                </div>
            </div>`;
    },

    // ... (restliche Funktionen openSetcard, renderMarketing, addPlayerPrompt bleiben identisch erhalten)
    openSetcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;
        document.getElementById('active-content').innerHTML = `
            <div style="background:rgba(255,255,255,0.05); padding:30px; border-radius:15px; border:1px solid var(--accent-orange); max-width:500px; margin:20px auto;">
                <h3 style="color:var(--accent-orange); margin-top:0;">SPIELER: ${p.name}</h3>
                <label style="display:block; margin-top:20px;">RÜCKENNUMMER</label>
                <input type="number" id="edit-num" class="login-input" value="${p.number||''}" style="width:100%; background:#000; border:1px solid #444; margin-top:10px;">
                <div style="margin-top:30px; display:flex; gap:10px;">
                    <button class="login-btn" onclick="BriefcaseUI.savePlayer('${id}')">SPEICHERN</button>
                    <button class="login-btn" style="background:#444;" onclick="BriefcaseUI.renderSporttasche()">ABBRECHEN</button>
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
            <div class="magazine-view" style="padding:20px;">
                <div class="mag-page" style="background:#fff; color:#000; padding:40px; border-radius:5px; text-align:center;">
                    <h1>FC TONI 2.0</h1>
                    <p>STADIONZEITUNG - DIN A5</p>
                    <hr>
                    <p style="font-size:0.8rem;">[ Hier entstehen deine Druckvorlagen ]</p>
                </div>
                <button class="login-btn" style="margin-top:20px; background:var(--accent-orange); color:#000;" onclick="window.print()">🖨️ DIN A5 DRUCK STARTEN</button>
            </div>`;
    },

    addPlayerPrompt() {
        const n = prompt("Name des Spielers:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, rating:3, number:""});
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
