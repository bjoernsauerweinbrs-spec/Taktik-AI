/**
 * =========================================
 * TONI 2.0 – BRIEFCASE MODULE (VISUAL)
 * Asset Library & Grid System
 * =========================================
 */
(function() {
    window.Aktentasche = {
        assets: [
            { id: 1, name: "4-3-3 Offensiv", type: "Taktik", icon: "📋" },
            { id: 2, name: "Sponsor: NeonEnergy", type: "Asset", icon: "🖼️" },
            { id: 3, name: "Match-Report #04", type: "Media", icon: "📄" },
            { id: 4, name: "Funinho 3vs3 Plan", type: "Taktik", icon: "⚽" },
            { id: 5, name: "Stadionzeitung V1", type: "Media", icon: "📰" }
        ],

        init() {
            console.log("💼 Aktentasche: Assets geladen.");
        },

        show() {
            const container = document.getElementById('module-briefcase');
            if (!container) return;

            container.innerHTML = `
                <div style="padding: 40px;">
                    <h2 style="color: var(--data-cyan); margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px;">Zentrale Aktentasche</h2>
                    <div class="asset-grid">
                        ${this.assets.map(asset => `
                            <div class="asset-card" onclick="alert('Asset geladen: ${asset.name}')">
                                <div class="asset-icon">${asset.icon}</div>
                                <div class="asset-label">${asset.name}</div>
                                <div class="asset-tag">${asset.type}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    };
})();
