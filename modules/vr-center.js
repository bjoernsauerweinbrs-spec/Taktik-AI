const vrCenter = {
    isVRMode: false,
    
    launchVR: function() {
        this.isVRMode = true;
        addMessage("Toni", "Stadion wird geladen. WebXR aktiv.");
        const container = document.getElementById('vr-container');
        container.innerHTML = `<a-scene embedded style="height:350px;"><a-sky color="#87CEEB"></a-sky><a-plane rotation="-90 0 0" width="100" height="100" color="#22c55e"></a-plane><a-entity id="rig" position="0 0 5"><a-camera><a-cursor></a-cursor></a-camera></a-entity></a-scene>`;
    },

    evaluatePerformance: function(time, scanned) {
        let score = scanned ? 100 : 30;
        if (time > 2.5) score -= 20;
        const stats = { date: new Date().toLocaleString('de-DE'), time: time.toFixed(2), scanned, score: Math.max(0, score) };
        this.saveToLog(stats);
        addMessage("Toni", `ANALYSE: Score ${stats.score}/100 | Scanning: ${scanned ? '✅' : '❌'}`);
    },

    saveToLog: function(stats) {
        let log = JSON.parse(localStorage.getItem('toni_vr_log')) || [];
        log.push(stats);
        if (log.length > 50) log.shift(); 
        localStorage.setItem('toni_vr_log', JSON.stringify(log));
        this.renderLogbook();
    },

    renderLogbook: function() {
        const logContainer = document.getElementById('vr-logbook');
        if (!logContainer) return;
        let log = JSON.parse(localStorage.getItem('toni_vr_log')) || [];
        if (log.length === 0) { logContainer.innerHTML = "<p>Keine Daten.</p>"; return; }
        const avg = (log.reduce((acc, curr) => acc + curr.score, 0) / log.length).toFixed(0);
        logContainer.innerHTML = `<div style="color:var(--accent); font-weight:bold; margin-bottom:10px;">Avg: ${avg}%</div>` + 
            log.reverse().slice(0, 5).map(e => `<div class="log-entry"><span>${e.date.split(',')[0]}</span><b>${e.score}%</b></div>`).join('');
    },

    triggerDrill: function() {
        addMessage("Toni", "Drill startet! Müller geht steil!");
        setTimeout(() => this.evaluatePerformance(1.8, true), 3000); // Simulierte Auswertung
    }
};
window.addEventListener('load', () => vrCenter.renderLogbook());
