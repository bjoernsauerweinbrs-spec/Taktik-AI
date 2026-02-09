window.SektorJunioren = {
    currentYouth: null,
    currentCoach: null,

    open() {
        // Trainer-Abfrage beim Öffnen
        const coach = prompt("Welcher Trainer leitet die heutige Einheit?", "Coach Toni");
        if (coach) this.currentCoach = coach;

        const content = document.getElementById('active-content');
        document.getElementById('sector-title').innerText = "JUNIOREN-ZENTRALE";
        
        content.innerHTML = `
            <div style="text-align:center; margin-bottom:20px;">
                <p style="color:var(--neon-green)">Eingeloggt als: ${this.currentCoach}</p>
            </div>
            <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                ${this.renderYouthButtons()}
            </div>
        `;
        document.getElementById('briefcase-content').classList.remove('hidden');
    },

    renderYouthButtons() {
        const teams = ["G-Jugend", "F-Jugend", "E-Jugend", "D-Jugend", "C-Jugend", "B-Jugend", "A-Jugend"];
        return teams.map(t => `
            <div class="mgmt-card" onclick="window.SektorJunioren.selectTeam('${t}')">
                <div class="card-header"><i class="fas fa-graduation-cap"></i> ${t}</div>
                <p>Jahrgangswechsel & Kader</p>
            </div>
        `).join('');
    },

    selectTeam(team) {
        this.currentYouth = team;
        alert(`${team} ausgewählt. TONI bereitet das ${team}-Spielfeld vor...`);
        // Hier triggern wir später die Verwandlung der Arena
    }
};
