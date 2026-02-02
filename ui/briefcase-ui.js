window.BriefcaseUI = {
    toggle() {
        document.getElementById('briefcase-overlay').classList.toggle('hidden');
    },

    async switchSektor(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        const target = document.getElementById('active-content');

        if (sektor === 'sport') {
            target.innerHTML = "<h3>👟 SPORTTASCHE // TEAMLISTE</h3><div id='player-list'>Lade Kader...</div>";
            this.loadSquad();
        } else {
            target.innerHTML = "<h3>🏢 GESCHÄFTSZIMMER</h3><p>Organisatorische Daten bereit.</p>";
        }
    },

    async loadSquad() {
        try {
            // Lädt deine besprochene Teamliste [cite: 2026-01-24]
            const resp = await fetch('data/players.sample.json');
            const data = await resp.json();
            let html = "<ul style='list-style:none; padding:0; margin-top:20px;'>";
            data.players.forEach(p => {
                html += `<li style='padding:10px; border-bottom:1px solid #333; cursor:pointer;' onclick='arena.addPlayer("${p.name}", "red")'>
                            <b>#${p.number}</b> ${p.name} (${p.position})
                         </li>`;
            });
            html += "</ul>";
            document.getElementById('player-list').innerHTML = html;
        } catch (e) {
            document.getElementById('player-list').innerHTML = "Fehler beim Laden der players.sample.json";
        }
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
