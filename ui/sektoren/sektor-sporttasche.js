/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (KADER-PLANER)
 * FIFA-Cards mit Betriebs-Modus (Training/Spiel) und Einsatz-Zuweisung.
 */
window.SektorSporttasche = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Header mit Betriebsmodus-Schalter
        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; padding: 0 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px; margin-bottom: 5px;">TEAM-KABINE</h2>
                    <span style="color: #555; font-size: 0.7rem; letter-spacing: 1px;">KADER-PLANUNG & STATUS-KONTROLLE</span>
                </div>

                <div style="display: flex; gap: 10px; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 12px; border: 1px solid #222;">
                    <button class="tactic-btn" 
                            style="background: ${window.Database.activeMode === 'training' ? 'var(--neon-green)' : 'transparent'}; 
                                   color: ${window.Database.activeMode === 'training' ? '#000' : '#fff'}; margin: 0; min-width: 120px;"
                            onclick="window.Database.setMode('training'); window.SektorSporttasche.open();">
                        <i class="fas fa-dumbbell"></i> TRAINING
                    </button>
                    <button class="tactic-btn" 
                            style="background: ${window.Database.activeMode === 'match' ? 'var(--neon-green)' : 'transparent'}; 
                                   color: ${window.Database.activeMode === 'match' ? '#000' : '#fff'}; margin: 0; min-width: 120px;"
                            onclick="window.Database.setMode('match'); window.SektorSporttasche.open();">
                        <i class="fas fa-trophy"></i> SPIEL
                    </button>
                </div>

                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>
            
            <div class="fifa-cards-grid">
        `;

        window.Database.players.forEach(p => {
            // Prüfung, ob der Spieler im aktuellen Modus "anwesend" ist
            const isAssigned = (p.assignment === 'both' || p.assignment === window.Database.activeMode);
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
