window.BriefcaseUI = {
    // Öffnet/Schließt die Aktentasche
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
        }
    },

    // Schaltet zwischen Sporttasche und Geschäftszimmer um
    async switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const target = document.getElementById('active-content');

        if (!nav || !content || !target) return;

        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            target.innerHTML = `
                <div class="squad-header">
                    <h3>👟 SPORTTASCHE // KADERPLANUNG</h3>
                    <p>Wähle einen Spieler aus, um ihn auf das Feld zu setzen.</p>
                </div>
                <div id="player-list-container" class="player-grid-view">
                    Lade Teamdaten...
                </div>
            `;
            await this.loadSquad();
        } else if (sektor === 'orga') {
            target.innerHTML = `
                <div class="squad-header">
                    <h3>🏢 GESCHÄFTSZIMMER</h3>
                    <p>Stadionzeitung und organisatorische Abläufe.</p>
                </div>
                <div class="orga-placeholder">System bereit für Redaktionsschluss.</div>
            `;
        }
    },

    // Lädt die players.sample.json und trennt Rot von Blau [cite: 2026-01-25]
    async loadSquad() {
        const container = document.getElementById('player-list-container');
        try {
            const resp = await fetch('data/players.sample.json');
            if (!resp.ok) throw new Error("Datei nicht gefunden");
            const data = await resp.json();
            
            let html = "";

            // DEIN TEAM (ROT) [cite: 2026-01-25]
            html += `<div class="team-section">
                        <h4 class="team-title red-accent">🔴 MEIN TEAM (HOME)</h4>
                        <div class="player-list">`;
            data.homeTeam.players.forEach(p => {
                html += `
                    <div class="player-card red-border" onclick="arena.addPlayer('${p.name}', 'red', '${p.position}')">
                        <span class="p-number">#${p.number}</span>
                        <span class="p-name">${p.name}</span>
                        <span class="p-pos">${p.position}</span>
                    </div>`;
            });
            html += `</div></div>`;

            // GEGNER (BLAU) [cite: 2026-01-25]
            html += `<div class="team-section">
                        <h4 class="team-title blue-accent">🔵 GEGNER (AWAY)</h4>
                        <div class="player-list">`;
            data.awayTeam.players.forEach(p => {
                html += `
                    <div class="player-card blue-border" onclick="arena.addPlayer('${p.name}', 'blue', '${p.position}')">
                        <span class="p-number">#${p.number}</span>
                        <span class="p-name">${p.name}</span>
                        <span class="p-pos">${p.position}</span>
                    </div>`;
            });
            html += `</div></div>`;

            container.innerHTML = html;
        } catch (e) {
            container.innerHTML = `<div class="error-msg">Fehler beim Laden des Kaders: data/players.sample.json fehlt oder ist fehlerhaft.</div>`;
            console.error(e);
        }
    },

    // Zurück zur Hauptübersicht der Aktentasche
    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
