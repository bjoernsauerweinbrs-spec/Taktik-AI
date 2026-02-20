/* ==========================================================
   VR-CENTER MODUL (Meta Quest 3 Integration & Training)
   ========================================================== */

const vrCenter = {
    // Trainings-Konfiguration
    config: {
        stadiumSize: 100,
        difficulty: "Pro",
        isDrillActive: false,
        lastScanTime: 0
    },

    // 1. VR-UMGEBUNG STARTEN (Quest 3 Ready)
    launchVR: function() {
        addMessage("Toni", "Initialisiere High-Fidelity Stadion... WebXR wird gestartet. Bitte Quest-Controller bereithalten.");
        
        const container = document.getElementById('vr-container');
        if (!container) return;

        // Die komplette A-Frame Szene für das Stadion-Feeling
        container.innerHTML = `
            <a-scene embedded xr-mode-ui="enabled: true" style="height:100%; width:100%;">
                <a-assets>
                    <img id="grass-tex" src="https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/terrain/grasslight-big.jpg">
                    <img id="sky-tex" src="https://upload.wikimedia.org/wikipedia/commons/8/89/HDRI_Sky_Pano_01.jpg">
                </a-assets>

                <a-plane src="#grass-tex" rotation="-90 0 0" width="100" height="100" repeat="10 10"></a-plane>
                <a-sky src="#sky-tex"></a-sky>
                <a-ambient-light color="#bbb"></a-ambient-light>
                <a-directional-light color="#fff" intensity="0.6" position="-1 2 1"></a-directional-light>

                <a-box position="0 2.5 -48" width="7.32" height="5" depth="0.2" color="white"></a-box>
                <a-box position="0 2.5 48" width="7.32" height="5" depth="0.2" color="white"></a-box>

                <a-entity id="rig" position="0 0 5">
                    <a-camera id="player-cam" look-controls>
                        <a-cursor color="var(--accent)" fuse="false"></a-cursor>
                    </a-camera>
                    
                    <a-entity oculus-touch-controls="hand: left"></a-entity>
                    <a-entity oculus-touch-controls="hand: right" ontriggerdown="vrCenter.handlePassAction()"></a-entity>
                </a-entity>

                <a-entity id="target-mueller" position="5 0 -10">
                    <a-cylinder radius="0.5" height="1.8" color="#ef4444"></a-cylinder>
                    <a-text value="MUELLER" position="-0.5 2 0" scale="1.5 1.5 1.5" color="white"></a-text>
                </a-entity>
            </a-scene>
        `;
    },

    // 2. PASS-SPIEL & INTERAKTION
    handlePassAction: function() {
        if (!this.config.isDrillActive) return;

        // Prüfen, ob der Spieler vor dem Pass gescannt hat
        const cam = document.getElementById('player-cam');
        const rotation = cam.getAttribute('rotation');
        
        // Simulierter Scanning-Check: Hat sich der Kopf weit genug gedreht?
        const hasScanned = Math.abs(rotation.y) > 45;
        
        addMessage("Toni", "Pass-Signal empfangen! Verarbeite Ballabgabe...");
        this.evaluatePerformance(1.5, hasScanned);
        this.config.isDrillActive = false;
    },

    // 3. LEISTUNGS-EVALUATION (Scanning & Timing)
    evaluatePerformance: function(time, scanned) {
        let score = scanned ? 100 : 35;
        if (time > 2.0) score -= 15;
        
        const stats = {
            date: new Date().toLocaleString('de-DE'),
            time: time.toFixed(2),
            scanned: scanned,
            score: Math.max(0, score)
        };

        this.saveToLog(stats);

        let feedback = scanned 
            ? "Exzellente Übersicht! Schulterblick vor dem Pass erkannt." 
            : "Pass okay, aber du hast den Raum nicht gescannt (Blinder Pass).";

        addMessage("Toni", `--- VR ANALYSE ---`);
        addMessage("Toni", `Score: ${stats.score}/100 | Übersicht: ${scanned ? '✅' : '❌'}`);
        addMessage("Toni", `Coach-Hinweis: ${feedback}`);
    },

    // 4. LOGBUCH-STEUERUNG
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
        if (log.length === 0) {
            logContainer.innerHTML = "<p style='color:#94a3b8'>Noch keine Trainingsdaten im Speicher.</p>";
            return;
        }

        const avgScore = (log.reduce((acc, curr) => acc + curr.score, 0) / log.length).toFixed(0);

        logContainer.innerHTML = `
            <div style="background:rgba(34, 197, 94, 0.1); padding:15px; border-radius:10px; margin-bottom:15px; text-align:center;">
                <span style="display:block; font-size:12px; color:#94a3b8;">DURCHSCHNITTS-SCORE</span>
                <b style="font-size:24px; color:var(--accent);">${avgScore}%</b>
            </div>
            <div class="log-list" style="display:flex; flex-direction:column; gap:8px;">
                ${log.reverse().slice(0, 5).map(entry => `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; font-size:12px;">
                        <span>${entry.date.split(',')[0]}</span>
                        <b style="color:var(--accent)">${entry.score}%</b>
                        <span>${entry.scanned ? '✅ Scan' : '❌ Blind'}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // 5. ÜBUNG STARTEN (Trigger für Scanning-Test)
    triggerDrill: function() {
        this.config.isDrillActive = true;
        addMessage("Toni", "Übung: Scanning & Pass-Spiel startet. Sieh dich im Raum um und drücke den Trigger am rechten Controller für den Pass auf Müller!");
        
        // Visueller Effekt für Start (A-Frame Zugriff)
        const target = document.getElementById('target-mueller');
        if (target) {
            target.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dur: 500; dir: alternate; loop: 4');
        }
    }
};

// Logbuch beim Start direkt laden
window.addEventListener('load', () => vrCenter.renderLogbook());
