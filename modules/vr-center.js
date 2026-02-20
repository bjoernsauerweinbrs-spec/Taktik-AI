const vrCenter = {
    launchVR: function() {
        addMessage("Toni", "Initialisiere Pro-Environment... WebXR wird gestartet.");
        const container = document.getElementById('vr-container');
        container.innerHTML = `
            <a-scene embedded xr-mode-ui="enabled: true" style="height:100%; width:100%;">
                <a-assets><img id="grass" src="https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/terrain/grasslight-big.jpg"></a-assets>
                <a-plane rotation="-90 0 0" width="100" height="100" src="#grass" repeat="10 10"></a-plane>
                <a-sky color="#87CEEB"></a-sky>
                <a-entity id="rig" position="0 0 5">
                    <a-camera look-controls><a-cursor color="var(--accent)"></a-cursor></a-camera>
                    <a-entity oculus-touch-controls="hand: right" ontriggerdown="vrCenter.handlePass()"></a-entity>
                </a-entity>
                <a-box id="mueller-3d" position="5 0 -15" color="red"></a-box>
            </a-scene>
        `;
    },

    evaluatePerformance: function(time, scanned) {
        let score = scanned ? 100 : 30;
        if (time > 2.5) score -= 20;
        const stats = {
            date: new Date().toLocaleString('de-DE'),
            time: time.toFixed(2),
            scanned: scanned,
            score: Math.max(0, score)
        };
        this.saveToLog(stats);
        addMessage("Toni", `--- VR ANALYSE ---`);
        addMessage("Toni", `Score: ${stats.score}/100 | Scanning: ${scanned?'✅':'❌'}`);
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
        if (log.length === 0) { logContainer.innerHTML = "<p>Keine Trainingsdaten.</p>"; return; }
        const avg = (log.reduce((acc, curr) => acc + curr.score, 0) / log.length).toFixed(0);
        logContainer.innerHTML = `<div style="color:var(--accent); font-weight:bold; font-size:18px; margin-bottom:15px;">Durchschnitt: ${avg}%</div>` + 
            log.reverse().slice(0, 8).map(e => `
                <div class="log-entry">
                    <span>${e.date.split(',')[0]}</span>
                    <b>${e.score}%</b>
                    <span>${e.scanned?'✅ Scan':'❌ Blind'}</span>
                </div>
            `).join('');
    },

    triggerDrill: function() {
        addMessage("Toni", "Drill-Modus aktiv! Scanning-Check läuft...");
        // Simulierte Simulation für Test am Desktop
        setTimeout(() => this.evaluatePerformance(1.8, Math.random() > 0.3), 2000);
    },

    handlePass: function() { addMessage("Toni", "Joystick-Pass registriert!"); }
};
window.addEventListener('load', () => vrCenter.renderLogbook());
