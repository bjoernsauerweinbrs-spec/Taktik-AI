// Wir definieren das Objekt direkt am window, damit app.html es sicher findet
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
            if (!overlay.classList.contains('hidden')) {
                this.backToNav();
            }
        } else {
            console.error("Fehler: briefcase-overlay nicht gefunden!");
        }
    },

    backToNav() {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        if(!nav || !content) return;

        nav.classList.remove('hidden');
        content.classList.add('hidden');
        title.innerText = "ZENTRALE AKTTENTASCHE";
        this.renderFolderGrid();
    },

    renderFolderGrid() {
        const nav = document.getElementById('briefcase-nav');
        const folders = [
            { id: 'taktik', name: 'TAKTIKEN', icon: 'fa-project-diagram', color: '#ff9500' },
            { id: 'sport', name: 'SPIELER', icon: 'fa-users', color: '#ff9500' },
            { id: 'training', name: 'TRAINING', icon: 'fa-dumbbell', color: '#ff9500' },
            { id: 'matchplan', name: 'MATCHPLANS', icon: 'fa-clipboard-list', color: '#00d1ff' },
            { id: 'media', name: 'MEDIA', icon: 'fa-photo-video', color: '#00d1ff' },
            { id: 'sponsoring', name: 'SPONSORING', icon: 'fa-handshake', color: '#00d1ff' },
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
        title.innerHTML = `<button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:#ff9500; cursor:pointer; margin-right:10px;"><i class="fas fa-arrow-left"></i></button> ${sektor.toUpperCase()}`;

        if (sektor === 'sport') this.renderSporttasche();
        else if (sektor === 'system') this.renderSystem();
        else this.renderPlaceholder(sektor);
    },

    renderSporttasche() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 10px;">
                <button class="login-btn" style="width: 100%; margin-bottom: 20px; background:#ff9500; color:#000;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUEN SPIELER HINZUFÜGEN</button>
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
                    ${players.map(p => `
                        <div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background: #151515; border: 1px solid #333; padding: 15px; border-radius: 10px; text-align: center; cursor:pointer;">
                            <div style="font-size: 1.2rem; font-weight: 900; color: #ff9500;">#${p.number}</div>
                            <b style="font-size: 0.8rem; color: #fff;">${p.name}</b>
                        </div>`).join('')}
                </div>
            </div>`;
    },

    openFIFAcard(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        const pac = p.pace || 50; const sho = p.shooting || 50; const pas = p.passing || 50;
        const gin = p.ginga || 50; const def = p.defense || 50; const sta = p.stamina || 50;

        document.getElementById('active-content').innerHTML = `
            <div style="display: flex; gap: 30px; background: #000; padding: 25px; border-radius: 15px; border: 1px solid #ff9500;">
                <div id="card-preview" style="width: 220px; height: 320px; background: linear-gradient(145deg, #d4af37, #b8860b); border-radius: 10px; padding: 20px; color: #111; text-align: center;">
                    <div id="v-rating" style="font-size: 4rem; font-weight: 900; line-height:1;">${p.rating || 80}</div>
                    <div style="font-weight:bold; text-transform:uppercase;">${p.pos || 'IV'}</div>
                    <div style="font-size: 1.5rem; font-weight: 900; margin-top: 80px; text-transform: uppercase; border-bottom: 2px solid rgba(0,0,0,0.1);">${p.name}</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; margin-top: 10px; font-weight: bold; font-size: 0.9rem; text-align: left; padding-left: 10px;">
                        <div><span id="c-pac">${pac}</span> PAC</div>
                        <div><span id="c-gin">${gin}</span> GIN</div>
                        <div><span id="c-sho">${sho}</span> SHO</div>
                        <div><span id="c-def">${def}</span> DEF</div>
                        <div><span id="c-pas">${pas}</span> PAS</div>
                        <div><span id="c-sta">${sta}</span> STA</div>
                    </div>
                </div>
                <div style="flex-grow: 1;">
                    <label>PAC</label><input type="range" id="i-pac" value="${pac}" oninput="BriefcaseUI.sync('${id}')">
                    <label>SHO</label><input type="range" id="i-sho" value="${sho}" oninput="BriefcaseUI.sync('${id}')">
                    <label>PAS</label><input type="range" id="i-pas" value="${pas}" oninput="BriefcaseUI.sync('${id}')">
                    <label>GIN</label><input type="range" id="i-gin" value="${gin}" oninput="BriefcaseUI.sync('${id}')">
                    <label>DEF</label><input type="range" id="i-def" value="${def}" oninput="BriefcaseUI.sync('${id}')">
                    <label>STA</label><input type="range" id="i-sta" value="${sta}" oninput="BriefcaseUI.sync('${id}')">
                    <button class="login-btn" style="width:100%; margin-top:15px;" onclick="BriefcaseUI.renderSporttasche()">SPEICHERN</button>
                </div>
            </div>`;
    },

    sync(id) {
        const vals = {
            pace: document.getElementById('i-pac').value,
            shooting: document.getElementById('i-sho').value,
            passing: document.getElementById('i-pas').value,
            ginga: document.getElementById('i-gin').value,
            defense: document.getElementById('i-def').value,
            stamina: document.getElementById('i-sta').value
        };
        document.getElementById('c-pac').innerText = vals.pace;
        document.getElementById('c-sho').innerText = vals.shooting;
        document.getElementById('c-pas').innerText = vals.passing;
        document.getElementById('c-gin').innerText = vals.ginga;
        document.getElementById('c-def').innerText = vals.defense;
        document.getElementById('c-sta').innerText = vals.stamina;

        const rating = Math.round((Object.values(vals).reduce((a,b)=>parseInt(a)+parseInt(b))) / 6);
        document.getElementById('v-rating').innerText = rating;

        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = players.findIndex(x => x.id == id);
        if(i !== -1) {
            Object.assign(players[i], vals);
            players[i].rating = rating;
            localStorage.setItem('toni_players', JSON.stringify(players));
        }
    },

    renderSystem() {
        const currentKey = localStorage.getItem('toni_api_key') || "";
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 20px; border: 1px solid #333; border-radius: 10px; background: rgba(255,255,255,0.02);">
                <h4 style="color:#fff;">KI-SETUP (API-KEY)</h4>
                <input type="password" id="api-key-input" class="login-input" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:10px;" value="${currentKey}" placeholder="API-Key hier...">
                <button class="login-btn" style="width:100%; margin-top:15px; background:#ff9500; color:#000;" onclick="BriefcaseUI.saveSettings()">SPEICHERN</button>
            </div>`;
    },

    saveSettings() {
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        alert("API-Key gesichert!");
    },

    renderPlaceholder(s) { document.getElementById('active-content').innerHTML = `<div style="text-align:center; padding:50px; color:#555;">Bereich ${s.toUpperCase()} folgt.</div>`; },

    addPlayerPrompt() {
        const n = prompt("Name:"); const num = prompt("Nummer:");
        if(n && num) {
            let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({ id: Date.now(), name: n, number: num, rating: 50, pace: 50, shooting: 50, passing: 50, ginga: 50, defense: 50, stamina: 50 });
            localStorage.setItem('toni_players', JSON.stringify(pl));
            this.renderSporttasche();
        }
    }
};

// Start
BriefcaseUI.init();
