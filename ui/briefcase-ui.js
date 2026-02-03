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

    // --- SYSTEM (STAMMDATEN) ---
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
        reader.onload = (ex) => { this.clubData.logo = ex.target.result; };
        reader.readAsDataURL(e.target.files[0]);
    },

    saveClubSetup: function() {
        this.clubData.name = document.getElementById('set-club').value;
        this.clubData.coach = document.getElementById('set-coach').value;
        this.clubData.league = document.getElementById('set-league').value;
        localStorage.setItem('toni_club_config', JSON.stringify(this.clubData));
        if(window.ToniAI) ToniAI.speak("Daten gespeichert. Wir greifen jetzt in der " + this.clubData.league + " an, Coach!");
    },

    // --- SPONSORING (CONSULTING) ---
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
                <div style="margin-top:20px; padding:10px; border:1px solid #333; font-size:0.65rem; color:#888;">
                    Inventar: Trikot (Brust/Ärmel), Bandenwerbung, Spieltags-Präsentator, Stadionheft-Anzeigen.
                </div>
            </div>`;
    },

    askConsultant: function(type) {
        const box = document.getElementById('consulting-box');
        box.innerHTML = "Analysiere Marktwerte...";
        let prompt = type === 'preise' 
            ? `Kalkuliere realistische Werbepreise für die ${this.clubData.league} (Trikot, Heft, Banden). Sei präzise wie Uli Hoeneß.`
            : `Erstelle ein Sponsoring-Akquise Konzept für den Verein ${this.clubData.name}.`;
        if(window.ToniAI) {
            ToniAI.processCommand(prompt);
            setTimeout(() => {
                const msgs = document.querySelectorAll('.bot-msg');
                if(msgs.length > 0) box.innerHTML = msgs[msgs.length-1].innerHTML;
            }, 3500);
        }
    },

    // --- STADIONHEFT (4 SEITEN HOCHGLANZ) ---
    renderTemplates: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const topP = players.sort((a,b) => b.rating - a.rating)[0] || {name: "Profi"};
        const currentMatch = JSON.parse(localStorage.getItem('toni_current_matchplan')) || { formation: '4-3-3' };
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:10px;">
                <h4 style="color:#fff; margin-bottom:15px;">MAGAZIN-EDITOR: ${this.clubData.name} INSIDE</h4>
                <div id="magazin-container" style="background:#fff; color:#000; padding:40px; font-family:'Helvetica', sans-serif; overflow-y:auto; height:450px; border-radius:5px;">
                    
                    <div class="mag-page" style="height:550px; border:12px solid #000; padding:20px; position:relative; margin-bottom:60px; display:flex; flex-direction:column; justify-content:space-between;">
                        <div>
                            <div style="display:flex; justify-content:space-between;">
                                <h1 style="font-size:3.5rem; font-weight:900; line-height:0.8; margin:0;">STADION<br>MAGAZIN</h1>
                                ${this.clubData.logo ? `<img src="${this.clubData.logo}" style="height:70px;">` : `<div style="font-weight:900; border:4px solid #000; padding:5px;">FC TONI</div>`}
                            </div>
                            <h2 style="margin-top:20px; font-size:1.2rem; text-transform:uppercase; letter-spacing:4px;">${this.clubData.name}</h2>
                        </div>
                        <div style="background:#000; height:200px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:2rem; font-weight:900;">MATCH-DAY</div>
                        <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                            <span style="font-size:0.8rem;">AUSGABE: ${new Date().toLocaleDateString()}</span>
                            <span style="font-size:1.5rem; font-weight:900;">${this.clubData.league}</span>
                        </div>
                    </div>

                    <div class="mag-page" style="height:550px; border-top:2px solid #eee; padding-top:20px; margin-bottom:60px;">
                        <h3 style="border-bottom:4px solid #000; padding-bottom:10px; text-transform:uppercase;">Vorwort des Trainers</h3>
                        <p style="font-size:0.9rem; line-height:1.6; text-align:justify;">
                            "Willkommen in der Arena! Heute gegen den Tabellennachbarn zählt jedes Prozent. Wir haben die Intensität gesteigert. Unsere taktische Ausrichtung ist klar auf Dominanz ausgelegt. Coach ${this.clubData.coach} und ich haben das Team perfekt eingestellt. Lassen Sie uns die Punkte hierbehalten!"
                        </p>
                        <p style="font-weight:bold; margin-top:20px;">- Ihr Toni (Co-Trainer)</p>
                        <div style="margin-top:40px; padding:20px; background:#f0f0f0;">
                            <b>TOP PLAYER IM FOKUS:</b><br>${topP.name} (Stärke: ${topP.rating})
                        </div>
                    </div>

                    <div class="mag-page" style="height:550px; border-top:2px solid #eee; padding-top:20px; margin-bottom:60px;">
                        <h3 style="text-transform:uppercase;">Taktik-Analyse</h3>
                        <div style="position:relative; width:100%; height:220px; background:#e8e8e8; border:2px solid #000; margin:20px 0; display:flex; align-items:center; justify-content:center;">
                            <div style="border:2px solid rgba(0,0,0,0.1); width:80%; height:80%;"></div>
                            <span style="position:absolute; background:#fff; padding:5px 15px; font-weight:900; border:2px solid #000;">${currentMatch.formation}</span>
                        </div>
                        <p style="font-size:0.85rem;"><b>MATCH-PLAN:</b> Raumkontrolle in der defensiven Zone, schnelles Umschalten über die Flügel. Wir erwarten einen tiefstehenden Gegner.</p>
                    </div>

                    <div class="mag-page" style="height:550px; border-top:2px solid #eee; padding-top:20px;">
                        <h3 style="text-transform:uppercase;">Partner & Sponsoren</h3>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px;">
                            <div style="border:1px solid #ccc; height:100px; display:flex; align-items:center; justify-content:center; color:#ccc;">HAUPTSPONSOR</div>
                            <div style="border:1px solid #ccc; height:100px; display:flex; align-items:center; justify-content:center; color:#ccc;">AUSRÜSTER</div>
                            <div style="border:1px solid #ccc; height:100px; display:flex; align-items:center; justify-content:center; color:#ccc;">REGIONALPARTNER</div>
                            <div style="border:1px solid #ccc; height:100px; display:flex; align-items:center; justify-content:center; color:#ccc;">STADIONWERBUNG</div>
                        </div>
                        <p style="font-size:0.7rem; color:#666; margin-top:40px;">Wollen auch Sie Teil des FC TONI 2.0 Netzwerks werden? Melden Sie sich in der Geschäftsstelle!</p>
                    </div>

                </div>
                <button class="login-btn" style="width:100%; margin-top:20px; background:#ff9500; color:#000; font-weight:900;" onclick="window.print()">DRUCKEN / SPEICHERN (PDF)</button>
            </div>`;
    },

    // --- SPORTTASCHE ---
    renderSporttasche: function() {
        var players = JSON.parse(localStorage.getItem('toni_players')) || [];
        document.getElementById('active-content').innerHTML = `<div style="padding:10px;"><button class="login-btn" style="width:100%; margin-bottom:20px; background:#ff9500; color:#000;" onclick="BriefcaseUI.addPlayerPrompt()">+ NEUER PRO-PLAYER</button><div class="pro-player-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px,1fr)); gap:10px;">${players.map(p => `<div class="p-card" onclick="BriefcaseUI.openFIFAcard('${p.id}')" style="background:#151515; border:1px solid #333; padding:15px; border-radius:10px; text-align:center; cursor:pointer;"><div style="font-size:1.2rem; font-weight:900; color:#ff9500;">#${p.number||0}</div><b style="font-size:0.8rem; color:#fff;">${p.name}</b></div>`).join('')}</div></div>`;
    },

    // --- TRAINER-NIVEAU ÜBUNGEN ---
    renderTraining: function() {
        document.getElementById('active-content').innerHTML = `
            <div style="padding:15px;">
                <h4 style="color:#fff;">INTERNATIONALES TRAINING</h4>
                <div id="drill-box" style="background:#111; padding:15px; border-radius:10px; border-left:4px solid #00d1ff; font-size:0.75rem; color:#ccc;">
                    Ich scanne Datenbanken für die ${this.clubData.league}...
                </div>
                <button class="tactic-btn" style="margin-top:15px;" onclick="BriefcaseUI.askConsultant('training')">ÜBUNGEN RECHARCHIEREN</button>
            </div>`;
    },

    openFIFAcard: function(id) {
        var players = JSON.parse(localStorage.getItem('toni_players')) || []; var p = players.find(x => x.id == id); if(!p) return;
        document.getElementById('active-content').innerHTML = `<div style="display:grid; grid-template-columns:240px 1fr; gap:30px; background:#000; padding:25px; border-radius:15px; border:1px solid #ff9500;"><div style="width:240px; height:360px; background:linear-gradient(145deg, #d4af37, #b8860b); border-radius:10px; padding:20px; color:#111; text-align:center;"><div id="v-rating" style="font-size:4rem; font-weight:900;">${p.rating||80}</div><div style="font-weight:bold;">${p.pos||'ZM'}</div><div style="width:110px; height:110px; margin:10px auto; border-radius:50%; background:#333; overflow:hidden;"><img id="v-photo" src="${p.photo||''}" style="width:100%; height:100%; object-fit:cover;"></div><div style="font-size:1.3rem; font-weight:900;">${p.name}</div></div><div><h3 style="color:#ff9500; margin:0;">ANALYSIS</h3><button class="login-btn" style="width:100%; margin-top:20px;" onclick="BriefcaseUI.renderSporttasche()">ZURÜCK</button></div></div>`;
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
