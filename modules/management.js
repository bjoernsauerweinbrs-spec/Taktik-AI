/* --- MANAGEMENT MODUL (Aktentasche v2.0) --- */

const mgmt = {
    budget: 25000,
    sponsors: [
        { name: "Global Sports", betrag: 12000, status: "Aktiv" },
        { name: "Local Health Co.", betrag: 5000, status: "Verhandlung" }
    ],

    init: function() {
        this.renderAll();
    },

    renderAll: function() {
        const container = document.getElementById('mgmt-content');
        if (!container) return;

        container.innerHTML = `
            <div class="management-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                
                <div class="mgmt-card" style="background: #1e293b; padding: 15px; border-radius: 10px; border: 1px solid #334155;">
                    <h3 style="color: #22c55e;">Sponsoring & Finanzen</h3>
                    <p>Aktuelles Budget: <b>${this.budget.toLocaleString()} €</b></p>
                    <div id="sponsor-list">
                        ${this.sponsors.map(s => `
                            <div style="font-size: 12px; background: rgba(0,0,0,0.2); padding: 8px; margin-bottom: 5px; border-radius: 5px; display: flex; justify-content: space-between;">
                                <span>${s.name}</span>
                                <span style="color: ${s.status === 'Aktiv' ? '#22c55e' : '#f59e0b'}">${s.betrag} € (${s.status})</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="action-btn" style="margin-top: 10px; font-size: 12px;" onclick="mgmt.addSponsor()">Sponsor akquirieren</button>
                </div>

                <div class="mgmt-card" style="background: #1e293b; padding: 15px; border-radius: 10px; border: 1px solid #334155;">
                    <h3 style="color: #22c55e;">Stadionzeitung</h3>
                    <p style="font-size: 12px; color: #94a3b8;">KI-basierte Analyse der letzten VR-Leistungen für die Fans.</p>
                    <div id="news-preview" style="background: white; color: black; padding: 10px; font-family: 'Times New Roman'; min-height: 80px; font-size: 11px; margin-bottom: 10px;">
                        <i>Warten auf Generierung...</i>
                    </div>
                    <button class="action-btn" style="background: #3b82f6;" onclick="mgmt.generateNews()">Zeitung drucken</button>
                </div>

                <div class="mgmt-card" style="grid-column: span 2; background: #1e293b; padding: 15px; border-radius: 10px; border: 1px solid #334155;">
                    <h3 style="color: #22c55e;">Analysezentrum (Upgrade)</h3>
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <div style="flex: 1; height: 10px; background: #0f172a; border-radius: 5px; overflow: hidden;">
                            <div style="width: 65%; height: 100%; background: #22c55e;"></div>
                        </div>
                        <span style="font-size: 12px;">Ausbaustufe: 2/3</span>
                        <button class="action-btn" style="width: auto; padding: 5px 15px;" onclick="mgmt.upgradeLab()">Ausbauen (8.000 €)</button>
                    </div>
                </div>
            </div>
        `;
    },

    generateNews: function() {
        const preview = document.getElementById('news-preview');
        const headline = "TRAININGSSENSATION: Toni AI analysiert Top-Scanningwerte!";
        preview.innerHTML = `<h4 style="margin:0">${headline}</h4><p>Coach zeigt in der VR-Umgebung überragende Übersicht...</p>`;
        addMessage("Toni", "Die Stadionzeitung wurde mit deinen aktuellen Leistungsdaten aktualisiert.");
    },

    addSponsor: function() {
        const n = prompt("Name des neuen Sponsors:");
        if(n) {
            this.sponsors.push({name: n, betrag: 2500, status: "Aktiv"});
            this.budget += 2500;
            this.renderAll();
            addMessage("Toni", "Glückwunsch! Ein neuer Sponsor unterstützt unser Projekt.");
        }
    },

    upgradeLab: function() {
        if(this.budget >= 8000) {
            this.budget -= 8000;
            addMessage("Toni", "Das Analysezentrum wurde erweitert. Die Datenpräzision im Bio-Lab steigt um 15%.");
            this.renderAll();
        } else {
            addMessage("Toni", "Budget nicht ausreichend für den Ausbau.");
        }
    }
};

// Initialisierung
window.addEventListener('load', () => mgmt.init());
