/**
 * TONI 2.0 - MANNSCHAFTSKABINE PRO (INTERNATIONAL STANDARDS)
 * Hierarchie: Gesamt-Kader -> Training -> Match (11+5)
 * Feature: Lokaler Foto-Upload (Base64) & Status-Management
 */
window.SektorSporttasche = {
    currentFilter: 'all', // all, training, match

    render: function() {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        // Filter-Logik
        let filteredPlayers = players;
        if (this.currentFilter === 'training') {
            filteredPlayers = players.filter(p => p.isPresent);
        } else if (this.currentFilter === 'match') {
            filteredPlayers = players.filter(p => p.isStarter || p.isNominated);
        }

        // Sortierung: Starter -> Nominiert -> Anwesend -> Rest
        filteredPlayers.sort((a, b) => {
            if (a.isStarter !== b.isStarter) return a.isStarter ? -1 : 1;
            if (a.isNominated !== b.isNominated) return a.isNominated ? -1 : 1;
            if (a.isPresent !== b.isPresent) return a.isPresent ? -1 : 1;
            return (b.rating || 0) - (a.rating || 0);
        });
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:20px; animation: fadeIn 0.4s ease-out;">
                
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px;">
                    <div>
                        <h2 style="color:var(--accent-gold); letter-spacing:3px; margin:0; text-shadow: 0 0 15px rgba(212,175,55,0.4);">MANNSCHAFTSKABINE</h2>
                        <div style="display:flex; gap:10px; margin-top:10px;">
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('all')" style="${this.currentFilter==='all'?'border-color:var(--neon-green);color:#fff':''}">GESAMT-KADER</button>
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('training')" style="${this.currentFilter==='training'?'border-color:var(--neon-green);color:#fff':''}">TRAINING-POOL</button>
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('match')" style="${this.currentFilter==='match'?'border-color:var(--neon-green);color:#fff':''}">MATCH-DAY (11+5)</button>
                        </div>
                    </div>
                    <div style="display:flex; gap:15px;">
                        <button class="tactic-btn" style="border-color:var(--status-error); color:var(--status-error);" onclick="SektorSporttasche.factoryReset()">KADER LÖSCHEN</button>
                        <button class="login-btn" style="width:auto; padding:12px 30px; background:var(--neon-green); color:#000; font-weight:900;" onclick="SektorSporttasche.addPlayer()">
                            <i class="fas fa-plus"></i> NEUER SPIELER
                        </button>
                    </div>
                </div>
                
                <div class="pro-player-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px;">
                    ${filteredPlayers.length > 0 
                        ? filteredPlayers.map(p => this.renderFifaCard(p)).join('') 
                        : `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:var(--text-dim); border:1px dashed #333;">Keine Spieler in dieser Ansicht gefunden.</div>`
                    }
                </div>
            </div>`;
    },

    setFilter: function(f) {
        this.currentFilter = f;
        this.render();
    },

    renderFifaCard: function(p) {
        const rating = p.rating || 80;
        const photo = p.photoUrl || 'https://via.placeholder.com/200/000000/39FF14?text=PRO';
        
        // Status-Indikatoren
        let badge = "";
        if (p.isStarter) badge = `<span style="background:var(--neon-green); color:#000; padding:2px 8px; border-radius:3px; font-size:0.5rem; font-weight:900;">STARTELF</span>`;
        else if (p.isNominated) badge = `<span style="background:var(--accent-gold); color:#000; padding:2px 8px; border-radius:3px; font-size:0.5rem; font-weight:900;">BANK</span>`;
        else if (p.isPresent) badge = `<span style="background:var(--data-cyan); color:#000; padding:2px 8px; border-radius:3px; font-size:0.5rem; font-weight:900;">TRAINING</span>`;

        return `
            <div class="fifa-card" onclick="SektorSporttasche.edit('${p.id}')" style="position:relative; background: linear-gradient(135deg, #1a1a1a 0%, #000 100%); border: 2px solid ${p.isStarter ? 'var(--neon-green)' : (p.isNominated ? 'var(--accent-gold)' : '#333')}; overflow:hidden;">
                
                <div style="width:100%; height:180px; background:#000; overflow:hidden;">
                    <img src="${photo}" style="width:100%; height:100%; object-fit:cover;">
                </div>

                <div style="position: absolute; top: 10px; left: 10px; display:flex; flex-direction:column; gap:5px;">
                    <div style="background:rgba(0,0,0,0.8); padding:5px 10px; border:1px solid var(--accent-gold); border-radius:5px; text-align:center;">
                        <div style="font-size: 1.2rem; font-weight: 900; color:#fff;">${rating}</div>
                        <div style="font-size: 0.5rem; color: var(--accent-gold); font-weight:bold;">${p.pos || 'ZM'}</div>
                    </div>
                    ${badge}
                </div>

                <div style="padding:15px; text-align: center;">
                    <div style="font-size: 1.1rem; font-weight: 900; color:#fff; margin-bottom:5px;">${p.name.toUpperCase()}</div>
                    <div style="font-size: 0.6rem; color:var(--text-dim); margin-bottom:10px;">NR: ${p.number} | ${p.status}</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.6rem; font-weight: bold; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">
                        <div style="display:flex; justify-content:space-between;"><span>VMAX</span> <span style="color:var(--neon-green)">${p.proKpis?.vmax || '--'}</span></div>
                        <div style="display:flex; justify-content:space-between;"><span>RSA</span> <span style="color:var(--neon-green)">${p.proKpis?.rsa || '--'}</span></div>
                    </div>
                </div>
            </div>`;
    },

    edit: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; max-width:900px; margin:0 auto; background:rgba(13, 20, 33, 0.98); border:2px solid var(--accent-gold); border-radius:20px; animation: fadeIn 0.3s;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <button class="tactic-btn" onclick="SektorSporttasche.render()"><i class="fas fa-chevron-left"></i> ZURÜCK</button>
                    <button class="tactic-btn" style="border-color:var(--status-error); color:var(--status-error);" onclick="SektorSporttasche.deletePlayer('${p.id}')">SPIELER LÖSCHEN</button>
                </div>
                
                <h2 style="color:var(--accent-gold); margin-bottom:25px; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:10px;">PROFI-DOSSIER: ${p.name.toUpperCase()}</h2>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:10px;">
                        <h4 style="color:var(--accent-gold); font-size:0.6rem; margin-bottom:15px;">FOTO-UPLOAD</h4>
                        <div id="drop-zone" style="width:100%; height:120px; border:2px dashed #444; border-radius:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; overflow:hidden;" onclick="document.getElementById('file-input').click()">
                            ${p.photoUrl ? `<img src="${p.photoUrl}" style="height:100%; width:100%; object-fit:cover;">` : '<i class="fas fa-cloud-upload-alt" style="font-size:2rem; color:#444;"></i><p style="font-size:0.5rem; color:#666;">KLICKEN ODER BILD HIERHER ZIEHEN</p>'}
                        </div>
                        <input type="file" id="file-input" style="display:none" onchange="SektorSporttasche.handleFileUpload(this)">
                        <input type="hidden" id="edit-photo-data" value="${p.photoUrl || ''}">

                        <div style="margin-top:20px;">
                            <label style="font-size:0.6rem; color:var(--text-dim);">ANWESENHEIT TRAINING</label>
                            <select id="edit-present" class="login-input" style="width:100%; margin-bottom:15px;">
                                <option value="true" ${p.isPresent?'selected':''}>ANWESEND</option>
                                <option value="false" ${!p.isPresent?'selected':''}>ABWESEND / ENTSCHULDIGT</option>
                            </select>

                            <label style="font-size:0.6rem; color:var(--text-dim);">MATCH-NOMINIERUNG (Aus Pool)</label>
                            <select id="edit-role" class="login-input" style="width:100%;">
                                <option value="none" ${!p.isStarter && !p.isNominated ? 'selected' : ''}>NICHT IM KADER</option>
                                <option value="starter" ${p.isStarter?'selected':''}>STARTELF (11)</option>
                                <option value="sub" ${p.isNominated?'selected':''}>ERSATZBANK (5)</option>
                            </select>
                        </div>
                    </div>

                    <div style="background:rgba(57,255,20,0.03); padding:20px; border-radius:10px; border:1px solid rgba(57,255,20,0.1);">
                        <h4 style="color:var(--neon-green); font-size:0.6rem; margin-bottom:15px;">PERFORMANCE-PARAMETER</h4>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                            <div><label style="font-size:0.5rem;">RATING</label><input type="number" id="edit-rating" value="${p.rating}" class="login-input"></div>
                            <div><label style="font-size:0.5rem;">NUMMER</label><input type="number" id="edit-number" value="${p.number}" class="login-input"></div>
                            <div><label style="font-size:0.5rem;">PULS</label><input type="number" id="edit-pulse" value="${p.vitals?.pulse || 70}" class="login-input"></div>
                            <div><label style="font-size:0.5rem;">SpO2</label><input type="number" id="edit-spo2" value="${p.vitals?.spo2 || 98}" class="login-input"></div>
                        </div>
                    </div>
                </div>
                
                <button class="login-btn" style="width:100%; margin-top:35px;" onclick="SektorSporttasche.save('${p.id}')">ÄNDERUNGEN SPEICHERN</button>
            </div>`;
    },

    handleFileUpload: function(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('edit-photo-data').value = e.target.result;
                document.getElementById('drop-zone').innerHTML = `<img src="${e.target.result}" style="height:100%; width:100%; object-fit:cover;">`;
            };
            reader.readAsDataURL(file);
        }
    },

    save: function(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(x => x.id == id);
        if(idx > -1) {
            const role = document.getElementById('edit-role').value;
            
            players[idx].rating = parseInt(document.getElementById('edit-rating').value);
            players[idx].number = parseInt(document.getElementById('edit-number').value);
            players[idx].photoUrl = document.getElementById('edit-photo-data').value;
            players[idx].isPresent = document.getElementById('edit-present').value === "true";
            
            // Nominierung setzen
            players[idx].isStarter = (role === 'starter');
            players[idx].isNominated = (role === 'sub');
            
            players[idx].vitals = {
                pulse: parseInt(document.getElementById('edit-pulse').value),
                spo2: parseInt(document.getElementById('edit-spo2').value)
            };
            
            localStorage.setItem('toni_players', JSON.stringify(players));
            if(window.ToniTTS) ToniTTS.speak("Daten synchronisiert.", "warm");
            this.render();
        }
    },

    addPlayer: function() {
        const name = prompt("Name des Spielers:");
        if (!name) return;
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        players.push({
            id: 'p_' + Date.now(),
            name: name,
            number: 10,
            pos: 'ZM',
            rating: 80,
            status: 'FIT',
            isPresent: true,
            isStarter: false,
            isNominated: false,
            vitals: { pulse: 70, spo2: 98 },
            proKpis: { vmax: 2, rsa: 75, ballControl: 75, stress: 75 }
        });
        localStorage.setItem('toni_players', JSON.stringify(players));
        this.render();
    },

    deletePlayer: function(id) {
        if(confirm("Spieler entfernen?")) {
            let players = JSON.parse(localStorage.getItem('toni_players')) || [];
            players = players.filter(p => p.id !== id);
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.render();
        }
    },

    factoryReset: function() {
        if(confirm("Gesamten Kader löschen?")) {
            localStorage.setItem('toni_players', JSON.stringify([]));
            this.render();
        }
    }
};
