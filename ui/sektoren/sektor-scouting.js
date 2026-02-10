/**
 * TONI 2.0 - SEKTOR SCOUTING (TALENT WATCH)
 * Fokus: Potential-Analyse & Entwicklungs-Notizen
 * Status: INITIAL-RELEASE 2026
 */
window.SektorScouting = {
    
    init() {
        if (!window.Database.scouting) {
            window.Database.scouting = [
                { id: 1, name: "Max Mustertalent", age: "15", team: "C-Jugend", potential: 88, notes: "Herausragende Übersicht, muss physisch zulegen." },
                { id: 2, name: "Leon Blitz", age: "14", team: "C-Jugend", potential: 82, notes: "Enormer Antritt, guter Abschluss." }
            ];
            if(window.Database.save) window.Database.save();
        }
    },

    open() {
        this.init();
        const content = document.getElementById('active-content');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        const scouts = window.Database.scouting || [];

        content.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(0, 209, 255, 0.3); padding-bottom:15px;">
                    <div>
                        <h2 style="color:var(--data-cyan); font-family:'Orbitron'; margin:0; font-size:1.2rem; letter-spacing:2px;">TALENT-SCOUTING</h2>
                        <span style="color:#666; font-size:0.7rem; text-transform:uppercase;">ACADEMY | FUTURE STARS MONITOR</span>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" style="font-size:0.65rem;" onclick="window.SektorScouting.addTalent()">+ NEUES TALENT</button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    ${scouts.map(s => `
                        <div class="mgmt-card" style="border-color: rgba(0,209,255,0.2); background: rgba(0,0,0,0.3); padding:20px; position:relative;">
                            <div style="position:absolute; top:15px; right:15px; text-align:right;">
                                <div style="color:var(--accent-gold); font-family:'Orbitron'; font-size:1rem; font-weight:900;">${s.potential}</div>
                                <div style="color:#444; font-size:0.5rem; letter-spacing:1px;">POTENTIAL</div>
                            </div>
                            
                            <div style="font-weight:bold; color:#fff; font-size:1rem; margin-bottom:5px;">${s.name.toUpperCase()}</div>
                            <div style="font-size:0.65rem; color:var(--data-cyan); font-family:'Orbitron'; margin-bottom:15px;">
                                ${s.age} JAHRE | ${s.team}
                            </div>
                            
                            <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:8px; border-left:2px solid var(--data-cyan); margin-bottom:15px;">
                                <p style="font-size:0.75rem; color:#aaa; margin:0; font-style:italic;">"${s.notes}"</p>
                            </div>

                            <div style="display:flex; gap:10px;">
                                <button class="tactic-btn" style="flex:1; font-size:0.6rem;" onclick="window.SektorScouting.editTalent(${s.id})">EDITIEREN</button>
                                <button class="tactic-btn" style="border-color:var(--status-error); color:var(--status-error); font-size:0.6rem;" onclick="window.SektorScouting.deleteTalent(${s.id})">LÖSCHEN</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top:30px; padding:20px; background:rgba(0, 209, 255, 0.05); border:1px dashed var(--data-cyan); border-radius:15px;">
                    <h4 style="color:var(--data-cyan); font-family:'Orbitron'; font-size:0.75rem; margin-bottom:10px;"><i class="fas fa-microscope"></i> TONI'S SCOUTING-FEEDBACK</h4>
                    <p style="font-size:0.8rem; color:#888; margin:0; line-height:1.5;">
                        "Coach, basierend auf den Potential-Werten ist besonders <b>${scouts[0]?.name || 'der Nachwuchs'}</b> ein Kandidat für ein Extra-Fördertraining im Bereich 'Umschaltspiel'. Ich behalte die Daten im Auge."
                    </p>
                </div>
            </div>
        `;
    },

    addTalent() {
        const name = prompt("Name des Talents:");
        if (!name) return;
        const team = prompt("Aktuelle Jugend (z.B. C-Jugend):", window.currentTeamContext || "");
        
        window.Database.scouting.push({
            id: Date.now(),
            name: name,
            age: "14",
            team: team,
            potential: 75,
            notes: "Neu im Fokus."
        });
        this.saveAndRender();
    },

    editTalent(id) {
        const talent = window.Database.scouting.find(t => t.id === id);
        if (talent) {
            const newNotes = prompt("Update Notizen:", talent.notes);
            const newPot = prompt("Update Potential (1-99):", talent.potential);
            if (newNotes !== null) talent.notes = newNotes;
            if (newPot !== null) talent.potential = parseInt(newPot);
            this.saveAndRender();
        }
    },

    deleteTalent(id) {
        if(confirm("Talent von der Beobachtungsliste entfernen?")) {
            window.Database.scouting = window.Database.scouting.filter(t => t.id !== id);
            this.saveAndRender();
        }
    },

    saveAndRender() {
        if(window.Database.save) window.Database.save();
        this.render();
    }
};
