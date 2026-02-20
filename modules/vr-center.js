/* --- PRO VR-CENTER MODUL (Mit Leistungs-Logbuch) --- */

const vrCenter = {
    // ... (vorherige Variablen bleiben gleich)
    
    evaluatePerformance: function(time, scanned) {
        let score = scanned ? 100 : 30;
        if (time > 2.5) score -= 20;
        
        const stats = {
            date: new Date().toLocaleString('de-DE'),
            time: time.toFixed(2),
            scanned: scanned,
            score: Math.max(0, score)
        };

        // Daten im Logbuch speichern
        this.saveToLog(stats);

        let rating = scanned ? "SEHR GUT" : "VERBESSERUNGSFÄHIG";
        let feedback = scanned ? "Perfektes Scanning." : "Du hast den Schulterblick vergessen!";

        addMessage("Toni", `--- ANALYSE ---`);
        addMessage("Toni", `Score: ${stats.score}/100 | Scanning: ${scanned ? '✅' : '❌'}`);
        addMessage("Toni", `Coach-Hinweis: ${feedback}`);
    },

    saveToLog: function(stats) {
        let log = JSON.parse(localStorage.getItem('toni_vr_log')) || [];
        log.push(stats);
        // Wir behalten nur die letzten 50 Einheiten
        if (log.length > 50) log.shift(); 
        localStorage.setItem('toni_vr_log', JSON.stringify(log));
        this.renderLogbook();
    },

    renderLogbook: function() {
        const logContainer = document.getElementById('vr-logbook');
        if (!logContainer) return;

        let log = JSON.parse(localStorage.getItem('toni_vr_log')) || [];
        if (log.length === 0) {
            logContainer.innerHTML = "<p style='color:#94a3b8'>Noch keine Trainingsdaten vorhanden.</p>";
            return;
        }

        const avgScore = (log.reduce((acc, curr) => acc + curr.score, 0) / log.length).toFixed(0);

        logContainer.innerHTML = `
            <div class="log-summary">Durchschnitts-Leistung: ${avgScore}%</div>
            <div class="log-list">
                ${log.reverse().slice(0, 5).map(entry => `
                    <div class="log-entry">
                        <span>${entry.date.split(',')[0]}</span>
                        <span>Score: <b>${entry.score}</b></span>
                        <span>${entry.scanned ? '✅ Scan' : '❌ Blind'}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

// Initiales Laden des Logbuchs
window.addEventListener('load', () => vrCenter.renderLogbook());
