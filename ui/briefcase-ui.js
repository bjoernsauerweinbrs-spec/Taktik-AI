window.BriefcaseUI = {
    toggle() {
        console.log("Trigger: Aktentasche");
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
        } else {
            alert("Fehler: Overlay-Element fehlt in der index.html!");
        }
    },

    async switchSektor(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const target = document.getElementById('active-content');
        
        nav.classList.add('hidden');
        content.classList.remove('hidden');

        if (sektor === 'sport') {
            this.renderAnalysisCenter();
        } else {
            target.innerHTML = "<h3>🏢 GESCHÄFTSZIMMER</h3><p>Bereit für Notizen.</p>";
        }
    },

    renderAnalysisCenter() {
        const target = document.getElementById('active-content');
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        let html = `<h3>📊 ANALYSEZENTRUM</h3><div class="player-grid-view">`;
        players.forEach(p => {
            html += `<div class="player-card" onclick="BriefcaseUI.openSetcard(${p.id})">${p.name} (#${p.number})</div>`;
        });
        html += `</div><button onclick="BriefcaseUI.backToNav()" class="back-btn">ZURÜCK</button>`;
        target.innerHTML = html;
    },

    backToNav() {
        document.getElementById('briefcase-nav').classList.remove('hidden');
        document.getElementById('briefcase-content').classList.add('hidden');
    }
};
