/**
 * TONI 2.0 - SEKTOR MATERIAL (ELITE LOGISTICS HUB)
 * Fokus: Inventar-Präzision, Sponsoring-Link & Self-Healing
 * Status: MASTER-SYNC 2026
 */
window.SektorMaterial = {
    
    init() {
        // Self-Healing: Datenbank-Integrität prüfen
        if (!window.Database.inventory || !Array.isArray(window.Database.inventory)) {
            console.log("📦 Logistik-Hub: Initialisiere Bestands-System...");
            window.Database.inventory = [
                { id: 1, name: "Trikotsatz (Heim)", status: "Vollständig", count: 18, category: "Textil", provider: "Global Sports Tech" },
                { id: 2, name: "Trainingsbälle (Gr. 5)", status: "Prüfen", count: 22, category: "Equipment", provider: "Vereins-Budget" },
                { id: 3, name: "Sani-Koffer (Elite)", status: "Vollständig", count: 2, category: "Medizin", provider: "Regio-Drink" },
                { id: 4, name: "Hütchen-Set (Markierung)", status: "Vollständig", count: 50, category: "Training", provider: "Internal" }
            ];
            if(window.Database.save) window.Database.save();
        }
    },

    open() {
        this.init(); 
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Layout-Optimization
        content.style.paddingBottom = "100px";
        content.style.overflowY = "auto";

        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const inventory = window.Database.inventory || [];
        const verein = window.coachInfo?.verein || "DEIN VEREIN";
        const alerts = inventory.filter(i => i.status !== 'Vollständig').length;

        content.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom: 2px solid var(--data-cyan); padding-bottom:15px;">
                    <div>
                        <h2 style="color:var(--data-cyan); font-family:'Orbitron'; margin:0; font-size:1.1rem; letter-spacing:2px;">LAGER-LOGISTIK</h2>
                        <p style="color:#666; font-size:0.6rem; text-transform:uppercase; margin-top:4px;">${verein} | INVENTAR & BESTAND</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="pro-btn-gold" style="font-size:0.6rem;" onclick="window.SektorMaterial.addItem()">+ MATERIAL HINZUFÜGEN</button>
                        <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.2); border: 1px solid #333; border-radius: 12px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
                        <thead>
                            <tr style="background: rgba(0, 209, 255, 0.05); color: var(--data-cyan); font-family:'Orbitron'; font-size:0.6rem;">
                                <th style="padding: 15px;">POS. BEZEICHNUNG</th>
                                <th style="padding: 15px;">KATEGORIE</th>
                                <th style="padding: 15px;">BESTAND</th>
                                <th style="padding: 15px;">SPONSOR / QUELLE</th>
                                <th style="padding: 15px;">STATUS</th>
                                <th style="padding: 15px; text-align:right;">AKTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inventory.map(item => `
                                <tr style="border-bottom: 1px solid #111; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                                    <td style="padding: 15px; font-weight: 900; color: #fff;">${item.name.toUpperCase()}</td>
                                    <td style="padding: 15px; color: #555;">${item.category}</td>
                                    <td style="padding: 15px; font-family:'Orbitron'; color:var(--data-cyan);">${item.count}</td>
                                    <td style="padding: 15px; color: var(--accent-gold); font-size:0.7rem;">${item.provider || 'N/A'}</td>
                                    <td style="padding: 15px;">
                                        <span style="color: ${item.status === 'Vollständig' ? 'var(--neon-green)' : 'var(--status-error)'}; font-size:0.7rem; font-weight:bold;">
                                            ● ${item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style="padding: 15px; text-align:right;">
                                        <button class="tactic-btn" style="padding:4px 8px; font-size:0.6rem;" onclick="window.SektorMaterial.editItem(${item.id})">EDIT</button>
                                        <button onclick="window.SektorMaterial.deleteItem(${item.id})" style="background:none; border:none; color:#333; cursor:pointer; margin-left:10px;"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="margin-top:25px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="background: rgba(57, 255, 20, 0.03); padding: 20px; border-radius: 12px; border: 1px dashed ${alerts > 0 ? 'var(--status-error)' : 'var(--neon-green)'};">
                        <h4 style="color: var(--neon-green); font-size: 0.75rem; margin: 0 0 10px 0; font-family:'Orbitron';">TONI LOGISTIK-FEEDBACK</h4>
                        <p style="font-size: 0.75rem; color: #888; line-height: 1.5; margin:0;">
                            ${alerts > 0 ? 
                                `"Coach, wir haben ${alerts} kritische Bestände. Die Ausrüstung der <b>${window.currentTeamContext || 'Mannschaft'}</b> muss vor der nächsten Einheit geprüft werden."` : 
                                `"Material-Check abgeschlossen. Das Equipment ist im optimalen Zustand für das kommende Training."`}
                        </p>
                    </div>

                    <div style="background: rgba(212, 175, 55, 0.03); padding: 20px; border-radius: 12px; border: 1px dashed var(--accent-gold);">
                        <h4 style="color: var(--accent-gold); font-size: 0.75rem; margin: 0 0 10px 0; font-family:'Orbitron';">SPONSORING-POTENTIAL</h4>
                        <p style="font-size: 0.75rem; color: #888; line-height: 1.5; margin:0;">
                            Fehlendes Material kann direkt als "Sponsoring-Paket" für Partner wie <b>${window.Database.sponsors?.[0]?.name || 'Partner'}</b> ausgeschrieben werden.
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    addItem() {
        const name = prompt("Name des Materials (z.B. Trainingsleibchen):");
        if (!name) return;
        const category = prompt("Kategorie (Textil, Equipment, Medizin):", "Equipment");
        const provider = prompt("Sponsor / Quelle:", "Verein");
        
        window.Database.inventory.push({
            id: Date.now(),
            name: name,
            status: "Vollständig",
            count: 1,
            category: category,
            provider: provider
        });
        this.saveAndRender();
        if(window.ToniVoice) window.ToniVoice.speak(`${name} wurde dem Inventar hinzugefügt.`);
    },

    editItem(id) {
        const item = window.Database.inventory.find(i => i.id === id);
        if (item) {
            const count = prompt(`Bestand für ${item.name}:`, item.count);
            if (count !== null) {
                item.count = parseInt(count) || 0;
                item.status = item.count < 5 ? "Prüfen" : "Vollständig";
                this.saveAndRender();
            }
        }
    },

    deleteItem(id) {
        if(confirm("Material dauerhaft aus dem Lager entfernen?")) {
            window.Database.inventory = window.Database.inventory.filter(i => i.id !== id);
            this.saveAndRender();
        }
    },

    saveAndRender() {
        if(window.Database.save) window.Database.save();
        this.render();
    }
};
