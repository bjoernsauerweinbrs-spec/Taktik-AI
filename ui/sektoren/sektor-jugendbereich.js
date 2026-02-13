/**
 * TONI 2.0 - SEKTOR JUGENDBEREICH (ACADEMY HUB)
 * Fokus: Jugend-Management, Pitch-Sync & Mission Stammplatz
 * Status: ETAPPE 5.1 - ACADEMY VERSIEGELT
 */
window.SektorJugendbereich = {
    currentYouth: null,
    currentCoach: "Coach Toni",

    open() {
        console.log("🎓 Academy: Junioren-Zentrale wird synchronisiert...");
        const content = document.getElementById('active-content');
        if (!content) return;

        // Trainer-Abfrage beim ersten Start
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
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom: 1px solid var(--data-cyan); padding-bottom: 15px;">
                    <div>
                        <h3 style="color:var(--data-cyan); font-family: 'Orbitron'; margin:0; letter-spacing:2px; font-size:1.1rem;">ACADEMY: ELITE JUGEND</h3>
                        <p style="color:#666; font-size:0.6rem; text-transform:uppercase; letter-spacing:1px;">AKTIVER LEAD: ${this.currentCoach}</p>
                    </div>
                    <button class="tactic-btn" style="font-size:0.65rem;" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
                
                <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                    ${this.renderYouthButtons()}
                </div>

                <div id="youth-detail-view" style="margin-top: 30px; padding: 25px; background: rgba(0, 209, 255, 0.05); border: 1px solid rgba(0, 209, 255, 0.2); border-radius: 15px; display: none; backdrop-filter: blur(10px);">
                </div>
            </div>
        `;
    },

    renderYouthButtons() {
        const teams = [
            { id: 'G', label: "G-JUGEND", sub: "FUNINO / U7", pitch: 'funino', icon: 'fa-child' },
            { id: 'F', label: "F-JUGEND", sub: "KLEINFELD / U9", pitch: 'kleinfeld', icon: 'fa-kids' },
            { id: 'E', label: "E-JUGEND", sub: "KLEINFELD / U11", pitch: 'kleinfeld', icon: 'fa-user-graduate' },
            { id: 'D', label: "D-JUGEND", sub: "KOMPAKT / U13", pitch: 'kleinfeld', icon: 'fa-users-rectangle' },
            { id: 'C', label: "C-JUGEND", sub: "GROSSFELD / U15", pitch: 'grossfeld', icon: 'fa-shield-halved' }
        ];

        return teams.map(t => `
            <div class="mgmt-card" onclick="window.SektorJugendbereich.selectTeam('${t.label}', '${t.pitch}')" 
                 style="cursor:pointer; border: 1px solid rgba(0, 209, 255, 0.2); text-align:center; padding:20px;">
                <i class="fas ${t.icon}" style="color:var(--data-cyan); font-size:1.5rem; margin-bottom:10px;"></i>
                <div style="color:var(--data-cyan); font-weight:900; font-family:'Orbitron'; font-size:0.8rem;">${t.label}</div>
                <p style="font-size: 0.5rem; color: #666; margin-top:5px; letter-spacing:1px;">${t.sub}</p>
            </div>
        `).join('');
    },

    selectTeam(team, pitchMode) {
        this.currentYouth = team;
        window.currentTeamContext = team; 
        
        const detailView = document.getElementById('youth-detail-view');
        detailView.style.display = 'block';
        detailView.classList.add('fadeIn');
        
        detailView.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">
                <h4 style="color: var(--neon-green); margin:0; font-family:'Orbitron'; font-size:1rem;">ACADEMY FOKUS: ${team}</h4>
                <button class="tactic-btn" onclick="window.openSection('kabine')" style="font-size:0.6rem;">KADER ÖFFNEN</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="display: flex; flex-direction: column; gap: 12px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; border:1px solid #222;">
                    <p style="font-size: 0.5rem; color: var(--data-cyan); text-transform: uppercase; letter-spacing:1px;">Academy Tools:</p>
                    
                    <button class="pro-btn-gold" onclick="window.openSection('stadionzeitung')" style="text-align:left; font-size:0.7rem;">
                        <i class="fas fa-newspaper"></i> MATCHDAY REPORT (DRUCK)
                    </button>
                    
                    <button class="pro-btn-gold" onclick="window.SektorJugendbereich.openStickerAlbum()" style="text-align:left; font-size:0.7rem;">
                        <i class="fas fa-id-badge"></i> MISSION STAMMPLATZ (STICKER)
                    </button>
                    
                    <button class="pro-btn-gold" onclick="window.openSection('training')" style="text-align:left; font-size:0.7rem;">
                        <i class="fas fa-clipboard-list"></i> TRAININGSEINHEIT PLANEN
                    </button>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <p style="font-size: 0.5rem; color: var(--neon-green); text-transform: uppercase; letter-spacing:1px;">Arena-Steuerung:</p>
                    
                    <button class="tactic-btn" style="border-color:var(--neon-green); color:var(--neon-green); font-size:0.7rem; text-align:left;" 
                            onclick="window.SektorJugendbereich.triggerPitchSwitch('${pitchMode}')">
                        <i class="fas fa-layer-group"></i> ARENA AUF ${pitchMode.toUpperCase()} UMSTELLEN
                    </button>
                    
                    <button class="tactic-btn" style="font-size:0.7rem; text-align:left;" onclick="window.SektorJugendbereich.openVideoCoach()">
                        <i class="fas fa-play-circle"></i> VIDEO-COACHING ÜBUNGEN
                    </button>
                    
                    <div style="background:rgba(57, 255, 20, 0.05); padding:12px; border-radius:8px; border:1px dashed var(--neon-green); margin-top:5px;">
                        <span style="font-size:0.55rem; color:var(--neon-green); line-height:1.4;">Toni-Hinweis: Für die ${team} empfehle ich heute Fokus auf den ersten Kontakt.</span>
                    </div>
                </div>
            </div>
        `;
        detailView.scrollIntoView({ behavior: 'smooth' });
    },

    triggerPitchSwitch(mode) {
        if (window.Arena) {
            window.BriefcaseUI.toggle(); // Schließt Zentrale für freie Sicht
            // Hier würde die Arena-Logik für Funino/Kleinfeld greifen
            if(window.ToniVoice) window.ToniVoice.speak("Arena wird auf " + mode + " konfiguriert.");
        }
    },

    openStickerAlbum() {
        alert("Mission Stammplatz: Sticker-Album wird für " + this.currentYouth + " generiert...");
        // Hier folgt später die Sticker-Logik
    },

    openVideoCoach() {
        const query = this.currentYouth + " Fussball Jugendtraining Technik Übungen";
        const url = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
        
        const videoOverlay = document.createElement('div');
        videoOverlay.id = "video-coach-overlay";
        videoOverlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:2000000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px; backdrop-filter:blur(15px);";
        
        videoOverlay.innerHTML = `
            <div style="width:100%; max-width:1100px; display:flex; justify-content:space-between; margin-bottom:20px; border-bottom:2px solid var(--data-cyan); padding-bottom:15px;">
                <div>
                    <h3 style="color:var(--data-cyan); margin:0; font-family:'Orbitron'; text-transform:uppercase; letter-spacing:2px;">ACADEMY VIDEO-COACH: ${this.currentYouth}</h3>
                    <span style="color:#666; font-size:0.6rem;">INTELLIGENTE ÜBUNGSAUSWAHL DURCH TONI KI</span>
                </div>
                <button onclick="document.getElementById('video-coach-overlay').remove()" style="background:none; border:1px solid #ff3b30; color:#ff3b30; cursor:pointer; padding:8px 20px; font-family:'Orbitron'; font-size:0.7rem; border-radius:5px;">SCHLIESSEN [X]</button>
            </div>
            <iframe width="100%" height="75%" src="${url}" frameborder="0" allowfullscreen style="border:2px solid var(--data-cyan); border-radius:15px; max-width:1100px; box-shadow:0 0 100px rgba(0,209,255,0.3);"></iframe>
        `;
        document.body.appendChild(videoOverlay);
    }
};
