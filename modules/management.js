/* ==========================================================
   MANAGEMENT & REDAKTION - TONI 2.0 (UNGEKÜRZT)
   ========================================================== */
 
const mgmt = {
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        clubName: "FC TONI 2.0 ELITE",
        clubLogo: "https://cdn-icons-png.flaticon.com/512/1165/1165187.png",
        income: [
            { id: 1, label: "Hauptsponsor CyberFit", amount: 12000 },
            { id: 2, label: "Ticket-Einnahmen", amount: 4500 }
        ],
        expenses: [
            { id: 3, label: "Platzmiete & Energie", amount: 1200 },
            { id: 4, label: "Ausrüstung & Bälle", amount: 850 }
        ],
        sponsors: [
            { id: 1, name: "CyberFit Wearables", logo: "https://via.placeholder.com/150x80?text=CyberFit" },
            { id: 2, name: "Elite Energy Drink", logo: "https://via.placeholder.com/150x80?text=EliteEnergy" }
        ],
        newsDraft: "Die Ära Toni 2.0 hat begonnen. Mit modernster VR-Technologie und kognitiver Analyse setzen wir neue Maßstäbe im Amateurfußball.",
        newsSettings: { pages: 4 }
    },

    init: function() { this.render(); },

    save: function() {
        localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
        this.render();
    },

    render: function() {
        const container = document.getElementById('mgmt-content');
        if (!container) return;

        const totalIncome = this.data.income.reduce((s, i) => s + i.amount, 0);
        const totalExpenses = this.data.expenses.reduce((s, i) => s + i.amount, 0);
        const saldo = totalIncome - totalExpenses;

        container.innerHTML = `
            <div class="mgmt-card" style="border-top: 5px solid var(--accent);">
                <div style="display:flex; gap:20px; align-items:center;">
                    <div style="width:70px; height:70px; background:rgba(0,0,0,0.2); border-radius:12px; padding:10px;">
                        <img src="${this.data.clubLogo}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <div style="flex:1;">
                        <input type="text" value="${this.data.clubName}" onchange="mgmt.data.clubName=this.value; mgmt.save()" style="font-size:22px; font-weight:900; background:none; border:none; color:white;">
                        <input type="text" value="${this.data.clubLogo}" onchange="mgmt.data.clubLogo=this.value; mgmt.save()" placeholder="Logo URL" style="font-size:11px; margin-top:5px; opacity:0.6;">
                    </div>
                </div>
            </div>

            <div class="mgmt-grid">
                <div class="mgmt-card">
                    <h3 style="display:flex; align-items:center; gap:10px;">💰 Budget-Zentrale</h3>
                    <div style="margin-bottom:15px; border-bottom: 1px solid #334155; padding-bottom:15px;">
                        <h4 style="color:var(--accent); font-size:12px; text-transform:uppercase;">Einnahmen</h4>
                        ${this.renderFinanceList('income')}
                    </div>
                    <div>
                        <h4 style="color:var(--danger); font-size:12px; text-transform:uppercase;">Ausgaben</h4>
                        ${this.renderFinanceList('expenses')}
                    </div>
                    <div style="text-align:center; padding:15px; background:rgba(0,0,0,0.3); border-radius:12px; margin-top:20px;">
                        <span style="font-size:11px; opacity:0.6;">AKTUELLER SALDO</span>
                        <h2 style="margin:5px 0; color:${saldo >= 0 ? 'var(--accent)' : 'var(--danger)'}; font-size:28px;">${saldo.toLocaleString()} €</h2>
                    </div>
                </div>

                <div class="mgmt-card">
                    <h3>🤝 Elite-Partnerschaften</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                        ${this.data.sponsors.map(s => `
                            <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; border:1px solid #334155;">
                                <input type="text" value="${s.name}" onchange="mgmt.updateSponsor(${s.id}, 'name', this.value)" style="font-size:12px; font-weight:bold; margin-bottom:8px;">
                                <input type="text" value="${s.logo}" onchange="mgmt.updateSponsor(${s.id}, 'logo', this.value)" placeholder="Logo URL" style="font-size:10px; opacity:0.5;">
                            </div>
                        `).join('')}
                    </div>
                    <button class="action-btn" style="width:100%; margin-top:20px; font-size:12px; background:none; border:1px dashed var(--accent); color:var(--accent);" onclick="mgmt.addSponsor()">+ NEUEN PARTNER HINZUFÜGEN</button>
                </div>
            </div>

            <div class="redaktion-panel" style="margin-top:30px;">
                <div class="redaktion-header">
                    <h2 style="color:var(--accent); margin:0; display:flex; align-items:center; gap:12px;">📰 TONI 2.0 REDAKTIONS-BÜRO</h2>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span style="font-size:12px; opacity:0.6;">MAGAZIN-FORMAT:</span>
                        <select onchange="mgmt.data.newsSettings.pages=parseInt(this.value); mgmt.save()" style="background:var(--primary); color:white; border:1px solid var(--accent); padding:5px 15px; border-radius:8px;">
                            <option value="4" ${this.data.newsSettings.pages === 4 ? 'selected' : ''}>4 SEITEN (FALTHEFT)</option>
                            <option value="8" ${this.data.newsSettings.pages === 8 ? 'selected' : ''}>8 SEITEN (MAGAZIN)</option>
                            <option value="12" ${this.data.newsSettings.pages === 12 ? 'selected' : ''}>12 SEITEN (ELITE)</option>
                        </select>
                    </div>
                </div>
                
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:40px;">
                    <div>
                        <label style="display:block; margin-bottom:10px; font-size:13px; font-weight:bold; color:var(--accent);">HAUPT-LEITARTIKEL (TITELSEITE)</label>
                        <textarea onchange="mgmt.data.newsDraft=this.value; mgmt.save()" style="width:100%; height:180px; background:var(--primary); color:white; border:1px solid #334155; padding:20px; border-radius:15px; font-family:inherit; line-height:1.6; font-size:15px;">${this.data.newsDraft}</textarea>
                    </div>
                    <div style="display:flex; flex-direction:column; justify-content:space-between;">
                        <div style="background:rgba(255,255,255,0.02); padding:20px; border-radius:15px; border:1px solid #334155;">
                            <h4 style="margin:0 0 15px 0; font-size:14px;">DRUCK-VORSCHAU</h4>
                            <div style="font-size:12px; color:var(--text-muted); line-height:1.8;">
                                <div style="display:flex; justify-content:space-between;"><span>Format:</span><span style="color:white;">A4 Quer (A5 Heft)</span></div>
                                <div style="display:flex; justify-content:space-between;"><span>Inhalt:</span><span style="color:white;">Taktik, Bio, Kader</span></div>
                                <div style="display:flex; justify-content:space-between;"><span>Bilder:</span><span style="color:white;">Fussball-Muster</span></div>
                            </div>
                        </div>
                        <button class="action-btn" style="width:100%; padding:20px; font-size:16px; box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);" onclick="newspaper.open()">
                            <span style="margin-right:10px;">🖨️</span> ZEITUNG GENERIEREN & DRUCKEN
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderFinanceList: function(type) {
        return this.data[type].map(i => `
            <div style="display:flex; gap:10px; margin-bottom:8px; align-items:center;">
                <input type="text" value="${i.label}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'label', this.value)" style="flex:3; font-size:13px; background:rgba(0,0,0,0.2);">
                <input type="number" value="${i.amount}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'amount', this.value)" style="flex:1; font-size:13px; background:rgba(0,0,0,0.2); text-align:right;">
                <span style="color:var(--text-muted); font-size:12px;">€</span>
            </div>
        `).join('');
    },

    updateFinance: function(type, id, field, val) {
        const item = this.data[type].find(i => i.id === id);
        if(item) { item[field] = field === 'amount' ? parseInt(val) || 0 : val; this.save(); }
    },

    updateSponsor: function(id, field, val) {
        const s = this.data.sponsors.find(x => x.id === id);
        if(s) { s[field] = val; this.save(); }
    },

    addSponsor: function() {
        this.data.sponsors.push({ id: Date.now(), name: "NEUER PARTNER", logo: "" });
        this.save();
    }
};

window.addEventListener('load', () => mgmt.init());
