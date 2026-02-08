/**
 * TONI 2.0 - SEKTOR KABINE (KADER-PLANER)
 * Fix: Stats-Grid korrigiert (kein Abschneiden mehr) & Team-Logik verfeinert.
 */
window.SektorSporttasche = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        const mode = window.Database.activeMode;
        const modeLabel = mode === 'training' ? 'TRAININGS-BETRIEB' : 'SPIEL-VORBEREITUNG';
        const modeColor = mode === 'training' ? 'var(--neon-green)' : 'var(--accent-gold)';

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; padding: 0 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 25px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px; margin-bottom: 5px;">KABINE: ${window.coachInfo.verein?.toUpperCase() || 'TEAM-POOL'}</h2>
                    <span style="color: ${modeColor}; font-size: 0.8rem; letter-spacing: 2px; font-weight: bold; text-transform: uppercase;">
                        <i class="fas ${mode === 'training' ? 'fa-dumbbell' : 'fa-trophy'}"></i> ${modeLabel}
                    </span>
                </div>

                <div style="display: flex; gap: 10px; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 12px; border: 1px solid #222;">
                    <button class="tactic-btn" 
                            style="background: ${mode === 'training' ? 'var(--neon-green)' : 'transparent'}; 
                                   color: ${mode === 'training' ? '#000' : '#fff'}; margin: 0; min-width: 130px;"
                            onclick="window.Database.setMode('training'); window.SektorSporttasche.open();">
                        TRAINING
                    </button>
                    <button class="tactic-btn" 
                            style="background: ${mode === 'match' ? 'var(--accent-gold)' : 'transparent'}; 
                                   color: ${mode === 'match' ? '#000' : '#fff'}; margin: 0; min-width: 130px;"
                            onclick="window.Database.setMode('match'); window.SektorSporttasche.open();">
                        SPIELBETRIEB
                    </button>
                </div>

                <div style="display: flex; gap: 15px;">
                    <button class="pro-btn-gold" style="border-radius: 8px;" onclick="window.SektorSporttasche.launchBoard()">
                        <i class="fas fa-play"></i> BOARD STARTEN
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>
            
            <div class="fifa-cards-grid" id="locker-room-grid"></div>
        `;

        this.renderCards();
    },

    renderCards() {
        const grid = document.getElementById('locker-room-grid');
        const mode = window.Database.activeMode;
        
        grid.innerHTML = window.Database.players.map(p => {
            const isAssigned = (p.assignment === 'both' || p.assignment === mode);
            const isTeamB = p.team === 'B';
            const teamLabel = mode === 'training' ? (isTeamB ? 'LEIBCHEN' : 'TRIKOT') : (isTeamB ? 'GEGNER' : 'STARTELF');
            const cardClass = isTeamB ? 'away-team' : 'home-team';
            const statusStyle = isAssigned ? '' : 'filter: grayscale(1) opacity(0.3);';
            const teamColor = isTeamB ? '#ccff00' : 'var(--accent-gold)';

            return `
                <div class="fifa-card ${cardClass}" style="${statusStyle}">
                    <div class="card-inner">
                        <div class="rating" onclick="window.SektorSporttasche.edit(${p.id}, 'rat')">${p.rat}</div>
                        
                        <div style="text-align:center; margin-top:20px;">
                            <div class="player-img-container" style="width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="document.getElementById('img-up-${p.id}').click()">
                                ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : `<i class="fas fa-user-ninja" style="font-size:2rem; opacity:0.2;"></i>`}
                                <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                            </div>
                            <div style="font-weight:900; font-size:0.8rem; margin-top:10px; color:#fff;" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">
                                ${p.name.toUpperCase()}
                            </div>
                            <button onclick="window.SektorSporttasche.toggleTeam(${p.id})" 
                                    style="background: rgba(0,0,0,0.6); border: 1px solid ${teamColor}; color: ${teamColor}; font-size: 0.55rem; padding: 4px 10px; border-radius: 4px; margin-top: 5px; cursor:pointer;">
                                ${teamLabel}
                            </button>
                        </div>

                        <div class="vital-bar-container">
                            <div class="card-stats-grid">
                                <div class="stat-item" onclick="window.SektorSporttasche.edit(${p.id}, 'pac')">PAC <span class="stat-val">${p.pac}</span></div>
                                <div class="stat-item" onclick="window.SektorSporttasche.edit(${p.id}, 'sho')">SHO <span class="stat-val">${p.sho}</span></div>
                                <div class="stat-item" onclick="window.SektorSporttasche.edit(${p.id}, 'pas')">PAS <span class="stat-val">${p.pas}</span></div>
                                <div class="stat-item" onclick="window.SektorSporttasche.edit(${p.id}, 'dri')">DRI <span class="stat-val">${p.dri}</span></div>
                                <div class="stat-item" onclick="window.SektorSporttasche.edit(${p.id}, 'def')">DEF <span class="stat-val">${p.def}</span></div>
                                <div class="stat-item" onclick="window.SektorSporttasche.edit(${p.id}, 'phy')">PHY <span class="stat-val">${p.phy}</span></div>
                            </div>
                            
                            <select onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.SektorSporttasche.open();"
                                    style="margin-top: 10px; width: 100%; background: #000; color: #888; border: 1px solid #222; font-size: 0.55rem; padding: 4px; border-radius: 4px;">
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
        window.Database.save();
        window.BriefcaseUI.toggle();
        if (window.arena) window.arena.syncFromDatabase();
    },

    edit(id, key) {
        const p = window.Database.players.find(x => x.id === id);
        if (!p) return;
        const val = prompt(`${key.toUpperCase()} ändern:`, p[key]);
        if (val !== null) {
            window.Database.updatePlayer(id, key, isNaN(val) ? val : parseInt(val));
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
