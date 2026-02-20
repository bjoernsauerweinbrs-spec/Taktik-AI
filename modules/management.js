const mgmt = {
    finances: {
        income: [{ label: "Tickets", amount: 1500 }, { label: "Hauptsponsor", amount: 8000 }],
        expenses: [{ label: "Platzpflege", amount: 600 }, { label: "Ausrüstung", amount: 2000 }]
    },

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('mgmt-content');
        if (!container) return;

        const totalI = this.finances.income.reduce((s, i) => s + i.amount, 0);
        const totalE = this.finances.expenses.reduce((s, i) => s + i.amount, 0);

        container.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background:#1e293b; padding:20px; border-radius:12px; border-top:4px solid #22c55e;">
                    <h4>Einnahmen (editierbar)</h4>
                    ${this.renderTable(this.finances.income, 'income')}
                    <button onclick="mgmt.add('income')" style="width:100%; border:1px dashed #22c55e; background:none; color:#22c55e; margin-top:10px;">+ Position</button>
                </div>
                <div style="background:#1e293b; padding:20px; border-radius:12px; border-top:4px solid #ef4444;">
                    <h4>Ausgaben (editierbar)</h4>
                    ${this.renderTable(this.finances.expenses, 'expenses')}
                    <button onclick="mgmt.add('expenses')" style="width:100%; border:1px dashed #ef4444; background:none; color:#ef4444; margin-top:10px;">+ Position</button>
                </div>
            </div>
            <div style="background:#0f172a; padding:25px; margin-top:20px; border-radius:15px; border:1px solid #334155; text-align:center;">
                <h2 style="margin:0; color:${totalI-totalE >= 0 ? '#22c55e' : '#ef4444'}">Saldo: ${(totalI - totalE).toLocaleString()} €</h2>
                <button class="action-btn" onclick="mgmt.news()" style="margin-top:15px; width:auto; padding:10px 30px;">STADIONZEITUNG GENERIEREN</button>
            </div>
            <div id="news-paper" style="display:none; background:#f5f5f5; color:#222; padding:30px; margin-top:20px; font-family:serif; border: 5px double #333; box-shadow: 10px 10px 0 #999;"></div>
        `;
    },

    renderTable: function(data, type) {
        return data.map((item, idx) => `
            <div style="display:flex; gap:10px; margin-bottom:8px;">
                <input type="text" value="${item.label}" onchange="mgmt.upd('${type}',${idx},'label',this.value)" style="flex:2; background:#0f172a; border:1px solid #334155; color:white; padding:5px; border-radius:4px;">
                <input type="number" value="${item.amount}" onchange="mgmt.upd('${type}',${idx},'amount',this.value)" style="flex:1; background:#0f172a; border:1px solid #334155; color:white; padding:5px; border-radius:4px;">
            </div>
        `).join('');
    },

    upd: function(t, i, f, v) { this.finances[t][i][f] = f === 'amount' ? parseInt(v) : v; this.render(); },
    add: function(t) { this.finances[t].push({label: "Neu...", amount: 0}); this.render(); },
    news: function() {
        const p = document.getElementById('news-paper');
        p.style.display = "block";
        p.innerHTML = `<h1 style="text-align:center; border-bottom:2px solid #333;">VEREINS-ECHO</h1>
                       <h3>Exklusiv: TONI AI analysiert die Finanzen</h3>
                       <p>Heute wurde bekannt, dass der Verein mit einem Saldo von <b>${this.finances.income[0].amount - this.finances.expenses[0].amount}€</b> im Kernbereich plant. Chef-Trainer optimistisch!</p>`;
        addMessage("Toni", "Stadionzeitung ist im Druck!");
    }
};
window.addEventListener('load', () => mgmt.init());
