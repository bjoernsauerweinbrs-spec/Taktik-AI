/**
 * TONI 2.0 - SEKTOR MATERIAL (LAGER & LOGISTIK)
 * Fokus: Bestandsaufnahme von Equipment, Medizin & Trikots.
 */
window.SektorMaterial = {
    // Standard-Inventar (wird später in der Database gespeichert)
    inventory: [
        { id: 1, name: "Trikotsatz (Heim)", status: "Vollständig", count: 18, category: "Textil" },
        { id: 2, name: "Trainingsbälle (Gr. 5)", status: "Prüfen", count: 22, category: "Equipment" },
        { id: 3, name: "Sani-Koffer (Erste Hilfe)", status: "Ablauf prüfen", count: 2, category: "Medizin" },
        { id: 4, name: "Markierungshauben", status: "Vollständig", count: 50, category: "Training" }
    ],

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Layout-Schutz gegen Clipping
        content.style.paddingBottom = "120px";
        content.style.overflowY = "auto";

        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--data-cyan); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--data-cyan); letter-spacing: 2px;">LAGER-VERWALTUNG</h2>
                    <span style="color: var(--text-dim); font-size: 0.75rem;">MATERIAL & LOGISTIK | ${window.coachInfo.verein || 'VEREIN'}</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="pro-btn-gold" style="font-size:0.7rem;" onclick="window.SektorMaterial.addItem()">+ NEUES MATERIAL</button>
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="management-grid" style="display: grid; grid-template-columns: 1fr; gap: 20px;">
                <div style="background: rgba(255,255,255,0.02); border-radius: 15px; border: 1px solid #333; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                        <thead>
                            <tr style="background: rgba(0, 209, 255, 0.1); color: var(--data-cyan);">
                                <th style="padding: 15px;">MATERIAL</th>
                                <th style="padding: 15px;">KATEGORIE</th>
                                <th style="padding: 15px;">ANZ.</th>
                                <th style="padding: 15px;">STATUS</th>
                                <th style="padding: 15px; text-align:right;">AKTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.inventory.map(item => `
                                <tr style="border-bottom: 1px solid #222;">
                                    <td style="padding: 15px; font-weight: bold;">${item.name}</td>
                                    <td style="padding: 15px; color: #888;">${item.category}</td>
                                    <td style="padding: 15px;">${item.count}</td>
                                    <td style="padding: 15px;">
                                        <span style="color: ${item.status === 'Vollständig' ? 'var(--neon-green)' : 'var(--accent-orange)'}">
                                            ● ${item.status}
                                        </span>
                                    </td>
                                    <td style="padding: 15px; text-align:right;">
                                        <button class="tactic-btn" style="padding: 5px 10px; font-size:0.6rem;" onclick="window.SektorMaterial.editItem(${item.id})">EDIT</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="background: rgba(57, 255, 20, 0.05); padding: 20px; border-radius: 15px; border: 1px dashed var(--neon-green);">
                    <h3 style="color: var(--neon-green); font-size: 0.9rem; margin-bottom: 10px;"><i class="fas fa-box-open"></i> TONI'S INVENTUR-TIPP</h3>
                    <p style="font-size: 0.8rem; color: #ccc; line-height: 1.5;">
                        "Coach, vergiss nicht, den Sani-Koffer nach der Winterpause aufzufüllen. Nichts ist schlimmer als fehlendes Eisspray beim ersten Zweikampf!"
                    </p>
                </div>
            </div>
        `;
    },

    addItem() {
        const name = prompt("Bezeichnung des neuen Materials:");
        if (name) {
            this.inventory.push({
                id: Date.now(),
                name: name,
                status: "Neu",
                count: 0,
                category: "Unbekannt"
            });
            this.render();
        }
    },

    editItem(id) {
        const item = this.inventory.find(i => i.id === id);
        if (item) {
            const newCount = prompt(`Neue Anzahl für ${item.name}:`, item.count);
            if (newCount !== null) {
                item.count = parseInt(newCount);
                this.render();
            }
        }
    }
};
