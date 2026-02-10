/**
 * TONI 2.0 - SEKTOR JUNIOREN
 * Status: ELITE UPDATE (Pitch-Switch & Global Team-Context Integration)
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

    // Brücken-Funktion: Kombiniert Detail-View mit globalem Kontext
    handleTeamSelect(teamLabel) {
        // 1. Globalen Kontext umschalten (für Kabine & Analyse)
        if(window.selectTeam) {
            // Wir rufen selectTeam auf, aber verhindern das automatische Schließen der Junioren-Zentrale,
            // damit der Coach noch die Arena-Tools nutzen kann.
            window.currentTeamContext = teamLabel;
            console.log("⚽️ Team-Kontext gesetzt auf: " + teamLabel);
        }
        
        // 2. Lokale Detail-Ansicht in der Junioren-Zentrale öffnen
        this.selectTeam(teamLabel);
    },

    selectTeam(team) {
        this.currentYouth = team;
        const detailView = document.getElementById('youth-detail-view');
        detailView.style.display = 'block';
        
        const allPlayers = window.YouthPresets?.musterspieler || [];
        const filteredPlayers = allPlayers.filter(p => p.jugend === team);

        detailView.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom:15px;">
                <h4 style="color: var(--neon-green); margin:0;">FOKUS: ${team}</h4>
                <button class="pro-btn" onclick="window.BriefcaseUI.switchSektor('sport')" style="font-size:0.6rem; padding:4px 10px;">
                    <i class="fas fa-users"></i> ZUR KABINE
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
                <div>
                    <p style="font-size: 0.7rem; color: #888; text-transform: uppercase;">Kader-Beamen (Schnell-Start):</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
                        ${filteredPlayers.map(p => `
                            <button class="pro-btn" style="font-size: 0.7rem; padding: 5px;" onclick="window.SektorJunioren.deployPlayer('${p.id}', '${p.name}')">
                                ${p.name.split(' ')[0]}
                            </button>
                        `).join('')}
                    </div>
                    <button class="pro-btn-gold" style="width:100%; margin-top:15px;" onclick="window.BriefcaseUI.switchSektor('reports')">
                        <i class="fas fa-chart-line"></i> VITAL-CHECK STARTEN
                    </button>
                    <button class="pro-btn-gold" style="width:100%; margin-top:10px;" onclick="window.SektorJunioren.openVideoCoach()">
                        <i class="fas fa-play-circle"></i> VIDEO-COACHING ÖFFNEN
                    </button>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <p style="font-size: 0.7rem; color: #888; text-transform: uppercase;">Arena-Konfiguration:</p>
                    <button class="pro-btn-gold" onclick="window.SektorJunioren.triggerPitchSwitch('${team === 'G-Jugend' ? 'funino' : 'classic'}')">
                        ${team === 'G-Jugend' ? 'FUNINO-PITCH (4 TORE)' : 'STANDARD-PITCH'}
                    </button>
                    <button class="pro-btn" onclick="window.SektorJunioren.addTrainingTool('cone')">+ HÜTCHEN-PARCOURS</button>
                    <button class="pro-btn" onclick="window.SektorJunioren.addTrainingTool('ladder')">+ KOORDI-LEITER</button>
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
            <p style="color:#888; margin-top:15px; font-size:0.8rem; letter-spacing:1px;">TONI durchsucht YouTube für ${this.currentYouth}...</p>
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
    },

    addTrainingTool(type) {
        if (!window.arena) return;
        if (type === 'cone') {
            for(let i=0; i<5; i++) window.arena.addEquipment('cone', 300 + (i*60), 200);
        } else if (type === 'ladder') {
            window.arena.addEquipment('ladder', 400, 100);
        }
        if(window.ToniVoice) window.ToniVoice.speak("Trainingsequipment platziert.");
        window.BriefcaseUI.toggle();
    }
};
