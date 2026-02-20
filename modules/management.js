/* ==========================================================
   MANAGEMENT MODUL (Finanz-Board & Stadionzeitung)
   ========================================================== */
 
const mgmt = {
    // Datenstruktur für das Vereins-Management
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        income: [
            { id: 101, label: "Hauptsponsor (Trikot)", amount: 8000 },
            { id: 102, label: "Ticketverkäufe", amount: 1500 },
            { id: 103, label: "Mitgliedsbeiträge", amount: 3000 },
            { id: 104, label: "Catering / Grillstand", amount: 850 }
        ],
        expenses: [
            { id: 201, label: "Platzmiete & Pflege", amount: 600 },
            { id: 202, label: "Energie / Flutlicht", amount: 450 },
            { id: 203, label: "Verbandsabgaben", amount: 200 },
            { id: 204, label: "Marketing / Plakate", amount: 150 }
        ],
        planned: [
            { id: 301, label: "Neue Trainingsbälle", amount: 500 },
            { id: 302, label: "Ausrüstung Medizinkoffer", amount: 250 }
        ],
        newsDraft: "Sensationeller Trainingsauftakt! TONI AI analysiert die ersten VR-Daten..."
    },

    init: function() {
        this.render();
    },

    // Speichert den aktuellen Stand im LocalStorage
    save: function() {
        localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
        this.render();
    },

    render: function() {
        const container = document.getElementById('mgmt-content');
        if (!container) return;

        const totalIncome = this.data.income.reduce((sum, i) => sum + i.amount, 0);
        const totalExpenses = this.data.expenses.reduce((sum, i) => sum + i.amount, 0);
        const saldo = totalIncome - totalExpenses;

        container.innerHTML = `
            <div class="mgmt-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                
                <div class="mgmt-card" style="background:var(--card); padding:20px; border-radius:15px; border-top:5px solid var(--accent);">
                    <h3 style="margin-top:0; color:var(--accent);">Einnahmen & Sponsoring</h3>
                    <div class="mgmt-list">
                        ${this.renderRows(this.data.income, 'income')}
                    </div>
                    <button class="action-btn" style="width:100%; margin-top:10px; background:none; border:1px dashed var(--accent); color:var(--accent);" onclick="mgmt.addRow('income')">+ Position hinzufügen</button>
                    <div style="margin-top:15px; text-align:right; font-weight:bold;">Ist: ${totalIncome.toLocaleString()} €</div>
                </div>

                <div class="mgmt-card" style="background:var(--card); padding:20px; border-radius:15px; border-top:5px solid var(--danger);">
                    <h3 style="margin-top:0; color:var(--danger);">Ausgaben & Fixkosten</h3>
                    <div class="mgmt-list">
                        ${this.renderRows(this.data.expenses, 'expenses')}
                    </div>
                    <button class="action-btn" style="width:100%; margin-top:10px; background:none; border:1px dashed var(--danger); color:var(--danger);" onclick="mgmt.addRow('expenses')">+ Position hinzufügen</button>
                    <div style="margin-top:15px; text-align:right; font-weight:bold;">Ist: ${totalExpenses.toLocaleString()} €</div>
                </div>

                <div class="mgmt-card" style="grid-column: span 2; background:var(--card); padding:20px; border-radius:15px; border-top:5px solid var(--warning);">
                    <h3 style="margin-top:0; color:var(--warning);">Geplante Investitionen</h3>
                    <div class="mgmt-list" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        ${this.renderRows(this.data.planned, 'planned')}
                    </div>
                    <button class="action-btn" style="width:100%; margin-top:10px; background:none; border:1px dashed var(--warning); color:var(--warning);" onclick="mgmt.addRow('planned')">+ Neue Planung</button>
                </div>

                <div style="grid-column: span 2; background:#0f172a; padding:25px; border-radius:20px; text-align:center; border: 1px solid #334155;">
                    <span style="color:#94a3b8; font-size:14px;">Aktueller Finanz-Status</span>
                    <h2 style="margin:5px 0 0 0; color: ${saldo >= 0 ? 'var(--accent)' : 'var(--danger)'}; font-size:32px;">
                        ${saldo.toLocaleString()} €
                    </h2>
                </div>

                <div class="mgmt-card" style="grid-column: span 2;">
                    <h3>Redaktion Stadionzeitung</h3>
                    <p style="font-size:12px; color:#94a3b8; margin-bottom:10px;">Schreibe hier den Leitartikel. TONI integriert automatisch die Finanzdaten.</p>
                    <textarea id="news-editor-input" onchange="mgmt.updateDraft(this.value)" style="width:100%; height:100px; padding:15px; background:#0f172a; color:white; border-radius:10px; border:1px solid #334155; font-family:inherit;">${this.data.newsDraft}</textarea>
                    <button class="action-btn" style="margin-top:15px; width:auto; padding:10px 30px;" onclick="mgmt.generatePreview()">ZEITUNG DRUCKEN (VORSCHAU)</button>
                    
                    <div id="news-print-preview" style="display:none; background:#f0f0f0; color:#1a1a1a; padding:40px; margin-top:30px; border:8px double #333; font-family:'Times New Roman', serif; box-shadow: 20px 20px 0 rgba(0,0,0,0.2);">
                        </div>
                </div>
            </div>
        `;
    },

    renderRows: function(list, type) {
        return list.map((item, idx) => `
            <div style="display:flex; gap:8px; margin-bottom:8px; align-items:center;">
                <input type="text" value="${item.label}" onchange="mgmt.updateEntry('${type}', ${idx}, 'label', this.value)" style="flex:3; font-size:13px;">
                <input type="number" value="${item.amount}" onchange="mgmt.updateEntry('${type}', ${idx}, 'amount', this.value)" style="flex:1; font-size:13px;">
                <button onclick="mgmt.deleteRow('${type}', ${idx})" style="background:none; border:none; color:var(--danger); cursor:pointer;">✕</button>
            </div>
        `).join('');
    },

    updateEntry: function(type, idx, field, val) {
        this.data[type][idx][field] = field === 'amount' ? (parseInt(val) || 0) : val;
        this.save();
    },

    addRow: function(type) {
        this.data[type].push({ id: Date.now(), label: "Neue Position", amount: 0 });
        this.save();
    },

    deleteRow: function(type, idx) {
        this.data[type].splice(idx, 1);
        this.save();
    },

    updateDraft: function(val) {
        this.data.newsDraft = val;
        localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
    },

    generatePreview: function() {
        const preview = document.getElementById('news-print-preview');
        const sal = this.data.income.reduce((s,i)=>s+i.amount,0) - this.data.expenses.reduce((s,i)=>s+i.amount,0);
        preview.style.display = "block";
        preview.innerHTML = `
            <div style="text-align:center; border-bottom:3px solid #1a1a1a; margin-bottom:20px;">
                <h1 style="margin:0; font-size:48px; letter-spacing:-1px;">VEREINS-ECHO</h1>
                <div style="display:flex; justify-content:space-between; font-weight:bold; text-transform:uppercase; font-size:14px; padding:5px 0;">
                    <span>Ausgabe: ${new Date().toLocaleDateString()}</span>
                    <span>Preis: Gratis für Mitglieder</span>
                </div>
            </div>
            <h2 style="font-size:32px; line-height:1.1; margin-bottom:15px;">"${this.data.newsDraft.substring(0, 50)}..."</h2>
            <p style="font-size:18px; line-height:1.5; column-count:1;">${this.data.newsDraft}</p>
            <div style="margin-top:30px; padding:20px; border:2px solid #1a1a1a; background:rgba(0,0,0,0.05);">
                <h4 style="margin:0 0 10px 0;">Wirtschaftliche Analyse durch TONI AI:</h4>
                Der Verein plant aktuell mit einem Saldo von <b>${sal.toLocaleString()} €</b>. 
                Besonders hervorzuheben ist die Position "${this.data.income[0].label}".
            </div>
            <div style="margin-top:20px; text-align:center; border-top:1px solid #ccc; font-style:italic;">
                Gedruckt im TONI AI Management-Center
            </div>
        `;
        addMessage("Toni", "Stadionzeitung generiert. Das Layout wurde für den Druck optimiert.");
    }
};

window.addEventListener('load', () => mgmt.init());
