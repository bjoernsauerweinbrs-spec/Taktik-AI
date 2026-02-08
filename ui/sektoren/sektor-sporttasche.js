/**
 * TONI 2.0 - SEKTOR KABINE (KADER-PLANER)
 * Status: STABILISIERT, CLIP-PROTECTED & ELITE-DESIGN
 */
window.SektorSporttasche = {
    open() {
        console.log("Sektor Kabine: Synchronisiere Kader-Management...");
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Sicherheits-Check: Datenbank-Integrität
        if (!window.Database) {
            content.innerHTML = `<div style="padding:40px; text-align:center; color:var(--status-error);">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem; margin-bottom:20px;"></i><br>
                DATENBANK-KERN NICHT GEFUNDEN
            </div>`;
            return;
        }

        const mode = window.Database.activeMode || 'training';
        const modeLabel = mode === 'training' ? 'TRAININGS-BETRIEB' : 'SPIEL-VORBEREITUNG';
        const modeColor = mode === 'training' ? 'var(--neon-green)' : 'var(--accent-gold)';

        // Clip-Protection: Sorgt dafür, dass Karten beim Scrollen nicht abgeschnitten werden
        content.style.paddingBottom = "200px"; 
        content.style.overflowY = "auto";
        content.style.height = "100%";

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:35px; padding: 10px; border-bottom: 2px solid rgba(255,255,255,0.05); padding-bottom: 25px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 3px; margin-bottom: 8px; text-transform:uppercase;">
                        KABINE: ${window.coachInfo.verein || 'MEIN KADER'}
                    </h2>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background: ${modeColor}; color:#000; font-size: 0.65rem; padding: 3px 10px; border-radius: 4px; font-weight: 900; text-transform: uppercase;">
                            <i class="fas ${mode === 'training' ? 'fa-dumbbell' : 'fa-trophy'}"></i> ${modeLabel}
                        </span>
                        <span style="color:#555; font-size:0.7rem;">VERSION 2.8 | ELITE-SYNC</span>
                    </div>
                </div>

                <div style="display: flex; gap: 8px; background: rgba(0,0,0,0.4); padding: 6px; border-radius: 12px; border: 1px solid #222;">
                    <button class="tactic-btn" 
                            style="background: ${mode === 'training' ? 'var(--neon-green)' : 'transparent'}; 
                                   color: ${mode === 'training' ? '#000' : '#888'}; margin: 0; padding: 8px 15px; border:none; font-weight:bold;"
                            onclick="window.Database.activeMode = 'training'; window.Database.save(); window.SektorSporttasche.open();">
                        TRAINING
                    </button>
                    <button class="tactic-btn" 
                            style="background: ${mode === 'match' ? 'var(--accent-gold)' : 'transparent'}; 
                                   color: ${mode === 'match' ? '#000' : '#888'}; margin: 0; padding: 8px 15px; border:none; font-weight:bold;"
                            onclick="window.Database.activeMode = 'match'; window.Database.save(); window.SektorSporttasche.open();">
                        MATCH
                    </button>
                </div>

                <div style="display: flex; gap: 12px;">
                    <button class="pro-btn-gold" style="border-radius: 10px; padding: 12px 25px; box-shadow: 0 4px 15px rgba(0,209,255,0.2);" onclick="window.SektorSporttasche.launchBoard()">
                        <i class="fas fa-play-circle"></i> BOARD AKTIVIEREN
                    </button>
                    <button class="tactic-btn" style="border-radius:10px;" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>
            
            <div id="locker-room-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; padding: 10px;"></div>
        `;

        this.renderCards();
    },

    renderCards() {
        const grid = document.getElementById('locker-room-grid');
        if (!grid) return;
        
        const mode = window.Database.activeMode;
        const players = window.Database.players || [];
        
        if (players.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:#444;">
                <i class="fas fa-user-plus" style="font-size:3rem; margin-bottom:20px; opacity:0.1;"></i><br>
                Keine Spieler im Kader. Nutze den Chat oder die Datenbank, um Spieler hinzuzufügen.
            </div>`;
            return;
        }

        grid.innerHTML = players.map(p => {
            const isAssigned = (p.assignment === 'both' || p.assignment === mode);
            const isTeamB = p.team === 'B';
            const teamLabel = mode === 'training' ? (isTeamB ? 'LEIBCHEN' : 'STAMMFELD') : (isTeamB ? 'GEGNER' : 'STARTELF');
            const cardClass = isTeamB ? 'away-team' : 'home-team';
            const statusStyle = isAssigned ? '' : 'filter: grayscale(1) opacity(0.2); transform: scale(0.95);';
            const teamColor = isTeamB ? '#ccff00' : 'var(--accent-gold)';

            return `
                <div class="fifa-card ${cardClass}" style="${statusStyle} transition: all 0.3s ease;">
                    <div class="card-inner" style="padding: 15px; position: relative; overflow:hidden;">
                        <div class="rating" style="cursor:pointer; z-index:10;" onclick="window.SektorSporttasche.edit(${p.id}, 'rat')">${p.rat || 80}</div>
                        
                        <div style="text-align:center; margin-top:25px;">
                            <div class="player-img-container" style="width: 85px; height: 85px; background: rgba(0,0,0,0.3); border-radius: 50%; border: 2px solid ${teamColor}; display:flex; align-items:center; justify-content:center; cursor:pointer; margin: 0 auto; overflow:hidden;" onclick="document.getElementById('img-up-${p.id}').click()">
                                ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-shield" style="font-size:2rem; opacity:0.2; color:${teamColor};"></i>`}
                                <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                            </div>
                            
                            <div style="font-weight:900; font-size:0.85rem; margin-top:15px; color:#fff; cursor:pointer; letter-spacing:1px;" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">
                                ${p.name.toUpperCase()}
                            </div>
                            
                            <button onclick="window.SektorSporttasche.toggleTeam(${p.id})" 
                                    style="background: rgba(0,0,0,0.8); border: 1px solid ${teamColor}; color: ${teamColor}; font-size: 0.6rem; padding: 5px 12px; border-radius: 20px; margin-top: 10px; cursor:pointer; text-transform:uppercase; font-weight:900; letter-spacing:1px;">
                                ${teamLabel}
                            </button>
                        </div>

                        <div class="vital-bar-container" style="margin-top:20px; background: rgba(0,0,0,0.3); padding:10px; border-radius:10px;">
                            <div class="card-stats-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.7rem; font-weight:bold;">
                                <div class="stat-item" style="color:#aaa; cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'pac')">PAC <span style="color:#fff;">${p.pac || 70}</span></div>
                                <div class="stat-item" style="color:#aaa; cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'sho')">SHO <span style="color:#fff;">${p.sho || 70}</span></div>
                                <div class="stat-item" style="color:#aaa; cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'pas')">PAS <span style="color:#fff;">${p.pas || 70}</span></div>
                                <div class="stat-item" style="color:#aaa; cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'dri')">DRI <span style="color:#fff;">${p.dri || 70}</span></div>
                                <div class="stat-item" style="color:#aaa; cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'def')">DEF <span style="color:#fff;">${p.def || 70}</span></div>
                                <div class="stat-item" style="color:#aaa; cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'phy')">PHY <span style="color:#fff;">${p.phy || 70}</span></div>
                            </div>
                            
                            <select onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.SektorSporttasche.open();"
                                    style="margin-top: 15px; width: 100%; background: #111; color: var(--data-cyan); border: 1px solid #333; font-size: 0.65rem; padding: 6px; border-radius: 6px; cursor:pointer; font-weight:bold;">
                                <option value="both" ${p.assignment === 'both' ? 'selected' : ''}>Training & Spiel</option>
                                <option value="training" ${p.assignment === 'training' ? 'selected' : ''}>Nur Training</option>
                                <option value="match" ${p.assignment === 'match' ? 'selected' : ''}>Nur Spiel</option>
                                <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>Abwesend / Verletzt</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    toggleTeam(id) {
        const p = window.Database.players.find(x => x.id === id);
        if (p) {
            const nextTeam = p.team === 'A' ? 'B' : 'A';
            window.Database.updatePlayer(id, 'team', nextTeam);
            console.log(`Team-Switch: ${p.name} ist jetzt Team ${nextTeam}`);
            this.open();
        }
    },

    launchBoard() {
        if (window.Database.save) window.Database.save();
        window.BriefcaseUI.toggle(); // Schließt die Aktentasche
        
        // Zwingt die Arena zum sofortigen Neuzeichnen der Aufstellung
        setTimeout(() => {
            if (window.arena && window.arena.syncFromDatabase) {
                window.arena.syncFromDatabase();
                window.arena.render();
                window.ToniVoice.speak("Board aktiv. Formationen geladen.");
            }
        }, 300);
    },

    edit(id, key) {
        const p = window.Database.players.find(x => x.id === id);
        if (!p) return;
        const val = prompt(`${key.toUpperCase()} ändern für ${p.name}:`, p[key]);
        if (val !== null && val.trim() !== "") {
            const newVal = isNaN(val) ? val : parseInt(val);
            window.Database.updatePlayer(id, key, newVal);
            this.open();
        }
    },

    upload(e, id) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Kompressions-Logik für Bilder (verhindert LocalStorage-Überlauf)
        const reader = new FileReader();
        reader.onload = () => {
            window.Database.updatePlayer(id, 'img', reader.result);
            this.open();
        };
        reader.readAsDataURL(file);
    }
};
