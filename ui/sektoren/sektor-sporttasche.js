/**
 * TONI 2.0 - MANNSCHAFTSKABINE PRO (FIFA STYLE & TACTICAL SYNC)
 */
window.SektorSporttasche = {
    currentFilter: 'all',

    render: function() {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        document.getElementById('active-content').innerHTML = `
            <div style="padding:25px; animation: fadeIn 0.4s ease-out;">
                
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:35px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px;">
                    <div>
                        <h2 style="color:var(--accent-gold); letter-spacing:4px; margin:0; font-size:1.5rem; text-shadow: 0 0 20px rgba(212,175,55,0.3);">ELITE SQUAD CONTROL</h2>
                        <div style="display:flex; gap:12px; margin-top:15px;">
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('all')" style="${this.currentFilter==='all'?'border-color:var(--neon-green);color:#fff':''}">ALLE</button>
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('training')" style="${this.currentFilter==='training'?'border-color:var(--neon-green);color:#fff':''}">IM TRAINING</button>
                            <button class="tactic-btn" onclick="SektorSporttasche.setFilter('match')" style="${this.currentFilter==='match'?'border-color:var(--neon-green);color:#fff':''}">MATCHDAY</button>
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:15px;">
                        <button class="login-btn" style="background:var(--accent-orange); color:#fff; padding:12px 25px;" onclick="SektorSporttasche.syncWithArena()">
                            <i class="fas fa-sync-alt"></i> BOARD AKTUALISIEREN
                        </button>
                        <button class="login-btn" style="background:var(--neon-green); color:#000; padding:12px 25px;" onclick="SektorSporttasche.addPlayer()">
                            + PROFI ANLEGEN
                        </button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px;">
                    ${this.getFilteredPlayers(players).map(p => this.renderProCard(p)).join('')}
                </div>
            </div>`;
    },

    getFilteredPlayers: function(players) {
        if (this.currentFilter === 'training') return players.filter(p => p.isPresent);
        if (this.currentFilter === 'match') return players.filter(p => p.isStarter || p.isNominated);
        return players;
    },

    renderProCard: function(p) {
        const borderCol = p.isStarter ? 'var(--neon-green)' : (p.isNominated ? 'var(--accent-gold)' : '#222');
        const presenceShadow = p.isPresent ? '0 0 20px rgba(57, 255, 20, 0.2)' : 'none';

        return `
            <div class="fifa-card" style="border: 2px solid ${borderCol}; background: linear-gradient(160deg, #121212 0%, #000 100%); position:relative; box-shadow: ${presenceShadow};">
                
                <div style="position:absolute; top:12px; right:12px; display:flex; gap:8px; z-index:10;">
                    <div onclick="SektorSporttasche.fastToggle('${p.id}', 'isPresent')" 
                         title="Anwesenheit Training"
                         style="width:22px; height:22px; border-radius:50%; background:${p.isPresent ? 'var(--neon-green)' : '#444'}; border:2px solid #000; cursor:pointer;"></div>
                </div>

                <div style="padding:20px 20px 10px 20px; display:flex; gap:15px; align-items:center;">
                    <div style="text-align:center;">
                        <div style="font-size:1.8rem; font-weight:900; line-height:1; color:${borderCol}">${p.rating || 80}</div>
                        <div style="font-size:0.6rem; font-weight:bold; color:var(--text-dim);">${p.pos || 'ZM'}</div>
                    </div>
                    <div style="width:70px; height:70px; background:#1a1a1a; border-radius:10px; border:1px solid #333; overflow:hidden;">
                        <img src="${p.photoUrl || ''}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div style="flex:1;">
                        <div style="font-weight:900; font-size:1rem; letter-spacing:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name.toUpperCase()}</div>
                        <div style="font-size:0.6rem; color:var(--accent-gold); font-weight:bold;">NR. ${p.number} | ${p.status || 'FIT'}</div>
                    </div>
                </div>

                <div style="padding:0 20px 15px 20px; display:flex; gap:5px;">
                    <button onclick="SektorSporttasche.setMatchRole('${p.id}', 'starter')" 
                            style="flex:1; font-size:0.55rem; padding:6px; border-radius:4px; border:1px solid #333; cursor:pointer; background:${p.isStarter?'var(--neon-green)':'transparent'}; color:${p.isStarter?'#000':'#fff'}; font-weight:900;">STARTELF</button>
                    <button onclick="SektorSporttasche.setMatchRole('${p.id}', 'sub')" 
                            style="flex:1; font-size:0.55rem; padding:6px; border-radius:4px; border:1px solid #333; cursor:pointer; background:${p.isNominated?'var(--accent-gold)':'transparent'}; color:${p.isNominated?'#000':'#fff'}; font-weight:900;">BANK</button>
                    <button onclick="SektorSporttasche.edit('${p.id}')" 
                            style="width:30px; background:rgba(255,255,255,0.05); border:1px solid #333; color:#fff; border-radius:4px;"><i class="fas fa-edit"></i></button>
                </div>

                <div style="padding:12px 20px; background:rgba(255,255,255,0.02); display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.6rem; border-top:1px solid rgba(255,255,255,0.05);">
                    <div style="display:flex; justify-content:space-between;"><span>VMAX</span> <span style="color:var(--neon-green)">${p.proKpis?.vmax || '--'}</span></div>
                    <div style="display:flex; justify-content:space-between;"><span>RSA</span> <span style="color:var(--neon-green)">${p.proKpis?.rsa || '--'}</span></div>
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
        }
    },

    setMatchRole: function(id, role) {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const idx = players.findIndex(p => p.id === id);
        if(idx > -1) {
            // Logik: Einer kann nicht beides sein.
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
            window.arena.resetBoard(); // Lädt nur die anwesenden/nominierten Spieler neu
            if(window.ToniTTS) ToniTTS.speak("Board synchronisiert. Die anwesenden Spieler sind auf ihren Positionen.", "warm");
            BriefcaseUI.toggle(); // Schließt die Tasche für freie Sicht aufs Board
        }
    },

    setFilter: function(f) {
        this.currentFilter = f;
        this.render();
    }
};
