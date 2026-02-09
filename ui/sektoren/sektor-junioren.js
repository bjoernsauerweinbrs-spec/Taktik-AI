/**
 * TONI 2.0 - SEKTOR JUNIOREN
 * Status: FINALISIERT & ROUTER-READY
 */
window.SektorJunioren = {
    currentYouth: null,
    currentCoach: "Coach Toni",

    open() {
        console.log("Sektor Junioren wird gestartet...");
        
        // UI Elemente referenzieren
        const title = document.getElementById('sector-title');
        const content = document.getElementById('active-content');
        const briefcaseContent = document.getElementById('briefcase-content');

        if (!content || !briefcaseContent) {
            console.error("Kritischer Fehler: UI Container nicht gefunden!");
            return;
        }

        // Trainer-Abfrage
        const coach = prompt("Welcher Trainer leitet die heutige Einheit?", this.currentCoach);
        if (coach) this.currentCoach = coach;

        if(title) title.innerText = "JUNIOREN-ZENTRALE";
        
        // Hauptansicht rendern
        content.innerHTML = `
            <div style="text-align:center; margin-bottom:20px; border-bottom: 1px solid rgba(57,255,20,0.3); padding-bottom: 15px;">
                <p style="color:var(--neon-green); font-family: 'Orbitron'; letter-spacing: 2px;">
                    <i class="fas fa-user-shield"></i> AKTIVER TRAINER: ${this.currentCoach}
                </p>
            </div>
            
            <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                ${this.renderYouthButtons()}
            </div>

            <div id="youth-detail-view" style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; display: none;">
                </div>
        `;
        
        briefcaseContent.classList.remove('hidden');
    },

    renderYouthButtons() {
        const teams = [
            { id: "G", label: "G-Jugend", sub: "Bambini / Funino" },
            { id: "F", label: "F-Jugend", sub: "U8 / U9" },
            { id: "E", label: "E-Jugend", sub: "U10 / U11" },
            { id: "D", label: "D-Jugend", sub: "U12 / U13" },
            { id: "C", label: "C-Jugend", sub: "U14 / U15" },
            { id: "B", label: "B-Jugend", sub: "U16 / U17" },
            { id: "A", label: "A-Jugend", sub: "U18 / U19" }
        ];

        return teams.map(t => `
            <div class="mgmt-card" onclick="window.SektorJunioren.selectTeam('${t.label}')" style="cursor:pointer; transition: 0.3s;">
                <div class="card-header"><i class="fas fa-graduation-cap"></i> ${t.label}</div>
                <p style="font-size: 0.7rem; color: #888;">${t.sub}</p>
            </div>
        `).join('');
    },

    selectTeam(team) {
        this.currentYouth = team;
        const detailView = document.getElementById('youth-detail-view');
        
        detailView.style.display = 'block';
        detailView.innerHTML = `
            <h4 style="color: var(--neon-green); margin-top: 0;">FOKUS: ${team}</h4>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="pro-btn" style="flex:1;" onclick="alert('Kader-Logik folgt...')">KADER ANZEIGEN</button>
                <button class="pro-btn-gold" style="flex:1;" onclick="alert('YouTube-Suche für ${team} startet...')">TRAININGS-VIDEOS</button>
            </div>
        `;
        
        console.log(`Team ausgewählt: ${team}`);
    }
};
