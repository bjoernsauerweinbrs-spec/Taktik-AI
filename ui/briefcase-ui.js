window.BriefcaseUI = {
    // --- TRAINER & CLUB DATEN ---
    clubData: JSON.parse(localStorage.getItem('toni_club_config')) || {
        name: 'FC TONI 2.0',
        coach: 'Björn',
        league: 'Regionalliga',
        logo: '' 
    },

    // --- INITIALISIERUNG ---
    init: function() {
        console.log("TONI 2.0 Management-Engine initialisiert...");
        let pl = JSON.parse(localStorage.getItem('toni_players')) || [];
        if (pl.length === 0) {
            pl.push({
                id: 'muster_1', name: 'Musterprofi', number: '10', pos: 'ZM',
                rating: 85, pace: 75, shooting: 80, passing: 85, defense: 70, photo: ''
            });
            localStorage.setItem('toni_players', JSON.stringify(pl));
        }
        if(!localStorage.getItem('toni_club_config')) {
            localStorage.setItem('toni_club_config', JSON.stringify(this.clubData));
        }
        
        // Magazin-Seiten laden
        this.magazinPages = JSON.parse(localStorage.getItem('toni_magazin_draft')) || [
            { id: 'p1', title: 'INSIDE ARENA.', type: 'cover', content: 'MATCHDAY MAG - Klicken zum Bearbeiten' },
            { id: 'p2', title: 'Wort des Coaches', type: 'text', content: 'Heute zählt nur die absolute Hingabe...' },
            { id: 'p3', title: 'Analyse & Formation', type: 'taktik', content: 'Fokus auf Raumkontrolle und Libero-Absicherung.' }
        ];
    },

    // --- NAVIGATION ---
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
            { id: 'templates', name: 'STADIONHEFT', icon: 'fa-book-open', color: '#fff' },
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
        else if (sektor === 'training') this.renderTraining();
        else if (sektor === 'sponsoring') this.renderSponsoring();
        else if (sektor === 'templates') this.renderTemplates();
        else if (sektor === 'system') this.renderSystem();
        else if (sektor === 'reports') this.renderReports();
        else this.renderPlaceholder(sektor);
    },

    // --- SYSTEM (CLUB + API KEYS) ---
    renderSystem: function() {
        const c = this.clubData;
        const apiKey = localStorage.getItem('toni_api_key') || "";
        const apiProvider = localStorage.getItem('toni_api_provider') || "llama";

        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; background:#0a0a0a; border:1px solid #333; border-radius:15px; overflow-y:auto; max-height:450px;">
                <h3 style="color:#ff9500; margin:0 0 15px 0; font-size:1rem; border-bottom:1px solid #222; padding-bottom:5px;">CLUB-KONFIGURATION</h3>
                <div style="display:grid; gap:10px; margin-bottom:25px;">
                    <div><label style="font-size:0.65rem; color:#888;">VEREIN</label>
                    <input type="text" id="set-club" value="${c.name}" class="login-input" style="text-align:left; margin:5px 0 0 0;"></div>
                    <div><label style="font-size:0.65rem; color:#888;">TRAINER</label>
                    <input type="text" id="set-coach" value="${c.coach}" class="login-input" style="text-align:left; margin:5px 0 0 0;"></div>
                    <div><label style="font-size:0.65rem; color:#888;">LIGA</label>
                    <input type="text" id="set-league" value="${c.league}" class="login-input" style="text-align:left; margin:5px 0 0 0;"></div>
                    <div style="margin-top:5px;">
                        <label style="font-size:0.65rem; color:#888;">LOGO</label><br>
                        <input type="file" onchange="BriefcaseUI.handleClubLogo(event)" style="font-size:0.65rem; color:#888;">
                        ${c.logo ? `<img src="${c.logo}" style="height:40px; display:block; margin-top:10px;">` : ''}
                    </div>
                </div>

                <h3 style="color:#ff9500; margin:0 0 15px 0; font-size:1rem; border-bottom:1px solid #222; padding-bottom:5px;">CORE SYSTEM (API)</h3>
                <div style="display:grid; gap:10px;">
                    <div><label style="font-size:0.65rem; color:#888;">KI-PROVIDER</label>
                        <select id="api-provider" class="login-input" style="text-align:left; margin:5px 0 0 0; background:#000;">
                            <option value="llama" ${apiProvider==='llama'?'selected':''}>Gemma 3 (Ollama)</option>
                            <option value="openai" ${apiProvider==='openai'?'selected':''}>OpenAI</option>
                        </select>
                    </div>
                    <div><label style="font-size:0.65rem; color:#888;">API KEY / ENDPUNKT</label>
                    <input type="password" id="api-key-input" value="${apiKey}" class="login-input" style="text-align:left; margin:5px 0 0 0;"></div>
                </div>
                <button class="login-btn" style="margin-top:20px; background:#ff9500; color:#000; font-weight:900;" onclick="BriefcaseUI.saveFullSettings()">ALLES SPEICHERN</button>
            </div>`;
    },

    saveFullSettings: function() {
        this.clubData.name = document.getElementById('set-club').value;
        this.clubData.coach = document.getElementById('set-coach').value;
        this.clubData.league = document.getElementById('set-league').value;
        localStorage.setItem('toni_club_config', JSON.stringify(this.clubData));
        localStorage.setItem('toni_api_key', document.getElementById('api-key-input').value);
        localStorage.setItem('toni_api_provider', document.getElementById('api-provider').value);
        if(window.ToniAI) ToniAI.speak("Konfiguration aktualisiert, Coach.", "deep");
        this.renderSystem();
    },

    handleClubLogo: function(e) {
        const reader = new FileReader();
        reader.onload = (ex) => { 
            this.clubData.logo = ex.target.result; 
            localStorage.setItem('toni_club_config', JSON.stringify(this.clubData));
            this.renderSystem();
        };
        reader.readAsDataURL(e.target.files[0]);
    },

    // --- SPONSORING ---
    renderSponsoring: function() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:15px;">
                <h4 style="color:#fff; margin-bottom:10px;">SPONSORING CONSULTING</h4>
                <div id="consulting-box" style="background:#111; padding:15px; border-radius:10px; border-left:4px solid #ff9500; font-size:0.75rem; color:#ccc;">
                    Bereit für die Analyse der ${this.clubData.league}.
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px;">
                    <button class="tactic-btn" onclick="BriefcaseUI.askConsultant('preise')">PREIS-CHECK</button>
                    <button class="tactic-btn" onclick="BriefcaseUI.askConsultant('konzept')">STRATEGIE</button>
                </div>
            </div>`;
    },

    askConsultant: function(type) {
        const box = document.getElementById('consulting-box');
        box.innerHTML = "Analysiere...";
        let prompt = type === 'preise' ? `Preise für ${this.clubData.league} kalkulieren.` : `Akquise für ${this.clubData.name}.`;
        if(window.ToniAI) {
            ToniAI.processCommand(prompt);
            setTimeout(() => {
                const msgs = document.querySelectorAll('.bot-msg');
                if(msgs.length > 0) box.innerHTML = msgs[msgs.length-1].innerHTML;
            }, 3000);
        }
    },

    // --- STADIONHEFT ---
    renderTemplates: function() {
        const currentMatch = JSON.parse(localStorage.getItem('toni_current_matchplan')) || { formation: '4-3-3' };
        const renderPage = (p, index) => {
            let layoutExtra = p.type === 'cover' ? `<div style="background:#000; height:150px; margin:20px 0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:2.5rem; font-weight:900;">MATCH DAY</div>` : 
                               p.type === 'taktik' ? `<div style="height:140px; background:#0b2d0b; border:2px solid #fff; margin:20px 0; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900;">${currentMatch.formation}</div>` : '';

            return `<div class="mag-page-wrapper" style="position:relative; margin-bottom:50px;">
                        <div class="no-print" style="position:absolute; left:-50px; top:0; display:flex; flex-direction:column; gap:8px;">
                            <button onclick="BriefcaseUI.removeMagPage(${index})" style="background:#ff4444; color:#fff; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                            <button onclick="BriefcaseUI.addMagPage(${index})" style="background:#00d1ff; color:#fff; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;"><i class="fas fa-plus"></i></button>
                        </div>
                        <div class="mag-page" style="background:#fff; color:#000; padding:40px; font-family:sans-serif; width:148mm; min-height:210mm; margin:0 auto; box-shadow:0 15px 40px rgba(0,0,0,0.5);">
                            <div style="display:flex; justify-content:space-between; border-bottom:2px solid #000; font-size:0.7rem; font-weight:900; margin-bottom:15px;">
                                <span>${this.clubData.name}</span><span>SEITE ${index + 1}</span>
                            </div>
                            <h2 contenteditable="true" onblur="BriefcaseUI.saveMagDraft(${index}, 'title', this.innerText)" style="font-size:3rem; font-weight:900; line-height:0.8; margin:0; letter-spacing:-2px; text-transform:uppercase;">${p.title}</h2>
                            ${layoutExtra}
                            <div contenteditable="true" onblur="BriefcaseUI.saveMagDraft(${index}, 'content', this.innerText)" style="font-size:1rem; line-height:1.5; margin-top:15px; flex-grow:1; outline:none;">${p.content}</div>
                        </div>
                    </div>`;
        };

        document.getElementById('active-content').innerHTML = `
            <style>@media print { .no-print, #sector-title, #briefcase-nav, .login-btn:not(#print-btn) { display: none !important; } .mag-page { box-shadow: none !important; margin: 0 !important; width: 100% !important; page-break-after: always !important; } }</style>
            <div style="padding:20px; background:#1a1a1a; height:500px; overflow-y:auto;">
                <div id="magazin-canvas">${this.magazinPages.map((p, i) => renderPage(p, i)).join('')}</div>
                <button id="print-btn" class="login-btn" style="background:#ff9500; color:#000; width:100%; margin-top:20px;" onclick="window.print()">DRUCKEN / PDF</button>
            </div>`;
    },

    saveMagDraft: function(index, field, value) {
        this.magazinPages[index][field] = value;
        localStorage.setItem('toni_magazin_draft', JSON.stringify(this.magazinPages));
    },

    addMagPage: function(index) {
        this.magazinPages.splice(index + 1, 0, { id: Date.now(), title: 'NEUE SEITE', type: 'text', content: 'Inhalt...' });
        localStorage.setItem('toni_magazin_draft', JSON.stringify(this.magazinPages));
        this.renderTemplates();
    },

    removeMagPage: function(index) {
        if (this.magazinPages.length <= 1) return;
        this.magazinPages.splice(index, 1);
        localStorage.setItem('toni_magazin_draft', JSON.stringify(this.magazinPages));
        this.renderTemplates();
    },

    // --- SPORTTASCHE ---
    renderSporttasche: function() {
        var players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `<div style="padding:10px;"><button class="login-btn" style="width:100%; margin-bottom:20px; background:#ff9500; color:#000;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER SPIELER</button><div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px,1fr)); gap:10px;">${players.map(p => `<div onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background:#151515; border:1px solid #333; padding:15px; border-radius:10px; text-align:center; cursor:pointer;"><div style="font-size:1.2rem; font-weight:900; color:#ff9500;">#${p.number||0}</div><b>${p.name}</b></div>`).join('')}</div></div>`;
    },

    openFIFAcard: function(id) {
        var players = JSON.parse(localStorage.getItem('toni_players')) || []; var p = players.find(x => x.id == id); if(!p) return;
        document.getElementById('active-content').innerHTML = `<div style="display:grid; grid-template-columns:220px 1fr; gap:20px; background:#000; padding:20px; border:1px solid #ff9500;"><div style="height:300px; background:linear-gradient(145deg, #d4af37, #b8860b); border-radius:10px; color:#111; text-align:center; padding:15px;"><div style="font-size:3rem; font-weight:900;">${p.rating||80}</div><div style="width:100px; height:100px; background:#333; margin:10px auto; border-radius:50%; overflow:hidden;"><img src="${p.photo||''}" style="width:100%; height:100%; object-fit:cover;"></div><div style="font-weight:900;">${p.name}</div></div><button class="login-btn" onclick="BriefcaseUI.renderSporttasche()">ZURÜCK</button></div>`;
    },

    renderTraining: function() {
        document.getElementById('active-content').innerHTML = `<div style="padding:15px;"><h4 style="color:#fff;">INTERNATIONAL TRAINING</h4><div id="drill-box" style="background:#111; padding:15px; border-left:4px solid #00d1ff; font-size:0.75rem; color:#ccc;">Analyse für ${this.clubData.league}...</div><button class="tactic-btn" style="margin-top:15px;" onclick="BriefcaseUI.askConsultant('training')">RECHARCHIEREN</button></div>`;
    },

    renderReports: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const avg = players.length > 0 ? Math.round(players.reduce((a,b) => a + (b.rating || 0), 0) / players.length) : 0;
        document.getElementById('active-content').innerHTML = `<div style="padding:15px;"><div style="background:rgba(0,209,255,0.05); padding:20px; border-radius:15px; text-align:center; border:1px solid #00d1ff;"><h4 style="color:#00d1ff; margin:0;">TEAM INDEX</h4><div style="font-size:3rem; font-weight:900; color:#fff;">${avg}%</div></div></div>`;
    },

    renderPlaceholder: function(s) { document.getElementById('active-content').innerHTML = `<div style="text-align:center; padding:50px; color:#444;">Sektor ${s} folgt...</div>`; },

    addPlayerPrompt: function() {
        var n = prompt("Name:"); var num = prompt("Nummer:"); if(n && num) {
            var pl = JSON.parse(localStorage.getItem('toni_players')) || [];
            pl.push({ id: Date.now(), name: n, number: num, rating: 50, pace: 50, shooting: 50, passing: 50, defense: 50 });
            localStorage.setItem('toni_players', JSON.stringify(pl)); this.renderSporttasche();
        }
    }
};

BriefcaseUI.init();
