window.BriefcaseUI = {
    init: function() { this.renderTiles(); },
    toggle: function() {
        const el = document.getElementById('briefcase-overlay');
        el.style.display = (el.style.display === 'flex') ? 'none' : 'flex';
        this.renderTiles();
    },
    renderTiles: function() {
        const container = document.getElementById('active-content');
        const tiles = [
            { name: 'KABINE', icon: 'fa-tshirt', action: 'window.SektorSporttasche.render()' },
            { name: 'ANALYSE', icon: 'fa-microchip', action: 'window.SektorAnalyse.render()' },
            { name: 'BUSINESS', icon: 'fa-handshake', action: 'window.SektorManagement.render()' },
            { name: 'TRAINING', icon: 'fa-dumbbell', action: '' },
            { name: 'SCOUTING', icon: 'fa-search', action: '' },
            { name: 'TAKTIK', icon: 'fa-clipboard-list', action: '' },
            { name: 'STADION', icon: 'fa-newspaper', action: '' },
            { name: 'FITNESS', icon: 'fa-heartbeat', action: '' },
            { name: 'SETTINGS', icon: 'fa-cog', action: '' }
        ];
        container.innerHTML = `<div class="management-grid">` + 
            tiles.map(t => `<div class="mgmt-card" onclick="${t.action}">
                <i class="fas ${t.icon}"></i><h3>${t.name}</h3>
            </div>`).join('') + `</div>`;
    }
};
