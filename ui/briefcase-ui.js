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
        
        // Magazin-Seiten aus dem Speicher laden oder Standard erstellen
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

    // --- SYSTEM ---
    renderSystem: function() {
        const c = this.clubData;
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; background:#0a0a0a; border:1px solid #333; border-radius:15px;">
                <h3 style="color:#ff9500; margin:0 0 20px 0;">CLUB-KONFIGURATION</h3>
                <div style="display:grid; gap:15px;">
                    <div><label style="font-size:0.7rem; color:#888;">VEREIN</label>
                    <input type="text" id="set-club" value="${c.name}" class="login-input" style="text-align:left; margin:5px 0 0 0;"></div>
                    <div><label style="font-size:0.7rem; color:#888;">TRAINER / MANAGER</label>
                    <input type="text" id="set-coach" value="${c.coach}" class="login-input" style="text-align:left; margin:5px 0 0 0;"></div>
                    <div><label style="font-size:0.7rem; color:#888;">LIGA</label>
                    <input type="text" id="set-league" value="${c.league}" class="login-input" style="text-align:left; margin:5px 0 0 0;"></div>
                    <div style="margin-top:10px;">
                        <label style="font-size:0.7rem; color:#888;">CLUB-LOGO</label><br>
                        <input type="file" onchange="BriefcaseUI.handleClubLogo(event)" style="font-size:0.7rem; color:#888; margin-top:5px;">
                        ${c.logo ? `<img src="${c.logo}" style="height:40px; display:block; margin-top:10px;">` : ''}
                    </div>
                </div>
                <button class="login-btn" style="margin-top:20px; background:#ff9500; color:#000;" onclick="BriefcaseUI.saveClubSetup()">UPDATE SPEICHERN</button>
            </div>`;
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

    saveClubSetup: function() {
        this.clubData.name = document.getElementById('set-club').value;
        this.clubData.coach = document.getElementById('set-coach').value;
        this.clubData.league = document.getElementById('set-league').value;
        localStorage.setItem('toni_club_config', JSON.stringify(this.clubData));
        if(window.ToniAI) ToniAI.speak("Daten gespeichert. Wir greifen jetzt in der " + this.clubData.league + " an, Coach!");
    },

    // --- SPONSORING ---
    renderSponsoring: function() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:15px;">
                <h4 style="color:#fff; margin-bottom:10px;">SPONSORING & VERMARKTUNG</h4>
                <div id="consulting-box" style="background:#111; padding:15px; border-radius:10px; border-left:4px solid #ff9500; font-size:0.75rem; color:#ccc; line-height:1.5;">
                    Bereit für die Analyse. Ich kalkuliere Preise und Strategien basierend auf der ${this.clubData.league}.
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px;">
                    <button class="tactic-btn" onclick="BriefcaseUI.askConsultant('preise')">PREIS-CHECK</button>
                    <button class="tactic-btn" onclick="BriefcaseUI.askConsultant('konzept')">AKQUISE-KONZEPT</button>
                </div>
            </div>`;
    },

    askConsultant: function(type) {
        const box = document.getElementById('consulting-box');
        box.innerHTML = "Analysiere Marktwerte...";
        let prompt = type === 'preise' 
            ? `Kalkuliere realistische Werbepreise für die ${this.clubData.league} (Trikot, Heft, Banden). Antworte als Manager Toni.`
            : `Erstelle ein Sponsoring-Akquise Konzept für den Verein ${this.clubData.name}.`;
        if(window.ToniAI) {
            ToniAI.processCommand(prompt);
            setTimeout(() => {
                const msgs = document.querySelectorAll('.bot-msg');
                if(msgs.length > 0) box.innerHTML = msgs[msgs.length-1].innerHTML;
            }, 3500);
        }
    },

    // --- STADIONHEFT EDITOR ---
    renderTemplates: function() {
        const currentMatch = JSON.parse(localStorage.getItem('toni_current_matchplan')) || { formation: '4-3-3' };
        
        const renderPage = (p, index) => {
            let layoutExtra = '';
            if (p.type === 'cover') {
                layoutExtra = `<div style="background:#000; height:180px; margin:20px 0; display:flex; align-items:center; justify-content:center; color:#fff; font-size:3rem; font-weight:900;">MATCH DAY</div>`;
            } else if (p.type === 'taktik') {
                layoutExtra = `<div style="height:160px; background:#0b2d0b; border:2px solid #fff; margin:20px 0; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900; position:relative;">
                                <div style="border:1px solid rgba(255,255,255,0.2); width:80%; height:80%;"></div>
                                <span style="position:absolute; background:#fff; color:#000; padding:5px 15px; font-size:1.2rem;">${currentMatch.formation}</span>
                               </div>`;
            }

            return `
                <div class="mag-page-wrapper" style="position:relative; margin-bottom:60px;">
                    <div class="no-print" style="position:absolute; left:-60px; top:0; display:flex; flex-direction:column; gap:10px;">
                        <button onclick="BriefcaseUI.removeMagPage(${index})" title="Seite löschen" style="background:#ff4444; color:#fff; border:none; border-radius:50%; width:35px; height:35px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                        <button onclick="BriefcaseUI.addMagPage(${index})" title="Seite danach einfügen" style="background:#00d1ff; color:#fff; border:none; border-radius:50%; width:35px; height:35px; cursor:pointer;"><i class="fas fa-plus"></i></button>
                    </div>

                    <div class="mag-page" style="background:#fff; color:#000; padding:45px; font-family:sans-serif; width:148mm; min-height:210mm; margin:0 auto; box-shadow:0 20px 50px rgba(0,0,0,0.5); display:flex; flex-direction:column;">
                        <div style="display:flex; justify-content:space-between; border-bottom:3px solid #000; padding-bottom:5px; margin-bottom:20px;">
                            <span style="font-weight:900; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">${this.clubData.name} Inside</span>
                            <span style="font-size:0.75rem;">SEITE ${index + 1}</span>
                        </div>
                        
                        <h2 contenteditable="true" onblur="BriefcaseUI.saveMagDraft(${index}, 'title', this.innerText)" style="font-size:3.5rem; font-weight:900; line-height:0.8; margin:0; letter-spacing:-3px; text-transform:uppercase;">${p.title}</h2>
                        ${layoutExtra}
                        <div contenteditable="true" onblur="BriefcaseUI.saveMagDraft(${index}, 'content', this.innerText)" style="font-size:1.1rem; line-height:1.6; text-align:justify; margin-top:15px; flex-grow:1; outline:none; border:1px dashed transparent;">
                            ${p.content}
                        </div>
                        
                        <div style="border-top:1px solid #eee; margin-top:20px; padding-top:10px; font-size:0.6rem; color:#999; display:flex; justify-content:space-between;">
                            <span>OFFIZIELLES STADIONMAGAZIN</span>
                            <span>${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>`;
        };

        document.getElementById('active-content').innerHTML = `
            <style>
                @media print { 
                    .no-print, #sector-title, #briefcase-nav, .login-btn:not(#print-btn) { display: none !important; } 
                    body { background: white !important; padding:0 !important; } 
                    .mag-page { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; height: 100vh !important; page-break-after: always !important; }
                }
            </style>
            <div style="padding:20px; background:#1a1a1a; height:500px; overflow-y:auto; scroll-behavior: smooth;">
                <div id="magazin-canvas">
                    ${this.magazinPages.map((p, i) => renderPage(p, i)).join('')}
                </div>
                <div style="text-align:center; padding:40px;">
                    <button id="print-btn" class="login-btn" style="background:#ff9500; color:#000; width:350px; height:60px; font-size:1.2rem;" onclick="window.print()">
                        <i class="fas fa-print"></i> PDF EXPORT
                    </button>
                </div>
            </div>`;
    },

    saveMagDraft: function(index, field, value) {
        this.magazinPages[index][field] = value;
        localStorage.setItem('toni_magazin_draft', JSON.stringify(this.magazinPages));
    },

    addMagPage: function(index) {
        this.magazinPages.splice(index + 1, 0, { id: Date.now(), title: 'NEUE SEITE.', type: 'text', content: 'Inhalt hier einfügen...' });
        localStorage.setItem('toni_magazin_draft', JSON.stringify(this.magazinPages));
        this.renderTemplates();
        if(window.ToniAI) ToniAI.speak("Neue Seite hinzugefügt.");
    },

    removeMagPage: function(index) {
        if (this.magazinPages.length <= 1) return;
        this.magazinPages.splice(index, 1);
        localStorage.setItem('toni_magazin_draft', JSON.stringify(this.magazinPages));
        this.renderTemplates();
        if(window.ToniAI) ToniAI.speak("Seite entfernt.");
    },

    // --- SPORTTASCHE ---
    renderSporttasche: function() {
        var players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `<div style="padding:10px;"><button class="login-btn" style="width:100%; margin-bottom:20px; background:#ff9500; color:#000;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER PRO-PLAYER</button><div class="pro-player-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px,1fr)); gap:10px;">${players.map(p => `<div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background:#151515; border:1px solid #333; padding:15px; border-radius:10px; text-align:center; cursor:pointer;"><div style="font-size:1.2rem; font-weight:900; color:#ff9500;">#${p.number||0}</div><b style="font-size:0.8rem; color:#fff;">${p.name}</b></div>`).join('')}</div></div>`;
    },

    // --- TRAINING ---
    renderTraining: function() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:15px;">
                <h4 style="color:#fff;">INTERNATIONALES TRAINING</h4>
                <div id="drill-box" style="background:#111; padding:15px; border-radius:10px; border-left:4px solid #00d1ff; font-size:0.75rem; color:#ccc;">
                    Datenbank-Analyse für ${this.clubData.league} aktiv...
                </div>
                <button class="tactic-btn" style="margin-top:15px;" onclick="BriefcaseUI.askConsultant('training')">ÜBUNGEN RECHARCHIEREN</button>
            </div>`;
    },

    openFIFAcard: function(id) {
        var players = JSON.parse(localStorage.getItem('toni_players')) || []; var p = players.find(x => x.id == id); if(!p) return;
        document.getElementById('active-content').innerHTML = `<div style="display:grid; grid-template-columns:240px 1fr; gap:30px; background:#000; padding:25px; border-radius:15px; border:1px solid #ff9500;"><div style="width:240px; height:360px; background:linear-gradient(145deg, #d4af37, #b8860b); border-radius:10px; padding:20px; color:#111; text-align:center;"><div id="v-rating" style="font-size:4rem; font-weight:900;">${p.rating||80}</div><div style="font-weight:bold;">${p.pos||'ZM'}</div><div style="width:110px; height:110px; margin:10px auto; border-radius:50%; background:#333; overflow:hidden;"><img id="v-photo" src="${p.photo||''}" style="width:100%; height:100%; object-fit:cover;"></div><div style="font-size:1.3rem; font-weight:900;">${p.name}</div></div><div><h3 style="color:#ff9500; margin:0;">ANALYSIS</h3><button class="login-btn" style="width:100%; margin-top:20px;" onclick="BriefcaseUI.renderSporttasche()">ZURÜCK</button></div></div>`;
    },

    renderReports: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const avg = players.length > 0 ? Math.round(players.reduce((a,b) => a + (b.rating || 0), 0) / players.length) : 0;
        document.getElementById('active-content').innerHTML = `<div style="padding:15px;"><div style="background:rgba(0,209,255,0.05); border:1px solid #00d1ff; padding:20px; border-radius:15px; text-align:center; margin-bottom:20px;"><h4 style="margin:0; color:#00d1ff;">GLOBAL INDEX</h4><div style="font-size:3rem; font-weight:900; color:#fff;">${avg}%</div></div><div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:10px;">${players.sort((a,b)=>b.rating-a.rating).map(p => `<div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #222; font-size:0.8rem;"><span>${p.name}</span><b style="color:#ff9500;">${p.rating}</b></div>`).join('')}</div></div>`;
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
