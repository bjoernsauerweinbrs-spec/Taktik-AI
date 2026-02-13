/**
 * TONI 2.0 - SEKTOR SPORTTASCHE (ELITE KABINE)
 * Fokus: Kader-Management, Bild-Upload & Kader-Filterung
 * Status: CLEAN & SYNCED 2026
 */
window.SektorSporttasche = {
    
    open() {
        const activeContent = document.getElementById('active-content');
        if (!activeContent) return;
        this.render();
    },

    render() {
        const activeContent = document.getElementById('active-content');
        // Holen des aktuellen Kontexts (Senioren oder spezifische Jugend)
        const team = window.currentTeamContext || "Senioren";
        
        const players = (window.Database && window.Database.players) 
            ? window.Database.players.filter(p => {
                // Filter: Entweder Team Senioren ODER die exakte Jugendbezeichnung (z.B. "G-JUGEND")
                const isCorrectTeam = (team === "Senioren") ? p.team === "Senioren" : p.jugend === team;
                return isCorrectTeam && p.assignment === "Trainer";
            }) 
            : [];

        activeContent.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(57, 255, 20, 0.2); padding-bottom:15px;">
                    <div>
                        <h3 style="color:#39FF14; font-family:'Orbitron'; margin:0; letter-spacing:2px; font-size:1.1rem;">KABINE: ${team.toUpperCase()}</h3>
                        <p style="color:#666; font-size:0.6rem; text-transform:uppercase; letter-spacing:1px;">KADER-GRÖSSE: ${players.length} SPIELER GELADEN</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" style="font-size:0.65rem;" onclick="window.SektorSporttasche.openAddModal('${team}')">
                            <i class="fas fa-user-plus"></i> NEUZUGANG
                        </button>
                        <button class="tactic-btn" style="font-size:0.65rem;" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; justify-items: center; padding-bottom: 50px;">
                    ${players.map(p => this.createCardHTML(p)).join('')}
                    ${players.length === 0 ? '<div style="color:#444; grid-column:1/-1; text-align:center; padding:50px; font-family:\'Orbitron\'">DIESER KADER IST NOCH LEER.</div>' : ''}
                </div>
            </div>
            
            <div id="player-edit-modal" class="hidden" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#05080F; border:2px solid #39FF14; padding:30px; border-radius:15px; z-index:1000005; width:480px; box-shadow:0 0 100px rgba(0,0,0,0.9); color:#fff; font-family:'Orbitron';">
                <div id="modal-form-content"></div>
            </div>
        `;
    },

    createCardHTML(p) {
        const rank = p.rat >= 90 ? "elite" : p.rat >= 80 ? "gold" : p.rat >= 70 ? "silver" : "bronze";
        const trainingActive = p.onTraining ? 'color:#39FF14;' : 'color:#333;';
        const matchActive = p.onField ? 'color:#39FF14;' : 'color:#333;';

        return `
            <div class="fifa-card" data-rank="${rank}">
                <div style="position:absolute; top:35px; left:22px; text-align:center; z-index:10;">
                    <div style="font-size:1.8rem; font-weight:900; line-height:1;">${p.rat}</div>
                    <div style="font-size:0.7rem; font-weight:bold; opacity:0.8;">${p.pos || 'ST'}</div>
                </div>
                
                <div style="position:absolute; top:35px; right:25px; z-index:10; display:flex; flex-direction:column; gap:10px;">
                    <i class="fas fa-dumbbell" style="${trainingActive} font-size:0.8rem;" title="Training"></i>
                    <i class="fas fa-running" style="${matchActive} font-size:0.8rem;" title="Spielfeld"></i>
                </div>

                <div class="player-img" style="background-image: url('${p.img || 'https://cdn-icons-png.flaticon.com/512/805/805404.png'}');" onclick="window.SektorSporttasche.triggerUpload('${p.id}')">
                </div>

                <div style="position:absolute; bottom:25%; width:100%; text-align:center; font-weight:900; font-size:0.9rem; letter-spacing:1px; z-index:10;" onclick="window.SektorSporttasche.openEdit('${p.id}')">
                    ${(p.name || 'PLAYER').split(' ').pop().toUpperCase()}
                </div>

                <div class="card-stats-grid" onclick="window.SektorSporttasche.openEdit('${p.id}')">
                    <div>PAC <span>${p.pac || 50}</span></div> <div>DRI <span>${p.dri || 50}</span></div>
                    <div>SHO <span>${p.sho || 50}</span></div> <div>DEF <span>${p.def || 50}</span></div>
                    <div>PAS <span>${p.pas || 50}</span></div> <div>PHY <span>${p.phy || 50}</span></div>
                </div>

                <div style="position:absolute; bottom:5px; width:100%; display:flex; justify-content:center; gap:5px; z-index:20; padding:0 10px;">
                    <button class="tactic-btn" style="font-size:0.5rem; flex:1; padding:3px;" onclick="window.SektorSporttasche.toggleStatus('${p.id}', 'onTraining')">TRAINING</button>
                    <button class="tactic-btn" style="font-size:0.5rem; flex:1; padding:3px;" onclick="window.SektorSporttasche.toggleStatus('${p.id}', 'onField')">MATCH</button>
                </div>
            </div>`;
    },

    toggleStatus(id, key) {
        const p = window.Database.players.find(x => x.id == id);
        if (p) {
            p[key] = !p[key];
            window.Database.save();
            this.render();
            // Update der Arena-Visualisierung
            if(window.Arena) window.Arena.draw();
        }
    },

    openAddModal(team) {
        const modal = document.getElementById('player-edit-modal');
        const form = document.getElementById('modal-form-content');
        if(!modal || !form) return;
        
        modal.classList.remove('hidden');
        form.innerHTML = `
            <h3 style="color:#39FF14; font-size:0.9rem; margin-bottom:20px; font-family:'Orbitron';">NEUZUGANG: ${team.toUpperCase()}</h3>
            <input type="text" id="add-name" placeholder="Vor- und Nachname" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; border-radius:5px; margin-bottom:15px; font-family:'Orbitron';">
            <button class="pro-btn-gold" style="width:100%;" onclick="window.SektorSporttasche.addPlayer('${team}')">SPIELER VERSIEGELN</button>
        `;
    },

    addPlayer(team) {
        const nameInput = document.getElementById('add-name');
        if (!nameInput || !nameInput.value) return;

        const newPlayer = {
            id: Date.now(),
            name: nameInput.value,
            team: (team === "Senioren") ? "Senioren" : "Jugend",
            jugend: (team !== "Senioren") ? team : "",
            rat: 75,
            pac: 70, sho: 70, pas: 70, dri: 70, def: 70, phy: 70,
            pos: "ST",
            number: "10",
            onField: false,
            onTraining: false,
            assignment: "Trainer",
            img: ""
        };

        window.Database.players.push(newPlayer);
        window.Database.save();
        document.getElementById('player-edit-modal').classList.add('hidden');
        this.render();
        if(window.Arena) window.Arena.draw();
    },

    saveData(id) {
        const p = window.Database.players.find(x => x.id == id);
        if (p) {
            p.name = document.getElementById('edit-name').value;
            p.number = document.getElementById('edit-number').value;
            p.pos = document.getElementById('edit-pos').value.toUpperCase();
            ['rat', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'].forEach(s => {
                p[s] = parseInt(document.getElementById('edit-' + s).value);
            });
            window.Database.save();
            document.getElementById('player-edit-modal').classList.add('hidden');
            this.render();
            if(window.Arena) window.Arena.draw();
        }
    },
    
    // ... restliche Funktionen (deletePlayer, triggerUpload etc.) bleiben wie gehabt
};
