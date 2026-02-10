/**
 * TONI 2.0 - SEKTOR JUNIOREN (ACADEMY HUB)
 * Fokus: Jugend-Kader Management & Pitch-Sync (Funino/Kleinfeld)
 * Status: MASTER-SYNC 2026
 */
window.SektorJunioren = {
    currentYouth: null,
    currentCoach: "Coach Toni",

    /**
     * Wird vom Router (openSection) aufgerufen
     */
    open() {
        console.log("🎓 Academy: Junioren-Zentrale wird initialisiert...");
        const content = document.getElementById('active-content');
        if (!content) return;

        // Falls noch kein Trainer gesetzt ist (einmalige Abfrage)
        if (this.currentCoach === "Coach Toni") {
            const coach = prompt("Welcher Trainer leitet die heutige Academy-Einheit?", this.currentCoach);
            if (coach) this.currentCoach = coach;
        }

        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        
        content.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom: 1px solid rgba(57,255,20,0.3); padding-bottom: 15px;">
                    <div>
                        <h3 style="color:var(--data-cyan); font-family: 'Orbitron'; margin:0; letter-spacing:2px;">ACADEMY: JUGEND-KADER</h3>
                        <p style="color:#666; font-size:0.6rem; text-transform:uppercase;">Aktiver Lead: ${this.currentCoach}</p>
                    </div>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
                
                <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                    ${this.renderYouthButtons()}
                </div>

                <div id="youth-detail-view" style="margin-top: 30px; padding: 25px; background: rgba(0, 209, 255, 0.03); border: 1px solid rgba(0, 209, 255, 0.1); border-radius: 15px; display: none;">
                    </div>
            </div>
        `;
    },

    renderYouthButtons() {
        const teams = [
            { id: 'G', label: "G-Jugend", sub: "Funino / Bambini", pitch: 'funino' },
            { id: 'F', label: "F-Jugend", sub: "Kleinfeld / U8-U9", pitch: 'kleinfeld' },
            { id: 'E', label: "E-Jugend", sub: "Kleinfeld / U10-U11", pitch: 'kleinfeld' },
            { id: 'D', label: "D-Jugend", sub: "Kompakt / U12-U13", pitch: 'kleinfeld' },
            { id: 'C', label: "C-Jugend", sub: "Großfeld / U14-U15", pitch: 'grossfeld' },
            { id: 'B', label: "B-Jugend", sub: "Leistung / U16-U17", pitch: 'grossfeld' },
            { id: 'A', label: "A-Jugend", sub: "Pro-Prep / U18-U19", pitch: 'grossfeld' }
        ];

        return teams.map(t => `
            <div class="mgmt-card" onclick="window.SektorJunioren.selectTeam('${t.label}', '${t.pitch}')" 
                 style="cursor:pointer; border-color: rgba(0, 209, 255, 0.3); transition: 0.3s;">
                <div style="color:var(--data-cyan); font-weight:900; font-family:'Orbitron'; font-size:0.8rem;">${t.label}</div>
                <p style="font-size: 0.6rem; color: #666; margin-top:5px;">${t.sub}</p>
            </div>
        `).join('');
    },

    selectTeam(team, pitchMode) {
        this.currentYouth = team;
        window.currentTeamContext = team; // Globaler Kontext für Zeitung/Sticker
        
        const detailView = document.getElementById('youth-detail-view');
        detailView.style.display = 'block';
        detailView.classList.add('fadeIn');
        
        detailView.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:10px;">
                <h4 style="color: var(--neon-green); margin:0; font-family:'Orbitron';">FOKUS: ${team}</h4>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.openSection('kabine')" style="font-size:0.6rem;">KABINE ÖFFNEN</button>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                    <p style="font-size: 0.55rem; color: #555; text-transform: uppercase; margin-bottom:5px;">Academy Management:</p>
                    
                    <button class="pro-btn-gold" onclick="window.openSection('stadionzeitung')" style="text-align:left; font-size:0.7rem;">
                        <i class="fas fa-newspaper"></i> MATCHDAY REPORT GENERIEREN
                    </button>
                    
                    <button class="pro-btn-gold" onclick="window.openSection('stammplatz')" style="text-align:left; font-size:0.7rem;">
                        <i class="fas fa-id-badge"></i> STICKER-ALBUM (MISSION STAMMPLATZ)
                    </button>
                    
                    <button class="pro-btn-gold" onclick="window.openSection('training')" style="text-align:left; font-size:0.7rem;">
                        <i class="fas fa-clipboard-list"></i> TRAININGSEINHEIT PLANEN
                    </button>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <p style="font-size: 0.55rem; color: #555; text-transform: uppercase; margin-bottom:5px;">Platz-Setup & Video:</p>
                    
                    <button class="tactic-btn" style="border-color:var(--neon-green); color:var(--neon-green); font-size:0.7rem;" 
                            onclick="window.SektorJunioren.triggerPitchSwitch('${pitchMode}')">
                        <i class="fas fa- ड्राft"></i> ARENA AUF ${pitchMode.toUpperCase()} UMSTELLEN
                    </button>
                    
                    <button class="tactic-btn" style="font-size:0.7rem;" onclick="window.SektorJunioren.openVideoCoach()">
                        <i class="fas fa-play-circle"></i> VIDEO-COACHING (YOUTUBE)
                    </button>
                    
                    <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:8px; border:1px dashed #222; margin-top:5px;">
                        <span style="font-size:0.6rem; color:#444;">INFO: Alle Änderungen im Kader werden über die "Kabine" (Pro-Sektor) verwaltet.</span>
                    </div>
                </div>
            </div>
        `;
        detailView.scrollIntoView({ behavior: 'smooth' });
    },

    triggerPitchSwitch(mode) {
        if (window.arena) {
            window.BriefcaseUI.toggle(); // Aktentasche schließen für freie Sicht
            window.arena.setPitchMode(mode);
        }
    },

    openVideoCoach() {
        const query = this.currentYouth + " Fussball Jugendtraining Übungen";
        const url = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
        const videoOverlay = document.createElement('div');
        videoOverlay.id = "video-coach-overlay";
        videoOverlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.98); z-index:2000000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(10px);";
        
        videoOverlay.innerHTML = `
            <div style="width:100%; max-width:1000px; display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--data-cyan); padding-bottom:10px;">
                <h3 style="color:var(--data-cyan); margin:0; font-family:'Orbitron'; text-transform:uppercase;">ACADEMY VIDEO-COACH: ${this.currentYouth}</h3>
                <button onclick="document.getElementById('video-coach-overlay').remove()" style="background:none; border:1px solid #fff; color:#fff; cursor:pointer; padding:5px 15px; font-family:'Orbitron'; font-size:0.7rem;">SCHLIESSEN [X]</button>
            </div>
            <iframe width="100%" height="70%" src="${url}" frameborder="0" allowfullscreen style="border:2px solid var(--data-cyan); border-radius:10px; max-width:1000px; box-shadow:0 0 50px rgba(0,209,255,0.2);"></iframe>
        `;
        document.body.appendChild(videoOverlay);
        if(window.ToniVoice) window.ToniVoice.speak("Ich habe die Trainings-Bibliothek für die " + this.currentYouth + " geöffnet.");
    }
};
