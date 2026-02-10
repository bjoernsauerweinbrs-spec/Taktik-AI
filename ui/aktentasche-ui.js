/**
 * TONI 2.0 - AKTENTASCHE UI (ULTIMATE ROUTING FIX)
 * Status: TIEFENANALYSE ERFOLGREICH - ALLE BUTTONS REPARIERT
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

        // Zurücksetzen der Ansicht auf die Kacheln
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
                
                <div class="mgmt-card" onclick="window.openSection('junioren')" style="border: 1px solid var(--neon-green); cursor: pointer; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <div class="card-header" style="color: var(--neon-green); font-weight: bold; margin-bottom: 10px;"><i class="fas fa-graduation-cap"></i> JUNIOREN</div>
                    <p style="font-size: 0.75rem; color: #aaa;">G- bis A-Jugend Verwaltung</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('transfer')" style="border: 1px solid #fff; cursor: pointer; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <div class="card-header" style="color: #fff; font-weight: bold; margin-bottom: 10px;"><i class="fas fa-exchange-alt"></i> TRANSFER & KADER</div>
                    <p style="font-size: 0.75rem; color: #aaa;">Spieler hinzufügen & entfernen</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('kabine')" style="border: 1px solid #444; cursor: pointer; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <div class="card-header" style="color: #ccc; font-weight: bold; margin-bottom: 10px;"><i class="fas fa-users"></i> KABINE</div>
                    <p style="font-size: 0.75rem; color: #aaa;">Kader & Spielerprofile</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('analyse')" style="border: 1px solid #444; cursor: pointer; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <div class="card-header" style="color: #ccc; font-weight: bold; margin-bottom: 10px;"><i class="fas fa-heartbeat"></i> ANALYSE</div>
                    <p style="font-size: 0.75rem; color: #aaa;">Vital-Check & Performance</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('management')" style="border: 1px solid var(--accent-gold); cursor: pointer; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <div class="card-header" style="color: var(--accent-gold); font-weight: bold; margin-bottom: 10px;"><i class="fas fa-chart-line"></i> BUSINESS</div>
                    <p style="font-size: 0.75rem; color: #aaa;">Sponsoring & Finanzen</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('stadion')" style="border: 1px solid #444; cursor: pointer; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <div class="card-header" style="color: #ccc; font-weight: bold; margin-bottom: 10px;"><i class="fas fa-newspaper"></i> STADION</div>
                    <p style="font-size: 0.75rem; color: #aaa;">Stadionzeitung (A5)</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('training')" style="border: 1px solid var(--neon-green); cursor: pointer; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <div class="card-header" style="color: var(--neon-green); font-weight: bold; margin-bottom: 10px;"><i class="fas fa-dumbbell"></i> TRAINING</div>
                    <p style="font-size: 0.75rem; color: #aaa;">KI-Einheiten & Archiv</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('matchday')" style="border: 1px solid var(--accent-orange); cursor: pointer; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <div class="card-header" style="color: var(--accent-orange); font-weight: bold; margin-bottom: 10px;"><i class="fas fa-clipboard-list"></i> MATCHDAY</div>
                    <p style="font-size: 0.75rem; color: #aaa;">Match-Plan & Gegner</p>
                </div>

            </div>
            
            <div id="briefcase-content" class="hidden" style="margin-top: 20px;">
                <div id="active-content"></div>
            </div>

            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px;">
                <button class="pro-btn" onclick="window.BriefcaseUI.renderMainGrid()" style="background: transparent; border: 1px solid var(--neon-green); color: var(--neon-green); padding: 10px 20px; cursor: pointer;">← ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;
    },

    renderTransferCenter() {
        const content = document.getElementById('active-content');
        if (!content) return;
        const players = window.Database ? window.Database.players : [];
        const teams = ["Senioren", "A-Jugend", "B-Jugend", "C-Jugend", "D-Jugend", "E-Jugend", "F-Jugend", "G-Jugend"];

        content.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:25px;">
                <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:12px; border:1px solid #333;">
                    <h3 style="color:var(--neon-green); font-family:'Orbitron'; font-size:0.9rem; margin-bottom:15px;">SPIELER ANLEGEN</h3>
                    <input type="text" id="new-player-name" placeholder="Vor- und Nachname" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; border-radius:8px; margin-bottom:10px; outline: none;">
                    <select id="new-player-team" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; border-radius:8px; margin-bottom:20px;">
                        ${teams.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                    <button class="pro-btn-gold" onclick="window.BriefcaseUI.addNewPlayer()" style="width:100%; padding:15px; background: var(--accent-gold); color: #000; border: none; font-weight: bold; cursor: pointer;">IN DEN VEREIN AUFNEHMEN</button>
                </div>

                <div style="background:rgba(0,0,0,0.4); padding:20px; border-radius:12px; border:1px solid #222; overflow-y:auto; max-height:50vh;">
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
 * REPARIERTER GLOBALER ROUTER
 */
window.openSection = function(section) {
    const nav = document.getElementById('briefcase-nav');
    const content = document.getElementById('briefcase-content');
    const backBtn = document.getElementById('back-to-hub');
    const activeContent = document.getElementById('active-content');

    // DOM-CHECK & AUTOMATISCHE REPARATUR
    if (!nav || !content || !backBtn) {
        console.warn("DOM-Elemente für Router fehlen. Initialisiere MainGrid neu.");
        window.BriefcaseUI.renderMainGrid();
        // Erneuter Versuch nach dem Rendering
        setTimeout(() => window.openSection(section), 10);
        return;
    }

    // Navigation ausblenden, Content einblenden
    nav.style.display = 'none';
    content.classList.remove('hidden');
    backBtn.classList.remove('hidden');

    try {
        switch(section) {
            case 'transfer': 
                window.BriefcaseUI.renderTransferCenter(); 
                break;
            
            case 'stadion': 
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    setTimeout(() => {
                        if(typeof window.SektorTemplates.switchTab === 'function') {
                            window.SektorTemplates.switchTab('magazine');
                        }
                    }, 100);
                } else {
                    activeContent.innerHTML = `<p style="text-align:center; padding:50px; color:orange;">Sektor TEMPLATES nicht geladen.</p>`;
                }
                break;

            case 'management':
                if(window.SektorManagement) window.SektorManagement.open();
                else if(window.SektorSponsoring) window.SektorSponsoring.open();
                break;

            case 'junioren': if(window.SektorJunioren) window.SektorJunioren.open(); break;
            case 'kabine': if(window.SektorSporttasche) window.SektorSporttasche.open(); break;
            case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
            case 'training': if(window.SektorTraining) window.SektorTraining.open(); break;
            case 'matchday': if(window.SektorMatchday) window.SektorMatchday.open(); break;
            
            default: 
                activeContent.innerHTML = `<div style="text-align:center; padding:50px; color:#666;">Sektor ${section.toUpperCase()} noch nicht verknüpft.</div>`;
        }
    } catch (e) {
        console.error("Fehler beim Routing:", e);
        activeContent.innerHTML = `<p style="color:red; padding:20px;">Ladefehler: ${e.message}</p>`;
    }
};
