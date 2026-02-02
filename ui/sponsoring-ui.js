/**
 * =========================================
 * TONI 2.0 – SPONSORING UI
 * Dashboard für Partner & Assets
 * =========================================
 */
(function() {
    window.Sponsoring = {
        partners: [
            { id: 1, name: "NeonEnergy", tier: "Premium", logo: "⚡", status: "Aktiv", budget: "85%" },
            { id: 2, name: "CyanBank", tier: "Hauptsponsor", logo: "🏦", status: "Review", budget: "100%" },
            { id: 3, name: "AeroGear", tier: "Supplier", logo: "👟", status: "Aktiv", budget: "40%" }
        ],

        show() {
            const container = document.getElementById('module-sponsoring');
            if (!container) return;

            container.innerHTML = `
                <div style="padding: 40px; animation: fadeIn 0.3s ease;">
                    <h2 style="color: var(--data-cyan); margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px;">Partner-Management</h2>
                    
                    <div class="sponsoring-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                        ${this.partners.map(p => `
                            <div class="sponsor-card" style="background: rgba(26, 34, 51, 0.6); border: 1px solid rgba(255,106,0,0.2); padding: 25px; border-radius: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                    <span style="font-size: 40px;">${p.logo}</span>
                                    <span style="font-size: 10px; background: rgba(0,209,255,0.1); color: var(--data-cyan); padding: 4px 10px; border-radius: 10px;">${p.tier}</span>
                                </div>
                                <h3 style="margin: 15px 0 5px 0;">${p.name}</h3>
                                <div style="font-size: 12px; color: #667085; margin-bottom: 20px;">Status: <span style="color: #28C76F;">${p.status}</span></div>
                                
                                <div style="height: 4px; background: #2E2E2E; border-radius: 2px; margin-bottom: 10px;">
                                    <div style="width: ${p.budget}; height: 100%; background: var(--accent-orange); border-radius: 2px;"></div>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 10px; color: #667085;">
                                    <span>Kontingent-Nutzung</span>
                                    <span>${p.budget}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    };
})();
