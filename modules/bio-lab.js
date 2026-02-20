/* --- BIO-LAB MODUL (Gesundheit & Leistung) --- */

const bioLab = {
    players: [
        { id: 1, name: "Müller", status: "fit", hr: 58, sleep: 8.5, stress: "low" },
        { id: 2, name: "Schmidt", status: "warning", hr: 72, sleep: 5.0, stress: "high" },
        { id: 3, name: "Schneider", status: "fit", hr: 60, sleep: 7.5, stress: "mid" },
        { id: 4, name: "Weber", status: "danger", hr: 85, sleep: 4.5, stress: "very high" }
    ],

    init: function() {
        this.renderLab();
        console.log("Bio-Lab initialisiert");
    },

    renderLab: function() {
        const container = document.getElementById('bio-lab-container');
        if (!container) return;

        container.innerHTML = this.players.map(p => `
            <div class="bio-card ${p.status}" onclick="bioLab.showDetails('${p.name}')">
                <div class="bio-card-header">
                    <span>${p.name}</span>
                    <div class="pulse-heart">❤️</div>
                </div>
                <div class="ekg-line">
                    <svg viewBox="0 0 100 30" class="ekg-svg">
                        <path d="M0 15 L10 15 L15 5 L20 25 L25 15 L100 15" class="path-${p.status}" />
                    </svg>
                </div>
                <div class="bio-stats">
                    <div class="b-stat"><span>Puls:</span> <b>${p.hr} BPM</b></div>
                    <div class="b-stat"><span>Schlaf:</span> <b>${p.sleep}h</b></div>
                </div>
            </div>
        `).join('');
    },

    showDetails: function(name) {
        const p = this.players.find(x => x.name === name);
        let advice = "Alles im grünen Bereich. Volle Belastung möglich.";
        if(p.status === 'warning') advice = "Erhöhtes Infektrisiko. Belastung reduzieren.";
        if(p.status === 'danger') advice = "STOPP! Sofortige Pause empfohlen. Herzfrequenz zu hoch.";
        
        addMessage("Toni", `<b>Labor-Analyse ${p.name}:</b> ${advice}`);
    }
};

// Start
window.addEventListener('load', () => bioLab.init());
