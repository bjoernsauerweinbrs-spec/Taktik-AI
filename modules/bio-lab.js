/* --- BIO-LAB MODUL (Gesundheit & Performance) --- */

const bioLab = {
    // Echtzeit-Simulationsdaten der Spieler
    playerHealth: [
        { id: 1, name: "Müller", hr: 62, oxygen: 98, sleep: 8.2, status: "fit" },
        { id: 2, name: "Schmidt", hr: 78, oxygen: 96, sleep: 5.4, status: "warning" },
        { id: 3, name: "Schneider", hr: 58, oxygen: 99, sleep: 7.8, status: "fit" },
        { id: 4, name: "Weber", hr: 92, oxygen: 94, sleep: 4.1, status: "danger" }
    ],

    init: function() {
        this.render();
        console.log("Bio-Lab: Daten-Synchronisation aktiv.");
    },

    render: function() {
        const container = document.getElementById('bio-lab-container');
        if (!container) return;

        container.innerHTML = this.playerHealth.map(p => `
            <div class="bio-card ${p.status}" onclick="bioLab.analyze('${p.name}')">
                <div class="bio-card-header">
                    <span class="p-name">${p.name}</span>
                    <span class="heart-icon">❤️</span>
                </div>
                
                <div class="ekg-container">
                    <svg viewBox="0 0 100 30" class="ekg-svg">
                        <path class="ekg-path" d="M0,15 L10,15 L15,5 L20,25 L25,15 L35,15 L40,10 L45,20 L50,15 L100,15" />
                    </svg>
                </div>

                <div class="bio-data-grid">
                    <div class="bio-stat">
                        <small>PULS</small>
                        <div class="val">${p.hr} <small>BPM</small></div>
                    </div>
                    <div class="bio-stat">
                        <small>SCHLAF</small>
                        <div class="val">${p.sleep} <small>h</small></div>
                    </div>
                    <div class="bio-stat">
                        <small>SPO2</small>
                        <div class="val">${p.oxygen} <small>%</small></div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    analyze: function(name) {
        const p = this.playerHealth.find(x => x.name === name);
        let msg = "";
        
        if(p.status === "fit") msg = `${name} ist in Top-Verfassung. Volle Belastung im Training möglich.`;
        if(p.status === "warning") msg = `Achtung: ${name} weist Schlafmangel auf. Belastung heute moderat halten.`;
        if(p.status === "danger") msg = `ALARM: Erhöhter Ruhepuls bei ${name}. Toni empfiehlt einen medizinischen Check-up!`;

        addMessage("Toni", `<b>Bio-Analyse:</b> ${msg}`);
    }
};

// Start des Moduls
window.addEventListener('load', () => bioLab.init());
