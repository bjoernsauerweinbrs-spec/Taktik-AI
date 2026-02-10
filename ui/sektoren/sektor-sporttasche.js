/**
 * TONI 2.0 - SEKTOR KABINE (MULTI-TEAM EDITION)
 * Status: ROUTING-FIX (Verknüpfung zu Transfer & Kader repariert)
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
        if(window.Database && window.Database.activeMode !== undefined) {
            window.Database.activeMode = newMode;
            if(window.Database.save) window.Database.save();
            this.render();
        }
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        const mode = window.Database ? (window.Database.activeMode || 'training') : 'training';
        const currentContext = window.currentTeamContext || "Senioren"; 
        
        let players = window.Database ? (window.Database.players || []) : [];
        
        // FILTER-LOGIK: Nur Spieler des aktuellen Teams anzeigen
        players = players.filter(p => p.team === currentContext);

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--neon-green); padding-bottom: 15px;">
                <div style="display:flex; flex-direction:column; gap:5px;">
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
                    <span style="font-size:0.6rem; color:#666; letter-spacing:1px;">AKTIVE ANSICHT: <b style="color:var(--data-cyan);">${currentContext.toUpperCase()}</b></span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.openSection('transfer')" style="font-size:0.6rem; border-color:var(--accent-gold); color:var(--accent-gold);">KADER VERWALTEN</button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="fifa-cards-grid" style="display: flex; flex-wrap: wrap; gap: 25px; justify-content: center; padding: 20px;">
                ${players.length === 0 ? 
                    `<div style="text-align:center; padding:50px; color:#444; border:2px dashed #222; border-radius:15px; width:100%;">
                        <i class="fas fa-user-plus" style="font-size:2rem; margin-bottom:10px;"></i><br>
                        Keine Spieler für <b>${currentContext}</b> gefunden.<br>
                        <button onclick="window.openSection('transfer')" style="background:none; border:none; color:var(--neon-green); cursor:pointer; text-decoration:underline; font-size:0.8rem; margin-top:10px;">Jetzt Spieler hinzufügen</button>
                    </div>` : 
                    players.map(p => {
                        let cardColor = 'var(--neon-green)';
                        let cardType = 'TALENT';
                        if (p.rat >= 85) { cardColor = 'var(--accent-gold)'; cardType = 'ELITE'; }
                        else if (p.rat >= 75) { cardColor = 'var(--data-cyan)'; cardType = 'PRO'; }

                        const sleepStatus = p.sleep || 100;
                        const vitalColor = sleepStatus > 80 ? 'var(--status-fit)' : (sleepStatus > 60 ? 'var(--accent-orange)' : 'var(--status-error)');
                        
                        return `
                            <div class="fifa-card" style="background: #0a0a0a; border: 2px solid ${cardColor}; border-radius: 15px; width: 210px; min-height: 320px; padding: 15px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.8); display: flex; flex-direction: column;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <div style="color:#fff; font-family:'Orbitron'; font-weight:900; font-size:1.8rem; cursor:pointer;" onclick="window.SektorSporttasche.edit(${p.id}, 'rat')">${p.rat || 80}</div>
                                    <div title="Vital-Status" onclick="window.openSection('analyse')" style="width:12px; height:12px; border-radius:50%; background:${vitalColor}; box-shadow: 0 0 10px ${vitalColor}; cursor:pointer; margin-top:5px;"></div>
                                </div>
                                <div style="text-align:center; margin-top:-5px;">
                                    <div style="width: 85px; height: 85px; background: #111; border-radius: 50%; border: 2px solid ${cardColor}; margin: 0 auto; overflow:hidden; cursor:pointer; position:relative;" onclick="document.getElementById('img-up-${p.id}').click()">
                                        ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user-ninja" style="color:${cardColor}; font-size:2rem; margin-top:20px;"></i>`}
                                        <input type="file" id="img-up-${p.id}" style="display:none" onchange="window.SektorSporttasche.upload(event, ${p.id})">
                                    </div>
                                    <div style="margin-top:8px; font-weight:bold; color:#fff; font-size:0.85rem;" onclick="window.SektorSporttasche.edit(${p.id}, 'name')">${p.name.toUpperCase()}</div>
                                    <div style="color:${cardColor}; font-size:0.65rem; font-weight:900; letter-spacing:2px; margin-bottom:10px;">${cardType} | ${p.pos || 'POS'}</div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: rgba(255,255,255,0.02); padding: 8px; border-radius: 8px; font-size: 0.7rem;">
                                    <div onclick="window.SektorSporttasche.edit(${p.id}, 'pac')" style="cursor:pointer; color:#666;">PAC <span style="color:#fff;">${p.pac || 70}</span></div>
                                    <div onclick="window.SektorSporttasche.edit(${p.id}, 'sho')" style="cursor:pointer; color:#666;">SHO <span style="color:#fff;">${p.sho || 70}</span></div>
                                    <div onclick="window.SektorSporttasche.edit(${p.id}, 'pas')" style="cursor:pointer; color:#666;">PAS <span style="color:#fff;">${p.pas || 70}</span></div>
                                    <div onclick="window.SektorSporttasche.edit(${p.id}, 'dri')" style="cursor:pointer; color:#666;">DRI <span style="color:#fff;">${p.dri || 70}</span></div>
                                    <div onclick="window.SektorSporttasche.edit(${p.id}, 'def')" style="cursor:pointer; color:#666;">DEF <span style="color:#fff;">${p.def || 70}</span></div>
                                    <div onclick="window.SektorSporttasche.edit(${p.id}, 'phy')" style="cursor:pointer; color:#666;">PHY <span style="color:#fff;">${p.phy || 70}</span></div>
                                </div>
                                <div style="margin-top:12px;">
                                    <select onchange="window.Database.updatePlayer(${p.id}, 'assignment', this.value); window.SektorSporttasche.render();" 
                                            style="width:100%; background:#000; color:${cardColor}; border:1px solid ${cardColor}44; padding:6px; border-radius:4px; font-size:0.65rem; font-weight:bold; cursor:pointer;">
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
                    }).join('')
                }
            </div>
        `;
    },

    edit(id, key) {
        if (!window.Database || !window.Database.players) return;
        const p = window.Database.players.find(x => x.id === id);
        if (!p) return;
        const val = prompt(`${key.toUpperCase()} ändern:`, p[key]);
        if (val !== null && val.trim() !== "") {
            const newVal = isNaN(val) ? val : parseInt(val);
            if(window.Database.updatePlayer) {
                window.Database.updatePlayer(id, key, newVal);
            } else {
                p[key] = newVal;
                if(window.Database.save) window.Database.save();
            }
            this.render();
        }
    },

    upload(e, id) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if(window.Database.updatePlayer) {
                window.Database.updatePlayer(id, 'img', reader.result);
            } else {
                const p = window.Database.players.find(x => x.id === id);
                if(p) p.img = reader.result;
                if(window.Database.save) window.Database.save();
            }
            this.render();
        };
        reader.readAsDataURL(file);
    }
};
