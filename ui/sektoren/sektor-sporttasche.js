/**
 * TONI 2.0 - SEKTOR KABINE (SPONSORING & MEDIA EDITION)
 * Fokus: Integration von Sponsoren-Pool & Stadionzeitung-Nominierung
 */
window.SektorSporttasche = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        content.style.paddingBottom = "180px";
        content.style.overflowY = "auto";
        this.render();
    },

    switchMode(newMode) {
        window.Database.setMode(newMode);
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const mode = window.Database.activeMode || 'training';
        const players = window.Database.players || [];

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--neon-green); padding-bottom: 15px;">
                <div style="display:flex; gap:15px; align-items:center;">
                    <h2 style="color:var(--neon-green); margin:0; letter-spacing:1px; text-transform:uppercase; font-size:1.1rem;">MANAGEMENT KABINE</h2>
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

            <div class="fifa-cards-grid" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                ${players.map(p => {
                    const sponsor = window.SponsorPool.find(s => s.id === p.sponsorId);
                    const isStar = p.isNewspaperStar;
                    const teamColor = p.team === 'B' ? '#ccff00' : 'var(--accent-gold)';
                    
                    return `
                        <div class="fifa-card" style="background: rgba(0,0,0,0.6); border: 2px solid ${mode === 'training' ? 'var(--neon-green)' : 'var(--accent-gold)'}; border-radius: 12px; width: 220px; padding: 15px; position: relative; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
                            
                            <div style="color:#fff; font-weight:900; font-size:1.4rem; position:absolute; top:10px; left:15px; cursor:pointer;" 
                                 onclick="window.SektorSporttasche.edit(${p.id}, 'rat')">${p.rat || 80}</div>

                            <div style="position:absolute; top:10px; right:15px; font-size:1.2rem; cursor:pointer; background:rgba(255,255,255,0.1); width:30px; height:30px; border-radius:5px; display:flex; align-items:center; justify-content:center;"
                                 onclick="window.SektorSporttasche.selectSponsor(${p.id})" title="Sponsor wählen">
                                ${sponsor ? sponsor.logo : '<i class="fas fa-handshake" style="font-size:0.8rem; color:#444;"></i>'}
                            </div>
                            
                            <div style="text-align:center; margin-top:25px;">
                                <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.05); border-radius: 50%; border: 2px solid ${teamColor}; margin: 0 auto 10px; display:flex; align-items:center; justify-content:center; overflow:hidden; cursor:pointer;"
                                     onclick="document.getElementById('img-up-${p.id}').click()">
                                    ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-ninja" style="color:${teamColor}; font-size:1.8rem;"></i>`}
                                    <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                                </div>
                                
                                <div style="font-weight:900; color:#fff; text-transform:uppercase; font-size:0.9rem; letter-spacing:1px; cursor:pointer;" 
                                     onclick="window.SektorSporttasche.edit(${p.id}, 'name')">${p.name}</div>
                                <div style="color:var(--data-cyan); font-size:0.7rem; font-weight:bold; margin-bottom:10px;">${p.pos || 'N/A'}</div>

                                <div onclick="window.SektorSporttasche.toggleNewspaper(${p.id})" 
                                     style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:0.6rem; cursor:pointer; margin-bottom:10px; transition:0.3s;
                                     ${isStar ? 'background:var(--neon-green); color:#000; font-weight:bold;' : 'background:#222; color:#555;'}">
                                     <i class="fas fa-newspaper"></i> ZEITUNG
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; font-size: 0.75rem; font-weight:bold;">
                                <div style="color:#aaa; cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'pac')">PAC <span style="color:#fff;">${p.pac || 70}</span></div>
                                <div style="color:#aaa; cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'sho')">SHO <span style="color:#fff;">${p.sho || 70}</span></div>
                                <div style="color:#aaa; cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'pas')">PAS <span style="color:#fff;">${p.pas || 70}</span></div>
                                <div style="color:#aaa; cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'dri')">DRI <span style="color:#fff;">${p.dri || 70}</span></div>
                                <div style="color:#aaa; cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'def')">DEF <span style="color:#fff;">${p.def || 70}</span></div>
                                <div style="color:#aaa; cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'phy')">PHY <span style="color:#fff;">${p.phy || 70}</span></div>
                            </div>

                            <select onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.SektorSporttasche.render();" 
                                    style="width:100%; margin-top:12px; background:#000; color:${mode === 'training' ? 'var(--neon-green)' : 'var(--accent-gold)'}; border:1px solid #444; padding:8px; border-radius:6px; font-weight:bold; font-size:0.75rem; cursor:pointer; text-transform:uppercase;">
                                ${mode === 'training' ? 
                                    `<option value="both" ${p.assignment === 'both' ? 'selected' : ''}>OHNE LEIBCHEN</option>
                                     <option value="training" ${p.assignment === 'training' ? 'selected' : ''}>MIT LEIBCHEN</option>
                                     <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>ABWESEND</option>` :
                                    `<option value="both" ${p.assignment === 'both' ? 'selected' : ''}>KADER (NOMINIERT)</option>
                                     <option value="none" ${p.assignment === 'none' ? 'selected' : ''}>NICHT IM KADER</option>`
                                }
                            </select>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    selectSponsor(playerId) {
        const sponsors = window.SponsorPool.map(s => `${s.id}: ${s.name} (${s.fee}€)`).join('\n');
        const choice = prompt(`Sponsor-ID wählen:\n${sponsors}\n\n(Lass leer zum Entfernen)`);
        if (choice !== null) {
            window.Database.updatePlayer(playerId, 'sponsorId', choice || null);
            this.render();
        }
    },

    toggleNewspaper(playerId) {
        const p = window.Database.players.find(x => x.id === playerId);
        window.Database.updatePlayer(playerId, 'isNewspaperStar', !p.isNewspaperStar);
        this.render();
    },

    edit(id, key) {
        const p = window.Database.players.find(x => x.id === id);
        if (!p) return;
        const val = prompt(`${key.toUpperCase()} ändern für ${p.name}:`, p[key]);
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
    }
};
