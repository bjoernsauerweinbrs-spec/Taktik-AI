/* ==========================================================
   MANAGEMENT MODUL - ELITE BÜRO (BUG-FREE)
   ========================================================== */

const mgmt = {
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        clubName: "FC TONI 2.0 ELITE",
        clubLogo: "https://cdn-icons-png.flaticon.com/512/1165/1165187.png",
        income: [{ id: 1, label: "Hauptsponsor", amount: 15000 }],
        expenses: [{ id: 4, label: "Miete", amount: 1200 }],
        sponsors: [{ id: 10, name: "CyberFit", logo: "" }],
        newsDraft: "Toni 2.0 ist bereit.",
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

        container.innerHTML = `
            <div class="mgmt-grid">
                <div class="mgmt-card">
                    <h2 style="color:var(--accent);">💰 Budget-Zentrale</h2>
                    <div class="budget-input-group">
                        <label>Einnahmen</label>
                        ${this.renderFinanceList('income', 'var(--accent)')}
                    </div>
                    <div class="budget-input-group">
                        <label>Ausgaben</label>
                        ${this.renderFinanceList('expenses', 'var(--danger)')}
                    </div>
                    <div style="background:rgba(34,197,94,0.1); padding:20px; border-radius:15px; text-align:center;">
                        <h1 style="color:var(--accent);">${(totalIncome - totalExpenses).toLocaleString()} €</h1>
                    </div>
                </div>

                <div class="mgmt-card" style="background:linear-gradient(135deg, #1e293b, #0f172a); border: 2px solid var(--accent);">
                    <h2 style="color:var(--accent);">🗞️ Zeitungs-Vorschau</h2>
                    <textarea onchange="mgmt.data.newsDraft=this.value; mgmt.save()" style="height:150px; background:rgba(0,0,0,0.3); color:white;">${this.data.newsDraft}</textarea>
                    <button class="action-btn" style="width:100%; margin-top:20px;" onclick="newspaper.open()">VORSCHAU ÖFFNEN</button>
                </div>
            </div>
        `;
    },

    renderFinanceList: function(type, color) {
        return this.data[type].map(i => `
            <div class="budget-row">
                <input type="text" value="${i.label}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'label', this.value)" style="flex:2; color:white !important;">
                <input type="number" value="${i.amount}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'amount', this.value)" style="flex:1; color:white !important; text-align:right;">
                <button onclick="mgmt.deleteFinanceRow('${type}', ${i.id})" style="color:var(--danger); background:none; border:none; cursor:pointer;">✕</button>
            </div>
        `).join('');
    },

    updateFinance: function(type, id, field, val) {
        const item = this.data[type].find(x => x.id === id);
        if (item) { item[field] = field === 'amount' ? parseInt(val) || 0 : val; localStorage.setItem('toni_mgmt', JSON.stringify(this.data)); }
    },

    deleteFinanceRow: function(type, id) {
        this.data[type] = this.data[type].filter(x => x.id !== id);
        this.save();
    }
};

window.addEventListener('load', () => mgmt.init());
