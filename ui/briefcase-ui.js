window.BriefcaseUI = {
    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.toggle('hidden');
    },

    async switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const target = document.getElementById('active-content');

        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            target.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3>👟 SPORTTASCHE // KADER</h3>
                    <div style="display:flex; gap:10px;">
                        <button onclick="BriefcaseUI.exportData()" class="action-btn">💾 SICHERN</button>
                        <button onclick="document.getElementById('import-trigger').click()" class="action-btn">📂 LADEN</button>
                        <input type="file" id="import-trigger" hidden onchange="BriefcaseUI.importData(event)">
                    </div>
                </div>
                <div id="player-list-container">Lade Teamdaten...</div>
            `;
            await this.loadSquad();
        } else if (sektor === 'orga') {
            target.innerHTML = `
                <h3>🏢 GESCHÄFTSZIMMER</h3>
                <textarea id="stadion-notes" style="width:100%; height:300px; background:#080E1A; color:white; border:1px solid #333; padding:15px; border-radius:10px;" placeholder="Hier kannst du Texte für die Stadionzeitung oder Orga-Abläufe schreiben..."></textarea>
                <button onclick="BriefcaseUI.saveOrga()" style="margin-top:10px;" class="action-btn">NOTIZ SPEICHERN</button>
            `;
            const saved = localStorage.getItem('toni_orga_notes');
            if(saved) document.getElementById('stadion-notes').value = saved;
        }
    },

    async loadSquad() {
        const container = document.getElementById('player-list-container');
        try {
            const resp = await fetch('data/players.sample.json');
            const data = await resp.json();
            let html = "<div class='player-grid-view'>";

            // HOME TEAM (ROT)
            html += `<div class="team-section">
                        <h4 style="color:var(--red-team)">🔴 MEIN TEAM</h4>`;
            data.homeTeam.players.forEach(p => {
                html += `<div class="player-card red-border" onclick="arena.addPlayer('${p.name}', 'red', '${p.position}')">
                            <b>#${p.number}</b> ${p.name} <small>(${p.position})</small>
                         </div>`;
            });
            html += `</div>`;

            // AWAY TEAM (BLAU - Nur als Nummern/Platzhalter)
            html += `<div class="team-section">
                        <h4 style="color:var(--blue-team)">🔵 GEGNER</h4>`;
            data.awayTeam.players.forEach(p => {
                html += `<div class="player-card blue-border" onclick="arena.addPlayer('Gegner ${p.number}', 'blue', '${p.position}')">
                            <b>#${p.number}</b> Gegner <small>(${p.position})</small>
                         </div>`;
            });
            html += `</div></div>`;
            container.innerHTML = html;
        } catch (e) {
            container.innerHTML = "Fehler beim Laden der Kaderdaten.";
        }
    },

    saveOrga() {
        const text = document.getElementById('stadion-notes').value;
        localStorage.setItem('toni_orga_notes', text);
        alert("Notiz im Browser-Speicher gesichert!");
    },

    // EXPORT: Erzeugt eine JSON-Datei für deinen Mac
    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            board: window.arena.items,
            orga: localStorage.getItem('toni_orga_notes')
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Toni2.0_Taktik_${new Date().toLocaleDateString()}.json`;
        a.click();
    },

    // IMPORT: Lädt die Datei von deinem Mac hoch
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            if (data.board) {
                window.arena.items = data.board;
                window.arena.render();
            }
            if (data.orga) {
                localStorage.setItem('toni_orga_notes', data.orga);
            }
            alert("Taktik erfolgreich geladen!");
        };
        reader.readAsText(file);
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
