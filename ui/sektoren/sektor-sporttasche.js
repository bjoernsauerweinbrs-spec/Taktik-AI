/**
 * TONI 2.0 - SEKTOR KABINE (KADER-PLANER)
 * Status: STABILISIERT & CLIP-PROTECTED
 */
window.SektorSporttasche = {
    open() {
        console.log("Sektor Kabine: Öffne Kader-Management...");
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Sicherstellen, dass die Datenbank existiert
        if (!window.Database) {
            console.error("Datenbank nicht gefunden!");
            content.innerHTML = `<p style="color:red; padding:20px;">Datenbank-Fehler: Bitte System neu starten.</p>`;
            return;
        }

        const mode = window.Database.activeMode || 'training';
        const modeLabel = mode === 'training' ? 'TRAININGS-BETRIEB' : 'SPIEL-VORBEREITUNG';
        const modeColor = mode === 'training' ? 'var(--neon-green)' : 'var(--accent-gold)';

        // Layout-Fix: Großes Padding unten, damit die Karten nicht abgeschnitten werden
        content.style.paddingBottom = "180px";
        content.style.overflowY = "auto";

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; padding: 0 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 25px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px; margin-bottom: 5px;">KABINE: ${window.coachInfo.verein?.toUpperCase() || 'TEAM-POOL'}</h2>
                    <span style="color: ${modeColor}; font-size: 0.8rem; letter-spacing: 2px; font-weight: bold; text-transform: uppercase;">
                        <i class="fas ${mode === 'training' ? 'fa-dumbbell' : 'fa-trophy'}"></i> ${modeLabel}
                    </span>
                </div>

                <div style="display: flex; gap: 10px; background: rgba(0,0,0,0.5); padding: 5px; border-radius: 12px; border: 1px solid #333;">
                    <button class="tactic-btn" 
                            style="background: ${mode === 'training' ? 'var(--neon-green)' : 'transparent'}; 
                                   color: ${mode === 'training' ? '#000' : '#fff'}; margin: 0; min-width: 120px; border:none;"
                            onclick="window.Database.setMode('training'); window.SektorSporttasche.open();">
                        TRAINING
                    </button>
                    <button class="tactic-btn" 
                            style="background: ${mode === 'match' ? 'var(--accent-gold)' : 'transparent'}; 
                                   color: ${mode === 'match' ? '#000' : '#fff'}; margin: 0; min-width: 120px; border:none;"
                            onclick="window.Database.setMode('match'); window.SektorSporttasche.open();">
                        MATCH
                    </button>
                </div>

                <div style="display: flex; gap: 15px;">
                    <button class="pro-btn-gold" style="border-radius: 8px; padding: 10px 20px;" onclick="window.SektorSporttasche.launchBoard()">
                        <i class="fas fa-play"></i> BOARD STARTEN
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>
            
            <div class="fifa-cards-grid" id="locker-room-grid" style="display: flex; flex-wrap: wrap; gap: 25px; justify-content: center;"></div>
        `;

        this.renderCards();
    },

    renderCards() {
        const grid = document.getElementById('locker-room-grid');
        if (!grid) return;
        
        const mode = window.Database.activeMode;
        const players = window.Database.players || [];
        
        grid.innerHTML = players.map(p => {
            const isAssigned = (p.assignment === 'both' || p.assignment === mode);
            const isTeamB = p.team === 'B';
            const teamLabel = mode === 'training' ? (isTeamB ? 'LEIBCHEN' : 'TRIKOT') : (isTeamB ? 'GEGNER' : 'STARTELF');
            const cardClass = isTeamB ? 'away-team' : 'home-team';
            const statusStyle = isAssigned ? '' : 'filter: grayscale(1) opacity(0.3);';
            const teamColor = isTeamB ? '#ccff00' : 'var(--accent-gold)';

            return `
                <div class="fifa-card ${cardClass}" style="${statusStyle}">
                    <div class="card-inner" style="padding: 15px;">
                        <div class="rating" style="cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'rat')">${p.rat}</div>
                        
                        <div style="text-align:center; margin-top:20px;">
                            <div class="player-img-container" style="width: 75px; height: 75px; background: rgba(255,255,255,0.05); border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; cursor:pointer; margin: 0 auto;" onclick="document.getElementById('img-up-${p.id}').click()">
                                ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : `<i class="fas fa-user-ninja" style="font-size:1.8rem; opacity:0.2;"></i>`}
                                <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                            </div>
                            <div style="font-weight:900; font-size:0.75rem; margin-top:10px; color:#fff; cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">
                                ${p.name.toUpperCase()}
                            </div>
                            <button onclick="window.SektorSporttasche.toggleTeam(${p.id})" 
                                    style="background: rgba(0,0,0,0.6); border: 1px solid ${teamColor}; color: ${teamColor}; font-size: 0.5rem; padding: 4px 10px; border-radius: 4px; margin-top: 5px; cursor:pointer; text-transform:uppercase; font-weight:bold;">
                                ${teamLabel}
                            </button>
                        </div>

                        <div class="vital-bar-container" style="margin-top:15px; width: 100%;">
                            <div class="card-stats-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.65rem;">
                                <div class="stat-item" style="cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'pac')">PAC <span class="stat-val">${p.pac}</span></div>
                                <div class="stat-item" style="cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'sho')">SHO <span class="stat-val">${p.sho}</span></div>
                                <div class="stat-item" style="cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'pas')">PAS <span class="stat-val">${p.pas}</span></div>
                                <div class="stat-item" style="cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'dri')">DRI <span class="stat-val">${p.dri}</span></div>
                                <div class="stat-item" style="cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'def')">DEF <span class="stat-val">${p.def}</span></div>
                                <div class="stat-item" style="cursor:pointer" onclick="window.SektorSporttasche.edit(${p.id}, 'phy')">PHY <span class="stat-val">${p.phy}</span></div>
                            </div>
                            
                            <select onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.SektorSporttasche.open();"
                                    style="margin-top: 12px; width: 100%; background: #000; color: #888; border: 1px solid #333; font-size: 0.55rem; padding: 5px; border-radius: 4px; cursor:pointer;">
                                <option value="both" ${p.assignment === 'both' ? 'selected' : ''}>Training & Spiel</option>
                                <option value="training" ${p.assignment === 'training' ? 'selected' : ''}>Nur Training</option>
                                <option value="match" ${p.assignment === 'match' ? 'selected' : ''}>Nur Spiel</option>
                                <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>Abwesend</option>
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
            window.Database.updatePlayer(id, 'team', p.team === 'A' ? 'B' : 'A');
            this.open();
        }
    },

    launchBoard() {
        if (window.Database.save) window.Database.save();
        window.BriefcaseUI.toggle();
        if (window.arena && window.arena.syncFromDatabase) window.arena.syncFromDatabase();
    },

    edit(id, key) {
        const p = window.Database.players.find(x => x.id === id);
        if (!p) return;
        const val = prompt(`${key.toUpperCase()} ändern:`, p[key]);
        if (val !== null) {
            const newVal = isNaN(val) ? val : parseInt(val);
            window.Database.updatePlayer(id, key, newVal);
            this.open();
        }
    },

    upload(e, id) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            window.Database.updatePlayer(id, 'img', reader.result);
            this.open();
        };
        reader.readAsDataURL(file);
    }
};
