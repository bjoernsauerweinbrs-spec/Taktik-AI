/* ==========================================================
   MANAGEMENT LAB | TRANSACTION ENGINE & INVENTORY
   ========================================================== */

const mgmt = {
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        clubName: "FC TONI 2.0 ELITE",
        budget: 250000,
        transactions: [
            { id: 1, type: 'IN', label: 'Sponsoring CyberFit', amount: 45000, date: '2026-02-15' },
            { id: 2, type: 'OUT', label: 'Wartung VR-Center', amount: 3200, date: '2026-02-18' }
        ],
        inventory: [
            { id: 'SKU-01', name: 'Kinesio-Tape', stock: 12, min: 20, unit: 'Rollen' },
            { id: 'SKU-02', name: 'Eisspray Pro', stock: 5, min: 10, unit: 'Dosen' },
            { id: 'SKU-03', name: 'GPS-Vesten', stock: 22, min: 18, unit: 'Stück' }
        ],
        sponsors: [
            { id: 10, name: "CyberFit Wearables", roi: 85, status: 'Active' },
            { id: 11, name: "Elite Energy", roi: 62, status: 'Pending' }
        ]
    },

    init: function() {
        this.render();
    },

    save: function() {
        localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
        this.render();
    },

    /**
     * TRANSACTION ENGINE
     */
    addTransaction: function(type, label, amount) {
        const t = { id: Date.now(), type, label, amount: parseInt(amount), date: new Date().toISOString().slice(0,10) };
        this.data.transactions.unshift(t);
        this.save();
    },

    /**
     * INVENTORY REORDER LOGIC
     */
    updateStock: function(id, delta) {
        const item = this.data.inventory.find(i => i.id === id);
        if (item) {
            item.stock += delta;
            if (item.stock < item.min) {
                addMessage("Toni", `ALERT: Lagerbestand ${item.name} kritisch! Bitte Nachbestellung einleiten.`);
            }
            this.save();
        }
    },

    /**
     * RENDERING THE LAB
     */
    render: function() {
        const container = document.getElementById('mgmt-content');
        if (!container) return;

        const totalIn = this.data.transactions.filter(t => t.type === 'IN').reduce((s, t) => s + t.amount, 0);
        const totalOut = this.data.transactions.filter(t => t.type === 'OUT').reduce((s, t) => s + t.amount, 0);
        const balance = totalIn - totalOut;

        container.innerHTML = `
            <div class="mgmt-grid">
                <div class="mgmt-card">
                    <h3 style="color:var(--accent-green)">Financial Matrix</h3>
                    <div style="font-size: 32px; font-weight: 900; margin: 20px 0;">${balance.toLocaleString()} €</div>
                    
                    <div class="transaction-list" style="height: 200px; overflow-y: auto;">
                        ${this.data.transactions.map(t => `
                            <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:12px;">
                                <span style="color:${t.type === 'IN' ? 'var(--accent-green)' : 'var(--danger)'}">${t.type === 'IN' ? '▲' : '▼'} ${t.label}</span>
                                <span>${t.amount.toLocaleString()} €</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="mgmt-card">
                    <h3 style="color:var(--accent-blue)">Lab Inventory</h3>
                    <div style="margin-top:20px;">
                        ${this.data.inventory.map(i => `
                            <div style="margin-bottom:15px; background:rgba(0,0,0,0.2); padding:10px; border-radius:10px; border-left: 4px solid ${i.stock < i.min ? 'var(--danger)' : 'var(--accent-green)'}">
                                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:bold;">
                                    <span>${i.name}</span>
                                    <span>${i.stock} / ${i.min} ${i.unit}</span>
                                </div>
                                <div style="height:4px; background:#334155; margin-top:8px; border-radius:2px;">
                                    <div style="width:${Math.min(100, (i.stock/i.min)*100)}%; height:100%; background:${i.stock < i.min ? 'var(--danger)' : 'var(--accent-green)'}"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
};

window.addEventListener('load', () => mgmt.init());
