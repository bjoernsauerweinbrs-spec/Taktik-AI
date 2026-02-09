/**
 * TONI 2.0 - SEKTOR JUNIOREN
 * Status: STABILISIERT & FUNINO-READY
 */
window.SektorJunioren = {
    currentYouth: null,
    currentCoach: "Coach Toni",

    open() {
        console.log("Sektor Junioren wird gestartet...");
        
        // 1. Erzwungener Sichtbarkeits-Fix für das Overlay
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.classList.remove('hidden');
        }

        // UI Elemente referenzieren
        const title = document.getElementById('sector-title');
        const content = document.getElementById('active-content');
        const briefcaseContent = document.getElementById('briefcase-content');

        if (!content || !briefcaseContent) {
            console.error("Kritischer Fehler: UI Container nicht gefunden!");
            return;
        }

        // Trainer-Abfrage (nur wenn noch kein Coach gesetzt wurde)
        if (this.currentCoach === "Coach Toni") {
            const coach = prompt("Welcher Trainer leitet die heutige Einheit?", this.currentCoach);
            if (coach) this.currentCoach = coach;
        }

        if(title) title.innerText = "JUNIOREN-ZENTRALE";
        
        // Hauptansicht rendern
        content.innerHTML = `
            <div style="text-align:center; margin-bottom:20px; border-bottom: 1px solid rgba(57,255,20,0.3); padding-bottom: 15px;">
                <p style="color:var(--neon-green); font-family: 'Orbitron'; letter-spacing: 2px;">
                    <i class="fas fa-user-shield"></i> AKTIVER TRAINER: ${this.currentCoach}
                </p>
            </div>
            
            <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                ${this.renderYouthButtons()}
            </div>

            <div id="youth-detail-view" style="margin-top: 30px; padding: 20px; background: rgba(57, 255, 20, 0.05); border: 1px solid rgba(57, 255, 20, 0.2); border-radius: 10px; display: none;">
                </div>
        `;
        
        briefcaseContent.classList.remove('hidden');
    },

    renderYouthButtons() {
        const teams = [
            { label: "G-Jugend", sub: "Bambini / Funino" },
            { label: "F-Jugend", sub: "U8 / U9" },
            { label: "E-Jugend", sub: "U10 / U11" },
            { label: "D-Jugend", sub: "U12 / U13" },
            { label: "C-Jugend", sub: "U14 / U15" },
            { label: "B-Jugend", sub: "U16 / U17" },
            { label: "A-Jugend", sub: "U18 / U19" }
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
        
        let actionButtons = `
            <button class="pro-btn" style="flex:1;" onclick="alert('Kader für ${team} wird geladen...')">KADER</button>
            <button class="pro-btn-gold" style="flex:1;" onclick="alert('YouTube-Suche für ${team} startet...')">VIDEOS</button>
        `;

        // Spezial-Button für Funino (G-Jugend)
        if(team === "G-Jugend") {
            actionButtons += `<button class="pro-btn" style="flex:1; border-color:var(--neon-green);" onclick="window.SektorJunioren.drawFuninoField()">ARENA-SETUP (4 TORE)</button>`;
        }

        detailView.innerHTML = `
            <h4 style="color: var(--neon-green); margin-top: 0;">FOKUS: ${team}</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                ${actionButtons}
            </div>
        `;
        
        console.log(`Team ausgewählt: ${team}`);
    },

    drawFuninoField() {
        if (!window.arena) {
            alert("Fehler: Arena-Engine nicht gefunden!");
            return;
        }

        // Tore auf dem Feld platzieren (Beispiel-Koordinaten)
        window.arena.clearEquipment('goal');
        
        // Vier Minitore für Funino
        const goals = [
            {x: 50, y: 100, type: 'mini'}, {x: 50, y: 300, type: 'mini'},
            {x: 750, y: 100, type: 'mini'}, {x: 750, y: 300, type: 'mini'}
        ];

        goals.forEach(g => {
            window.arena.addEquipment('goal', g.x, g.y);
        });

        alert("Funino-Spielfeld aktiviert! TONI hat die 4 Minitore platziert.");
        window.BriefcaseUI.toggle(); // Schließt die Tasche, um das Feld zu sehen
    }
};
