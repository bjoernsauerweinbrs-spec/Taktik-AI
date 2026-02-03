window.BriefcaseUI = {
    init() {
        let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        if (pl.length === 0) {
            pl.push({
                id: 'muster_1', name: 'David Luiz (Muster)', number: '4', pos: 'IV',
                rating: 85, pace: 75, shooting: 60, passing: 82, ginga: 90, defense: 88, stamina: 80, pulse: 72, status: 'Fit', isMuster: true
            });
            localStorage.setItem('toni_players', JSON.stringify(pl));
        }
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
            if (!overlay.classList.contains('hidden')) { this.backToNav(); }
        }
    },

    backToNav() {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        nav.classList.remove('hidden');
        content.classList.add('hidden');
        title.innerText = "ZENTRALE AKTTENTASCHE";
        this.renderFolderGrid();
    },

    renderFolderGrid() {
        const nav = document.getElementById('briefcase-nav');
        const folders = [
            { id: 'taktik', name: 'TAKTIKEN', icon: 'fa-project-diagram', color: 'var(--accent-orange)' },
            { id: 'sport', name: 'SPIELER', icon: 'fa-users', color: 'var(--accent-orange)' },
            { id: 'training', name: 'TRAINING', icon: 'fa-dumbbell', color: 'var(--accent-orange)' },
            { id: 'matchplan', name: 'MATCHPLANS', icon: 'fa-clipboard-list', color: 'var(--data-cyan)' },
            { id: 'media', name: 'MEDIA', icon: 'fa-photo-video', color: 'var(--data-cyan)' },
            { id: 'sponsoring', name: 'SPONSORING', icon: 'fa-handshake', color: 'var(--data-cyan)' },
            { id: 'templates', name: 'TEMPLATES', icon: 'fa-file-invoice', color: '#888' },
            { id: 'reports', name: 'REPORTS', icon: 'fa-chart-line', color: '#888' },
            { id: 'system', name: 'SYSTEM', icon: 'fa-cogs', color: '#888' }
        ];

        nav.innerHTML = `
            <div class="folder-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 10px;">
                ${folders.map(f => `
                    <div class="folder-card" onclick="BriefcaseUI.switchSektor('${f.id}')" 
                         style="background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 25px; border-radius: 12px; text-align: center; cursor: pointer;">
                        <i class="fas ${f.icon}" style="font-size: 2rem; color: ${f.color}; margin-bottom: 10px; display: block;"></i>
                        <span style="font-size: 0.75rem; font-weight: bold; letter-spacing: 1px; color: #fff;">${f.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        nav.classList.add('hidden');
        content.classList.remove('hidden');
        title.innerHTML = `<button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:var(--accent-orange); cursor:pointer; margin-right:10px;"><i class="fas fa-arrow-left"></i></button> ${sektor.toUpperCase()}`;

        if (sektor === 'sport') this.renderSporttasche();
        else if (sektor === 'system') this.renderSystem();
        else if (sektor === 'training') this.renderTraining();
        else if (sektor === 'matchplan') this.renderMatchplan();
        else if (sektor === 'media') this.renderMedia();
        else if (sektor === 'sponsoring') this.renderSponsoring();
        else this.renderPlaceholder(sektor);
    },

    // --- SYSTEM (FIXED API KEY INPUT) ---
    renderSystem() {
        const currentProvider = localStorage.getItem('toni_api_provider') || "llama";
        const currentKey = localStorage.getItem('toni_api_key') || "";
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 20px; border: 1px solid #333; border-radius: 15px; background: rgba(255,255,255,0.02);">
                <h4 style="color:#fff; margin-top:0;">KI-SETUP & API-SCHLÜSSEL</h4>
                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.7rem; color:#888; margin-bottom:5px;">PROVIDER</label>
                    <select id="api-provider" class="login-input" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:10px; border-radius:5px;">
                        <option value="llama" ${currentProvider==='llama'?'selected':''}>Gemma 3 (MacBook / Ollama)</option>
                        <option value="openai" ${currentProvider==='openai'?'selected':''}>OpenAI (GPT-4o)</option>
                    </select>
                </div>
                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.7rem; color:#888; margin-bottom:5px;">API-KEY</label>
                    <input type="password" id="api-key-input" class="login-input" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:10px; border-radius:5px;" value="${currentKey}" placeholder="Schlüssel hier einfügen...">
                </div>
                <button class="login-btn" style="width:100%; height:45px; background:var(--accent-orange); color:#000; font-weight:bold;" onclick="BriefcaseUI.saveSettings()">KONFIGURATION SPEICHERN</button>
                <div style="margin-top:15px; font-size:0.65rem; color:#666; line-height:1.4;">
                    <i class="fas fa-info-circle"></i> Wenn du Ollama nutzt, stelle sicher, dass es auf deinem Mac im Hintergrund läuft.
                </div>
            </div>`;
    },

    saveSettings() {
        const key = document.getElementById('api-key-input').value;
        const prov = document.getElementById('api-provider').value;
        localStorage.setItem('toni_api_key', key);
        localStorage.setItem('toni_api_provider', prov);
        alert("System-Einstellungen erfolgreich gesichert!");
    },

    // --- FIFA-STYLE SETCARD ---
    openFIFAcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        document.getElementById('active-content').innerHTML = `
            <div class="fifa-card-container" style="display: grid; grid-template-columns: 200px 1fr; gap: 30px; background: linear-gradient(135deg, #1a1a1a 0%, #000 100%); padding: 30px; border-radius: 20px; border: 2px solid var(--accent-orange); color: white;">
                <div style="background: #222; border: 2px solid var(--accent-orange); border-radius: 15px; padding: 20px; text-align: center;">
                    <div style="font-size: 4rem; font-weight: 900; color: var(--accent-orange);">${p.rating || 80}</div>
                    <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 15px;">${p.pos || 'ST'}</div>
                    <div style="width: 100%; height: 120px; background: #333; border-radius: 10px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user" style="font-size: 4rem; color: #555;"></i>
                    </div>
                    <div style="font-size: 1.1rem; font-weight: bold;">${p.name}</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.7rem; margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">
                        <div>PAC ${p.pace||50}</div><div>SHO ${p.shooting||50}</div>
                        <div>PAS ${p.passing||50}</div><div>DEF ${p.defense||50}</div>
                    </div>
                </div>
                <div>
                    <h2 style="margin:0; color:var(--accent-orange);">${p.name} (#${p.number})</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                        <div>
                            <label style="font-size:0.7rem;">PACE</label><input type="range" value="${p.pace||50}" onchange="BriefcaseUI.updateVal('${id}', 'pace', this.value)">
                            <label style="font-size:0.7rem;">GINGA</label><input type="range" value="${p.ginga||50}" onchange="BriefcaseUI.updateVal('${id}', 'ginga', this.value)">
                            <label style="font-size:0.7rem;">PULS</label><input type="number" value="${p.pulse||70}" style="width:100%; background:#000; border:1px solid #444; color:#fff;" onchange="BriefcaseUI.updateVal('${id}', 'pulse', this.value)">
                        </div>
                        <div>
                            <label style="font-size:0.7rem;">STAMINA</label><input type="range" value="${p.stamina||50}" onchange="BriefcaseUI.updateVal('${id}', 'stamina', this.value)">
                            <label style="font-size:0.7rem;">STATUS</label>
                            <select onchange="BriefcaseUI.updateVal('${id}', 'status', this.value)" style="width:100%; background:#000; color:#fff;">
                                <option value="Fit" ${p.status==='Fit'?'selected':''}>Fit</option>
                                <option value="Angeschlagen" ${p.status==='Angeschlagen'?'selected':''}>Angeschlagen</option>
                            </select>
                        </div>
                    </div>
                    <button class="login-btn" style="margin-top:20px; width:100%;" onclick="BriefcaseUI.renderSporttasche()">FERTIG</button>
                </div>
            </div>`;
    },

    // --- SPORTTASCHE / SPONSORING / ETC (ERHALTEN) ---
    renderSporttasche() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 10px;">
                <button class="login-btn" style="width: 100%; margin-bottom: 20px;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUEN SPIELER HINZUFÜGEN</button>
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
                    ${players.map(p => `<div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background:#151515; border:1px solid #333; padding:15px; border-radius:10px; text-align:center; cursor:pointer;">
                        <div style="font-size:1.2rem; font-weight:900; color:var(--accent-orange);">#${p.number}</div>
                        <b style="color:#fff;">${p.name}</b>
                    </div>`).join('')}
                </div>
            </div>`;
    },

    renderSponsoring() {
        document.getElementById('active-content').innerHTML = `<div style="padding:20px;"><h3 style="color:var(--data-cyan);">PARTNER-BOARD</h3><div style="background:white; color:black; padding:30px; border-radius:15px; text-align:center; font-weight:bold; font-size:2rem;">LOGO HIER</div></div>`;
    },

    updateVal(id, key, val) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        if(i !== -1) {
            players[i][key] = val;
            if (key === 'pulse' && val > 160 && window.ToniAI) {
                const msg = `Coach! Achtung bei ${players[i].name}. Puls: ${val}!`;
                window.ToniAI.addChatMessage("Toni", msg, "bot-msg");
                window.ToniAI.speak(msg);
            }
            localStorage.setItem('toni_players', JSON.stringify(players));
        }
    },

    renderPlaceholder(sektor) { document.getElementById('active-content').innerHTML = `<div style="text-align:center; padding:50px; color:#555;"><p>Bereich ${sektor.toUpperCase()} wird vorbereitet.</p></div>`; },
    
    addPlayerPrompt() {
        const name = prompt("Name:"); const num = prompt("Nummer:");
        if(name && num) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({ id: Date.now(), name: name, number: num, rating: 50, pulse: 70 });
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    }
};

BriefcaseUI.init();
