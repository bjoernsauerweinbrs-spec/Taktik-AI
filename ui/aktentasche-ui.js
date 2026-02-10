/**
 * TONI 2.0 - AKTENTASCHE UI (ELITE RECOVERY & TRANSFER UPDATE)
 * Status: NAVIGATION FIX (Transfer & Stadion Buttons repariert)
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("Briefcase UI System initialisiert.");
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) return;

        this.isOpen = !this.isOpen;
        overlay.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            overlay.classList.remove('hidden');
            this.renderMainGrid();
        }
    },

    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        windowBody.style.overflowY = "auto";
        windowBody.style.paddingBottom = "50px"; 

        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase; margin:0; font-family: 'Orbitron'; font-size: 1.2rem;">ZENTRALE</h2>
                    <p style="color: #666; font-size: 0.6rem; letter-spacing: 2px; margin: 5px 0 0 0;">STRATEGIC HUB & UNIT CONTROL</p>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #666; font-size: 1.5rem;"></i>
            </div>
            
            <hr style="border: 0; border-top: 1px solid rgba(57, 255, 20, 0.2); margin-bottom: 30px;">

            <div id="briefcase-nav" class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                
                <div class="mgmt-card" onclick="window.openSection('junioren')" style="border: 1px solid var(--neon-green); box-shadow: 0 0 15px rgba(57, 255, 20, 0.1); cursor: pointer;">
                    <div class="card-header" style="color: var(--neon-green);"><i class="fas fa-graduation-cap"></i> JUNIOREN</div>
                    <p>G- bis A-Jugend Verwaltung</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('transfer')" style="border: 1px solid #fff; cursor: pointer;">
                    <div class="card-header" style="color: #fff;"><i class="fas fa-exchange-alt"></i> TRANSFER & KADER</div>
                    <p>Spieler hinzufügen & entfernen</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('kabine')" style="cursor: pointer;">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>Kader & Spielerprofile</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('analyse')" style="cursor: pointer;">
                    <div class="card-header"><i class="fas fa-heartbeat"></i> ANALYSE</div>
                    <p>Vital-Check & Performance</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('management')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--accent-gold);"><i class="fas fa-chart-line"></i> BUSINESS</div>
                    <p>Sponsoring & Finanzen</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('stadion')" style="cursor: pointer;">
                    <div class="card-header"><i class="fas fa-newspaper"></i> STADION</div>
                    <p>Stadionzeitung (A5)</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('training')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--neon-green);"><i class="fas fa-dumbbell"></i> TRAINING</div>
                    <p>KI-Einheiten & Archiv</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('material')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--data-cyan);"><i class="fas fa-box-open"></i> LAGER</div>
                    <p>Material & Bestandsliste</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('video')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--data-cyan);"><i class="fas fa-video"></i> SKILLS</div>
                    <p>Video-Analyse & Vektoren</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('matchday')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--accent-orange);"><i class="fas fa-clipboard-list"></i> MATCHDAY</div>
                    <p>Match-Plan & Gegner</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('taktik')" style="cursor: pointer;">
                    <div class="card-header" style="color: #ff3b30;"><i class="fas fa-chess-board"></i> TAKTIK</div>
                    <p>Formation & Spielzüge</p>
                </div>
            </div>
            
            <div id="briefcase-content" class="hidden">
                <div id="active-content"></div>
            </div>

            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px;">
                <button class="pro-btn" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;
    },

    /**
     * TRANSFER-ZENTRUM RENDERN
     */
    renderTransferCenter() {
        const content = document.getElementById('active-content');
        const players = window.Database ? window.Database.players : [];
        const teams = ["Senioren", "A-Jugend", "B-Jugend", "C-Jugend", "D-Jugend", "E-Jugend", "F-Jugend", "G-Jugend"];

        content.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:25px; height:100%;">
                <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:12px; border:1px solid #333;">
                    <h3 style="color:var(--neon-green); font-family:'Orbitron'; font-size:0.9rem; margin-bottom:15px;">SPIELER ANLEGEN</h3>
                    <input type="text" id="new-player-name" placeholder="Vor- und Nachname" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; border-radius:8px; margin-bottom:10px; font-family:sans-serif;">
                    <select id="new-player-team" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; border-radius:8px; margin-bottom:20px;">
                        ${teams.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                    <button class="pro-btn-gold" onclick="window.BriefcaseUI.addNewPlayer()" style="width:100%; padding:15px;">IN DEN VEREIN AUFNEHMEN</button>
                </div>

                <div style="background:rgba(0,0,0,0.4); padding:20px; border-radius:12px; border:1px solid #222; overflow-y:auto; max-height:60vh;">
                    <h3 style="color:#fff; font-family:'Orbitron'; font-size:0.8rem; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">GESAMT-KADER (${players.length})</h3>
                    <table style="width:100%; color:#fff; font-size:0.8rem; border-collapse:collapse;">
                        ${players.map(p => `
                            <tr style="border-bottom:1px solid #222;">
                                <td style="padding:10px; font-weight:bold;">${p.name}</td>
                                <td style="color:#888;">${p.team || '---'}</td>
                                <td style="text-align:right;">
                                    <button onclick="window.BriefcaseUI.removePlayer(${p.id})" style="background:none; border:none; color:var(--status-error); cursor:pointer;"><i class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            </div>`;
    },

    addNewPlayer() {
        const nameInp = document.getElementById('new-player-name');
        const teamInp = document.getElementById('new-player-team');
        if(!nameInp || !nameInp.value.trim()) { alert("Name fehlt!"); return; }

        const newP = {
            id: Date.now(),
            name: nameInp.value.trim(),
            team: teamInp.value,
            rat: 75, pac: 70, sho: 70, pas: 70, dri: 70, def: 70, phy: 70,
            pos: 'ST', assignment: 'both'
        };

        if(window.Database && window.Database.players) {
            window.Database.players.push(newP);
            if(window.Database.save) window.Database.save();
            nameInp.value = ""; 
            this.renderTransferCenter();
            if(window.ToniVoice) window.ToniVoice.speak(`${newP.name} ist jetzt im Verein.`);
        }
    },

    removePlayer(id) {
        if(!confirm("Spieler wirklich löschen?")) return;
        if(window.Database && window.Database.players) {
            window.Database.players = window.Database.players.filter(p => p.id !== id);
            if(window.Database.save) window.Database.save();
            this.renderTransferCenter();
        }
    }
};

/**
 * GLOBALER ROUTER
 */
window.openSection = function(section) {
    const nav = document.getElementById('briefcase-nav');
    const content = document.getElementById('briefcase-content');
    const backBtn = document.getElementById('back-to-hub');

    if(nav) nav.style.display = 'none';
    if(content) content.classList.remove('hidden');
    if(backBtn) backBtn.classList.remove('hidden');

    try {
        switch(section) {
            case 'transfer': 
                window.BriefcaseUI.renderTransferCenter(); 
                break;
            case 'stadion': 
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    setTimeout(() => window.SektorTemplates.switchTab('magazine'), 50);
                }
                break;
            case 'junioren': if(window.SektorJunioren) window.SektorJunioren.open(); break;
            case 'kabine': if(window.SektorSporttasche) window.SektorSporttasche.open(); break;
            case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
            case 'management': if(window.SektorManagement) window.SektorManagement.open(); break;
            case 'training': if(window.SektorTraining) window.SektorTraining.open(); break;
            case 'material': if(window.SektorMaterial) window.SektorMaterial.open(); break;
            case 'video': if(window.SektorVideo) window.SektorVideo.open(); break;
            case 'matchday': if(window.SektorMatchday) window.SektorMatchday.open(); break;
            case 'taktik': if(window.SektorTaktik) window.SektorTaktik.open(); break;
            default: console.warn("Sektor unbekannt:", section);
        }
    } catch (e) {
        console.error("Sektor-Ladefehler:", e);
    }
};
