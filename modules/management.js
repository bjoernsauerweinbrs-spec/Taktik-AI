/* ==========================================================
   MANAGEMENT MODUL - ELITE BÜRO DESIGN (UNGEKÜRZT)
   ========================================================== */

const mgmt = {
    // 1. MUSTER-DATEN (Damit das Büro beim Start direkt "Elite" aussieht)
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        clubName: "FC TONI 2.0 ELITE",
        clubLogo: "https://cdn-icons-png.flaticon.com/512/1165/1165187.png",
        income: [
            { id: 1, label: "Hauptsponsor CyberFit", amount: 15000 },
            { id: 2, label: "Ticket-Einnahmen", amount: 4800 }
        ],
        expenses: [
            { id: 4, label: "Platzmiete & Infrastruktur", amount: 1400 },
            { id: 5, label: "Energie & Flutlicht", amount: 650 }
        ],
        sponsors: [
            { id: 10, name: "CyberFit Wearables", logo: "https://via.placeholder.com/150x80?text=CyberFit" },
            { id: 11, name: "Elite Energy Drink", logo: "https://via.placeholder.com/150x80?text=EliteEnergy" }
        ],
        newsDraft: "Die Ära Toni 2.0 hat begonnen. Mit modernster VR-Technologie setzen wir neue Maßstäbe.",
        newsSettings: { pages: 4 }
    },

    /**
     * INITIALISIERUNG
     */
    init: function() {
        this.render();
    },

    /**
     * SPEICHERN & PERSISTIEREN
     */
    save: function() {
        localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
        this.render();
    },

    /**
     * FINANZ-LOGIK: POSITION UPDATEN
     */
    updateFinance: function(type, id, field, val) {
        const list = this.data[type];
        const item = list.find(i => i.id === id);
        if (item) {
            item[field] = field === 'amount' ? (parseInt(val) || 0) : val;
            // Wir speichern hier nur im Hintergrund, damit der Fokus im Input bleibt
            localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
        }
    },

    /**
     * FINANZ-LOGIK: NEUE REIHE
     */
    addFinanceRow: function(type) {
        this.data[type].push({
            id: Date.now(),
            label: "Neue Position",
            amount: 0
        });
        this.save();
    },

    /**
     * FINANZ-LOGIK: REIHE LÖSCHEN
     */
    deleteFinanceRow: function(type, id) {
        this.data[type] = this.data[type].filter(i => i.id !== id);
        this.save();
    },

    /**
     * SPONSOREN UPDATEN
     */
    updateSponsor: function(id, field, val) {
        const s = this.data.sponsors.find(x => x.id === id);
        if (s) {
            s[field] = val;
            localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
        }
    },

    /**
     * DAS HAUPT-RENDERING FÜR DAS "ELITE BÜRO"
     */
    render: function() {
        const container = document.getElementById('mgmt-content');
        if (!container) return;

        const totalIncome = this.data.income.reduce((s, i) => s + i.amount, 0);
        const totalExpenses = this.data.expenses.reduce((s, i) => s + i.amount, 0);
        const saldo = totalIncome - totalExpenses;

        container.innerHTML = `
            <div class="mgmt-card" style="border-top: 6px solid var(--accent); margin-bottom:30px;">
                <div style="display:flex; gap:30px; align-items:center;">
                    <div style="width:80px; height:80px; background:rgba(0,0,0,0.3); border-radius:15px; padding:10px;">
                        <img src="${this.data.clubLogo}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <div style="flex:1;">
                        <input type="text" value="${this.data.clubName}" onchange="mgmt.data.clubName=this.value; mgmt.save()" 
                               style="font-size:24px; font-weight:900; background:none; border:none; color:white; width:100%;">
                        <input type="text" value="${this.data.clubLogo}" onchange="mgmt.data.clubLogo=this.value; mgmt.save()" 
                               placeholder="Logo URL" style="font-size:12px; margin-top:5px; opacity:0.5; background:none; border:none; color:white; width:100%;">
                    </div>
                </div>
            </div>

            <div class="mgmt-grid">
                
                <div class="mgmt-card">
                    <h2 style="color:var(--accent); margin:0 0 25px 0;">💰 Budget & Controlling</h2>
                    
                    <div class="budget-input-group">
                        <label>Einnahmen</label>
                        ${this.renderFinanceList('income', 'var(--accent)')}
                        <button onclick="mgmt.addFinanceRow('income')" style="background:none; border:1px dashed var(--accent); color:var(--accent); width:100%; padding:10px; border-radius:10px; cursor:pointer; margin-top:10px;">+ Hinzufügen</button>
                    </div>

                    <div class="budget-input-group">
                        <label>Ausgaben</label>
                        ${this.renderFinanceList('expenses', 'var(--danger)')}
                        <button onclick="mgmt.addFinanceRow('expenses')" style="background:none; border:1px dashed var(--danger); color:var(--danger); width:100%; padding:10px; border-radius:10px; cursor:pointer; margin-top:10px;">+ Hinzufügen</button>
                    </div>

                    <div style="margin-top:20px; padding:20px; background:rgba(34,197,94,0.1); border-radius:15px; border:1px solid var(--accent); text-align:center;">
                        <span style="font-size:12px; color:#94a3b8;">VERFÜGBARES BUDGET</span>
                        <h1 style="margin:5px 0; color:var(--accent); font-size:42px;">${saldo.toLocaleString()} €</h1>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:30px;">
                    
                    <div class="mgmt-card">
                        <h3 style="margin-top:0;">🤝 Sponsoring</h3>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            ${this.data.sponsors.map(s => `
                                <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:15px; border:1px solid rgba(255,255,255,0.1);">
                                    <input type="text" value="${s.name}" onchange="mgmt.updateSponsor(${s.id}, 'name', this.value)" style="font-size:12px; font-weight:bold; color:white; border:none; background:none; width:100%;">
                                    <input type="text" value="${s.logo}" onchange="mgmt.updateSponsor(${s.id}, 'logo', this.value)" placeholder="URL" style="font-size:10px; opacity:0.4; color:white; border:none; background:none; width:100%;">
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="redaktion-panel" style="margin-top:0; padding:25px;">
                        <h3 style="color:var(--accent); margin-top:0;">🗞️ Redaktion</h3>
                        <textarea onchange="mgmt.data.newsDraft=this.value; mgmt.save()" 
                                  style="width:100%; height:120px; background:rgba(0,0,0,0.2); color:white; border:1px solid #334155; padding:15px; border-radius:12px; font-family:inherit;">${this.data.newsDraft}</textarea>
                        
                        <div style="margin-top:20px; display:flex; gap:15px; align-items:center;">
                            <select onchange="mgmt.data.newsSettings.pages=parseInt(this.value); mgmt.save()" style="background:#0f172a; color:white; border:1px solid var(--accent); padding:10px; border-radius:8px;">
                                <option value="4" ${this.data.newsSettings.pages === 4 ? 'selected' : ''}>4 Seiten</option>
                                <option value="8" ${this.data.newsSettings.pages === 8 ? 'selected' : ''}>8 Seiten</option>
                                <option value="12" ${this.data.newsSettings.pages === 12 ? 'selected' : ''}>12 Seiten</option>
                            </select>
                            <button class="action-btn" style="flex:1" onclick="newspaper.open()">ZEITUNG DRUCKEN</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * HILFSFUNKTION FÜR FINANZ-LISTEN (ReferenceError Fix)
     */
    renderFinanceList: function(type, color) {
        return this.data[type].map(i => `
            <div class="budget-row" style="margin-bottom:8px;">
                <input type="text" value="${i.label}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'label', this.value)" style="flex:2.5;">
                <div style="flex:1; position:relative; display:flex; align-items:center;">
                    <input type="number" value="${i.amount}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'amount', this.value)" style="width:100%; text-align:right; padding-right:20px;">
                    <span style="position:absolute; right:8px; color:${color}; font-weight:bold; font-size:12px;">€</span>
                </div>
                <button onclick="mgmt.deleteFinanceRow('${type}', ${i.id})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-weight:bold; padding: 0 5px;">✕</button>
            </div>
        `).join('');
    }
};

window.addEventListener('load', () => mgmt.init());
