window.BriefcaseUI = {
    init: function() {
        this.showHome();
    },
    toggle: function() {
        const el = document.getElementById('briefcase-overlay');
        el.style.display = (el.style.display === 'flex') ? 'none' : 'flex';
        if(el.style.display === 'flex') this.showHome();
    },
    showHome: function() {
        const container = document.getElementById('active-content');
        document.getElementById('modal-title').innerText = "ZENTRALE ARCHIV";
        
        const tiles = [
            { name: 'KABINE', icon: 'fa-tshirt', action: 'window.SektorSporttasche.render()' },
            { name: 'ANALYSE', icon: 'fa-microchip', action: 'window.SektorAnalyse.render()' },
            { name: 'BUSINESS', icon: 'fa-handshake', action: 'window.SektorManagement.render()' },
            { name: 'TRAINING', icon: 'fa-dumbbell', action: 'alert("Trainingstools laden...")' },
            { name: 'SCOUTING', icon: 'fa-search', action: 'alert("Scouting-Datenbank...")' },
            { name: 'TAKTIK', icon: 'fa-clipboard-list', action: 'alert("Taktik-Vorlagen...")' },
            { name: 'FITNESS', icon: 'fa-heartbeat', action: 'alert("Vital-Logs...")' },
            { name: 'ARCHIV', icon: 'fa-folder-open', action: 'alert("Spiel-Archiv...")' },
            { name: 'SETTINGS', icon: 'fa-cog', action: 'alert("System-Konfiguration...")' }
        ];

        container.innerHTML = `
            <div class="management-grid">
                ${tiles.map(t => `
                    <div class="mgmt-card" onclick="${t.action}">
                        <div class="card-header"><i class="fas ${t.icon}"></i> ${t.name}</div>
                        <p>Sektor öffnen und Daten synchronisieren.</p>
                        <button class="pro-btn">ÖFFNEN</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
};
