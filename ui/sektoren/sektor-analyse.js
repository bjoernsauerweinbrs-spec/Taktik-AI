// ui/sektoren/sektor-analyse.js
// SektorAnalyse: Performance-Labor mit Player-Selection, Live-Vitals und Warnungen

window.SektorAnalyse = {
    containerId: 'active-content',
    selectedPlayerId: null,

    init(containerId = 'active-content') {
        this.containerId = containerId;
        if (window.ToniEvents && typeof window.ToniEvents.on === 'function') {
            window.ToniEvents.on('players:updated', () => this.render());
        } else {
            console.warn('[SektorAnalyse] ToniEvents not available');
        }
        this.render();
    },

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('[SektorAnalyse] container not found:', this.containerId);
            return;
        }

        const players = (window.ToniDB && typeof window.ToniDB.getPlayers === 'function')
            ? window.ToniDB.getPlayers().filter(p => p.team === 'home')
            : [];

        // build player list and detail panel
        let html = `<div class="analyse-grid">
            <div class="player-list">
                <h2 style="color:var(--neon-green)">ANALYSE-LABOR</h2>
                <ul class="player-list-ul">`;
        players.forEach(p => {
            const activeClass = p.id === this.selectedPlayerId ? 'active' : '';
            html += `<li class="player-item ${activeClass}" data-player-id="${p.id}">
                        <strong>${p.name}</strong> <span class="meta">(${p.pos} | ${p.rat})</span>
                     </li>`;
        });
        html += `</ul></div><div class="player-detail"><h3>Spieler-Details</h3>`;

        const selected = players.find(p => p.id === this.selectedPlayerId) || players[0] || null;
        if (selected) {
            // ensure selectedPlayerId is set
            this.selectedPlayerId = selected.id;
            const pulse = selected.vitals?.pulse ?? 'N/A';
            const spo2 = selected.vitals?.spo2 ?? 'N/A';
            const warning = (typeof pulse === 'number' && pulse > 160) ? `<div class="warning" style="color:var(--status-error)">WARNUNG: Puls kritisch (${pulse})</div>` : '';
            html += `<div class="detail-block">
                        <p><strong>Name:</strong> ${selected.name}</p>
                        <p><strong>Position:</strong> ${selected.pos}</p>
                        <p><strong>Rating:</strong> ${selected.rat}</p>
                        <p><strong>Puls:</strong> ${pulse}</p>
                        <p><strong>SpO2:</strong> ${spo2}</p>
                        ${warning}
                     </div>`;
        } else {
            html += `<div class="detail-block"><p>Keine Spieler im Kader.</p></div>`;
        }

        html += `</div></div>`; // close grid

        container.innerHTML = html;

        // attach click handlers for player selection
        container.querySelectorAll('.player-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-player-id');
                if (id && id !== this.selectedPlayerId) {
                    this.selectedPlayerId = id;
                    this.render(); // re-render to show selected details
                }
            });
        });
    }
};
