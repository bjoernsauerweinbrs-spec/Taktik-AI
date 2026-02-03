window.BriefcaseUI = {
    // --- INITIALISIERUNG ---
    init: function() {
        console.log("BriefcaseUI wird initialisiert...");
        let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        if (pl.length === 0) {
            pl.push({
                id: 'muster_1', name: 'David Luiz (Muster)', number: '4', pos: 'IV',
                rating: 85, pace: 75, shooting: 60, passing: 82, ginga: 90, defense: 88, stamina: 80, pulse: 72, 
                photo: '', status: 'Fit', isMuster: true
            });
            localStorage.setItem('toni_players', JSON.stringify(pl));
        }
    },

    // --- GLOBALER TAG-KATALOG ---
    tagCatalog: [
        { id: 'SHOT_ON_TARGET', alias: 'TOR/ABSCHLUSS', impact: { shooting: 5, mental: 2 }, live: true },
        { id: 'PROGRESSIVE_PASS', alias: 'RAUMGEWINN-PASS', impact: { passing: 4, tactic: 2 }, live: true },
        { id: 'SKILL_BREAKTHROUGH', alias: 'DRIBBLING-DURCHBRUCH', impact: { ginga: 3, technique: 2 }, live: false },
        { id: 'TURNOVER_PASS', alias: 'FEHLPASS', impact: { passing: -2 }, live: false },
        { id: 'PRESSING_RECOVERY', alias: 'PRESSING-ERFOLG', impact: { tactic: 3, defense: 2 }, live: true }
    ],

    // --- NAVIGATION & UI CONTROLS ---
    toggle: function() {
        var overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
            if (!overlay.classList.contains('hidden')) { this.backToNav(); }
        }
    },

    backToNav: function() {
        var nav = document.getElementById('briefcase-nav');
        var content = document.getElementById('briefcase-content');
        var title = document.getElementById('sector-title');
        if(!nav || !content) return;
        nav.classList.remove('hidden');
        content.classList.add('hidden');
        title.innerText = "ZENTRALE AKTTENTASCHE";
        this.renderFolderGrid();
    },

    renderFolderGrid: function() {
        var nav = document.getElementById('briefcase-nav');
        if(!nav) return;
        var folders = [
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
        nav.innerHTML = '<div class="folder-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 10px;">' +
            folders.map(function(f) {
                return '<div class="folder-card" onclick="BriefcaseUI.switchSektor(\'' + f.id + '\')" ' +
                    'style="background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 25px; border-radius: 12px; text-align: center; cursor: pointer;">' +
                    '<i class="fas ' + f.icon + '" style="font-size: 2rem; color: ' + f.color + '; margin-bottom: 10px; display: block;"></i>' +
                    '<span style="font-size: 0.75rem; font-weight: bold; color: #fff;">' + f.name + '</span>' +
                    '</div>';
            }).join('') + '</div>';
    },

    switchSektor: function(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        document.getElementById('sector-title').innerHTML = '<button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:#ff9500; cursor:pointer; margin-right:10px;"><i class="fas fa-arrow-left"></i></button> ' + sektor.toUpperCase();
        
        if (sektor === 'sport') this.renderSporttasche();
        else if (sektor === 'matchplan') this.renderMatchplans();
        else if (sektor === 'reports') this.renderReports();
        else if (sektor === 'templates') this.renderTemplates();
        else if (sektor === 'media') this.renderMedia();
        else if (sektor === 'system') this.renderSystem();
        else if (sektor === 'sponsoring') this.renderSponsoring();
        else this.renderPlaceholder(sektor);
    },

    // --- MATCHPLANS ---
    renderMatchplans: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const currentMatchplan = JSON.parse(localStorage.getItem('toni_current_matchplan')) || { formation: '4-3-3' };
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h4 style="color:#fff; margin:0;">SPIELTAGS-SETUP</h4>
                    <select id="formation-select" onchange="BriefcaseUI.saveMatchplan()" style="background:#000; color:#ff9500; border:1px solid #ff9500; padding:5px; border-radius:5px;">
                        <option value="4-3-3" ${currentMatchplan.formation === '4-3-3' ? 'selected' : ''}>4-3-3 (Ginga Style)</option>
                        <option value="4-4-2" ${currentMatchplan.formation === '4-4-2' ? 'selected' : ''}>4-4-2 (Kompakt)</option>
                        <option value="3-5-2" ${currentMatchplan.formation === '3-5-2' ? 'selected' : ''}>3-5-2 (Dominanz)</option>
                    </select>
                </div>
                <div style="background:rgba(255,255,255,0.02); border:1px solid #333; border-radius:10px; padding:15px;">
                    <p style="font-size:0.7rem; color:#888;">NOMINIERTE STARTELF:</p>
                    <div id="starting-xi-list" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; margin-bottom:20px;">
                        ${players.slice(0, 11).map(p => `<div style="background:#1a1a1a; padding:10px; border-left:3px solid #ff9500; border-radius:5px; font-size:0.75rem;">#${p.number} <b>${p.name}</b> (${p.pos})</div>`).join('')}
                    </div>
                    <button class="login-btn" style="width:100%; background:#ff9500; color:#000; font-weight:900;" onclick="BriefcaseUI.transferToBoard()">AUF BOARD AKTIVIEREN</button>
                    <button class="login-btn" style="width:100%; margin-top:10px; background:#333;" onclick="BriefcaseUI.generateTacticalBriefing()">TONI ANALYSIS</button>
                </div>
            </div>`;
    },

    saveMatchplan: function() {
        const formation = document.getElementById('formation-select').value;
        localStorage.setItem('toni_current_matchplan', JSON.stringify({ formation: formation }));
    },

    transferToBoard: function() {
        const formation = document.getElementById('formation-select').value;
        if(window.arena) {
            arena.applyTacticalPattern(formation.toLowerCase().replace(/-/g, '')); 
            this.toggle();
            if(window.ToniAI) ToniAI.speak("Coach, die Spieler rücken in die " + formation + " Formation. Wir sind bereit.");
        }
    },

    generateTacticalBriefing: function() {
        const formation = document.getElementById('formation-select').value;
        if(window.ToniAI) ToniAI.processCommand("Analysiere kurz die taktischen Vorteile der " + formation + " Formation.");
    },

    // --- SPONSORING (INTERACTIVE) ---
    renderSponsoring: function() {
        const sponsors = JSON.parse(localStorage.getItem('toni_sponsors')) || [
            { id: 1, name: 'Hauptsponsor', logo: '' },
            { id: 2, name: 'Ausrüster', logo: '' }
        ];
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 15px;">
                <h4 style="color:#fff; margin-bottom:10px;">PARTNER & SPONSOREN</h4>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:15px;">
                    ${sponsors.map(s => `
                        <div style="background:rgba(255,255,255,0.02); border:1px solid #333; border-radius:10px; padding:15px; text-align:center;">
                            <div style="height:60px; background:rgba(255,255,255,0.05); border-radius:5px; margin-bottom:10px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                                ${s.logo ? `<img src="${s.logo}" style="max-height:100%; max-width:100%;">` : `<i class="fas fa-handshake" style="color:#333; font-size:1.5rem;"></i>`}
                            </div>
                            <button class="login-btn" style="font-size:0.55rem; padding:5px;" onclick="document.getElementById('upload-spon-${s.id}').click()">UPLOAD</button>
                            <input type="file" id="upload-spon-${s.id}" style="display:none;" onchange="BriefcaseUI.handleSponsorLogo(event, ${s.id})">
                        </div>
                    `).join('')}
                </div>
            </div>`;
    },

    handleSponsorLogo: function(e, id) {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ex) => {
            let sponsors = JSON.parse(localStorage.getItem('toni_sponsors')) || [{ id: 1, name: 'Haupt', logo: '' }, { id: 2, name: 'Ausrüst', logo: '' }];
            const idx = sponsors.findIndex(s => s.id === id);
            if (idx !== -1) {
                sponsors[idx].logo = ex.target.result;
                localStorage.setItem('toni_sponsors', JSON.stringify(sponsors));
                this.renderSponsoring();
                if(window.ToniAI) ToniAI.speak("Partner-Logo wurde im System aktualisiert, Coach.");
            }
        }; reader.readAsDataURL(file);
    },

    // --- TEMPLATES (SYNCED WITH MATCHPLAN & SPONSOR) ---
    renderTemplates: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const sponsors = JSON.parse(localStorage.getItem('toni_sponsors')) || [];
        const mainSponsor = sponsors.find(s => s.id === 1 && s.logo);
        const currentMatch = JSON.parse(localStorage.getItem('toni_current_matchplan')) || { formation: 'Keine' };
        const topPlayer = players.sort((a,b) => b.rating - a.rating)[0] || {name: "Kader leer", rating: 0};
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding: 15px;">
                <div id="print-area" style="background: #fff; color: #000; padding: 25px; border-radius: 5px; font-family: 'serif'; min-height:300px; position:relative;">
                    ${mainSponsor ? `<img src="${mainSponsor.logo}" style="position:absolute; top:10px; right:10px; max-height:40px;">` : ''}
                    <h2 style="text-align:center; border-bottom:2px solid #000; margin-top:0;">STADIONZEITUNG</h2>
                    <div style="display:flex; gap:15px; margin-top:20px;">
                        <div style="flex:1; text-align:center; border-right:1px solid #ddd;">
                            <img src="${topPlayer.photo || 'https://via.placeholder.com/80'}" style="width:100px; height:100px; border-radius:5px; border:1px solid #000; object-fit:cover;">
                            <p style="font-size:0.8rem; margin-top:10px;"><b>STAR DES TAGES</b><br>${topPlayer.name}</p>
                        </div>
                        <div style="flex:1.5; font-size:0.75rem;">
                            <b>COACH ANALYSE:</b><br>
                            "Wir setzen heute auf volle Ginga-Power und maximale Kontrolle."
                            <div style="margin-top:20px; padding:10px; border:1px dashed #ccc;">
                                <b>MATCH-FORMATION:</b><br>
                                <span style="font-size:1.2rem; font-weight:900;">${currentMatch.formation}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="login-btn" style="width:100%; margin-top:20px; background:#ff9500; color:#000;" onclick="window.print()">STADIONZEITUNG DRUCKEN</button>
            </div>`;
    },

    // --- REPORTS ---
    renderReports: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const avgRating = players.length > 0 ? Math.round(players.reduce((a,b) => a + (b.rating || 0), 0) / players.length) : 0;
        document.getElementById('active-content').innerHTML = `<div style="padding:15px;"><div style="background:rgba(0,209,255,0.05); border:1px solid #00d1ff; padding:20px; border-radius:15px; text-align:center; margin-bottom:20px;"><h4 style="margin:0; color:#00d1ff;">TEAM GINGA-INDEX</h4><div style="font-size:3rem; font-weight:900; color:#fff;">${avgRating}%</div></div><h4 style="color:#fff;">RANKING</h4><div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:10px;">${players.sort((a,b)=>b.rating-a.rating).map(p => `<div style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid #222;"><span>${p.name}</span><b style="color:#ff9500;">${p.rating}</b></div>`).join('')}</div></div>`;
    },

    // --- MEDIA ---
    renderMedia: function() {
        document.getElementById('active-content').innerHTML = `<div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:20px; padding:10px;"><div style="background:#000; border:1px solid #333; border-radius:10px; overflow:hidden;"><div style="height:250px; display:flex; align-items:center; justify-content:center; background:#111; color:#444;"><i class="fas fa-play-circle" style="font-size:4rem;"></i></div><div style="padding:10px; background:#1a1a1a; display:flex; gap:10px; overflow-x:auto;">${this.tagCatalog.map(t => `<button onclick="BriefcaseUI.logTag('${t.id}')" style="white-space:nowrap; background:#333; color:#fff; border:none; padding:5px 10px; border-radius:5px; font-size:0.6rem;">${t.alias}</button>`).join('')}</div></div><div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:10px;"><h4 style="margin:0 0 10px 0; font-size:0.8rem; color:#ff9500;">TAG-LOG</h4><div id="tag-log" style="font-size:0.7rem; color:#888; height:200px; overflow-y:auto;">Warte...</div></div></div>`;
    },

    logTag: function(tagId) {
        const tag = this.tagCatalog.find(t => t.id === tagId); const log = document.getElementById('tag-log');
        const entry = document.createElement('div'); entry.innerHTML = `[${new Date().toLocaleTimeString()}] <b>${tag.id}</b>`;
        if(log.innerHTML.includes("Warte")) log.innerHTML = ""; log.prepend(entry);
    },

    // --- SPORTTASCHE ---
    renderSporttasche: function() {
        var players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `<div style="padding:10px;"><button class="login-btn" style="width:100%; margin-bottom:20px; background:#ff9500; color:#000;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUEN SPIELER</button><div class="pro-player-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px,1fr)); gap:10px;">${players.map(p => `<div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background:#151515; border:1px solid #333; padding:15px; border-radius:10px; text-align:center; cursor:pointer;"><div style="font-size:1.2rem; font-weight:900; color:#ff9500;">#${p.number||0}</div><b style="font-size:0.8rem; color:#fff;">${p.name}</b></div>`).join('')}</div></div>`;
    },

    openFIFAcard: function(id) {
        var players = JSON.parse(localStorage.getItem('toni_players')) || []; var p = players.find(x => x.id == id); if(!p) return;
        var pins = JSON.parse(localStorage.getItem('toni_player_pins')) || {}; var pin = pins[id] ? pins[id].pin : "Keine PIN";
        document.getElementById('active-content').innerHTML = `<div style="display:grid; grid-template-columns:240px 1fr; gap:30px; background:#000; padding:25px; border-radius:15px; border:1px solid #ff9500;"><div style="width:240px; height:360px; background:linear-gradient(145deg, #d4af37, #b8860b); border-radius:10px; padding:20px; color:#111; text-align:center;"><div id="v-rating" style="font-size:4rem; font-weight:900;">${p.rating||80}</div><div style="font-weight:bold;">${p.pos||'IV'}</div><div onclick="document.getElementById('photo-upload').click()" style="width:110px; height:110px; margin:10px auto; border-radius:50%; background:#333; overflow:hidden; border:2px solid rgba(0,0,0,0.2); cursor:pointer;"><img id="v-photo" src="${p.photo||'https://via.placeholder.com/110'}" style="width:100%; height:100%; object-fit:cover;"></div><input type="file" id="photo-upload" style="display:none;" onchange="BriefcaseUI.handlePhoto(event,'${id}')"><div style="font-size:1.3rem; font-weight:900;">${p.name}</div><div style="font-size:0.6rem; margin-top:5px; background:rgba(0,0,0,0.1); padding:5px;">PIN: ${pin}</div></div><div><h3 style="color:#ff9500; margin:0;">ANALYSIS</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px;"><div><label>PAC</label><input type="range" id="i-pac" value="${p.pace||50}" oninput="BriefcaseUI.sync('${id}')"><label>GIN</label><input type="range" id="i-gin" value="${p.ginga||50}" oninput="BriefcaseUI.sync('${id}')"></div><div><label>SHO</label><input type="range" id="i-sho" value="${p.shooting||50}" oninput="BriefcaseUI.sync('${id}')"><label>DEF</label><input type="range" id="i-def" value="${p.defense||50}" oninput="BriefcaseUI.sync('${id}')"></div></div><button class="login-btn" style="width:100%; margin-top:20px;" onclick="BriefcaseUI.renderSporttasche()">FERTIG</button></div></div>`;
    },

    sync: function(id) {
        var v = { pace: document.getElementById('i-pac').value, shooting: document.getElementById('i-sho').value, ginga: document.getElementById('i-gin').value, defense: document.getElementById('i-def').value, stamina: 50, pulse: 70 };
        var r = Math.round((parseInt(v.pace)+parseInt(v.shooting)+parseInt(v.ginga)+parseInt(v.defense))/4);
        document.getElementById('v-rating').innerText = r; let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        const i = pl.findIndex(x => x.id == id); if(i !== -1) { Object.assign(pl[i], v); pl[i].rating = r; localStorage.setItem('toni_players', JSON.stringify(pl)); }
    },

    handlePhoto: function(e, id) {
        var f = e.target.files[0]; if(!f) return; var r = new FileReader(); r.onload = function(ex) {
            document.getElementById('v-photo').src = ex.target.result;
            let pl = JSON.parse(localStorage.getItem('toni_players')) || []; const i = pl.findIndex(x => x.id == id); if(i !== -1) { pl[i].photo = ex.target.result; localStorage.setItem('toni_players', JSON.stringify(pl)); }
        }; r.readAsDataURL(f);
    },

    renderSystem: function() {
        var k = localStorage.getItem('toni_api_key') || ""; var pr = localStorage.getItem('toni_api_provider') || "llama";
        document.getElementById('active-content').innerHTML = `<div style="padding:20px; background:rgba(255,255,255,0.02); border-radius:15px; border:1px solid #333;"><h4 style="color:#fff;">SYSTEM</h4><select id="api-provider" style="width:100%; background:#000; color:#fff; padding:10px; margin-bottom:10px;"><option value="llama" ${pr==='llama'?'selected':''}>Gemma 3 (Ollama)</option><option value="openai" ${pr==='openai'?'selected':''}>OpenAI</option></select><input type="password" id="api-key-input" style="width:100%; background:#000; color:#fff; padding:10px;" value="${k}"><button class="login-btn" style="width:100%; margin-top:15px; background:#ff9500; color:#000;" onclick="BriefcaseUI.saveSettings()">SPEICHERN</button></div>`;
    },

    saveSettings: function() { localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value); localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value); alert("Gesichert!"); },

    renderPlaceholder: function(s) { document.getElementById('active-content').innerHTML = `<div style="text-align:center; padding:50px;">Sektor ${s} folgt.</div>`; },

    addPlayerPrompt: function() {
        var n = prompt("Name:"); var num = prompt("Nummer:"); if(n && num) {
            var pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({ id: Date.now(), name: n, number: num, rating: 50, pace: 50, shooting: 50, ginga: 50, defense: 50, stamina: 50, pulse: 70 });
            localStorage.setItem('toni_players', JSON.stringify(pl)); this.renderSporttasche();
        }
    }
};

BriefcaseUI.init();
