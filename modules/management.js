const mgmt = {
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        income: [{l: "Hauptsponsor", a: 8000}, {l: "Tickets", a: 1500}],
        expenses: [{l: "Ausrüstung", a: 2000}, {l: "Flutlicht", a: 450}],
        planned: [{l: "Neue Bälle", a: 500}],
        newsText: "Cheftrainer optimistisch nach Finanz-Check."
    },

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('mgmt-content');
        const sal = this.data.income.reduce((s,i)=>s+i.a,0) - this.data.expenses.reduce((s,i)=>s+i.a,0);
        
        container.innerHTML = `
            <div class="mgmt-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="mgmt-card">
                    <h4>Einnahmen & Sponsoren</h4>
                    ${this.renderTable(this.data.income, 'income')}
                    <button onclick="mgmt.add('income')">+ Position</button>
                </div>
                <div class="mgmt-card">
                    <h4>Fixkosten & Ausgaben</h4>
                    ${this.renderTable(this.data.expenses, 'expenses')}
                    <button onclick="mgmt.add('expenses')">+ Position</button>
                </div>
            </div>
            <div class="saldo-box" style="background:#0f172a; padding:20px; border-radius:15px; text-align:center; margin:20px 0;">
                <h2 style="color: ${sal>=0?'var(--accent)':'var(--danger)'}">Saldo: ${sal.toLocaleString()} €</h2>
            </div>
            <div class="news-editor">
                <h3>Redaktion Stadionzeitung</h3>
                <textarea id="news-edit" onchange="mgmt.data.newsText=this.value; mgmt.save()" style="width:100%; height:80px; background:#0f172a; color:white;">${this.data.newsText}</textarea>
                <button class="action-btn" onclick="mgmt.printNews()">Vorschau Stadionzeitung</button>
                <div id="news-preview" style="display:none; background:white; color:black; padding:30px; margin-top:20px; font-family:serif; border:5px double #333;"></div>
            </div>
        `;
    },

    renderTable: function(list, type) {
        return list.map((item, idx) => `
            <div style="display:flex; gap:5px; margin-bottom:5px;">
                <input type="text" value="${item.l}" onchange="mgmt.upd('${type}',${idx},'l',this.value)">
                <input type="number" value="${item.a}" onchange="mgmt.upd('${type}',${idx},'a',this.value)">
            </div>
        `).join('');
    },

    upd: function(t,i,f,v) { this.data[t][i][f] = f==='a'?parseInt(v):v; this.save(); },
    add: function(t) { this.data[t].push({l: "Neu", a:0}); this.save(); },
    save: function() { localStorage.setItem('toni_mgmt', JSON.stringify(this.data)); this.render(); },
    printNews: function() {
        const p = document.getElementById('news-preview'); p.style.display="block";
        p.innerHTML = `<h1>VEREINS-ECHO</h1><p>${this.data.newsText}</p><hr><h4>Saldo aktuell: ${this.data.income.reduce((s,i)=>s+i.a,0)-this.data.expenses.reduce((s,i)=>s+i.a,0)}€</h4>`;
    }
};
window.addEventListener('load', () => mgmt.init());
