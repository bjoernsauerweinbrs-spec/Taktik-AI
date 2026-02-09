/**
 * TONI 2.0 - SEKTOR KABINE (ELITE-READABILITY UPDATE)
 * Fokus: Fix für abgeschnittene Ratings & professionelles Karten-Layout.
 */
window.SektorSporttasche = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        
        // Verhindert das "Verschwinden" der unteren Elemente
        content.style.paddingBottom = "150px";
        content.style.overflowY = "auto";
        this.render();
    },

    switchMode(newMode) {
        if(window.Database && window.Database.setMode) {
            window.Database.setMode(newMode);
            this.render();
        }
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const mode = window.Database ? window.Database.activeMode : 'training';
        const players = window.Database ? window.Database.players : [];

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--neon-green); padding-bottom: 15px;">
                <div style="display:flex; gap:15px; align-items:center;">
                    <h2 style="color:var(--neon-green); margin:0; letter-spacing:2px; font-family:'Orbitron'; font-size:1.1rem;">KABINE</h2>
                    <div style="display:flex; background:#000; border:1px solid #333; border-radius:8px; padding:3px;">
                        <button onclick="window.SektorSporttasche.switchMode('training')" 
                            style="padding:8px 15px; border:none; border-radius:6px; cursor:pointer; font-weight:bold; font-size:0.7rem; transition:0.3s;
                            ${mode === 'training' ? 'background:var(--neon-green); color:#000;' : 'background:transparent; color:#666;'}">TRAINING</button>
                        <button onclick="window.SektorSporttasche.switchMode('match')" 
                            style="padding:8px 15px; border:none; border-radius:6px; cursor:pointer; font-weight:bold; font-size:0.7rem; transition:0.3s;
                            ${mode === 'match' ? 'background:var(--accent-gold); color:#000;' : 'background:transparent; color:#666;'}">SPIEL</button>
                    </div>
                </div>
                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>

            <div class="fifa-cards-grid" style="display: flex; flex-wrap: wrap; gap: 25px; justify-content: center; padding: 20px;">
                ${players.map(p => {
                    const sponsor = (window.SponsorPool) ? window.SponsorPool.find(s => s.id == p.sponsorId) : null;
                    const cardColor = mode === 'training' ? 'var(--neon-green)' : 'var(--accent-gold)';
                    
                    return `
                        <div class="fifa-card" style="
                            background: #111; 
                            border: 2px solid ${cardColor}; 
                            border-radius: 15px; 
                            width: 210px; 
                            padding: 15px; 
                            position: relative; 
                            box-shadow: 0 10px 20px rgba(0,0,0,0.6);
                            display: flex; flex-direction: column; gap: 10px;">
                            
                            <div style="color:#fff; font-family:'Orbitron'; font-weight:900; font-size:1.6rem; margin-bottom: 5px; cursor:pointer;" 
                                 onclick="window.SektorSporttasche.edit(${p.id}, 'rat')">
                                 ${p.rat || 80}
                            </div>

                            <div style="position:absolute; top:15px; right:15px; font-size:1.2rem; cursor:pointer; color:#444;"
                                 onclick="window.SektorSporttasche.selectSponsor(${p.id})">
                                 ${sponsor ? sponsor.logo : '<i class="fas fa-handshake"></i>'}
                            </div>
                            
                            <div style="text-align:center;">
                                <div style="width: 90px; height: 90px; background: #222; border-radius: 50%; border: 2px solid ${cardColor}; margin: 0 auto; overflow:hidden; cursor:pointer; display:flex; align-items:center; justify-content:center;"
                                     onclick="document.getElementById('img-up-${p.id}').click()">
                                    ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-ninja" style="color:${cardColor}; font-size:2rem;"></i>`}
                                    <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                                </div>
                                <div style="margin-top:10px; font-weight:bold; color:#fff; font-size:0.9rem; cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">${p.name.toUpperCase()}</div>
                                <div style="color:var(--data-cyan); font-size:0.7rem; font-weight:bold; letter-spacing:1px;">${p.pos || 'POS'}</div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px; font-size: 0.75rem;">
                                <div onclick="window.SektorSporttasche.edit(${p.id}, 'pac')" style="cursor:pointer; color:#888;">PAC <span style="color:#fff;">${p.pac || 70}</span></div>
                                <div onclick="window.SektorSporttasche.edit(${p.id}, 'sho')" style="cursor:pointer; color:#888;">SHO <span style="color:#fff;">${p.sho || 70}</span></div>
                                <div onclick="window.SektorSporttasche.edit(${p.id}, 'pas')" style="cursor:pointer; color:#888;">PAS <span style="color:#fff;">${p.pas || 70}</span></div>
                                <div onclick="window.SektorSporttasche.edit(${p.id}, 'dri')" style="cursor:pointer; color:#888;">DRI <span style="color:#fff;">${p.dri || 70}</span></div>
                                <div onclick="window.SektorSporttasche.edit(${p.id}, 'def')" style="cursor:pointer; color:#888;">DEF <span style="color:#fff;">${p.def || 70}</span></div>
                                <div onclick="window.SektorSporttasche.edit(${p.id}, 'phy')" style="cursor:pointer; color:#888;">PHY <span style="color:#fff;">${p.phy || 70}</span></div>
                            </div>

                            <div style="margin-top:auto;">
                                <select onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.SektorSporttasche.render();" 
                                        style="width:100%; background:#000; color:${cardColor}; border:1px solid #333; padding:8px; border-radius:5px; font-size:0.7rem; font-weight:bold; cursor:pointer;">
                                    ${mode === 'training' ? 
                                        `<option value="both" ${p.assignment === 'both' ? 'selected' : ''}>KADER</option>
                                         <option value="training" ${p.assignment === 'training' ? 'selected' : ''}>LEIBCHEN</option>
                                         <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>ABWESEND</option>` :
                                        `<option value="both" ${p.assignment === 'both' ? 'selected' : ''}>NOMINIERT</option>
                                         <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>RESERVE</option>`
                                    }
                                </select>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // ... (restliche Funktionen: edit, upload, selectSponsor, toggleNewspaper bleiben wie im Original)
    edit(id, key) {
        const p = window.Database.players.find(x => x.id === id);
        if (!p) return;
        const val = prompt(`${key.toUpperCase()} ändern:`, p[key]);
        if (val !== null && val.trim() !== "") {
            const newVal = isNaN(val) ? val : parseInt(val);
            window.Database.updatePlayer(id, key, newVal);
            this.render();
        }
    },

    upload(e, id) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            window.Database.updatePlayer(id, 'img', reader.result);
            this.render();
        };
        reader.readAsDataURL(file);
    },

    selectSponsor(playerId) {
        if(!window.SponsorPool) return;
        const sponsors = window.SponsorPool.map(s => `${s.id}: ${s.name}`).join('\n');
        const choice = prompt(`Sponsor wählen (ID):\n${sponsors}`, "");
        if (choice !== null) {
            window.Database.updatePlayer(playerId, 'sponsorId', choice || null);
            this.render();
        }
    }
};
