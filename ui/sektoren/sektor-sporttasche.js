/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (KADER-PLANER)
 * Elite-Update: FIFA-Schild-Design & Medizinisches Dashboard.
 */
window.SektorSporttasche = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        const mode = window.Database.activeMode;
        const modeLabel = mode === 'training' ? 'TRAININGS-BETRIEB' : 'SPIEL-VORBEREITUNG';
        const modeColor = mode === 'training' ? 'var(--neon-green)' : 'var(--accent-gold)';

        let html = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; padding: 0 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 25px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px; margin-bottom: 5px;">KABINE: SCUPIN & TEAM</h2>
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
                    <button class="pro-btn-gold" style="border-radius: 8px; box-shadow: 0 0 15px rgba(212,175,55,0.3);" 
                            onclick="window.SektorSporttasche.launchBoard()">
                        <i class="fas fa-play"></i> BOARD STARTEN
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>
            
            <div class="fifa-cards-grid">
        `;

        window.Database.players.forEach(p => {
            const isAssigned = (p.assignment === 'both' || p.assignment === mode);
            
            // Team-Logik & Visualisierung
            const isTeamB = p.team === 'B';
            const teamLabel = mode === 'training' ? (isTeamB ? 'LEIBCHEN' : 'TRIKOT') : (isTeamB ? 'GEGNER' : 'EIGENES TEAM');
            
            // Karte bekommt "home-team" für Team A und eine Spezial-Klasse für Leibchen/Gegner
            const cardClass = isTeamB ? 'away-team' : 'home-team';
            const statusStyle = isAssigned ? '' : 'filter: grayscale(1) opacity(0.4);';
            const teamColor = isTeamB ? '#ccff00' : 'var(--accent-gold)';

            html += `
                <div class="fifa-card ${cardClass}" style="${statusStyle}">
                    <div class="card-inner">
                        <div class="rating">${p.rat}</div>
                        <div class="pos-label" onclick="window.SektorSporttasche.edit(${p.id}, 'pos')">${p.pos}</div>
                        
                        ${isAssigned ? '<i class="fas fa-heartbeat card-pulse-icon"></i>' : ''}

                        <div class="player-img-container" style="margin-top: 50px; border-radius: 50%; width: 90px; height: 90px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);" onclick="document.getElementById('img-up-${p.id}').click()">
                            ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover; border-radius: 50%;">` 
                                    : `<i class="fas fa-user-ninja" style="font-size:2.5rem; margin-top:20px; opacity:0.2"></i>`}
                            <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                        </div>
                        
                        <div class="player-name-banner" style="margin-top: 10px; font-weight: 900; letter-spacing: 1px;" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">
                            ${p.name.toUpperCase()}
                        </div>
                        
                        <button onclick="window.SektorSporttasche.toggleTeam(${p.id})" 
                                style="background: rgba(0,0,0,0.5); border: 1px solid ${teamColor}; color: ${teamColor};
                                       width: 90%; font-size: 0.6rem; padding: 5px; border-radius: 4px; cursor: pointer; margin-top: 5px; font-weight: bold; text-transform: uppercase;">
                             ${teamLabel}
                        </button>

                        <div class="stats-grid" style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'pac')"><span>${p.pac || 0}</span>PAC</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'sho')"><span>${p.sho || 0}</span>SHO</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'pas')"><span>${p.pas || 0}</span>PAS</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'dri')"><span>${p.dri || 0}</span>DRI</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'def')"><span>${p.def || 0}</span>DEF</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'phy')"><span>${p.phy || 0}</span>PHY</div>
                        </div>

                        <select class="assignment-select" 
                                onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.SektorSporttasche.open();"
                                style="margin-top: auto; margin-bottom: 15px; width: 90%; background: #000; color: #fff; border: 1px solid #333; font-size: 0.55rem; padding: 3px; border-radius: 4px; cursor: pointer;">
                            <option value="both" ${p.assignment === 'both' ? 'selected' : ''}>Training & Spiel</option>
                            <option value="training" ${p.assignment === 'training' ? 'selected' : ''}>Nur Training</option>
                            <option value="match" ${p.assignment === 'match' ? 'selected' : ''}>Nur Spiel</option>
                            <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>Abwesend</option>
                        </select>
                    </div>
                </div>
            `;
        });
        
        content.innerHTML = html + `</div>`;
    },

    toggleTeam(id) {
        const p = window.Database.players.find(x => x.id === id);
        if (p) {
            const nextTeam = p.team === 'A' ? 'B' : 'A';
            window.Database.updatePlayer(id, 'team', nextTeam);
            this.open();
        }
    },

    launchBoard() {
        window.Database.save();
        if (window.BriefcaseUI) window.BriefcaseUI.toggle();
        if (window.arena) {
            window.arena.syncFromDatabase();
            if (window.toggleEquipmentPalette) {
                window.toggleEquipmentPalette(window.Database.activeMode === 'training');
            }
        }
    },

    edit(id, key) {
        const p = window.Database.players.find(x => x.id === id);
        if (!p) return;
        const val = prompt(`Neuer Wert für ${key.toUpperCase()}:`, p[key]);
        if (val !== null) {
            const finalVal = isNaN(val) || val === "" ? val : parseInt(val);
            window.Database.updatePlayer(id, key, finalVal);
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
