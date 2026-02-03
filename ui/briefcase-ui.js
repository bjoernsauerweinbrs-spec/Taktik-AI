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
                         style="background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 25px; border-radius: 12px; text-align: center; cursor: pointer; transition: 0.2s;">
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

        switch(sektor) {
            case 'sport': this.renderSporttasche(); break;
            case 'taktik': this.renderTaktiken(); break;
            case 'training': this.renderTraining(); break;
            case 'matchplan': this.renderMatchplan(); break;
            case 'media': this.renderMedia(); break;
            case 'sponsoring': this.renderSponsoring(); break;
            case 'templates': this.renderTemplates(); break;
            case 'reports': this.renderReports(); break;
            case 'system': this.renderSystem(); break;
        }
    },

    // 1. TAKTIKEN
    renderTaktiken() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:15px;">
                <h4 style="color:var(--accent-orange);">GESPEICHERTE BOARDS</h4>
                <div style="background:#1a1a1a; padding:15px; border-radius:10px; border:1px dashed #444; text-align:center;">
                    <i class="fas fa-save" style="font-size:2rem; color:#333; margin-bottom:10px;"></i><br>
                    <small>Keine gespeicherten Taktiken gefunden.</small>
                </div>
            </div>`;
    },

    // 2. SPIELER (SPORTTASCHE) + FIFA CARD
    renderSporttasche() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 10px;">
                <button class="login-btn" style="width: 100%; margin-bottom: 20px; background:var(--accent-orange); color:#000;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUEN SPIELER HINZUFÜGEN</button>
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background:#151515; border:1px solid #333; padding:15px; border-radius:10px; text-align:center; cursor:pointer;">
                            <div style="font-size:1.2rem; font-weight:900; color:var(--accent-orange);">#${p.number}</div>
                            <b style="color:#fff;">${p.name}</b>
                        </div>`).join('')}
                </div>
            </div>`;
    },

    openFIFAcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;
        document.getElementById('active-content').innerHTML = `
            <div class="fifa-card-container" style="display: grid; grid-template-columns: 200px 1fr; gap: 30px; background: linear-gradient(135deg, #1a1a1a 0%, #000 100%); padding: 30px; border-radius: 20px; border: 2px solid var(--accent-orange); color: white;">
                <div style="background: #222; border: 2px solid var(--accent-orange); border-radius: 15px; padding: 20px; text-align: center;">
                    <div style="font-size: 4rem; font-weight: 900; color: var(--accent-orange);">${p.rating || 80}</div>
                    <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">${p.pos || 'ST'}</div>
                    <div style="width: 100%; height: 100px; background: #333; border-radius: 10px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-user" style="font-size:3rem;"></i></div>
                    <div style="font-size: 1rem; font-weight: bold;">${p.name}</div>
                </div>
                <div>
                    <h3 style="margin:0; color:var(--accent-orange);">ATTRIBUTE & PULS</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div>
                            <label style="font-size:0.6rem;">PACE</label><input type="range" value="${p.pace||50}" onchange="BriefcaseUI.updateVal('${id}', 'pace', this.value)">
                            <label style="font-size:0.6rem;">GINGA</label><input type="range" value="${p.ginga||50}" onchange="BriefcaseUI.updateVal('${id}', 'ginga', this.value)">
                            <label style="font-size:0.6rem;">PULS</label><input type="number" value="${p.pulse||70}" style="width:100%; background:#000; border:1px solid #444; color:#fff;" onchange="BriefcaseUI.updateVal('${id}', 'pulse', this.value)">
                        </div>
                        <div>
                            <label style="font-size:0.6rem;">DEFENSE</label><input type="range" value="${p.defense||50}" onchange="BriefcaseUI.updateVal('${id}', 'defense', this.value)">
                            <label style="font-size:0.6rem;">STAMINA</label><input type="range" value="${p.stamina||50}" onchange="BriefcaseUI.updateVal('${id}', 'stamina', this.value)">
                        </div>
                    </div>
                    <button class="login-btn" style="margin-top:20px; width:100%;" onclick="BriefcaseUI.renderSporttasche()">FERTIG</button>
                </div>
            </div>`;
    },

    // 3. TRAINING
    renderTraining() {
        const drills = [{t:"Ginga Dribbling", f:"Technik"}, {t:"Pressing-Box", f:"Taktik"}];
        document.getElementById('active-content').innerHTML = `
            <div style="padding:15px;">
                <h4 style="color:var(--accent-orange);">DRIL-KATALOG</h4>
                ${drills.map(d => `<div style="background:#1a1a1a; padding:15px; border-radius:10px; margin-bottom:10px; border-left:4px solid var(--accent-orange); display:flex; justify-content:space-between; align-items:center;">
                    <span><b>${d.t}</b><br><small>${d.f}</small></span>
                    <button class="login-btn" style="width:auto; padding:5px 10px; font-size:0.6rem;" onclick="BriefcaseUI.placeholderMsg()">ZUWEISEN</button>
                </div>`).join('')}
            </div>`;
    },

    // 4. MATCHPLANS
    renderMatchplan() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; border:1px solid var(--data-cyan); border-radius:15px; text-align:center;">
                <h3 style="color:var(--data-cyan);">MATCH-SETUP</h3>
                <select class="login-input" style="width:100%; background:#000; color:#fff; margin-bottom:15px;">
                    <option>HEIM-SPIEL</option><option>AUSWÄRTS-SPIEL</option>
                </select>
                <button class="login-btn" style="width:100%; background:var(--data-cyan); color:#000;" onclick="BriefcaseUI.placeholderMsg()">AKTIVIEREN</button>
            </div>`;
    },

    // 5. MEDIA
    renderMedia() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; background:#000; border:1px solid #333; border-radius:10px; text-align:center;">
                <i class="fas fa-play-circle" style="font-size:3rem; color:#444; margin-bottom:15px;"></i><br>
                <b style="color:var(--data-cyan);">MEDIA-PLAYER BEREIT</b><br>
                <small style="color:#666;">Lade hier deine Taktik-Videos hoch.</small>
            </div>`;
    },

    // 6. SPONSORING
    renderSponsoring() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px;">
                <h3 style="color:var(--data-cyan);">PARTNER-BOARD</h3>
                <div style="background:white; color:black; padding:30px; border-radius:15px; text-align:center; font-weight:bold; font-size:1.5rem;">HAUPTSPONSOR HIER</div>
            </div>`;
    },

    // 7. TEMPLATES (A5 DRUCK)
    renderTemplates() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; text-align:center;">
                <i class="fas fa-print" style="font-size:2.5rem; color:var(--accent-orange); margin-bottom:15px;"></i>
                <h4>STADIONZEITUNG (A5)</h4>
                <button class="login-btn" onclick="window.print()" style="background:var(--accent-orange); color:#000;">DRUCK-VORSCHAU ÖFFNEN</button>
            </div>`;
    },

    // 8. REPORTS
    renderReports() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px;">
                <h4 style="color:#888;">ANALYSE-REPORTS</h4>
                <div style="background:#1a1a1a; padding:15px; border-radius:10px;">Ginga-Score Team-Schnitt: 78%</div>
            </div>`;
    },

    // 9. SYSTEM (API KEY)
    renderSystem() {
        const currentProvider = localStorage.getItem('toni_api_provider') || "llama";
        const currentKey = localStorage.getItem('toni_api_key') || "";
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 20px; border: 1px solid #333; border-radius: 15px; background: rgba(255,255,255,0.02);">
                <h4 style="color:#fff; margin-top:0;">KI-SETUP</h4>
                <select id="api-provider" class="login-input" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:10px; margin-bottom:10px;">
                    <option value="llama" ${currentProvider==='llama'?'selected':''}>Gemma 3 (MacBook)</option>
                    <option value="openai" ${currentProvider==='openai'?'selected':''}>OpenAI (Cloud)</option>
                </select>
                <input type="password" id="api-key-input" class="login-input" style="width:100%; background:#000; border:1px solid #444; color:#fff; padding:10px; margin-bottom:15px;" value="${currentKey}" placeholder="API-Key...">
                <button class="login-btn" style="width:100%; background:var(--accent-orange); color:#000;" onclick="BriefcaseUI.saveSettings()">SPEICHERN</button>
            </div>`;
    },

    // HELPER
    updateVal(id, key, val) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        if(i !== -1) {
            players[i][key] = val;
            const p = players[i];
            const avg = (parseInt(p.pace||50) + parseInt(p.shooting||50) + parseInt(p.passing||50) + parseInt(p.defense||50) + parseInt(p.ginga||50)) / 5;
            players[i].rating = Math.round(avg);
            localStorage.setItem('toni_players', JSON.stringify(players));
            if (key === 'pulse' && val > 160 && window.ToniAI) {
                const msg = `Coach Björn! Achtung bei ${players[i].name}. Puls: ${val}!`;
                window.ToniAI.addChatMessage("Toni", msg, "bot-msg");
                window.ToniAI.speak(msg);
            }
        }
    },

    saveSettings() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        alert("Konfiguration gesichert!");
    },

    placeholderMsg() { alert("Diese Funktion wird mit den nächsten Match-Daten verknüpft."); },
    
    addPlayerPrompt() {
        const name = prompt("Name:"); const num = prompt("Nummer:");
        if(name && num) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({ id: Date.now(), name: name, number: num, rating: 50, pace: 50, pulse: 70, status: 'Fit' });
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    }
};

BriefcaseUI.init();
