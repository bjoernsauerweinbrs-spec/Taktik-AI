/**
 * TONI 2.0 - MANNSCHAFTSKABINE PRO (INTERNATIONAL STANDARDS)
 * FIFA-Style Cards mit CSS-Klassen Steuerung & Echtzeit-Datenbindung.
 */
window.SektorSporttasche = {
    currentFilter: 'all',

    render: function() {
        const players = window.ToniDB ? window.ToniDB.getPlayers() : [];
        
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
        const roleClass = p.isStarter ? 'starter' : (p.isNominated ? 'bench' : '');
        const presenceClass = p.isPresent ? 'on' : '';
        const photo = p.photoUrl || 'https://via.placeholder.com/150/000/39FF14?text=PRO';

        return `
            <div class="fifa-card ${roleClass}" onclick="SektorSporttasche.edit('${p.id}')">
                
                <div class="presence-toggle ${presenceClass}" 
                     onclick="event.stopPropagation(); SektorSporttasche.fastToggle('${p.id}', 'isPresent')"
                     title="${p.isPresent ? 'Im Training' : 'Abwesend'}"></div>

                <div style="padding:20px; display:flex; gap:15px; align-items:center;">
                    <div style="text-align:center;">
                        <div style="font-size:2.2rem; font-weight:900; line-height:1; color:#fff;">${p.rating || 80}</div>
                        <div style="font-size:0.7rem; font-weight:bold; color:var(--accent-gold);">${p.pos || 'ZM'}</div>
                    </div>
                    <div style="width:80px; height:80px; background:#000; border-radius:10px; border:1px solid rgba(255,255,255,0.1); overflow:hidden;">
                        <img src="${photo}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div style="flex:1;">
                        <div style="font-weight:900; font-size:1rem; letter-spacing:1px; color:#fff;">${p.name.toUpperCase()}</div>
                        <div style="font-size:0.6rem; color:var(--text-dim); font-weight:bold;">#${p.number} | ${p.status || 'PRO'}</div>
                    </div>
                </div>

                <div style="padding:0 20px 20px 20px; display:flex; gap:10px; margin-top: 5px;">
                    <button onclick="event.stopPropagation(); SektorSporttasche.setMatchRole('${p.id}', 'starter')" 
                            class="tactic-btn" style="flex:1; border-color:${p.isStarter?'var(--neon-green)':'#333'}; background:${p.isStarter?'var(--neon-green)':'transparent'}; color:${p.isStarter?'#000':'#fff'};">STARTELF</button>
                    <button onclick="event.stopPropagation(); SektorSporttasche.setMatchRole('${p.id}', 'sub')" 
                            class="tactic-btn" style="flex:1; border-color:${p.isNominated?'var(--accent-gold)':'#333'}; background:${p.isNominated?'var(--accent-gold)':'transparent'}; color:${p.isNominated?'#000':'#fff'};">BANK</button>
                </div>
            </div>`;
    },

    fastToggle: function(id, field) {
        const players = window.ToniDB.getPlayers();
        const player = players.find(p => p.id === id);
        if(player) {
            player[field] = !player[field];
            window.ToniDB.savePlayer(player);
            this.render();
        }
    },

    setMatchRole: function(id, role) {
        const players = window.ToniDB.getPlayers();
        const player = players.find(p => p.id === id);
        if(player) {
            if(role === 'starter') {
                player.isStarter = !player.isStarter;
                player.isNominated = false;
            } else {
                player.isNominated = !player.isNominated;
                player.isStarter = false;
            }
            window.ToniDB.savePlayer(player);
            this.render();
        }
    },

    syncWithArena: function() {
        if(window.arena) {
            const squad = window.ToniDB.getPlayers().filter(p => p.isPresent);
            window.arena.players = squad.map((p, i) => ({
                id: p.id, name: p.name, nr: p.number, team: 'home',
                x: window.arena.canvas.width * (0.2 + (i * 0.05)),
                y: window.arena.canvas.height * (0.2 + (i * 0.1)),
                radius: 18
            }));
            window.arena.render();
            if(window.BriefcaseUI) window.BriefcaseUI.toggle();
        }
    },

    setFilter: function(f) {
        this.currentFilter = f;
        this.render();
    },

    // ... edit, save, addPlayer, deletePlayer Funktionen bleiben identisch zur Vorversion
    edit: function(id) {
        const players = window.ToniDB.getPlayers();
        const p = players.find(x => x.id == id);
        if(!p) return;

        document.getElementById('active-content').innerHTML = `
            <div style="padding:30px; max-width:900px; margin:0 auto; background:var(--panel-dark); border:2px solid var(--accent-gold); border-radius:20px; animation: fadeIn 0.3s;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <button class="tactic-btn" onclick="SektorSporttasche.render()"><i class="fas fa-chevron-left"></i> ZURÜCK</button>
                    <button class="tactic-btn" style="border-color:var(--status-error); color:var(--status-error);" onclick="SektorSporttasche.deletePlayer('${p.id}')">LÖSCHEN</button>
                </div>
                <h2 style="color:var(--accent-gold); margin-bottom:25px;">PROFI-DOSSIER: ${p.name.toUpperCase()}</h2>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                    <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:10px;">
                        <div id="drop-zone" style="width:100%; height:180px; border:2px dashed #444; border-radius:10px; display:flex; justify-content:center; overflow:hidden;" onclick="document.getElementById('file-input').click()">
                            ${p.photoUrl ? `<img src="${p.photoUrl}" style="height:100%; width:100%; object-fit:cover;">` : '<p>FOTO HOCHLADEN</p>'}
                        </div>
                        <input type="file" id="file-input" style="display:none" onchange="SektorSporttasche.handleFileUpload(this)">
                        <input type="hidden" id="edit-photo-data" value="${p.photoUrl || ''}">
                    </div>
                    <div style="background:rgba(57,255,20,0.03); padding:20px; border-radius:10px;">
                        <label>RATING</label><input type="number" id="edit-rating" value="${p.rating || 80}" class="login-input" style="width:100%">
                        <label>NUMMER</label><input type="number" id="edit-number" value="${p.number}" class="login-input" style="width:100%">
                    </div>
                </div>
                <button class="login-btn" style="width:100%; margin-top:35px;" onclick="SektorSporttasche.save('${p.id}')">ÄNDERUNGEN SPEICHERN</button>
            </div>`;
    },

    save: function(id) {
        const players = window.ToniDB.getPlayers();
        const p = players.find(x => x.id == id);
        if(p) {
            p.rating = parseInt(document.getElementById('edit-rating').value);
            p.number = parseInt(document.getElementById('edit-number').value);
            p.photoUrl = document.getElementById('edit-photo-data').value;
            window.ToniDB.savePlayer(p);
            this.render();
        }
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

    addPlayer: function() {
        const name = prompt("Name des neuen Spielers:");
        if (!name) return;
        window.ToniDB.savePlayer({ id: 'p_' + Date.now(), name: name, number: 10, pos: 'ZM', rating: 80, isPresent: true });
        this.render();
    },

    deletePlayer: function(id) {
        if(confirm("Löschen?")) { window.ToniDB.deletePlayer(id); this.render(); }
    }
};
