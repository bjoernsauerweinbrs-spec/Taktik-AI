/**
 * TONI 2.0 - SEKTOR MATERIAL (LAGER & LOGISTIK)
 * Fokus: Bestandsaufnahme von Equipment, Medizin & Trikots.
 * Status: DATABASE-SYNC AKTIVIERT
 */
window.SektorMaterial = {
    
    init() {
        // Lädt Bestand aus der Database oder nutzt Standardwerte
        if (!window.Database.inventory || window.Database.inventory.length === 0) {
            window.Database.inventory = [
                { id: 1, name: "Trikotsatz (Heim)", status: "Vollständig", count: 18, category: "Textil" },
                { id: 2, name: "Trainingsbälle (Gr. 5)", status: "Prüfen", count: 22, category: "Equipment" },
                { id: 3, name: "Sani-Koffer (Erste Hilfe)", status: "Ablauf prüfen", count: 2, category: "Medizin" },
                { id: 4, name: "Markierungshauben", status: "Vollständig", count: 50, category: "Training" }
            ];
            if(window.Database.save) window.Database.save();
        }
    },

    open() {
        this.init(); // Sicherstellen, dass Daten da sind
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Layout-Schutz gegen Clipping & Scroll-Fix
        content.style.paddingBottom = "150px";
        content.style.overflowY = "auto";

        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const inventory = window.Database.inventory;
        const verein = (window.coachInfo && window.coachInfo.verein) ? window.coachInfo.verein : "DEIN VEREIN";
        
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--data-cyan); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--data-cyan); letter-spacing: 2px; font-family:'Orbitron'; font-size:1.1rem;">LAGER-VERWALTUNG</h2>
                    <span style="color: #666; font-size: 0.7rem; text-transform: uppercase; letter-spacing:1px;">${verein} | LOGISTIK-HUB</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="pro-btn-gold" style="font-size:0.65rem; padding: 8px 12px;" onclick="window.SektorMaterial.addItem()">+ MATERIAL</button>
                    <button class="tactic-btn" style="font-size:0.65rem;" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div style="background: rgba(0,0,0,0.3); border-radius: 15px; border: 1px solid #222; overflow: hidden;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.8rem;">
                        <thead>
                            <tr style="background: rgba(0, 209, 255, 0.1); color: var(--data-cyan); font-family:'Orbitron';">
                                <th style="padding: 15px;">MATERIAL</th>
                                <th style="padding: 15px;">KATEGORIE</th>
                                <th style="padding: 15px;">ANZ.</th>
                                <th style="padding: 15px;">STATUS</th>
                                <th style="padding: 15px; text-align:right;">AKTION</th>
                            </tr>
                        </thead>
                        <tbody id="inventory-table-body">
                            ${inventory.map((item, index) => `
                                <tr style="border-bottom: 1px solid #111; transition: 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                                    <td style="padding: 15px; font-weight: 900; color: #fff;">${item.name.toUpperCase()}</td>
                                    <td style="padding: 15px; color: #666;">${item.category}</td>
                                    <td style="padding: 15px; font-family:'Orbitron'; color:var(--data-cyan);">${item.count}</td>
                                    <td style="padding: 15px;">
                                        <span style="display: flex; align-items: center; gap: 8px; color: ${item.status === 'Vollständig' ? 'var(--neon-green)' : 'var(--accent-orange)'}">
                                            <div style="width:6px; height:6px; border-radius:50%; background:currentColor; box-shadow: 0 0 8px currentColor;"></div>
                                            ${item.status}
                                        </span>
                                    </td>
                                    <td style="padding: 15px; text-align:right;">
                                        <button class="tactic-btn" style="padding: 5px 10px; font-size:0.6rem;" onclick="window.SektorMaterial.editItem(${item.id})">EDIT</button>
                                        <button onclick="window.SektorMaterial.deleteItem(${item.id})" style="background:none; border:none; color:#444; cursor:pointer; margin-left:10px;"><i class="fas fa-trash-alt"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style="margin-top:25px; background: rgba(57, 255, 20, 0.05); padding: 20px; border-radius: 15px; border: 1px dashed var(--neon-green);">
                <h3 style="color: var(--neon-green); font-size: 0.8rem; margin: 0 0 10px 0; font-family:'Orbitron';"><i class="fas fa-box-open"></i> TONI'S LOGISTIK-CHECK</h3>
                <p style="font-size: 0.75rem; color: #aaa; line-height: 1.6; margin:0;">
                    "Coach, für das nächste Training der <b>${window.currentTeamContext || 'Senioren'}</b> sind alle Trikotsätze einsatzbereit. Denke daran, die Bälle regelmäßig auf den richtigen Druck zu prüfen!"
                </p>
            </div>
        `;
    },

    addItem() {
        const name = prompt("Bezeichnung des neuen Materials:");
        if (!name) return;
        const category = prompt("Kategorie (z.B. Equipment, Medizin, Textil):", "Equipment");
        
        window.Database.inventory.push({
            id: Date.now(),
            name: name,
            status: "Neu",
            count: 0,
            category: category || "Diverses"
        });
        this.saveAndRender();
    },

    editItem(id) {
        const item = window.Database.inventory.find(i => i.id === id);
        if (item) {
            const newCount = prompt(`Neue Anzahl für ${item.name}:`, item.count);
            if (newCount !== null) {
                item.count = parseInt(newCount) || 0;
                const newStatus = prompt(`Status für ${item.name} (z.B. Vollständig, Prüfen):`, item.status);
                if (newStatus) item.status = newStatus;
                this.saveAndRender();
            }
        }
    },

    deleteItem(id) {
        if(confirm("Material dauerhaft aus der Liste löschen?")) {
            window.Database.inventory = window.Database.inventory.filter(i => i.id !== id);
            this.saveAndRender();
        }
    },

    saveAndRender() {
        if(window.Database.save) window.Database.save();
        this.render();
    }
};
