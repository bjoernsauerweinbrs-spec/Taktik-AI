/**
 * TONI 2.0 - MANNSCHAFTSKABINE PRO (ULTIMATE UPDATE)
 * Foto-System, 11+5 Kader-Logik, Vital-Werte & Pro-Metriken.
 */
window.SektorSporttasche = {
    currentSort: 'starter', 

    render: function() {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        // Sortierung: Startelf (11) zuerst, dann Bank, dann Rating
        players.sort((a, b) => {
            if (a.isStarter === b.isStarter) return (b.rating || 0) - (a.rating || 0);
            return a.isStarter ? -1 : 1;
        });
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; animation: fadeIn 0.4s ease-out;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                    <div>
                        <h2 style="color:var(--accent-gold); letter-spacing:3px; margin:0; text-shadow: 0 0 15px rgba(212,175,55,0.4);">MANNSCHAFTSKABINE</h2>
                        <p style="font-size:0.8rem; color:var(--neon-green); font-weight:bold; margin-top:5px; text-transform:uppercase;">Coach Björn's Ginga Selection</p>
                    </div>
                    <div style="display:flex; gap:15px;">
                        <button class="tactic-btn" style="border-color:var(--status-error); color:var(--status-error);" onclick="SektorSporttasche.factoryReset()">KADER LÖSCHEN</button>
                        <button class="login-btn" style="width:auto; padding:12px 30px; background:var(--neon-green); color:#000; font-weight:900;" onclick="SektorSporttasche.addPlayer()">
                            <i class="fas fa-plus"></i> NEUER PROFI
                        </button>
                    </div>
                </div>
                
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px;">
                    ${players.length > 0 
                        ? players.map(p => this.renderFifaCard(p)).join('') 
                        : `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:var(--text-dim); border:1px dashed #333;">Kabine leer. Starte die Kaderplanung, Coach!</div>`
                    }
                </div>
            </div>`;
    },

    renderFifaCard: function(p) {
        const rating = p.rating || 80;
        const skills = p.skills || { spr: 70, aus: 70, tec: 70, pas: 70, phy: 70 };
        const statusColor = (p.status === 'Verletzt') ? 'var(--status-error)' : 'var(--status-fit)';
        const photo = p.photoUrl || 'https://via.placeholder.com/200/000000/39FF14?text=PRO';
        const isStarter = p.isStarter || false;

        return `
            <div class="fifa-card" onclick="SektorSporttasche.edit('${p.id}')" style="position:relative; background: linear-gradient(135deg, #1a1a1a 0%, #000 100%); border: 2px solid ${isStarter ? 'var(--neon-green)' : 'var(--accent-gold)'}; overflow:hidden;">
                
                ${isStarter ? '<div style="position:absolute; top:10px; right:10px; color:var(--neon-green); font-size:1.2rem; z-index:10; text-shadow:0 0 10px var(--neon-green);"><i class="fas fa-star"></i></div>' : ''}

                <div style="width:100%; height:180px; background:#000; overflow:hidden; border-bottom:1px solid rgba(212,175,55,0.2);">
                    <img src="${photo}" style="width:100%; height:100%; object-fit:cover;">
                </div>

                <div style="position: absolute; top: 140px; left: 15px; background:rgba(0,0,0,0.8); padding:5px 10px; border:1px solid var(--accent-gold); border-radius:5px;">
                    <div style="font-size: 1.8rem; font-weight: 900; line-height:1; color:#fff;">${rating}</div>
                    <div style="font-size: 0.7rem; color: var(--accent-gold); font-weight:bold;">${p.pos || 'ZM'}</div>
                </div>

                <div style="padding:15px; text-align: center;">
                    <div style="font-size: 1.1rem; font-weight: 900; color:#fff; margin-bottom:10px;">${p.name.toUpperCase()}</div>
                    
                    <div style="display:flex; justify-content:center; gap:15px; margin-bottom:10px; font-size:0.6rem; color:var(--data-cyan);">
                        <span><i class="fas fa-heartbeat"></i> ${p.vitals?.pulse || '--'} BPM</span>
                        <span><i class="fas fa-wind"></i> ${p.vitals?.spo2 || '--'}% SpO2</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.7rem; font-weight: bold; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">
                        <div style="display:flex; justify-content:space-between;"><span>VMAX</span> <span style="color:var(--neon-green)">${this.getVmaxLabel(p.proKpis?.vmax)}</span></div>
                        <div style="display:flex; justify-content:space-between;"><span>RSA</span> <span style="color:var(--neon-green)">${p.proKpis?.rsa || '--'}</span></div>
                        <div style="display:flex; justify-content:space-between;"><span>BEH</span> <span style="color:var(--accent-gold)">${p.proKpis?.ballControl || '--'}</span></div>
                        <div style="display:flex; justify-content:space-between;"><span>STR</span> <span style="color:var(--accent-gold)">${p.proKpis?.stress || '--'}</span></div>
                    </div>
                </div>
            </div>`;
    },

    getVmaxLabel: function(val) {
        if(val == 1) return "LGSM";
        if(val == 2) return "MITL";
        if(val == 3) return "SCHN";
        return "--";
    },

    addPlayer: function() {
        const name = prompt("Name des Profis:");
        if (!name) return;
        
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({
            id: 'p_' + Date.now(),
            name: name,
            number: prompt("Rückennummer:", "10"),
            pos: prompt("Position (ST, ZM, IV, TW):", "ZM"),
            rating: 80,
            status: 'FIT',
            isStarter: false,
            vitals: { pulse: 72, spo2: 98 },
            proKpis: { vmax: 2, rsa: 75, ballControl: 75, stress: 75 }
        });
        
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.render();
    },

    edit: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        // Fallbacks für neue Felder
        if(!p.vitals) p.vitals = { pulse: 72, spo2: 98 };
        if(!p.proKpis) p.proKpis = { vmax: 2, rsa: 75, ballControl: 75, stress: 75 };

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; max-width:900px; margin:0 auto; background:rgba(13, 20, 33, 0.98); border:2px solid var(--accent-gold); border-radius:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <button class="tactic-btn" onclick="SektorSporttasche.render()"><i class="fas fa-chevron-left"></i> ZURÜCK</button>
                    <button class="tactic-btn" style="border-color:var(--status-error); color:var(--status-error);" onclick="SektorSporttasche.deletePlayer('${p.id}')">SPIELER LÖSCHEN</button>
                </div>
                
                <h2 style="color:var(--accent-gold); margin-bottom:25px; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:10px;">PROFI-DOSSIER: ${p.name.toUpperCase()}</h2>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px;">
                    <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:10px;">
                        <h4 style="color:var(--accent-gold); font-size:0.6rem; margin-bottom:10px;">PROFIL-BILD (URL)</h4>
                        <input type="text" id="edit-photo" value="${p.photoUrl || ''}" class="login-input" style="width:100%; margin-bottom:15px;" placeholder="https://...">
                        
                        <label style="font-size:0.6rem; color:var(--text-dim);">KADER-STATUS</label>
                        <select id="edit-starter" class="login-input" style="width:100%; margin-bottom:15px;">
                            <option value="false" ${!p.isStarter?'selected':''}>BANK (SUB)</option>
                            <option value="true" ${p.isStarter?'selected':''}>STARTELF (11)</option>
                        </select>

                        <label style="font-size:0.6rem; color:var(--text-dim);">RATING (1-99)</label>
                        <input type="number" id="edit-rating" value="${p.rating}" class="login-input" style="width:100%;">
                    </div>

                    <div style="background:rgba(0,209,255,0.03); padding:15px; border-radius:10px; border:1px solid rgba(0,209,255,0.1);">
                        <h4 style="color:var(--data-cyan); font-size:0.6rem; margin-bottom:15px;">VITAL-WERTE (ANALOG)</h4>
                        <label style="font-size:0.6rem;">PULS (BPM)</label>
                        <input type="number" id="edit-pulse" value="${p.vitals.pulse}" class="login-input" style="width:100%; margin-bottom:15px;">
                        <label style="font-size:0.6rem;">SAUERSTOFF (SpO2 %)</label>
                        <input type="number" id="edit-spo2" value="${p.vitals.spo2}" class="login-input" style="width:100%;">
                    </div>

                    <div style="background:rgba(57,255,20,0.03); padding:15px; border-radius:10px; border:1px solid rgba(57,255,20,0.1);">
                        <h4 style="color:var(--neon-green); font-size:0.6rem; margin-bottom:15px;">PRO-KPIs (LEISTUNG)</h4>
                        <label style="font-size:0.6rem;">VMAX (GESCHWINDIGKEIT)</label>
                        <select id="edit-vmax" class="login-input" style="width:100%; margin-bottom:10px;">
                            <option value="1" ${p.proKpis.vmax==1?'selected':''}>LANGSAM</option>
                            <option value="2" ${p.proKpis.vmax==2?'selected':''}>MITTEL</option>
                            <option value="3" ${p.proKpis.vmax==3?'selected':''}>SCHNELL</option>
                        </select>
                        <label style="font-size:0.6rem;">RSA-INDEX (SPRINT-AUSDAUER)</label>
                        <input type="number" id="edit-rsa" value="${p.proKpis.rsa}" class="login-input" style="width:100%; margin-bottom:10px;">
                        <label style="font-size:0.6rem;">BALLBEHAUPTUNG (DRUCK)</label>
                        <input type="number" id="edit-beh" value="${p.proKpis.ballControl}" class="login-input" style="width:100%; margin-bottom:10px;">
                        <label style="font-size:0.6rem;">STRESS-RESISTENZ</label>
                        <input type="number" id="edit-stress" value="${p.proKpis.stress}" class="login-input" style="width:100%;">
                    </div>
                </div>
                
                <button class="login-btn" style="width:100%; margin-top:35px;" onclick="SektorSporttasche.save('${p.id}')">ÄNDERUNGEN IM KERN SPEICHERN</button>
            </div>`;
    },

    save: function(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(x => x.id == id);
        if(idx > -1) {
            players[idx].rating = parseInt(document.getElementById('edit-rating').value);
            players[idx].photoUrl = document.getElementById('edit-photo').value;
            players[idx].isStarter = document.getElementById('edit-starter').value === "true";
            
            players[idx].vitals = {
                pulse: parseInt(document.getElementById('edit-pulse').value),
                spo2: parseInt(document.getElementById('edit-spo2').value)
            };
            
            players[idx].proKpis = {
                vmax: parseInt(document.getElementById('edit-vmax').value),
                rsa: parseInt(document.getElementById('edit-rsa').value),
                ballControl: parseInt(document.getElementById('edit-beh').value),
                stress: parseInt(document.getElementById('edit-stress').value)
            };
            
            localStorage.setItem('toni_players', JSON.stringify(players));
            if(window.ToniTTS) ToniTTS.speak("Profi-Dossier aktualisiert.", "warm");
            this.render();
        }
    },

    deletePlayer: function(id) {
        if(confirm("Möchtest du diesen Spieler wirklich aus dem Kader entfernen?")) {
            let players = JSON.parse(localStorage.getItem('toni_players')) || [];
            players = players.filter(p => p.id !== id);
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.render();
        }
    },

    factoryReset: function() {
        if(confirm("ACHTUNG: Möchtest du den GESAMTEN Kader löschen und neu starten?")) {
            localStorage.setItem('toni_players', JSON.stringify([]));
            this.render();
        }
    }
};
