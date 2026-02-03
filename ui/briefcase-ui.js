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
        else if (sektor === 'training') this.renderTraining();
        else if (sektor === 'matchplan') this.renderMatchplan();
        else if (sektor === 'media') this.renderMedia();
        else if (sektor === 'system') this.renderSystem();
        else this.renderPlaceholder(sektor);
    },

    // --- NEU: MEDIA ZENTRALE ---
    renderMedia() {
        document.getElementById('active-content').innerHTML = `
            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; padding: 10px;">
                <div style="background:#000; border: 1px solid #333; border-radius: 10px; overflow:hidden; display:flex; flex-direction:column;">
                    <div id="video-placeholder" style="flex-grow:1; display:flex; align-items:center; justify-content:center; background:#111; min-height:250px;">
                        <i class="fas fa-play-circle" style="font-size:4rem; color:#444;"></i>
                    </div>
                    <div style="padding:15px; background:#1a1a1a; border-top:1px solid #333;">
                        <b style="color:var(--data-cyan);">TAKTIK-ANALYSE_01.MP4</b><br>
                        <small style="color:#666;">Hochgeladen am: 03.02.2026</small>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div class="sponsoring-tool" style="padding:15px; border:1px solid #444; border-radius:10px;">
                        <h4 style="margin:0 0 10px 0; font-size:0.8rem; color:var(--accent-orange);">VIDEO HOCHLADEN</h4>
                        <input type="file" id="video-upload" style="display:none;" onchange="alert('Video wird verarbeitet...')">
                        <button class="login-btn" style="width:100%; font-size:0.7rem;" onclick="document.getElementById('video-upload').click()">DATEI WÄHLEN</button>
                    </div>
                    <div style="padding:15px; background:rgba(255,149,0,0.05); border:1px solid var(--accent-orange); border-radius:10px;">
                        <h4 style="margin:0 0 10px 0; font-size:0.8rem; color:var(--accent-orange);">TONIS ANALYSE-FEED</h4>
                        <p style="font-size:0.7rem; color:#ccc; line-height:1.4;">"Coach, das Video zeigt deutlich: Die Abstände beim Verschieben in der 2. Minute waren zu groß. Wir müssen kompakter stehen!"</p>
                    </div>
                </div>
            </div>
        `;
    },

    // --- BESTEHENDE MODULE (ERHALTEN) ---
    renderMatchplan() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 10px; text-align: center; border: 1px solid var(--data-cyan); border-radius: 10px; background: rgba(0,209,255,0.05);">
                <h3 style="color: var(--data-cyan);">MATCHPLAN AKTIVIEREN</h3>
                <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
                    <button class="tactic-btn" onclick="BriefcaseUI.setMatchStyle('Offensiv')">GINGA (ATTACK)</button>
                    <button class="tactic-btn" onclick="BriefcaseUI.setMatchStyle('Defensiv')">COMPACT (DEFENSE)</button>
                </div>
            </div>`;
    },

    setMatchStyle(style) {
        if (window.ToniAI) {
            const msg = `Verstanden Coach Björn! Wir spielen heute ${style}.`;
            window.ToniAI.addChatMessage("Toni", msg, "bot-msg");
            window.ToniAI.speak(msg);
        }
    },

    renderTraining() {
        const drills = [
            { title: "Ginga Dribbling", focus: "Technik", load: "Mittel" },
            { title: "Gegenpressing 4vs4", focus: "Taktik", load: "Hoch" }
        ];
        document.getElementById('active-content').innerHTML = `
            <div style="padding:10px;">
                <h4 style="color:var(--accent-orange);">DRIL-KATALOG</h4>
                ${drills.map(d => `
                    <div style="background:#1a1a1a; padding:15px; border-radius:10px; margin-bottom:10px; border-left:4px solid var(--accent-orange); display:flex; justify-content:space-between; align-items:center;">
                        <div><b>${d.title}</b><br><small style="color:#888;">Fokus: ${d.focus}</small></div>
                        <button class="login-btn" style="font-size:0.6rem; width:auto; padding:8px;" onclick="BriefcaseUI.assignDrill('${d.title}')">PLANEN</button>
                    </div>`).join('')}
            </div>`;
    },

    assignDrill(drillName) {
        if (window.ToniAI) {
            const msg = `Übung '${drillName}' ist für Coach Björn geplant!`;
            window.ToniAI.addChatMessage("Toni", msg, "bot-msg");
            window.ToniAI.speak(msg);
        }
    },

    renderSporttasche() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 10px;">
                <button class="login-btn" style="width: 100%; margin-bottom: 20px;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUEN SPIELER HINZUFÜGEN</button>
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background: #151515; border: 1px solid ${p.pulse > 160 ? '#ff3b30' : '#333'}; padding: 15px; border-radius: 10px; text-align: center; cursor:pointer;">
                            <div style="font-size: 1.2rem; font-weight: 900; color: var(--accent-orange);">#${p.number}</div>
                            <b style="font-size: 0.8rem; color: #fff;">${p.name}</b>
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
                <h3>${p.name} (#${p.number})</h3>
                <label style="color:#888;">PULS (BPM)</label><input type="number" value="${p.pulse||70}" style="width:100%; background:#000; color:#fff;" onchange="BriefcaseUI.updateVal('${id}', 'pulse', this.value)">
                <button class="login-btn" style="margin-top: 20px; width:100%;" onclick="BriefcaseUI.renderSporttasche()">FERTIG</button>
            </div>`;
    },

    updateVal(id, key, val) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        if(i !== -1) {
            players[i][key] = val;
            if (key === 'pulse' && val > 160 && window.ToniAI) {
                const msg = `Coach! Achtung bei ${players[i].name}!`;
                window.ToniAI.addChatMessage("Toni", msg, "bot-msg");
                window.ToniAI.speak(msg);
            }
            localStorage.setItem('toni_players', JSON.stringify(players));
        }
    },

    renderSystem() {
        const currentProvider = localStorage.getItem('toni_api_provider') || "llama";
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 20px; border: 1px solid #333; border-radius: 10px;">
                <h4 style="color:#fff;">KI-SETUP</h4>
                <select id="api-provider" class="login-input" style="width:100%; background:#000; color:#fff;">
                    <option value="llama" ${currentProvider==='llama'?'selected':''}>Gemma 3 (MacBook)</option>
                    <option value="openai" ${currentProvider==='openai'?'selected':''}>OpenAI</option>
                </select>
                <button class="login-btn" style="margin-top:15px; width:100%;" onclick="BriefcaseUI.saveSettings()">SPEICHERN</button>
            </div>`;
    },

    saveSettings() {
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        alert("System-Konfiguration gesichert.");
    },

    renderPlaceholder(sektor) {
        document.getElementById('active-content').innerHTML = `<div style="text-align:center; padding:50px; color:#555;"><i class="fas fa-tools" style="font-size:2rem; margin-bottom:10px;"></i><p>Bereich ${sektor.toUpperCase()} wird ausgebaut.</p></div>`;
    },

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
