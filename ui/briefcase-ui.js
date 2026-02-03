window.BriefcaseUI = {
    init() {
        let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        if (pl.length === 0) {
            pl.push({
                id: 'muster_1', name: 'David Luiz (Muster)', number: '4', pos: 'IV',
                rating: 85, pace: 75, passing: 82, ginga: 90, defense: 88, stamina: 80, pulse: 72, status: 'Fit', isMuster: true
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
        else if (sektor === 'training') this.renderTraining();
        else if (sektor === 'system') this.renderSystem();
        else this.renderPlaceholder(sektor);
    },

    // --- NEU: TRAINING MODUL ---
    renderTraining() {
        const drills = [
            { id: 1, title: "Ginga Dribbling", focus: "Technik", load: "Mittel" },
            { id: 2, title: "Gegenpressing 4vs4", focus: "Taktik", load: "Hoch" },
            { id: 3, title: "Abschluss-Stafette", focus: "Präzision", load: "Gering" }
        ];
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];

        document.getElementById('active-content').innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 10px;">
                <div>
                    <h4 style="color:var(--accent-orange);">DRIL-KATALOG</h4>
                    ${drills.map(d => `
                        <div style="background:#1a1a1a; padding:15px; border-radius:10px; margin-bottom:10px; border-left:4px solid var(--accent-orange);">
                            <b>${d.title}</b><br>
                            <small>Fokus: ${d.focus} | Last: ${d.load}</small>
                            <button class="login-btn" style="margin-top:10px; font-size:0.6rem; width:auto; padding:5px 10px;" onclick="BriefcaseUI.assignDrill('${d.title}')">SPIELER ZUWEISEN</button>
                        </div>
                    `).join('')}
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:10px;">
                    <h4 style="color:var(--data-cyan);">KADER-STATUS</h4>
                    ${players.map(p => `
                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:8px; border-bottom:1px solid #222; padding-bottom:5px;">
                            <span>#${p.number} ${p.name}</span>
                            <span style="color:${p.stamina < 50 ? '#ff3b30' : '#4cd964'}">Fit: ${p.stamina}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    assignDrill(drillName) {
        if (window.ToniAI) {
            const msg = `Coach Björn, gute Wahl! Ich habe das ${drillName}-Training in die Pläne der Jungs eingetragen. Ich achte besonders darauf, wer beim Puls heute schon am Limit war.`;
            window.ToniAI.addChatMessage("Toni", msg, "bot-msg");
            window.ToniAI.speak(msg);
        }
    },

    // --- BESTEHENDE FUNKTIONEN (SICHERGESTELLT) ---
    renderSporttasche() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 10px;">
                <button class="login-btn" style="width: 100%; margin-bottom: 20px;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUEN SPIELER HINZUFÜGEN</button>
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background: #151515; border: 1px solid ${p.pulse > 160 ? '#ff3b30' : '#333'}; padding: 15px; border-radius: 10px; text-align: center; cursor:pointer;">
                            <div style="font-size: 1.2rem; font-weight: 900; color: ${p.pulse > 160 ? '#ff3b30' : 'var(--accent-orange)'};">#${p.number}</div>
                            <b style="font-size: 0.8rem;">${p.name}</b>
                            <div style="font-size: 0.65rem; color: ${p.pulse > 160 ? '#ff3b30' : '#888'}; margin-top:5px;">❤️ ${p.pulse || 70} BPM</div>
                        </div>`).join('')}
                </div>
            </div>`;
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
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <div>
                        <label style="font-size:0.7rem;">PACE</label><input type="range" value="${p.pace||50}" onchange="BriefcaseUI.updateVal('${id}', 'pace', this.value)">
                        <label style="font-size:0.7rem;">PULS (BPM)</label><input type="number" value="${p.pulse||70}" style="width:100%; background:#000; color:#fff; border:1px solid #444;" onchange="BriefcaseUI.updateVal('${id}', 'pulse', this.value)">
                    </div>
                    <div>
                        <label style="font-size:0.7rem;">STAMINA</label><input type="range" value="${p.stamina||50}" onchange="BriefcaseUI.updateVal('${id}', 'stamina', this.value)">
                    </div>
                </div>
                <button class="login-btn" style="margin-top: 20px; width:100%;" onclick="BriefcaseUI.renderSporttasche()">ÄNDERUNGEN ÜBERNEHMEN</button>
            </div>`;
    },

    updateVal(id, key, val) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        if(i !== -1) {
            players[i][key] = val;
            if (key === 'pulse' && val > 160 && window.ToniAI) {
                const warn = `Coach Björn! Achtung bei ${players[i].name}. Puls: ${val}!`;
                window.ToniAI.addChatMessage("Toni", warn, "bot-msg");
                window.ToniAI.speak(warn);
            }
            localStorage.setItem('toni_players', JSON.stringify(players));
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
            </div>`;
    },

    saveSettings() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        alert("Einstellungen gesichert.");
    },

    renderPlaceholder(sektor) {
        document.getElementById('active-content').innerHTML = `<div style="text-align:center; padding:50px; color:#555;"><p>Bereich <b>${sektor.toUpperCase()}</b> wird vorbereitet.</p></div>`;
    },

    addPlayerPrompt() {
        const name = prompt("Name:"); const num = prompt("Nummer:");
        if(name && num) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({ id: Date.now(), name: name, number: num, pos: '??', rating: 50, pace: 50, ginga: 50, defense: 50, stamina: 50, pulse: 70, status: 'Fit' });
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    }
};

BriefcaseUI.init();
