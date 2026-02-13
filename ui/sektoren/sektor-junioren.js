/**
 * TONI 2.0 - SEKTOR JUGENDBEREICH (ACADEMY HUB)
 * Fokus: Jugend-Management, Pitch-Sync & Mission Stammplatz
 * Status: SMART SYNC AKTIVIERT 2026
 */
window.SektorJugendbereich = {
    currentYouth: null,
    currentCoach: "Coach Toni",

    open() {
        console.log("🎓 Academy: Junioren-Zentrale wird synchronisiert...");
        const content = document.getElementById('active-content');
        if (!content) return;

        // Trainer-Abfrage beim ersten Start (nur falls Name noch Standard)
        if (this.currentCoach === "Coach Toni" && window.coachInfo?.name) {
            this.currentCoach = window.coachInfo.name;
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
            { id: 'F', label: "F-JUGEND", sub: "KLEINFELD / U9", pitch: 'kleinfeld', icon: 'fa-hands-holding-child' },
            { id: 'E', label: "E-JUGEND", sub: "KLEINFELD / U11", pitch: 'kleinfeld', icon: 'fa-user-graduate' },
            { id: 'D', label: "D-JUGEND", sub: "KOMPAKT / U13", pitch: 'kleinfeld', icon: 'fa-users-rectangle' },
            { id: 'C', label: "C-JUGEND", sub: "GROSSFELD / U15", pitch: 'grossfeld', icon: 'fa-shield-halved' }
        ];

        return teams.map(t => `
            <div class="mgmt-card" onclick="window.SektorJugendbereich.selectTeam('${t.label}', '${t.pitch}')" 
                 style="cursor:pointer; border: 1px solid rgba(0, 209, 255, 0.2); text-align:center; padding:20px; transition: 0.3s;"
                 onmouseover="this.style.borderColor='var(--data-cyan)'; this.style.background='rgba(0,209,255,0.05)';"
                 onmouseout="this.style.borderColor='rgba(0, 209, 255, 0.2)'; this.style.background='transparent';">
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
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.openSection('kabine')" style="font-size:0.6rem;">KADER</button>
                    <button class="tactic-btn" onclick="window.SektorJugendbereich.triggerPitchSwitch('${pitchMode}')" style="border-color:var(--neon-green); color:var(--neon-green); font-size:0.6rem;">ARENA SYNC</button>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="display: flex; flex-direction: column; gap: 12px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; border:1px solid #222;">
                    <p style="font-size: 0.5rem; color: var(--data-cyan); text-transform: uppercase; letter-spacing:1px;">Academy Tools:</p>
                    
                    <button class="pro-btn-gold" onclick="window.openSection('stadionzeitung')" style="text-align:left; font-size:0.7rem;">
                        <i class="fas fa-newspaper"></i> MATCHDAY REPORT
                    </button>
                    
                    <button class="pro-btn-gold" onclick="window.SektorJugendbereich.openStickerAlbum()" style="text-align:left; font-size:0.7rem;">
                        <i class="fas fa-id-badge"></i> MISSION STAMMPLATZ (STICKER)
                    </button>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <p style="font-size: 0.5rem; color: var(--neon-green); text-transform: uppercase; letter-spacing:1px;">Status-Check:</p>
                    <div style="background:rgba(57, 255, 20, 0.05); padding:12px; border-radius:8px; border:1px dashed var(--neon-green);">
                        <span style="font-size:0.55rem; color:var(--neon-green); line-height:1.4;">
                            <i class="fas fa-info-circle"></i> Toni-Tipp: Bei der <b>${team}</b> heute Fokus auf "Spielfreude und viele Ballkontakte".
                        </span>
                    </div>
                    <button class="tactic-btn" style="font-size:0.7rem; text-align:left;" onclick="window.SektorVideo.open()">
                        <i class="fas fa-play-circle"></i> VIDEO-COACHING ÖFFNEN
                    </button>
                </div>
            </div>
        `;
        detailView.scrollIntoView({ behavior: 'smooth' });
    },

    triggerPitchSwitch(mode) {
        if (window.Arena && typeof window.Arena.setPitchMode === 'function') {
            window.Arena.setPitchMode(mode);
            if(window.ToniVoice) window.ToniVoice.speak("Arena-Transformation eingeleitet. Pitch auf " + mode + " versiegelt.");
            
            // Briefcase schließen für freie Sicht aufs Feld
            setTimeout(() => {
                if(window.BriefcaseUI) window.BriefcaseUI.toggle();
            }, 1000);
        } else {
            alert("Arena-Engine nicht bereit für Transformation.");
        }
    },

    openStickerAlbum() {
        if(window.ToniVoice) window.ToniVoice.speak("Mission Stammplatz aktiviert. Sticker-Album für " + this.currentYouth + " wird vorbereitet.");
        alert("Mission Stammplatz: Sticker-Album wird generiert...");
    }
};
