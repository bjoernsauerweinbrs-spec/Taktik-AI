const mgmt = {
    init: function() {
        this.render();
    },
    render: function() {
        const container = document.getElementById('mgmt-content');
        if(!container) return;

        container.innerHTML = `
            <div class="mgmt-card">
                <h3>Sponsoring Portfolio</h3>
                <div class="stat-row"><span>Global Partner A</span> <strong>2.4 Mio €</strong></div>
                <div class="stat-row"><span>Equipment Sponsor</span> <strong>850k €</strong></div>
                <div class="progress-bar"><div style="width: 75%"></div></div>
                <p><small>Zielerreichung: 75% der Saison-Vorgabe</small></p>
            </div>
            <div class="mgmt-card">
                <h3>Infrastruktur-Investment (ROI)</h3>
                <p>Neues Analyse-Zentrum: <strong>-1.2 Mio €</strong></p>
                <p>Erwartete Reduktion Ausfalltage: <strong>-15%</strong></p>
                <button class="action-btn">INVESTITION BESTÄTIGEN</button>
            </div>
            <div class="mgmt-card">
                <h3>Marktwert-Entwicklung</h3>
                <canvas id="marketChart" height="100"></canvas>
            </div>
        `;
    }
};
