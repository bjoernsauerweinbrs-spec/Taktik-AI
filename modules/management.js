const mgmt = {
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        income: [{l: "Hauptsponsor", a: 8000}, {l: "Tickets", a: 1500}],
        expenses: [{l: "Platzpflege", a: 600}, {l: "Flutlicht", a: 450}],
        planned: [{l: "Neue Trikots", a: 1200}],
        newsDraft: "Cheftrainer analysiert die neue Saison..."
    },

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('mgmt-content');
        const sal = this.data.income.reduce((s,i)=>s+i.a,0) - this.data.expenses.reduce((s,i)=>s+i.a,0);
        
        container.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="mgmt-card" style="background:var(--card); padding:15px; border-radius:15px;">
                    <h4 style="color:var(--accent)">Einnahmen</h4>
                    ${this.renderRows(this.data.income, 'income')}
                    <button onclick="mgmt.add('income')">+ Einnahme</button>
                </div>
                <div class="mgmt-card" style="background:var(--card); padding:15px; border-radius:15px;">
                    <h4 style="color:var(--danger)">Ausgaben</h4>
                    ${this.renderRows(this.data.expenses, 'expenses')}
                    <button onclick="mgmt.add('expenses')">+ Ausgabe</button>
                </div>
            </div>
            <div style="background:#0f172a; padding:20px; border-radius:15px; text-align:center; margin:20px 0;">
                <h2>Aktueller Saldo: ${sal.toLocaleString()} €</h2>
            </div>
            <div class="news-section">
                <h3>Stadionzeitung Editor</h3>
                <textarea id="news-text" onchange="mgmt.data.newsDraft=this.value; mgmt.save()">${this.data.newsDraft}</textarea>
                <button class="action-btn" onclick="mgmt.generateNews()">VORSCHAU DRUCKEN</button>
                <div id="news-paper" style="display:none; background:white; color:black; padding:30px; margin-top:20px; font-family:serif; border:5px double #333;"></div>
            </div>
        `;
    },

    renderRows: function(list, type) {
        return list.map((item, idx) => `
            <div style="display:flex; gap:5px; margin-bottom:5px;">
                <input type="text" value="${item.l}" onchange="mgmt.upd('${type}',${idx},'l',this.value)">
                <input type="number" value="${item.a}" onchange="mgmt.upd('${type}',${idx},'a',this.value)">
                <button onclick="mgmt.del('${type}',${idx})">✕</button>
            </div>
        `).join('');
    },

    upd: function(t,i,f,v) { this.data[t][i][f] = f==='a'?parseInt(v):v; this.save(); },
    add: function(t) { this.data[t].push({l: "Neu", a:0}); this.save(); },
    del: function(t,i) { this.data[t].splice(i,1); this.save(); },
    save: function() { localStorage.setItem('toni_mgmt', JSON.stringify(this.data)); this.render(); },
    generateNews: function() {
        const p = document.getElementById('news-paper'); p.style.display="block";
        p.innerHTML = `<h1>VEREINS-KURIER</h1><hr><p>${this.data.newsDraft}</p><br><small>Finanz-Status: ${this.data.income.reduce((s,i)=>s+i.a,0)-this.data.expenses.reduce((s,i)=>s+i.a,0)}€</small>`;
    }
};
window.addEventListener('load', () => mgmt.init());
