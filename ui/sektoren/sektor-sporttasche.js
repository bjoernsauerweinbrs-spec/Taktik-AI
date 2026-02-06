window.SektorSporttasche = {
    render: function() {
        const container = document.getElementById('active-content');
        const players = window.ToniDB.getPlayers().filter(p => p.team === 'home');
        
        const starters = players.filter(p => p.isStarter);
        const bench = players.filter(p => !p.isStarter);

        container.innerHTML = `
            <div class="kabine-wrapper">
                <section class="kabine-section">
                    <h3 class="section-title"><i class="fas fa-star"></i> STARTELF (XI)</h3>
                    <div class="fifa-cards-grid">
                        ${starters.map(p => this.createFullCard(p)).join('')}
                    </div>
                </section>

                <section class="kabine-section">
                    <h3 class="section-title"><i class="fas fa-subway"></i> ERSATZBANK</h3>
                    <div class="fifa-cards-grid">
                        ${bench.map(p => this.createFullCard(p)).join('')}
                    </div>
                </section>
            </div>
        `;
    },

    createFullCard: function(p) {
        return `
            <div class="fifa-card-pro ${p.isPresent ? 'active' : 'inactive'}" onclick="window.SektorSporttasche.togglePresence('${p.id}', ${p.isPresent})">
                <div class="card-glow"></div>
                <div class="card-content">
                    <div class="top-row">
                        <div class="rating-box">
                            <span class="rat">${p.rat}</span>
                            <span class="pos">${p.pos}</span>
                            <span class="flag">${p.flag || '🏳️'}</span>
                        </div>
                        <div class="player-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                    <div class="name-box">${p.name.toUpperCase()}</div>
                    <div class="stats-grid">
                        <div class="stat"><span>PAC</span> <b>${p.stats?.PAC || '--'}</b></div>
                        <div class="stat"><span>SHO</span> <b>${p.stats?.SHO || '--'}</b></div>
                        <div class="stat"><span>PAS</span> <b>${p.stats?.PAS || '--'}</b></div>
                        <div class="stat"><span>DRI</span> <b>${p.stats?.DRI || '--'}</b></div>
                        <div class="stat"><span>DEF</span> <b>${p.stats?.DEF || '--'}</b></div>
                        <div class="stat"><span>PHY</span> <b>${p.stats?.PHY || '--'}</b></div>
                    </div>
                </div>
                <div class="card-status-label">${p.isPresent ? 'IM SPIEL' : 'BEREIT'}</div>
            </div>
        `;
    },

    togglePresence: function(id, currentStatus) {
        window.ToniDB.updatePlayer(id, { isPresent: !currentStatus });
        this.render();
    }
};
