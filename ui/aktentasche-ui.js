window.BriefcaseUI = {
    init: function() { this.showHome(); },
    toggle: function() {
        const el = document.getElementById('briefcase-overlay');
        el.style.display = (el.style.display === 'flex') ? 'none' : 'flex';
        if(el.style.display === 'flex') this.showHome();
    },
    showHome: function() {
        const container = document.getElementById('active-content');
        const tiles = [
            { name: 'KABINE', icon: 'fa-tshirt', action: 'window.SektorSporttasche.render()' },
            { name: 'ANALYSE', icon: 'fa-microchip', action: 'window.SektorAnalyse.render()' },
            { name: 'BUSINESS', icon: 'fa-handshake', action: 'window.SektorManagement.render()' },
            { name: 'TRAINING', icon: 'fa-dumbbell', action: 'alert("In Arbeit...")' },
            { name: 'SCOUTING', icon: 'fa-search', action: 'alert("In Arbeit...")' },
            { name: 'TAKTIK', icon: 'fa-clipboard-list', action: 'alert("In Arbeit...")' },
            { name: 'FITNESS', icon: 'fa-heartbeat', action: 'alert("In Arbeit...")' },
            { name: 'ARCHIV', icon: 'fa-folder-open', action: 'alert("In Arbeit...")' },
            { name: 'SETTINGS', icon: 'fa-cog', action: 'alert("In Arbeit...")' }
        ];

        container.innerHTML = `
            <div class="management-grid">
                ${tiles.map(t => `
                    <div class="mgmt-card" onclick="${t.action}">
                        <div class="card-header"><i class="fas ${t.icon}"></i> ${t.name}</div>
                        <p>Sektor öffnen...</p>
                        <button class="pro-btn">ÖFFNEN</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
};
