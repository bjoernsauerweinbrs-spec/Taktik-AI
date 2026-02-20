/* ==========================================================
   MANAGEMENT & REDAKTION MODUL - TONI 2.0 (UNGEKÜRZT)
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
        newsDraft: "Die Ära Toni 2.0 hat begonnen. Mit modernster VR-Technologie setzen wir neue Maßstäbe.",
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
                    <img src="${this.data.clubLogo}" style="width:60px; height:60px; object-fit:contain;">
                    <div style="flex:1;">
                        <input type="text" value="${this.data.clubName}" onchange="mgmt.data.clubName=this.value; mgmt.save()" style="font-size:20px; font-weight:900;">
                        <input type="text" value="${this.data.clubLogo}" onchange="mgmt.data.clubLogo=this.value; mgmt.save()" placeholder="Logo URL" style="font-size:12px;">
                    </div>
                </div>
            </div>

            <div class="mgmt-grid">
                <div class="mgmt-card">
                    <h3>💰 Budget-Planung</h3>
                    <div style="margin-bottom:15px;">
                        <h4 style="color:var(--accent)">Einnahmen</h4>
                        ${this.renderFinanceList('income')}
                    </div>
                    <div style="margin-bottom:15px;">
                        <h4 style="color:var(--danger)">Ausgaben</h4>
                        ${this.renderFinanceList('expenses')}
                    </div>
                    <div style="text-align:center; padding:15px; background:#0f172a; border-radius:10px;">
                        <h2 style="color:${saldo >= 0 ? 'var(--accent)' : 'var(--danger)'}">${saldo.toLocaleString()} €</h2>
                    </div>
                </div>

                <div class="mgmt-card">
                    <h3>🤝 Sponsoring-Partner</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        ${this.data.sponsors.map(s => `
                            <div style="background:#0f172a; padding:10px; border-radius:10px;">
                                <input type="text" value="${s.name}" onchange="mgmt.updateSponsor(${s.id}, 'name', this.value)" style="font-size:11px;">
                                <input type="text" value="${s.logo}" onchange="mgmt.updateSponsor(${s.id}, 'logo', this.value)" style="font-size:9px;">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="mgmt-card" style="border: 2px solid var(--accent);">
                <h2 style="color:var(--accent);">📰 Redaktions-Büro</h2>
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:30px;">
                    <textarea onchange="mgmt.data.newsDraft=this.value; mgmt.save()" style="height:150px;">${this.data.newsDraft}</textarea>
                    <div>
                        <select onchange="mgmt.data.newsSettings.pages=parseInt(this.value); mgmt.save()">
                            <option value="4" ${this.data.newsSettings.pages === 4 ? 'selected' : ''}>4 Seiten</option>
                            <option value="8" ${this.data.newsSettings.pages === 8 ? 'selected' : ''}>8 Seiten</option>
                            <option value="12" ${this.data.newsSettings.pages === 12 ? 'selected' : ''}>12 Seiten</option>
                        </select>
                        <button class="action-btn" style="width:100%; margin-top:20px;" onclick="newspaper.open()">ZEITUNG DRUCKEN</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderFinanceList: function(type) {
        return this.data[type].map(i => `
            <div style="display:flex; gap:8px; margin-bottom:5px;">
                <input type="text" value="${i.label}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'label', this.value)" style="flex:2;">
                <input type="number" value="${i.amount}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'amount', this.value)" style="flex:1;">
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
    }
};
window.addEventListener('load', () => mgmt.init());
