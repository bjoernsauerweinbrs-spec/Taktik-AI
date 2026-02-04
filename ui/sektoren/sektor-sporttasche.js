/**
 * TONI 2.0 - MANNSCHAFTSKABINE PRO (FIFA SKILLS UPDATE)
 * Leuchtende Karten mit detaillierter Punktevergabe für Sprint, Ausdauer & Technik.
 */
window.SektorSporttasche = {
    currentSort: 'rating', 

    render: function() {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        if (this.currentSort === 'rating') {
            players.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; animation: fadeIn 0.4s ease-out;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                    <div>
                        <h2 style="color:var(--accent-gold); letter-spacing:3px; margin:0; text-shadow: 0 0 15px rgba(212,175,55,0.4);">MANNSCHAFTSKABINE</h2>
                        <p style="font-size:0.8rem; color:var(--neon-green); font-weight:bold; margin-top:5px; text-transform:uppercase; letter-spacing:1px;">Ginga Performance Selection</p>
                    </div>
                    <div style="display:flex; gap:15px;">
                        <button class="login-btn" style="width:auto; padding:12px 30px; background:var(--neon-green); color:#000; font-weight:900;" onclick="SektorSporttasche.addPlayer()">
                            <i class="fas fa-plus"></i> NEUER PROFI
                        </button>
                    </div>
                </div>
                
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px;">
                    ${players.length > 0 
                        ? players.map(p => this.renderFifaCard(p)).join('') 
                        : `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:var(--text-dim); border:1px dashed #333;">Der Kabinengang ist noch leer, Coach.</div>`
                    }
                </div>
            </div>`;
    },

    renderFifaCard: function(p) {
        const rating = p.rating || 80;
        const skills = p.skills || { spr: 80, aus: 80, tec: 80, pas: 80, phy: 80 };
        const statusColor = (p.status === 'Verletzt') ? 'var(--status-error)' : 'var(--status-fit)';

        return `
            <div class="fifa-card" onclick="SektorSporttasche.edit('${p.id}')" style="position:relative; background: linear-gradient(135deg, #2c2c2c 0%, #000 100%); border: 2px solid var(--accent-gold); box-shadow: 0 0 20px rgba(212,175,55,0.2); border-radius: 10px 10px 50px 10px; padding: 20px; color: #fff; transition: 0.3s;">
                <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:var(--neon-green); box-shadow: 0 0 15px var(--neon-green);"></div>

                <div style="position: absolute; top: 20px; left: 15px; text-align:center;">
                    <div style="font-size: 2.5rem; font-weight: 900; line-height:1;">${rating}</div>
                    <div style="font-size: 0.9rem; color: var(--accent-gold); font-weight:bold;">${p.pos || 'ZM'}</div>
                </div>

                <div style="position: absolute; top: 20px; right: 20px; width: 12px; height: 12px; background: ${statusColor}; border-radius: 50%; box-shadow: 0 0 10px ${statusColor};"></div>

                <div style="margin-top: 80px; text-align: center; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 10px;">
                    <div style="font-size: 1.4rem; font-weight: 900; letter-spacing: 1px;">${p.name.toUpperCase()}</div>
                    <div style="font-size: 0.7rem; color: var(--accent-gold); margin-top:5px;">NR: ${p.number} | BMI: ${(p.weight/((p.height/100)**2)).toFixed(1)}</div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 15px; font-size: 0.8rem; font-weight: bold;">
                    <div style="display:flex; justify-content:space-between; padding: 0 10px;"><span>SPR</span> <span style="color:var(--neon-green)">${skills.spr}</span></div>
                    <div style="display:flex; justify-content:space-between; padding: 0 10px;"><span>TEC</span> <span style="color:var(--neon-green)">${skills.tec}</span></div>
                    <div style="display:flex; justify-content:space-between; padding: 0 10px;"><span>AUS</span> <span style="color:var(--neon-green)">${skills.aus}</span></div>
                    <div style="display:flex; justify-content:space-between; padding: 0 10px;"><span>PAS</span> <span style="color:var(--neon-green)">${skills.pas}</span></div>
                    <div style="display:flex; justify-content:space-between; padding: 0 10px;"><span>PHY</span> <span style="color:var(--neon-green)">${skills.phy}</span></div>
                </div>

                <div class="ginga-bg" style="position: absolute; bottom: 5px; right: 15px; font-size: 2.5rem; opacity: 0.05; font-weight: 900; font-style: italic; pointer-events:none;">GINGA</div>
            </div>`;
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
            weight: 75,
            height: 180,
            skills: { spr: 70, aus: 70, tec: 70, pas: 70, phy: 70 }
        });
        
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.render();
    },

    edit: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        // Sicherstellen, dass Skills existieren
        if(!p.skills) p.skills = { spr: 70, aus: 70, tec: 70, pas: 70, phy: 70 };

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; max-width:700px; margin:0 auto; background:rgba(13, 20, 33, 0.98); border:2px solid var(--neon-green); border-radius:20px; box-shadow: 0 0 40px rgba(57, 255, 20, 0.2);">
                <button class="tactic-btn" style="width:auto; margin-bottom:25px;" onclick="SektorSporttasche.render()">
                    <i class="fas fa-chevron-left"></i> ZURÜCK ZUR KABINE
                </button>
                
                <h2 style="color:var(--neon-green); margin-bottom:25px; letter-spacing:2px; border-bottom:1px solid rgba(57,255,20,0.3); padding-bottom:10px;">PROFI-DOSSIER: ${p.name.toUpperCase()}</h2>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:10px;">
                        <h4 style="color:var(--accent-gold); font-size:0.7rem; margin-bottom:15px; letter-spacing:1px;">BASIS-WERTE</h4>
                        <div style="margin-bottom:10px;">
                            <label style="font-size:0.6rem; color:var(--text-dim);">STATUS</label>
                            <select id="edit-status" class="login-input" style="width:100%;">
                                <option value="FIT" ${p.status==='FIT'?'selected':''}>FIT</option>
                                <option value="Verletzt" ${p.status==='Verletzt'?'selected':''}>VERLETZT</option>
                            </select>
                        </div>
                        <div style="margin-bottom:10px;">
                            <label style="font-size:0.6rem; color:var(--text-dim);">GESAMT-RATING</label>
                            <input type="number" id="edit-rating" value="${p.rating}" class="login-input" style="width:100%;">
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <div><label style="font-size:0.6rem; color:var(--text-dim);">GEWICHT</label><input type="number" id="edit-weight" value="${p.weight}" class="login-input"></div>
                            <div><label style="font-size:0.6rem; color:var(--text-dim);">GRÖSSE</label><input type="number" id="edit-height" value="${p.height}" class="login-input"></div>
                        </div>
                    </div>

                    <div style="background:rgba(57,255,20,0.03); padding:20px; border-radius:10px; border:1px solid rgba(57,255,20,0.1);">
                        <h4 style="color:var(--neon-green); font-size:0.7rem; margin-bottom:15px; letter-spacing:1px;">SKILL-PUNKTE (1-99)</h4>
                        <div style="display:grid; grid-template-columns: 1fr; gap:12px;">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <label style="font-size:0.7rem;">SPRINT (SPR)</label>
                                <input type="number" id="skill-spr" value="${p.skills.spr}" class="login-input" style="width:60px; text-align:center;">
                            </div>
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <label style="font-size:0.7rem;">AUSDAUER (AUS)</label>
                                <input type="number" id="skill-aus" value="${p.skills.aus}" class="login-input" style="width:60px; text-align:center;">
                            </div>
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <label style="font-size:0.7rem;">TECHNIK (TEC)</label>
                                <input type="number" id="skill-tec" value="${p.skills.tec}" class="login-input" style="width:60px; text-align:center;">
                            </div>
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <label style="font-size:0.7rem;">PASSSPIEL (PAS)</label>
                                <input type="number" id="skill-pas" value="${p.skills.pas}" class="login-input" style="width:60px; text-align:center;">
                            </div>
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <label style="font-size:0.7rem;">PHYSIS (PHY)</label>
                                <input type="number" id="skill-phy" value="${p.skills.phy}" class="login-input" style="width:60px; text-align:center;">
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="login-btn" style="width:100%; margin-top:35px; background:var(--neon-green); color:#000; font-weight:900; letter-spacing:2px;" onclick="SektorSporttasche.save('${p.id}')">ÄNDERUNGEN SPEICHERN</button>
            </div>`;
    },

    save: function(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(x => x.id == id);
        if(idx > -1) {
            players[idx].status = document.getElementById('edit-status').value;
            players[idx].rating = parseInt(document.getElementById('edit-rating').value);
            players[idx].weight = parseFloat(document.getElementById('edit-weight').value);
            players[idx].height = parseFloat(document.getElementById('edit-height').value);
            
            // Skills speichern
            players[idx].skills = {
                spr: parseInt(document.getElementById('skill-spr').value),
                aus: parseInt(document.getElementById('skill-aus').value),
                tec: parseInt(document.getElementById('skill-tec').value),
                pas: parseInt(document.getElementById('skill-pas').value),
                phy: parseInt(document.getElementById('skill-phy').value)
            };
            
            localStorage.setItem('toni_players', JSON.stringify(players));
            if(window.ToniTTS) ToniTTS.speak("Leistungsdaten wurden im Kernsystem aktualisiert.", "warm");
            this.render();
        }
    }
};
