/**
 * =========================================
 * TONI 2.0 – AKTENTASCHE (ASSET MANAGEMENT)
 * Bibliothek, Tagging & Versionierung
 * =========================================
 */
(function() {
    window.Aktentasche = {
        assets: [
            { id: 1, name: "Offensiv-Pressing 4-3-3", type: "Taktik", date: "2026-02-01", tag: "Taktik", version: "v2.1" },
            { id: 2, name: "Stadionzeitung - Ausgabe 04", type: "PDF", date: "2026-01-30", tag: "Media", version: "Final" },
            { id: 3, name: "Hauptsponsor Logo - HighRes", type: "Image", date: "2026-01-25", tag: "Sponsor", version: "v1.0" },
            { id: 4, name: "Standard-Situationen Eckball", type: "Taktik", date: "2026-02-02", tag: "Taktik", version: "Draft" }
        ],

        init() {
            console.log("💼 Aktentasche: System geladen.");
            this.renderLibrary();
        },

        // Schaltet zwischen Board und Aktentasche um
        toggleView(active = true) {
            const stage = document.getElementById('stage');
            const canvas = document.getElementById('main-canvas');
            const tools = document.querySelector('.tools-overlay');
            
            if (active) {
                canvas.style.display = 'none';
                tools.style.display = 'none';
                this.renderLibrary();
            } else {
                canvas.style.display = 'block';
                tools.style.display = 'flex';
                const lib = document.getElementById('asset-library');
                if (lib) lib.remove();
            }
        },

        renderLibrary() {
            let libraryContainer = document.getElementById('asset-library');
            if (!libraryContainer) {
                libraryContainer = document.createElement('div');
                libraryContainer.id = 'asset-library';
                document.getElementById('stage').appendChild(libraryContainer);
            }

            libraryContainer.innerHTML = `
                <div class="library-header">
                    <h2>Asset-Bibliothek</h2>
                    <input type="text" placeholder="Suche nach Taktiken, Tags oder Datum..." oninput="Aktentasche.filter(this.value)">
                </div>
                <div class="asset-grid" id="asset-grid">
                    ${this.assets.map(asset => this.createAssetCard(asset)).join('')}
                </div>
            `;
        },

        createAssetCard(asset) {
            const icon = asset.type === "Taktik" ? "📋" : asset.type === "PDF" ? "📄" : "🖼️";
            return `
                <div class="asset-card" onclick="Aktentasche.showDetails(${asset.id})">
                    <div class="asset-icon">${icon}</div>
                    <div class="asset-info">
                        <span class="asset-tag">${asset.tag}</span>
                        <h4>${asset.name}</h4>
                        <small>${asset.date} • ${asset.version}</small>
                    </div>
                </div>
            `;
        },

        showDetails(id) {
            const asset = this.assets.find(a => a.id === id);
            if (!asset) return;

            const sidebar = document.getElementById('setcard-content');
            sidebar.innerHTML = `
                <div class="asset-detail-view" style="animation: slideInRight 0.3s ease;">
                    <h3 style="color: #FF6A00; text-transform: uppercase;">Asset Details</h3>
                    <div style="background: #2E2E2E; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${asset.name}</p>
                        <p><strong>Typ:</strong> ${asset.type}</p>
                        <p><strong>Letzte Änderung:</strong> ${asset.date}</p>
                        <p><strong>Version:</strong> ${asset.version}</p>
                    </div>
                    <div class="action-group">
                        <button class="holo-button-small" onclick="alert('Asset geladen')">ÖFFNEN</button>
                        <button class="holo-button-small" onclick="alert('Teilen Link kopiert')">TEILEN</button>
                    </div>
                </div>
            `;
        },

        filter(query) {
            const filtered = this.assets.filter(a => 
                a.name.toLowerCase().includes(query.toLowerCase()) || 
                a.tag.toLowerCase().includes(query.toLowerCase())
            );
            const grid = document.getElementById('asset-grid');
            grid.innerHTML = filtered.map(asset => this.createAssetCard(asset)).join('');
        }
    };
})();
