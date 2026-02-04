/**
 * TONI 2.0 - MANNSCHAFTSKABINE PRO (INTERNATIONAL STANDARDS)
 * FIFA-Style Cards mit Echtzeit-Status & Arena-Synchronisation.
 */
window.SektorSporttasche = {
    currentFilter: 'all',

    render: function() {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:25px; animation: fadeIn 0.4s ease-out; height: 82vh; overflow-y: auto;">
                
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:20px;">
                    <div>
                        <h2 style="color:var(--accent-gold); letter-spacing:4px; margin:0; font-size:1.4rem; font-weight:900;">SQUAD MANAGEMENT</h2>
                        <div style="display:flex; gap:10px; margin-top:15px;">
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('all')" style="${this.currentFilter==='all'?'border-color:var(--neon-green);color:#fff':''}">GESAMT-KADER</button>
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('training')" style="${this.currentFilter==='training'?'border-color:var(--neon-green);color:#fff':''}">TRAINING-POOL</button>
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('match')" style="${this.currentFilter==='match'?'border-color:var(--neon-green);color:#fff':''}">MATCHDAY-KADER</button>
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:12px;">
                        <button class="login-btn" style="background:var(--accent-orange); color:#fff; padding:10px 20px; font-size:0.75rem;" onclick="SektorSporttasche.syncWithArena()">
                            <i class="fas fa-sync-alt"></i> BOARD AKTUALISIEREN
                        </button>
                        <button class="login-btn" style="background:var(--neon-green); color:#000; padding:10px 20px; font-size:0.75rem;" onclick="SektorSporttasche.addPlayer()">
                            <i class="fas fa-plus"></i> SPIELER ANLEGEN
                        </button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 35px;">
                    ${this.getFilteredPlayers(players).length > 0 
                        ? this.getFilteredPlayers(players).map(p => this.renderProCard(p)).join('')
                        : `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:var(--text-dim); border:1px dashed #333; border-radius:20px;">Keine Spieler in dieser Auswahl gefunden.</div>`
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
        const presenceGlow = p.isPresent ? `0 0 25px rgba(57, 255, 20, 0.15)` : 'none';
        const rating = p.rating || 80;
        const photo = p.photoUrl || 'https://via.placeholder.com/150/000000/39FF14?text=PRO';

        return `
            <div class="fifa-card" style="border: 1px solid ${borderCol}; background: linear-gradient(135deg, #0d1117 0%, #000 100%); position:relative; box-shadow: ${presenceGlow}; transition: 0.3s ease;">
                
                <div style="position:absolute; top:15px; right:15px; z-index:10;">
                    <div onclick="SektorSporttasche.fastToggle('${p.id}', 'isPresent')" 
                         title="Anwesenheit markieren"
                         style="width:14px; height:14px; border-radius:50%; background:${p.isPresent ? 'var(--neon-green)' : '#222'}; border:2px solid #000; cursor:pointer; box-shadow:${p.isPresent ? '0 0 10px var(--neon-green)' : 'none'};"></div>
                </div>

                <div style="padding:25px 25px 15px 25px; display:flex; gap:20px; align-items:center;">
                    <div style="text-align:center;">
                        <div style="font-size:2.2rem; font-weight:900; line-height:1; color:${borderCol}; letter-spacing:-1px;">${rating}</div>
                        <div style="font-size:0.65rem; font-weight:900; color:var(--text-dim); margin-top:5px;">${p.pos || 'ZM'}</div>
                    </div>
                    <div style="width:85px; height:85px; background:radial-gradient(circle, #222 0%, #000 100%); border-radius:12px; border:1px solid rgba(255,255,255,0.05); overflow:hidden; box-shadow: inset 0 0 15px rgba(0,0,0,0.5);">
                        <img src="${photo}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                </div>

                <div style="padding:0 25px 20px 25px;">
                    <div style="font-weight:900; font-size:1.1rem; letter-spacing:1px; color:#fff; margin-bottom:2px;">${p.name.toUpperCase()}</div>
                    <div style="font-size:0.6rem; color:var(--accent-gold); font-weight:700; letter-spacing:1px;">NR. ${p.number} | ${p.status || 'FIT'}</div>
                </div>

                <div style="padding:0 20px 20px 20px; display:flex; gap:8px;">
                    <button onclick="SektorSporttasche.setMatchRole('${p.id}', 'starter')" 
                            style="flex:1; font-size:0.6rem; padding:8px; border-radius:6px; border:1px solid #333; cursor:pointer; transition:0.2s; background:${p.isStarter?'var(--neon-green)':'rgba(255,255,255,0.03)'}; color:${p.isStarter?'#000':'#fff'}; font-weight:900;">STARTELF</button>
                    <button onclick="SektorSporttasche.setMatchRole('${p.id}', 'sub')" 
                            style="flex:1; font-size:0.6rem; padding:8px; border-radius:6px; border:1px solid #333; cursor:pointer; transition:0.2s; background:${p.isNominated?'var(--accent-gold)':'rgba(255,255,255,0.03)'}; color:${p.isNominated?'#000':'#fff'}; font-weight:900;">BANK</button>
                    <button onclick="SektorSporttasche.edit('${p.id}')" 
                            title="Profi-Dossier bearbeiten"
                            style="width:38px; background:rgba(255,255,255,0.05); border:1px solid #333; color:#fff; border-radius:6px; cursor:pointer;"><i class="fas fa-fingerprint"></i></button>
                </div>

                <div style="padding:15px 25px; background:rgba(255,255,255,0.02); display:grid; grid-template-columns: 1fr 1fr; gap:15px; font-size:0.65rem; border-top:1px solid rgba(255,255,255,0.05);">
                    <div style="display:flex; justify-content:space-between; border-right:1px solid rgba(255,255,255,0.05); padding-right:10px;">
                        <span style="color:var(--text-dim);">VMAX</span> 
                        <span style="color:var(--neon-green); font-weight:900;">${p.proKpis?.vmax || '--'}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--text-dim);">RSA</span> 
                        <span style="color:var(--neon-green); font-weight:900;">${p.proKpis?.rsa || '--'}</span>
                    </div>
                </div>
            </div>`;
    },

    fastToggle: function(id, field) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(p => p.id === id);
        if(idx > -1) {
            players[idx][field] = !players[idx][field];
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.render();
            if(window.ToniTTS && players[idx][field]) ToniTTS.speak(`${players[idx].name} ist im Training gemeldet.`, "warm");
        }
    },

    setMatchRole: function(id, role) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(p => p.id === id);
        if(idx > -1) {
            if(role === 'starter') {
                players[idx].isStarter = !players[idx].isStarter;
                players[idx].isNominated = false;
            } else {
                players[idx].isNominated = !players[idx].isNominated;
                players[idx].isStarter = false;
            }
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.render();
        }
    },

    syncWithArena: function() {
        if(window.arena) {
            window.arena.resetBoard();
            if(window.ToniTTS) ToniTTS.speak("Taktisches Board wird mit dem Kader synchronisiert.", "warm");
            if(window.BriefcaseUI) window.BriefcaseUI.toggle();
        }
    },

    setFilter: function(f) {
        this.currentFilter = f;
        this.render();
    },

    // Dossier-Bearbeitung (Original-Funktion erhalten und optisch angepasst)
    edit: function(id) {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const p = players.find(x => x.id == id);
        if(!p) return;

        const pulse = (p.vitals && p.vitals.pulse) ? p.vitals.pulse : 70;
        const spo2 = (p.vitals && p.vitals.spo2) ? p.vitals.spo2 : 98;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; max-width:800px; margin:0 auto; background:rgba(13, 20, 33, 0.98); border:1px solid var(--accent-gold); border-radius:20px; animation: fadeIn 0.3s;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                    <button class="tactic-btn" onclick="SektorSporttasche.render()"><i class="fas fa-chevron-left"></i> ZURÜCK</button>
                    <button class="tactic-btn" style="border-color:var(--status-error); color:var(--status-error);" onclick="SektorSporttasche.deletePlayer('${p.id}')">PROFI ENTFERNEN</button>
                </div>
                
                <h2 style="color:var(--accent-gold); margin-bottom:30px;">PROFI-DOSSIER: ${p.name.toUpperCase()}</h2>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:15px;">
                        <h4 style="font-size:0.6rem; color:var(--text-dim); margin-bottom:15px; letter-spacing:2px;">BASICS</h4>
                        <label style="font-size:0.6rem; display:block; margin-bottom:5px;">RATING</label>
                        <input type="number" id="edit-rating" value="${p.rating || 80}" class="login-input" style="width:100%; margin-bottom:15px;">
                        <label style="font-size:0.6rem; display:block; margin-bottom:5px;">RÜCKENNUMMER</label>
                        <input type="number" id="edit-number" value="${p.number}" class="login-input" style="width:100%;">
                    </div>

                    <div style="background:rgba(57,255,20,0.03); padding:20px; border-radius:15px; border:1px solid rgba(57,255,20,0.1);">
                        <h4 style="font-size:0.6rem; color:var(--neon-green); margin-bottom:15px; letter-spacing:2px;">MEDICAL VITALITY</h4>
                        <label style="font-size:0.6rem; display:block; margin-bottom:5px;">PULS (BPM)</label>
                        <input type="number" id="edit-pulse" value="${pulse}" class="login-input" style="width:100%; margin-bottom:15px;">
                        <label style="font-size:0.6rem; display:block; margin-bottom:5px;">SAUERSTOFF (SpO2 %)</label>
                        <input type="number" id="edit-spo2" value="${spo2}" class="login-input" style="width:100%;">
                    </div>
                </div>
                
                <button class="login-btn" style="width:100%; margin-top:35px;" onclick="SektorSporttasche.save('${p.id}')">DOSSIER SYNCHRONISIEREN</button>
            </div>`;
    },

    save: function(id) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(x => x.id == id);
        if(idx > -1) {
            players[idx].rating = parseInt(document.getElementById('edit-rating').value);
            players[idx].number = parseInt(document.getElementById('edit-number').value);
            players[idx].vitals = {
                pulse: parseInt(document.getElementById('edit-pulse').value),
                spo2: parseInt(document.getElementById('edit-spo2').value)
            };
            localStorage.setItem('toni_players', JSON.stringify(players));
            this.render();
        }
    }
};
