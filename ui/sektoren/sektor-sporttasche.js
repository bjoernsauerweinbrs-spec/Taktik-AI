/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (KADER-PLANER)
 * FIFA-Cards mit Launch-Control für Training & Spielbetrieb.
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
                    <h2 style="color:var(--neon-green); letter-spacing: 2px; margin-bottom: 5px;">TEAM-KABINE</h2>
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
                    <button class="pro-btn-gold" style="background: var(--neon-green); border-radius: 8px; box-shadow: 0 0 15px rgba(57,255,20,0.3);" 
                            onclick="window.SektorSporttasche.launchBoard()">
                        <i class="fas fa-play"></i> TEAM AUFGESTELLT - BOARD STARTEN
                    </button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>
            
            <div class="fifa-cards-grid">
        `;

        window.Database.players.forEach(p => {
            const isAssigned = (p.assignment === 'both' || p.assignment === mode);
            const statusClass = isAssigned ? 'active' : 'inactive';
            
            html += `
                <div class="fifa-card ${statusClass}">
                    <div class="presence-toggle ${isAssigned ? 'on' : 'off'}"></div>
                    
                    <div class="card-inner">
                        <div class="rating">${p.rat}</div>
                        <div class="pos-label" onclick="window.SektorSporttasche.edit(${p.id}, 'pos')">${p.pos}</div>
                        
                        <div class="player-img-container" onclick="document.getElementById('img-up-${p.id}').click()">
                            ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` 
                                    : `<i class="fas fa-user-ninja" style="font-size:3rem; margin-top:15px; opacity:0.1"></i>`}
                            <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                        </div>
                        
                        <div class="player-name-banner" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">
                            ${p.name.toUpperCase()}
                        </div>
                        
                        <div class="stats-grid">
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'pac')"><span>${p.pac || 0}</span>PAC</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'sho')"><span>${p.sho || 0}</span>SHO</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'pas')"><span>${p.pas || 0}</span>PAS</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'dri')"><span>${p.dri || 0}</span>DRI</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'def')"><span>${p.def || 0}</span>DEF</div>
                            <div onclick="window.SektorSporttasche.edit(${p.id}, 'phy')"><span>${p.phy || 0}</span>PHY</div>
                        </div>

                        <select class="assignment-select" 
                                onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.SektorSporttasche.open();"
                                style="margin-top: 10px; width: 85%; background: rgba(0,0,0,0.8); color: ${isAssigned ? 'var(--neon-green)' : '#555'}; border: none; font-size: 0.6rem; text-align-last: center; padding: 2px; border-radius: 4px; cursor: pointer; text-transform: uppercase; font-weight: bold;">
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

    // Startet die Arena-Engine mit den aktuellen Filtern
    launchBoard() {
        console.log("Launching Board with Mode:", window.Database.activeMode);
        
        // 1. Speichern sicherstellen
        window.Database.save();
        
        // 2. Aktentasche schließen
        if (window.toggleBriefcase) window.toggleBriefcase();
        
        // 3. Arena synchronisieren (hier greift dann das neue horizontale Layout)
        if (window.arena) {
            window.arena.syncFromDatabase();
            
            // Palette basierend auf Modus steuern
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
