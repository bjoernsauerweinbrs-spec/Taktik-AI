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
            title.innerText = "📁 SYSTEM-ORDNER";
            this.renderSystemOrdner();
        }
    },

    renderSporttasche() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        target.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:20px;">
                <div id="player-grid" class="pro-player-list">
                    <div class="p-card add-btn" onclick="BriefcaseUI.addPlayerPrompt()" style="border:2px dashed var(--accent-orange); display:flex; align-items:center; justify-content:center; cursor:pointer;">
                        <b>+ SPIELER HINZUFÜGEN</b>
                    </div>
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openSetcard('${p.id}')">
                            <div style="font-size:1.2rem; font-weight:900; color:var(--accent-orange);">#${p.number || '00'}</div>
                            <b>${p.name}</b><br>
                            <small>${p.pos || 'Position wählen'}</small>
                            <div style="margin-top:5px; color:var(--data-cyan); font-size:0.7rem;">${p.rating || 0} ★ GINGA</div>
                        </div>
                    `).join('')}
                </div>
                <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border:1px solid #333;">
                    <h4 style="color:var(--accent-orange); margin-top:0;">TRAINER-TOOLS</h4>
                    <button class="login-btn" style="width:100%; margin-bottom:10px;" onclick="BriefcaseUI.applyFormation('433')">4-3-3 GINGA</button>
                    <button class="login-btn" style="width:100%;" onclick="BriefcaseUI.applyFormation('352')">3-5-2 KOMPAKT</button>
                    <hr style="border:0; border-top:1px solid #444; margin:20px 0;">
                    <p style="font-size:0.7rem; color:#888;">Toni analysiert den Kader live. Klicke auf einen Spieler für Details.</p>
                </div>
            </div>
        `;
    },

    openSetcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(player => player.id == id);
        if(!p) return;

        const target = document.getElementById('active-content');
        target.innerHTML = `
            <div style="max-width:600px; background:rgba(255,255,255,0.05); padding:30px; border-radius:20px; border:1px solid var(--accent-orange);">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:20px;">
                    <h2 style="margin:0; color:var(--accent-orange);">SPIELER-PROFIL</h2>
                    <button onclick="BriefcaseUI.renderSporttasche()" class="login-btn" style="width:auto; background:#444;">X</button>
                </div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div>
                        <label>NAME</label>
                        <input type="text" id="edit-name" class="login-input" value="${p.name}">
                        <label style="margin-top:10px; display:block;">NUMMER</label>
                        <input type="number" id="edit-number" class="login-input" value="${p.number || ''}">
                        <label style="margin-top:10px; display:block;">POSITION</label>
                        <select id="edit-pos" class="login-input" style="background:#111;">
                            <option value="TW" ${p.pos==='TW'?'selected':''}>Torwart</option>
                            <option value="IV" ${p.pos==='IV'?'selected':''}>Innenverteidiger</option>
                            <option value="DM" ${p.pos==='DM'?'selected':''}>Def. Mittelfeld</option>
                            <option value="ST" ${p.pos==='ST'?'selected':''}>Stürmer</option>
                        </select>
                    </div>
                    <div style="border-left:1px solid #333; padding-left:20px;">
                        <label>GINGA-RATING (1-5 ★)</label>
                        <input type="range" id="edit-rating" min="1" max="5" value="${p.rating || 3}" style="width:100%;">
                        
                        <label style="margin-top:20px; display:block;">KM-LEISTUNG (Letztes Spiel)</label>
                        <input type="number" id="edit-km" class="login-input" value="${p.km || ''}" placeholder="z.B. 11.5">
                        
                        <label style="margin-top:10px; display:block;">STATUS</label>
                        <select id="edit-status" class="login-input" style="background:#111;">
                            <option value="Fit">Fit</option>
                            <option value="Angeschlagen">Angeschlagen</option>
                            <option value="Verletzt">Verletzt</option>
                        </select>
                    </div>
                </div>
                
                <div style="margin-top:30px; display:flex; gap:10px;">
                    <button class="login-btn" onclick="BriefcaseUI.savePlayer('${id}')" style="background:var(--accent-orange); color:#000;">SPEICHERN</button>
                    <button class="login-btn" onclick="BriefcaseUI.deletePlayer('${id}')" style="background:#FF3B30; width:auto;">LÖSCHEN</button>
                </div>
            </div>
        `;
    },

    savePlayer(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const index = players.findIndex(p => p.id == id);
        
        if(index !== -1) {
            players[index].name = document.getElementById('edit-name').value;
            players[index].number = document.getElementById('edit-number').value;
            players[index].pos = document.getElementById('edit-pos').value;
            players[index].rating = document.getElementById('edit-rating').value;
            players[index].km = document.getElementById('edit-km').value;
            players[index].status = document.getElementById('edit-status').value;
            
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.renderSporttasche();
        }
    },

    deletePlayer(id) {
        if(confirm("Spieler wirklich löschen?")) {
            let players = JSON.parse(localStorage.getItem('toni_players')) || [];
            players = players.filter(p => p.id != id);
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.renderSporttasche();
        }
    },

    // (Die restlichen Funktionen renderMarketing, renderSystemOrdner etc. bleiben wie zuvor komplett erhalten)
    renderSystemOrdner() {
        const currentKey = localStorage.getItem('toni_api_key') || "";
        const currentProvider = localStorage.getItem('toni_api_provider') || "openai";
        const target = document.getElementById('active-content');
        target.innerHTML = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
            <div class="sponsoring-tool">
                <h4>🔑 KI-SETUP</h4>
                <select id="api-provider" class="login-input" style="width:100%; margin-bottom:15px; background:#111;">
                    <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI</option>
                    <option value="llama" ${currentProvider === 'llama' ? 'selected' : ''}>Gemma 3 (Lokal)</option>
                </select>
                <input type="password" id="api-key-input" class="login-input" value="${currentKey}">
                <button class="login-btn" onclick="BriefcaseUI.saveSettings()">SPEICHERN</button>
            </div>
            <div class="sponsoring-tool" style="border-color:#ffcc00;">
                <h4>ℹ️ MAC-HILFE</h4>
                <p style="font-size:0.7rem;">Terminal: <code>launchctl setenv OLLAMA_ORIGINS "*"</code></p>
            </div>
        </div>`;
    },

    saveSettings() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        this.renderSystemOrdner();
    },

    renderMarketing() {
        document.getElementById('active-content').innerHTML = `
            <div class="magazine-view"><div class="mag-page"><h1 contenteditable="true">FC TONI 2.0</h1></div>
            <button class="login-btn" onclick="window.print()">A5 DRUCK</button></div>`;
    },

    addPlayerPrompt() {
        const n = prompt("Name des Spielers:");
        if(n) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({id:Date.now(), name:n, rating:3, status:'Fit'});
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    },

    applyFormation(type) {
        if(window.arena) arena.animateFormation(type);
        this.toggle();
    }
};
