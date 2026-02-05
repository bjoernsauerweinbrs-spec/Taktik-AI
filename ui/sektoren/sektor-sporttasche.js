/**
 * TONI 2.0 - MANNSCHAFTSKABINE PRO (INTERNATIONAL STANDARDS)
 * FIFA-Style Cards mit Foto-Upload, Anwesenheits-Management & Dossier-Zugriff.
 */
window.SektorSporttasche = {
    currentFilter: 'all',

    render: function() {
        const players = window.ToniDB ? window.ToniDB.getPlayers() : (JSON.parse(localStorage.getItem('toni_players')) || []);
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:25px; animation: fadeIn 0.4s ease-out; height: 82vh; overflow-y: auto;">
                
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:20px;">
                    <div>
                        <h2 style="color:var(--accent-gold); letter-spacing:4px; margin:0; font-size:1.4rem; font-weight:900;">SQUAD MANAGEMENT</h2>
                        <div style="display:flex; gap:10px; margin-top:15px;">
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('all')" style="${this.currentFilter==='all'?'border-color:var(--neon-green);color:#fff':''}">GESAMT-KADER</button>
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('training')" style="${this.currentFilter==='training'?'border-color:var(--neon-green);color:#fff':''}">IM TRAINING</button>
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('match')" style="${this.currentFilter==='match'?'border-color:var(--neon-green);color:#fff':''}">MATCHDAY</button>
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:12px;">
                        <button class="login-btn" style="background:var(--accent-orange); color:#fff; padding:10px 20px; font-size:0.75rem;" onclick="SektorSporttasche.syncWithArena()">
                            <i class="fas fa-sync-alt"></i> BOARD AKTUALISIEREN
                        </button>
                        <button class="login-btn" style="background:var(--neon-green); color:#000; padding:10px 20px; font-size:0.75rem;" onclick="SektorSporttasche.addPlayer()">
                            <i class="fas fa-plus"></i> NEUER SPIELER
                        </button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 35px;">
                    ${this.getFilteredPlayers(players).length > 0 
                        ? this.getFilteredPlayers(players).map(p => this.renderProCard(p)).join('')
                        : `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:var(--text-dim); border:1px dashed #333; border-radius:20px;">Keine Spieler gefunden.</div>`
                    }
                </div>
            </div>`;
    },

    getFilteredPlayers: function(players) {
        if (this.currentFilter === 'training') return players.filter(p => p.isPresent);
        if (this.currentFilter === 'match') return players.filter(p => p.isStarter || p.isNominated);
        return players;
    },

    renderProCard: function(p) {
        const borderCol = p.isStarter ? 'var(--neon-green)' : (p.isNominated ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)');
        const presenceGlow = p.isPresent ? `0 0 25px rgba(57, 255, 20, 0.2)` : 'none';
        const rating = p.rating || 80;
        const photo = p.photoUrl || 'https://via.placeholder.com/150/000000/39FF14?text=PRO';

        return `
            <div class="fifa-card" onclick="SektorSporttasche.edit('${p.id}')" style="border: 2px solid ${borderCol}; background: linear-gradient(135deg, #0d1117 0%, #000 100%); position:relative; box-shadow: ${presenceGlow}; cursor:pointer; transition: transform 0.2s;">
                
                <div style="position:absolute; top:12px; right:12px; z-index:10;">
                    <div onclick="event.stopPropagation(); SektorSporttasche.fastToggle('${p.id}', 'isPresent')" 
                         title="${p.isPresent ? 'Im Training' : 'Abwesend'}"
                         style="width:18px; height:18px; border-radius:50%; background:${p.isPresent ? 'var(--neon-green)' : '#444'}; border:3px solid #000; cursor:pointer;"></div>
                </div>

                <div style="padding:25px 25px 15px 25px; display:flex; gap:15px; align-items:center;">
                    <div style="text-align:center;">
                        <div style="font-size:1.8rem; font-weight:900; line-height:1; color:${borderCol}">${rating}</div>
                        <div style="font-size:0.6rem; font-weight:bold; color:var(--text-dim);">${p.pos || 'ZM'}</div>
                    </div>
                    <div style="width:75px; height:75px; background:#111; border-radius:10px; border:1px solid #333; overflow:hidden;">
                        <img src="${photo}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div style="flex:1;">
                        <div style="font-weight:900; font-size:0.9rem; letter-spacing:1px; color:#fff;">${p.name.toUpperCase()}</div>
                        <div style="font-size:0.5rem; color:var(--accent-gold); font-weight:bold;">NR. ${p.number} | ${p.status || 'FIT'}</div>
                    </div>
                </div>

                <div style="padding:0 20px 20px 20px; display:flex; gap:5px;">
                    <button onclick="event.stopPropagation(); SektorSporttasche.setMatchRole('${p.id}', 'starter')" 
                            style="flex:1; font-size:0.55rem; padding:6px; border-radius:4px; border:1px solid #333; cursor:pointer; background:${p.isStarter?'var(--neon-green)':'transparent'}; color:${p.isStarter?'#000':'#fff'}; font-weight:900;">STARTELF</button>
                    <button onclick="event.stopPropagation(); SektorSporttasche.setMatchRole('${p.id}', 'sub')" 
                            style="flex:1; font-size:0.55rem; padding:6px; border-radius:4px; border:1px solid #333; cursor:pointer; background:${p.isNominated?'var(--accent-gold)':'transparent'}; color:${p.isNominated?'#000':'#fff'}; font-weight:900;">BANK</button>
                </div>
            </div>`;
    },

    fastToggle: function(id, field) {
        let players = window.ToniDB.getPlayers();
        const idx = players.findIndex(p => p.id === id);
        if(idx > -1) {
            players[idx][field] = !players[idx][field];
            window.ToniDB.savePlayer(players[idx]);
            this.render();
        }
    },

    setMatchRole: function(id, role) {
        let players = window.ToniDB.getPlayers();
        const idx = players.findIndex(p => p.id === id);
        if(idx > -1) {
            if(role === 'starter') {
                players[idx].isStarter = !players[idx].isStarter;
                players[idx].isNominated = false;
            } else {
                players[idx].isNominated = !players[idx].isNominated;
                players[idx].isStarter = false;
            }
            window.ToniDB.savePlayer(players[idx]);
            this.render();
        }
    },

    syncWithArena: function() {
        if(window.arena) {
            const squad = window.ToniDB.getPlayers().filter(p => p.isPresent);
            window.arena.players = squad.map((p, i) => ({
                id: p.id,
                name: p.name,
                number: p.number,
                team: 'red',
                x: 0.2 + (i * 0.05),
                y: 0.2 + (i * 0.1)
            }));
            window.arena.render();
            if(window.BriefcaseUI) window.BriefcaseUI.toggle();
            if(window.ToniTTS) ToniTTS.speak("Kader synchronisiert. Anwesende Spieler auf dem Board positioniert.", "warm");
        }
    },

    setFilter: function(f) {
        this.currentFilter = f;
        this.render();
    },

    edit: function(id) {
        const players = window.ToniDB.getPlayers();
        const p = players.find(x => x.id == id);
        if(!p) return;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; max-width:900px; margin:0 auto; background:rgba(13, 20, 33, 0.98); border:2px solid var(--accent-gold); border-radius:20px; animation: fadeIn 0.3s;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <button class="tactic-btn" onclick="SektorSporttasche.render()"><i class="fas fa-chevron-left"></i> ZURÜCK</button>
                    <button class="tactic-btn" style="border-color:var(--status-error); color:var(--status-error);" onclick="SektorSporttasche.deletePlayer('${p.id}')">LÖSCHEN</button>
                </div>
                
                <h2 style="color:var(--accent-gold); margin-bottom:25px; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:10px;">PROFI-DOSSIER: ${p.name.toUpperCase()}</h2>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:10px;">
                        <h4 style="color:var(--accent-gold); font-size:0.6rem; margin-bottom:15px;">FOTO & STATUS</h4>
                        <div id="drop-zone" style="width:100%; height:180px; border:2px dashed #444; border-radius:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; overflow:hidden; position:relative;" onclick="document.getElementById('file-input').click()">
                            ${p.photoUrl ? `<img src="${p.photoUrl}" style="height:100%; width:100%; object-fit:cover;">` : '<i class="fas fa-camera" style="font-size:2.5rem; color:#444;"></i><p style="font-size:0.6rem; color:#666; margin-top:10px;">KLICKEN ZUM HOCHLADEN</p>'}
                        </div>
                        <input type="file" id="file-input" style="display:none" onchange="SektorSporttasche.handleFileUpload(this)">
                        <input type="hidden" id="edit-photo-data" value="${p.photoUrl || ''}">

                        <div style="margin-top:20px;">
                            <label style="font-size:0.6rem; color:var(--text-dim);">TRAININGS-STATUS</label>
                            <select id="edit-present" class="login-input" style="width:100%;">
                                <option value="true" ${p.isPresent?'selected':''}>AKTIV IM TRAINING</option>
                                <option value="false" ${!p.isPresent?'selected':''}>ABWESEND / VERLETZT</option>
                            </select>
                        </div>
                    </div>

                    <div style="background:rgba(57,255,20,0.03); padding:20px; border-radius:10px; border:1px solid rgba(57,255,20,0.1);">
                        <h4 style="color:var(--neon-green); font-size:0.6rem; margin-bottom:15px;">LEISTUNGSDATEN</h4>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                            <div><label style="font-size:0.5rem; color:#aaa;">RATING</label><input type="number" id="edit-rating" value="${p.rating || 80}" class="login-input" style="width:100%"></div>
                            <div><label style="font-size:0.5rem; color:#aaa;">NUMMER</label><input type="number" id="edit-number" value="${p.number}" class="login-input" style="width:100%"></div>
                            <div><label style="font-size:0.5rem; color:#aaa;">PULS (BPM)</label><input type="number" id="edit-pulse" value="${p.vitals?.pulse || 70}" class="login-input" style="width:100%"></div>
                            <div><label style="font-size:0.5rem; color:#aaa;">SpO2 (%)</label><input type="number" id="edit-spo2" value="${p.vitals?.spo2 || 98}" class="login-input" style="width:100%"></div>
                            <div><label style="font-size:0.5rem; color:#aaa;">V-MAX (KM/H)</label><input type="number" id="edit-vmax" value="${p.proKpis?.vmax || 30}" class="login-input" style="width:100%"></div>
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
        const players = window.ToniDB.getPlayers();
        const idx = players.findIndex(x => x.id == id);
        if(idx > -1) {
            players[idx].rating = parseInt(document.getElementById('edit-rating').value);
            players[idx].number = parseInt(document.getElementById('edit-number').value);
            players[idx].photoUrl = document.getElementById('edit-photo-data').value;
            players[idx].isPresent = document.getElementById('edit-present').value === "true";
            players[idx].vitals = {
                pulse: parseInt(document.getElementById('edit-pulse').value),
                spo2: parseInt(document.getElementById('edit-spo2').value)
            };
            players[idx].proKpis = {
                vmax: parseFloat(document.getElementById('edit-vmax').value),
                rsa: players[idx].proKpis?.rsa || 78
            };
            window.ToniDB.savePlayer(players[idx]);
            this.render();
        }
    },

    addPlayer: function() {
        const name = prompt("Name des neuen Spielers:");
        if (!name) return;
        const newPlayer = {
            id: 'p_' + Date.now(),
            name: name,
            number: 10,
            pos: 'ZM',
            rating: 80,
            isPresent: true,
            isStarter: false,
            isNominated: false,
            vitals: { pulse: 70, spo2: 98 },
            proKpis: { vmax: 30, rsa: 78 }
        };
        window.ToniDB.savePlayer(newPlayer);
        this.render();
    },

    deletePlayer: function(id) {
        if(confirm("Spieler unwiderruflich löschen?")) {
            window.ToniDB.deletePlayer(id);
            this.render();
        }
    }
};
