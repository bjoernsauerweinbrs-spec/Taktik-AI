const mgmt = {
    budget: 25000,
    journal: [
        { desc: "Startbudget", amount: 25000, type: "plus" }
    ],

    init: function() { this.render(); },

    render: function() {
        const container = document.getElementById('mgmt-content');
        if (!container) return;
        container.innerHTML = `
            <div class="management-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="mgmt-card">
                    <h3>Finanz-Journal</h3>
                    <div id="finance-log" style="height: 150px; overflow-y: auto; background: rgba(0,0,0,0.2); padding: 10px; font-size: 12px;">
                        ${this.journal.map(j => `<div style="color: ${j.type === 'plus' ? '#22c55e' : '#ef4444'}">${j.desc}: ${j.amount} €</div>`).join('')}
                    </div>
                    <div style="margin-top: 10px;">
                        <input type="text" id="fn-desc" placeholder="Zweck (z.B. Tickets)" style="width: 60%;">
                        <input type="number" id="fn-amount" placeholder="Betrag" style="width: 30%;">
                        <button onclick="mgmt.addEntry('plus')" style="background: #22c55e;">+</button>
                        <button onclick="mgmt.addEntry('minus')" style="background: #ef4444;">-</button>
                    </div>
                </div>
                <div class="mgmt-card">
                    <h3>Stadionzeitung</h3>
                    <button class="action-btn" onclick="mgmt.generateNews()">Zeitung generieren</button>
                    <div id="news-preview" style="background:white; color:black; margin-top:10px; padding:5px; font-size:10px;">...</div>
                </div>
            </div>
        `;
    },

    addEntry: function(type) {
        const desc = document.getElementById('fn-desc').value;
        const amount = parseInt(document.getElementById('fn-amount').value);
        if(!desc || !amount) return;
        this.journal.push({ desc, amount, type });
        this.budget = type === 'plus' ? this.budget + amount : this.budget - amount;
        this.render();
        addMessage("Toni", `Finanzen aktualisiert: ${desc} gebucht.`);
    }
};
window.addEventListener('load', () => mgmt.init());
