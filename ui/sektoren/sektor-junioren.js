/**
 * TONI 2.0 - SEKTOR JUNIOREN (ELITE MANAGEMENT UPDATE)
 * Status: FINALISIERT (Management-Konsole & Multi-Sektor Navigation Fix)
 */
window.SektorJunioren = {
    currentYouth: null,
    currentCoach: "Coach Toni",

    open() {
        console.log("Sektor Junioren wird gestartet...");
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.classList.remove('hidden');
        }

        const title = document.getElementById('sector-title');
        const content = document.getElementById('active-content');
        const briefcaseContent = document.getElementById('briefcase-content');

        if (!content || !briefcaseContent) {
            console.error("Kritischer Fehler: UI Container nicht gefunden!");
            return;
        }

        if (this.currentCoach === "Coach Toni") {
            const coach = prompt("Welcher Trainer leitet die heutige Einheit?", this.currentCoach);
            if (coach) this.currentCoach = coach;
        }

        if(title) title.innerText = "JUNIOREN-ZENTRALE";
        
        content.innerHTML = `
            <div style="text-align:center; margin-bottom:20px; border-bottom: 1px solid rgba(57,255,20,0.3); padding-bottom: 15px;">
                <p style="color:var(--neon-green); font-family: 'Orbitron'; letter-spacing: 2px;">
                    <i class="fas fa-user-shield"></i> AKTIVER TRAINER: ${this.currentCoach}
                </p>
            </div>
            
            <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                ${this.renderYouthButtons()}
            </div>

            <div id="youth-detail-view" style="margin-top: 30px; padding: 20px; background: rgba(57, 255, 20, 0.05); border: 1px solid rgba(57, 255, 20, 0.2); border-radius: 10px; display: none;">
            </div>
        `;
        
        briefcaseContent.classList.remove('hidden');
    },

    renderYouthButtons() {
        const teams = [
            { label: "G-Jugend", sub: "Bambini / Funino" },
            { label: "F-Jugend", sub: "U8 / U9" },
            { label: "E-Jugend", sub: "U10 / U11" },
            { label: "D-Jugend", sub: "U12 / U13" },
            { label: "C-Jugend", sub: "U14 / U15" },
            { label: "B-Jugend", sub: "U16 / U17" },
            { label: "A-Jugend", sub: "U18 / U19" }
        ];

        return teams.map(t => `
            <div class="mgmt-card" onclick="window.SektorJunioren.handleTeamSelect('${t.label}')" style="cursor:pointer; transition: 0.3s; position:relative;">
                <div class="card-header"><i class="fas fa-graduation-cap"></i> ${t.label}</div>
                <p style="font-size: 0.7rem; color: #888;">${t.sub}</p>
            </div>
        `).join('');
    },

    handleTeamSelect(teamLabel) {
        if(window.selectTeam) {
            window.currentTeamContext = teamLabel;
            console.log("⚽️ Team-Kontext gesetzt auf: " + teamLabel);
        }
        this.selectTeam(teamLabel);
    },

    /**
     * ZENTRALE NAVIGATION-LOGIK (FIX FÜR STADIONZEITUNG)
     */
    goToMagazine() {
        // 1. Sektor wechseln
        window.BriefcaseUI.switchSektor('templates');
        
        // 2. Delay für Initialisierung des Ziel-Sektors
        setTimeout(() => {
            if (window.SektorTemplates) {
                window.SektorTemplates.switchTab('magazine');
            }
        }, 80);
    },

    selectTeam(team) {
        this.currentYouth = team;
        const detailView = document.getElementById('youth-detail-view');
        detailView.style.display = 'block';
        
        const allPlayers = window.YouthPresets?.musterspieler || [];
        const filteredPlayers = allPlayers.filter(p => p.jugend === team);

        detailView.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom:15px;">
                <h4 style="color: var(--neon-green); margin:0; font-family:'Orbitron'; text-transform:uppercase;">FOKUS: ${team}</h4>
                <div style="display:flex; gap:10px;">
                    <button class="pro-btn" onclick="window.BriefcaseUI.switchSektor('sport')" style="font-size:0.6rem; padding:4px 10px;">
                        <i class="fas fa-users"></i> KABINE
                    </button>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                
                <div style="display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid #333;">
                    <p style="font-size: 0.65rem; color: var(--data-cyan); text-transform: uppercase; margin:0 0 5px 0; letter-spacing:1px;">Management-Konsole:</p>
                    
                    <button class="pro-btn-gold" onclick="window.SektorJunioren.goToMagazine()" style="text-align:left; padding:10px; font-size:0.75rem;">
                        <i class="fas fa-book-open"></i> STADIONZEITUNG
                    </button>
                    
                    <button class="pro-btn-gold" onclick="window.BriefcaseUI.switchSektor('training')" style="text-align:left; padding:10px; font-size:0.75rem;">
                        <i class="fas fa-dumbbell"></i> TRAINING PLANEN
                    </button>
                    
                    <button class="pro-btn-gold" onclick="window.BriefcaseUI.switchSektor('sport'); setTimeout(() => window.SektorSporttasche.switchMode('match'), 50);" style="text-align:left; padding:10px; font-size:0.75rem;">
                        <i class="fas fa-chess-board"></i> TAKTIK & AUFSTELLUNG
                    </button>
                    
                    <button class="pro-btn-gold" onclick="window.BriefcaseUI.switchSektor('reports')" style="text-align:left; padding:10px; font-size:0.75rem;">
                        <i class="fas fa-chart-line"></i> PERFORMANCE ANALYSE
                    </button>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <p style="font-size: 0.65rem; color: #888; text-transform: uppercase; margin:0;">Arena & Kader:</p>
                    <button class="pro-btn-gold" style="font-size:0.7rem;" onclick="window.SektorJunioren.triggerPitchSwitch('${team === 'G-Jugend' ? 'funino' : 'classic'}')">
                        ${team === 'G-Jugend' ? 'FUNINO PITCH' : 'STANDARD PITCH'}
                    </button>
                    
                    <div style="margin-top:5px; display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                        ${filteredPlayers.map(p => `
                            <button class="pro-btn" style="font-size: 0.65rem; padding: 5px;" onclick="window.SektorJunioren.deployPlayer('${p.id}', '${p.name}')">
                                ${p.name.split(' ')[0]}
                            </button>
                        `).join('')}
                    </div>
                    
                    <button class="pro-btn" style="margin-top:5px; font-size:0.7rem;" onclick="window.SektorJunioren.openVideoCoach()">
                        <i class="fas fa-play-circle"></i> VIDEO-COACHING
                    </button>
                </div>
            </div>
        `;
    },

    triggerPitchSwitch(mode) {
        if (!window.arena) return;
        window.BriefcaseUI.toggle(); 
        window.arena.switchPitchMode(mode);
    },

    openVideoCoach() {
        const query = this.currentYouth + " Fussball Technik Training";
        const url = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
        const videoOverlay = document.createElement('div');
        videoOverlay.id = "video-coach-overlay";
        videoOverlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:20000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
        videoOverlay.innerHTML = `
            <div style="width:100%; max-width:900px; display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--neon-green); padding-bottom:10px;">
                <h3 style="color:var(--neon-green); margin:0; font-family:'Orbitron'; text-transform:uppercase;">TONI VIDEO-COACH: ${this.currentYouth}</h3>
                <button onclick="document.getElementById('video-coach-overlay').remove()" style="background:none; border:1px solid #fff; color:#fff; cursor:pointer; padding:5px 15px; font-family:'Orbitron';">CLOSE [X]</button>
            </div>
            <iframe width="100%" height="550px" src="${url}" frameborder="0" allowfullscreen style="border:2px solid var(--neon-green); border-radius:10px; max-width:900px;"></iframe>
        `;
        document.body.appendChild(videoOverlay);
        if(window.ToniVoice) window.ToniVoice.speak("Video-Coaching für die " + this.currentYouth + " wird geladen.");
    },

    deployPlayer(id, name) {
        if (!window.arena) return;
        const newPlayer = {
            id: 'youth-' + id, name: name, type: 'player',
            x: 200 + Math.random() * 400, y: 150 + Math.random() * 200,
            targetX: 200 + Math.random() * 400, targetY: 150 + Math.random() * 200,
            color: 'var(--neon-green)', number: '?'
        };
        window.arena.elements.push(newPlayer);
        if(window.ToniVoice) window.ToniVoice.speak(`${name} ist auf dem Platz.`);
        window.BriefcaseUI.toggle();
    }
};
