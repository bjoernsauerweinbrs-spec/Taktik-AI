/* --- MANAGEMENT MODUL (Finanz-Board & Stadionzeitung) --- */

const mgmt = {
    // Musterdaten: Diese können vom User direkt in der App geändert werden
    financeData: {
        income: [
            { id: 101, label: "Hauptsponsor (Trikot)", amount: 5000 },
            { id: 102, label: "Ticketverkauf (Heimspiel)", amount: 1200 },
            { id: 103, label: "Mitgliedsbeiträge", amount: 3500 },
            { id: 104, label: "Catering / Verkauf", amount: 850 }
        ],
        expenses: [
            { id: 201, label: "Trainingsanzüge (Team)", amount: 1500 },
            { id: 202, label: "Flutlicht & Strom", amount: 450 },
            { id: 203, label: "Schiedsrichterkosten", amount: 120 },
            { id: 204, label: "Verbandsabgaben", amount: 300 }
        ]
    },

    init: function() {
        // Lade gespeicherte Daten aus dem Speicher, falls vorhanden
        const saved = localStorage.getItem('toni_mgmt_data');
        if (saved) {
            this.financeData = JSON.parse(saved);
        }
        this.render();
    },

    // Speichert den aktuellen Stand lokal ab
    save: function() {
        localStorage.setItem('toni_mgmt_data', JSON.stringify(this.financeData));
        this.render();
    },

    render: function() {
        const container = document.getElementById('mgmt-content');
        if (!container) return;

        const totalIncome = this.financeData.income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = this.financeData.expenses.reduce((sum, item) => sum + item.amount, 0);
        const balance = totalIncome - totalExpenses;

        container.innerHTML = `
            <div class="mgmt-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                
                <div class="mgmt-card" style="background: #1e293b; padding: 20px; border-radius: 12px; border-top: 4px solid #22c55e;">
                    <h3 style="margin-top:0; color:#22c55e;">Einnahmen (Muster)</h3>
                    <div id="income-list">
                        ${this.renderList(this.financeData.income, 'income')}
                    </div>
                    <button onclick="mgmt.addItem('income')" style="background:none; border:1px dashed #22c55e; color:#22c55e; width:100%; padding:5px; margin-top:10px; cursor:pointer;">+ Position hinzufügen</button>
                    <div style="margin-top:15px; text-align:right; font-weight:bold;">Gesamt: ${totalIncome} €</div>
                </div>

                <div class="mgmt-card" style="background: #1e293b; padding: 20px; border-radius: 12px; border-top: 4px solid #ef4444;">
                    <h3 style="margin-top:0; color:#ef4444;">Ausgaben (Muster)</h3>
                    <div id="expense-list">
                        ${this.renderList(this.financeData.expenses, 'expenses')}
                    </div>
                    <button onclick="mgmt.addItem('expenses')" style="background:none; border:1px dashed #ef4444; color:#ef4444; width:100%; padding:5px; margin-top:10px; cursor:pointer;">+ Position hinzufügen</button>
                    <div style="margin-top:15px; text-align:right; font-weight:bold;">Gesamt: ${totalExpenses} €</div>
                </div>

                <div class="mgmt-card" style="grid-column: span 2; display: flex; justify-content: space-between; align-items: center; background: #0f172a; border: 1px solid #334155;">
                    <div>
                        <span style="color:#94a3b8;">Aktueller Saldo:</span>
                        <h2 style="margin:0; color: ${balance >= 0 ? '#22c55e' : '#ef4444'}">${balance.toLocaleString()} €</h2>
                    </div>
                    <div style="text-align: right;">
                        <button class="action-btn" style="width:auto; padding: 10px 20px;" onclick="mgmt.generateNews()">Stadionzeitung generieren</button>
                    </div>
                </div>
                
                <div id="news-output" style="grid-column: span 2; display:none; background:white; color:black; padding:20px; font-family:'Times New Roman'; border: 1px solid #ddd;">
                    </div>
            </div>
        `;
    },

    // Erstellt die editierbaren Zeilen
    renderList: function(list, type) {
        return list.map((item, index) => `
            <div style="display: flex; gap: 10px; margin-bottom: 8px; align-items: center;">
                <input type="text" value="${item.label}" 
                    onchange="mgmt.updateItem('${type}', ${index}, 'label', this.value)" 
                    style="flex: 2; background: #0f172a; color: white; border: 1px solid #334155; padding: 5px; border-radius: 4px;">
                <input type="number" value="${item.amount}" 
                    onchange="mgmt.updateItem('${type}', ${index}, 'amount', this.value)" 
                    style="flex: 1; background: #0f172a; color: white; border: 1px solid #334155; padding: 5px; border-radius: 4px;">
                <button onclick="mgmt.deleteItem('${type}', ${index})" style="background:none; border:none; color:#ef4444; cursor:pointer;">✕</button>
            </div>
        `).join('');
    },

    updateItem: function(type, index, field, value) {
        if (field === 'amount') value = parseInt(value) || 0;
        this.financeData[type][index][field] = value;
        this.save();
    },

    addItem: function(type) {
        this.financeData[type].push({ id: Date.now(), label: "Neue Position", amount: 0 });
        this.save();
    },

    deleteItem: function(type, index) {
        this.financeData[type].splice(index, 1);
        this.save();
    },

    generateNews: function() {
        const output = document.getElementById('news-output');
        const balance = this.financeData.income.reduce((sum, item) => sum + item.amount, 0) - this.financeData.expenses.reduce((sum, item) => sum + item.amount, 0);
        
        output.style.display = "block";
        output.innerHTML = `
            <div style="text-align:center; border-bottom: 2px solid black; margin-bottom: 10px;">
                <h1 style="margin:0">VEREINS-ECHO</h1>
                <small>Ausgabe vom ${new Date().toLocaleDateString()}</small>
            </div>
            <h3>Finanzbericht: Verein steht auf ${balance >= 0 ? 'solidem Fundament' : 'wackligen Beinen'}</h3>
            <p>Nach der neuesten Analyse von TONI AI beträgt der aktuelle Saldo ${balance} €. 
               Besonders die Position "${this.financeData.income[0].label}" sticht hervor.</p>
            <p style="text-align:right;"><i>Cheftrainer-Analyse Ende.</i></p>
        `;
        addMessage("Toni", "Stadionzeitung wurde basierend auf deinen Finanzdaten erstellt.");
    }
};

window.addEventListener('load', () => mgmt.init());
