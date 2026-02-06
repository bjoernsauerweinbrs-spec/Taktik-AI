window.BriefcaseUI = {
    init: function() { this.renderHome(); },
    toggle: function() {
        const el = document.getElementById('briefcase-overlay');
        const isVisible = el.style.display === 'flex';
        el.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) this.renderHome();
    },
    renderHome: function() {
        const container = document.getElementById('active-content');
        const sectors = [
            { id: 'kabine', name: 'KABINE', icon: 'fa-tshirt', action: 'window.SektorSporttasche.render()' },
            { id: 'analyse', name: 'ANALYSE', icon: 'fa-microchip', action: 'window.SektorAnalyse.render()' },
            { id: 'business', name: 'BUSINESS', icon: 'fa-handshake', action: 'window.SektorManagement.render()' },
            { id: 'training', name: 'TRAINING', icon: 'fa-dumbbell', action: '' },
            { id: 'scouting', name: 'SCOUTING', icon: 'fa-search', action: '' },
            { id: 'taktik', name: 'TAKTIK', icon: 'fa-clipboard-list', action: '' },
            { id: 'station', name: 'STADION', icon: 'fa-newspaper', action: '' },
            { id: 'fitness', name: 'FITNESS', icon: 'fa-heartbeat', action: '' },
            { id: 'archiv', name: 'ARCHIV', icon: 'fa-folder-open', action: '' }
        ];

        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <h2 style="color:var(--neon-green); margin:0;">ZENTRALE ARCHIV</h2>
                <button class="pro-btn-gold" style="width:auto; padding:5px 15px;" onclick="window.BriefcaseUI.toggle()">SCHLIESSEN X</button>
            </div>
            <div class="management-grid">
                ${sectors.map(s => `
                    <div class="mgmt-card" onclick="${s.action}">
                        <div class="card-header"><i class="fas ${s.icon}"></i> ${s.name}</div>
                        <p style="font-size:0.7rem; color:#888;">System-Sektor ${s.id.toUpperCase()} synchronisiert.</p>
                        <button class="pro-btn">ÖFFNEN</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
};
