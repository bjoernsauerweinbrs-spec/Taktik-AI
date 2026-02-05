// ui/sektoren/sektor-sporttasche.js
// SektorSporttasche: reaktive Kabine-Ansicht mit Event-Subscription und sicheren Event-Handlern

window.SektorSporttasche = {
    init(containerId = 'active-content') {
        this.containerId = containerId;
        // subscribe to updates
        if (window.ToniEvents && typeof window.ToniEvents.on === 'function') {
            window.ToniEvents.on('players:updated', () => this.render());
        } else {
            console.warn('[SektorSporttasche] ToniEvents not available');
        }
        // initial render
        this.render();
    },

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('[SektorSporttasche] container not found:', this.containerId);
            return;
        }

        const players = (window.ToniDB && typeof window.ToniDB.getPlayers === 'function')
            ? window.ToniDB.getPlayers().filter(p => p.team === 'home')
            : [];

        let html = '<div class="grid">';
        players.forEach(p => {
            html += `<div class="card" data-player-id="${p.id}">
                <div class="card-header">
                    <h3 class="player-name">${p.name}</h3>
                    <div class="player-meta">${p.pos} | ${p.rat}</div>
                </div>
                <div class="card-body">
                    <div class="vitals">Puls: ${p.vitals?.pulse ?? 'N/A'} | SpO2: ${p.vitals?.spo2 ?? 'N/A'}</div>
                </div>
                <div class="card-footer">
                    <button class="presence-btn">${p.isPresent ? 'Anwesend' : 'Abwesend'}</button>
                </div>
            </div>`;
        });
        html += '</div>';

        container.innerHTML = html;

        // attach handlers (event delegation per card)
        container.querySelectorAll('.card').forEach(card => {
            const btn = card.querySelector('.presence-btn');
            if (!btn) return;
            btn.addEventListener('click', () => {
                const id = card.getAttribute('data-player-id');
                const current = window.ToniDB && window.ToniDB.getPlayers().find(x => x.id === id);
                if (current) {
                    window.ToniDB.updatePlayer(id, { isPresent: !current.isPresent });
                } else {
                    console.warn('[SektorSporttasche] player not found for toggle', id);
                }
            });
        });
    }
};
