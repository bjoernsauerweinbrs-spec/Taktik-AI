window.BriefcaseUI = {
    init() {
        let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        if (pl.length === 0) {
            pl.push({
                id: 'muster_1',
                name: 'David Luiz (Muster)',
                number: '4',
                pos: 'IV',
                rating: 85,
                pace: 75,
                passing: 82,
                ginga: 90,
                defense: 88,
                stamina: 80,
                pulse: 72, // Ruhepuls/Startwert
                status: 'Fit',
                isMuster: true
            });
            localStorage.setItem('toni_players', JSON.stringify(pl));
        }
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
            if (!overlay.classList.contains('hidden')) {
                this.backToNav();
            }
        }
    },

    // FIX: Der Zurück-Button und die Grid-Anzeige
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
                        <span style="font-size: 0.75rem; font-weight: bold; letter-spacing: 1px;">${f.name}</span>
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
        else this.renderPlaceholder(sektor);
    },

    renderSporttasche() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const target = document.getElementById('active-content');
        
        target.innerHTML = `
            <div style="padding: 10px;">
                <button class="login-btn" style="width: 100%; margin-bottom: 20px;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUEN SPIELER HINZUFÜGEN</button>
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background: #151515; border: 1px solid ${p.pulse > 160 ? '#ff3b30' : '#333'}; padding: 15px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 1.2rem; font-weight: 900; color: ${p.pulse > 160 ? '#ff3b30' : 'var(--accent-orange)'};">#${p.number}</div>
                            <b style="font-size: 0.8rem;">${p.name}</b>
                            <div style="font-size: 0.65rem; color: ${p.pulse > 160 ? '#ff3b30' : '#888'}; margin-top:5px;">❤️ ${p.pulse || 70} BPM</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    openFIFAcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        document.getElementById('active-content').innerHTML = `
            <div class="fifa-card-overlay" style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; border: 1px solid var(--accent-orange);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 15px;">
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <div style="font-size: 3rem; font-weight: 900; color: var(--accent-orange);">${p.rating || 80}</div>
                        <div><h2 style="margin: 0;">${p.name}</h2><span style="color: #888;">${p.pos} | #${p.number}</span></div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.8rem; color: #888;">BELASTUNG</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: ${p.pulse > 160 ? '#ff3b30' : '#4cd964'};">❤️ ${p.pulse || 70}</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <div>
                        <label style="font-size:0.7rem;">PACE</label><input type="range" value="${p.pace||50}" onchange="BriefcaseUI.updateVal('${id}', 'pace', this.value)">
                        <label style="font-size:0.7rem;">GINGA</label><input type="range" value="${p.ginga||50}" onchange="BriefcaseUI.updateVal('${id}', 'ginga', this.value)">
                        <label style="font-size:0.7rem;">PULS (BPM)</label>
                        <input type="number" value="${p.pulse||70}" style="width:100%; background:#000; color:#fff; border:1px solid #444;" onchange="BriefcaseUI.updateVal('${id}', 'pulse', this.value)">
                    </div>
                    <div>
                        <label style="font-size:0.7rem;">DEFENSE</label><input type="range" value="${p.defense||50}" onchange="BriefcaseUI.updateVal('${id}', 'defense', this.value)">
                        <label style="font-size:0.7rem;">STAMINA</label><input type="range" value="${p.stamina||50}" onchange="BriefcaseUI.updateVal('${id}', 'stamina', this.value)">
                        <label style="font-size:0.7rem;">STATUS</label>
                        <select onchange="BriefcaseUI.updateVal('${id}', 'status', this.value)" style="width:100%; background:#000; color:#fff; border:1px solid #444;">
                            <option value="Fit" ${p.status==='Fit'?'selected':''}>Fit</option>
                            <option value="Angeschlagen" ${p.status==='Angeschlagen'?'selected':''}>Angeschlagen</option>
                        </select>
                    </div>
                </div>
                <button class="login-btn" style="margin-top: 20px; width:100%;" onclick="BriefcaseUI.renderSporttasche()">ÄNDERUNGEN ÜBERNEHMEN</button>
            </div>
        `;
    },

    updateVal(id, key, val) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        if(i !== -1) {
            players[i][key] = val;
            
            // Puls-Check für Toni
            if (key === 'pulse' && val > 160) {
                if (window.ToniAI) {
                    const warn = `Coach Björn! Achtung bei ${players[i].name}. Der Puls ist bei ${val}! Er braucht eine Pause, sonst riskieren wir eine Verletzung!`;
                    window.ToniAI.addChatMessage("Toni", warn, "bot-msg");
                    window.ToniAI.speak(warn);
                }
            }

            // Rating-Update
            const p = players[i];
            const avg = (parseInt(p.pace||50) + parseInt(p.ginga||50) + parseInt(p.defense||50) + parseInt(p.stamina||50)) / 4;
            players[i].rating = Math.round(avg);
            
            localStorage.setItem('toni_players', JSON.stringify(players));
            if(window.arena) window.arena.loadPlayersFromStorage();
        }
    },

    // ... (restliche Funktionen addPlayerPrompt, renderSystem, renderPlaceholder bleiben erhalten)
    addPlayerPrompt() {
        const name = prompt("Name des Spielers:");
        const num = prompt("Rückennummer:");
        if(name && num) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({ id: Date.now(), name: name, number: num, pos: '??', rating: 50, pace: 50, ginga: 50, defense: 50, stamina: 50, pulse: 70, status: 'Fit' });
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    },

    renderSystem() {
        const currentProvider = localStorage.getItem('toni_api_provider') || "llama";
        const currentKey = localStorage.getItem('toni_api_key') || "";
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 20px; border: 1px solid #333; border-radius: 10px;">
                <h4>KI-KONFIGURATION</h4>
                <select id="api-provider" class="login-input" style="width:100%; background:#000; color:#fff;">
                    <option value="llama" ${currentProvider==='llama'?'selected':''}>Gemma 3 (MacBook)</option>
                    <option value="openai" ${currentProvider==='openai'?'selected':''}>OpenAI</option>
                </select>
                <input type="password" id="api-key-input" class="login-input" style="width:100%; margin-top:10px;" value="${currentKey}" placeholder="API Key...">
                <button class="login-btn" style="margin-top:15px; width:100%;" onclick="BriefcaseUI.saveSettings()">SPEICHERN</button>
            </div>
        `;
    },

    saveSettings() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        alert("Einstellungen gesichert.");
    },

    renderPlaceholder(sektor) {
        document.getElementById('active-content').innerHTML = `<div style="text-align:center; padding:50px; color:#555;"><p>Bereich <b>${sektor.toUpperCase()}</b> wird vorbereitet.</p></div>`;
    }
};

BriefcaseUI.init();
