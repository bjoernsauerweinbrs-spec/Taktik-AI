/* --- MANAGEMENT MODUL (AKTENTASCHE) --- */

const mgmt = {
    sponsors: [
        { name: "Lokale Pizzeria", beitrag: 500, typ: "Bande" },
        { name: "Auto-Haus Müller", beitrag: 2500, typ: "Trikot" }
    ],

    init: function() {
        this.renderSponsors();
        this.renderFinances();
    },

    renderSponsors: function() {
        const container = document.getElementById('sponsor-list');
        if (!container) return;
        container.innerHTML = this.sponsors.map(s => `
            <div style="background: rgba(255,255,255,0.05); padding: 10px; margin-bottom: 5px; border-radius: 5px; display: flex; justify-content: space-between;">
                <span><b>${s.name}</b> (${s.typ})</span>
                <span style="color: #22c55e;">+ ${s.beitrag}€</span>
            </div>
        `).join('');
    },

    renderFinances: function() {
        const container = document.getElementById('finance-stats');
        if (!container) return;
        const gesamt = this.sponsors.reduce((sum, s) => sum + s.beitrag, 0);
        container.innerHTML = `
            <div style="font-size: 20px; font-weight: bold; color: #22c55e;">Saldo: ${gesamt} €</div>
            <p style="font-size: 12px; color: #94a3b8;">Toni empfiehlt: Investiere 200€ in neue Hütchen.</p>
        `;
    },

    generateNewspaper: function() {
        addMessage("Toni", "Ich analysiere die letzten Spiele... Erstelle Layout für die Stadionzeitung... Fertig! Die PDF liegt in deiner Aktentasche.");
        document.getElementById('newspaper-status').innerText = "Status: Ausgabe 14 (Februar 2026) generiert!";
    },

    openSponsorDialog: function() {
        const name = prompt("Name des Sponsors:");
        if(name) {
            this.sponsors.push({ name: name, beitrag: 100, typ: "Kleinsponsor" });
            this.init();
            addMessage("Toni", `Neuer Sponsor ${name} wurde hinzugefügt. Das steigert unser Budget!`);
        }
    }
};

// Modul beim Laden registrieren
window.addEventListener('load', () => mgmt.init());
