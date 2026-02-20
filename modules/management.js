const mgmt = {
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        income: [{l: "Hauptsponsor", a: 8000}, {l: "Tickets", a: 1500}],
        expenses: [{l: "Platzpflege", a: 600}, {l: "Flutlicht", a: 450}],
        planned: [{l: "Ausrüstung", a: 1200}],
        newsDraft: "Cheftrainer optimistisch: Finanzen im Elite-Check!"
    },

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('mgmt-content');
        const sal = this.data.income.reduce((s,i)=>s+i.a,0) - this.data.expenses.reduce((s,i)=>s+i.a,0);
        
        container.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="mgmt-card" style="background:var(--card); padding:20px; border-radius:15px; border-top:5px solid var(--accent);">
                    <h4>Einnahmen (editierbar)</h4>
                    ${this.renderRows(this.data.income, 'income')}
                    <button onclick="mgmt.add('income')" style="width:100%; border:1px dashed var(--accent); background:none; color:var(--accent); cursor:pointer; padding:8px;">+ Position</button>
                </div>
                <div class="mgmt-card" style="background:var(--card); padding:20px; border-radius:15px; border-top:5px solid var(--danger);">
                    <h4>Fixkosten / Ausgaben</h4>
                    ${this.renderRows(this.data.expenses, 'expenses')}
                    <button onclick="mgmt.add('expenses')" style="width:100%; border:1px dashed var(--danger); background:none; color:var(--danger); cursor:pointer; padding:8px;">+ Position</button>
                </div>
                <div class="mgmt-card" style="grid-column: span 2; background:var(--card); padding:20px; border-radius:15px; border-top:5px solid var(--warning);">
                    <h4>Geplante Investitionen</h4>
                    ${this.renderRows(this.data.planned, 'planned')}
                    <button onclick="mgmt.add('planned')" style="width:100%; border:1px dashed var(--warning); background:none; color:var(--warning); cursor:pointer; padding:8px;">+ Planung hinzufügen</button>
                </div>
            </div>
            <div style="background:#0f172a; padding:30px; margin:25px 0; border-radius:20px; text-align:center; border: 1px solid #334155;">
                <h2 style="margin:0; color: ${sal>=0?'var(--accent)':'var(--danger)'}">Aktueller Saldo: ${sal.toLocaleString()} €</h2>
            </div>
            <div class="news-section" style="background:var(--card); padding:25px; border-radius:20px;">
                <h3>Redaktion Stadionzeitung</h3>
                <textarea id="news-draft" onchange="mgmt.updDraft(this.value)" style="width:100%; height:120px; background:#0f172a; color:white; padding:15px; border-radius:10px; border:1px solid #334155; box-sizing:border-box;">${this.data.newsDraft}</textarea>
                <button class="action-btn" onclick="mgmt.print()" style="margin-top:15px; width:auto; padding:12px 30px;">VORSCHAU GENERIEREN</button>
                <div id="news-preview" style="display:none; background:#f9f9f9; color:black; padding:40px; margin-top:20px; font-family:serif; border: 6px double #333; box-shadow: 15px 15px 0 rgba(0,0,0,0.3);"></div>
            </div>
        `;
    },

    renderRows: function(list, type) {
        return list.map((item, idx) => `
            <div style="display:flex; gap:8px; margin-bottom:10px;">
                <input type="text" value="${item.l}" onchange="mgmt.upd('${type}',${idx},'l',this.value)" style="flex:3;">
                <input type="number" value="${item.a}" onchange="mgmt.upd('${type}',${idx},'a',this.value)" style="flex:1;">
                <button onclick="mgmt.del('${type}',${idx})" style="background:none; border:none; color:var(--danger); cursor:pointer;">✕</button>
            </div>
        `).join('');
    },

    upd: function(t,i,f,v) { this.data[t][i][f] = f==='a'?parseInt(v):v; this.save(); },
    updDraft: function(v) { this.data.newsDraft = v; this.save(); },
    add: function(t) { this.data[t].push({l: "Neu", a:0}); this.save(); },
    del: function(t,i) { this.data[t].splice(i,1); this.save(); },
    save: function() { localStorage.setItem('toni_mgmt', JSON.stringify(this.data)); this.render(); },
    print: function() {
        const p = document.getElementById('news-preview'); p.style.display="block";
        const sal = this.data.income.reduce((s,i)=>s+i.a,0) - this.data.expenses.reduce((s,i)=>s+i.a,0);
        p.innerHTML = `<h1 style="text-align:center; border-bottom:4px solid black; margin-bottom:10px;">VEREINS-KURIER</h1>
                       <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:20px;"><span>${new Date().toLocaleDateString()}</span><span>Exklusiv-Bericht</span></div>
                       <p style="font-size:18px; line-height:1.6;">${this.data.newsDraft}</p>
                       <div style="margin-top:30px; border-top:1px solid #ccc; padding-top:10px;">
                       <b>Finanz-Update:</b> Aktueller Vereins-Saldo liegt bei ${sal}€. Toni AI rät zu ${sal>0?'Investitionen':'Einsparungen'}.</div>`;
        addMessage("Toni", "Stadionzeitung generiert. Vorschau bereit.");
    }
};
window.addEventListener('load', () => mgmt.init());
