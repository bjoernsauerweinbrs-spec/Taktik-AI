/* ==========================================================
   MANAGEMENT & REDAKTION MODUL - TONI 2.0 (ELITE EDITION)
   ========================================================== */

const mgmt = {
    // 1. MUSTER-DATEN (Damit das Büro beim Start direkt "Elite" aussieht)
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        clubName: "FC TONI 2.0 ELITE",
        clubLogo: "https://cdn-icons-png.flaticon.com/512/1165/1165187.png",
        income: [
            { id: 1, label: "Hauptsponsor CyberFit", amount: 15000 },
            { id: 2, label: "Ticket-Einnahmen", amount: 4800 },
            { id: 3, label: "Merchandising", amount: 2100 }
        ],
        expenses: [
            { id: 4, label: "Platzmiete & Infrastruktur", amount: 1400 },
            { id: 5, label: "Energie & Flutlicht", amount: 650 },
            { id: 6, label: "Ausrüstung Profi-Kader", amount: 1200 }
        ],
        sponsors: [
            { id: 10, name: "CyberFit Wearables", logo: "https://via.placeholder.com/150x80?text=CyberFit" },
            { id: 11, name: "Elite Energy Drink", logo: "https://via.placeholder.com/150x80?text=EliteEnergy" },
            { id: 12, name: "Sauerwein Coaching", logo: "https://via.placeholder.com/150x80?text=Sauerwein" }
        ],
        newsDraft: "Die Revolution im Training: Toni 2.0 analysiert ab heute jede Bewegung. Mit modernster VR-Technologie und kognitiver Datenerfassung setzen wir neue Maßstäbe im Amateurfußball.",
        newsSettings: {
            pages: 4,
            template: "classic"
        }
    },

    /**
     * INITIALISIERUNG
     */
    init: function() {
        this.render();
    },

    /**
     * SPEICHERN
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
            localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
            // Kein Render hier, um den Fokus im Input-Feld nicht zu verlieren
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
     * NEUEN SPONSOR HINZUFÜGEN
     */
    addSponsor: function() {
        this.data.sponsors.push({
            id: Date.now(),
            name: "Neuer Partner",
            logo: ""
        });
        this.save();
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
                    <div style="width:90px; height:90px; background:rgba(0,0,0,0.3); border-radius:18px; padding:12px; border:1px solid rgba(255,255,255,0.1);">
                        <img src="${this.data.clubLogo}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <div style="flex:1;">
                        <input type="text" value="${this.data.clubName}" onchange="mgmt.data.clubName=this.value; mgmt.save()" 
                               style="font-size:26px; font-weight:900; background:none; border:none; color:white; width:100%; outline:none;">
                        <input type="text" value="${this.data.clubLogo}" onchange="mgmt.data.clubLogo=this.value; mgmt.save()" 
                               placeholder="Vereins-Logo URL" style="font-size:12px; margin-top:8px; opacity:0.5; background:none; border:none; color:white; width:100%;">
                    </div>
                </div>
            </div>

            <div class="mgmt-grid">
                
                <div class="mgmt-card">
                    <h2 style="color:var(--accent); margin:0 0 25px 0; display:flex; align-items:center; gap:12px;">
                        <span>💰</span> Budget-Zentrale
                    </h2>
                    
                    <div class="budget-input-group">
                        <label>Einnahmen (Sponsoring & Tickets)</label>
                        ${this.renderFinanceList('income', 'var(--accent)')}
                        <button onclick="mgmt.addFinanceRow('income')" 
                                style="background:none; border:1px dashed var(--accent); color:var(--accent); width:100%; padding:10px; border-radius:10px; cursor:pointer; margin-top:10px; font-weight:bold;">
                            + Einnahme-Position hinzufügen
                        </button>
                    </div>

                    <div class="budget-input-group">
                        <label>Ausgaben (Fixkosten & Betrieb)</label>
                        ${this.renderFinanceList('expenses', 'var(--danger)')}
                        <button onclick="mgmt.addFinanceRow('expenses')" 
                                style="background:none; border:1px dashed var(--danger); color:var(--danger); width:100%; padding:10px; border-radius:10px; cursor:pointer; margin-top:10px; font-weight:bold;">
                            + Ausgabe-Position hinzufügen
                        </button>
                    </div>

                    <div style="margin-top:30px; padding:25px; background:linear-gradient(145deg, rgba(34,197,94,0.15), rgba(0,0,0,0.2)); border-radius:20px; border:1px solid var(--accent); text-align:center;">
                        <span style="font-size:12px; color:#94a3b8; letter-spacing:2px; font-weight:800;">VERFÜGBARE MITTEL</span>
                        <h1 style="margin:8px 0 0 0; color:var(--accent); font-size:48px; letter-spacing:-1px;">
                            ${saldo.toLocaleString()} €
                        </h1>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:30px;">
                    
                    <div class="mgmt-card">
                        <h3 style="margin-top:0; margin-bottom:20px;">🤝 Elite-Partnerschaften</h3>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            ${this.data.sponsors.map(s => `
                                <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:15px; border:1px solid rgba(255,255,255,0.05); transition:0.3s;">
                                    <input type="text" value="${s.name}" onchange="mgmt.updateSponsor(${s.id}, 'name', this.value)" 
                                           style="font-size:12px; font-weight:bold; margin-bottom:8px; color:white; border:none; background:none; width:100%;">
                                    <input type="text" value="${s.logo}" onchange="mgmt.updateSponsor(${s.id}, 'logo', this.value)" 
                                           placeholder="Logo URL" style="font-size:10px; opacity:0.4; color:white; border:none; background:none; width:100%;">
                                </div>
                            `).join('')}
                        </div>
                        <button onclick="mgmt.addSponsor()" class="action-btn" style="width:100%; margin-top:20px; background:rgba(255,255,255,0.05); color:white; border:1px solid #334155;">
                            Partner hinzufügen
                        </button>
                    </div>

                    <div class="redaktion-panel" style="padding:25px; margin-top:0; border-width:2px;">
                        <h3 style="color:var(--accent); margin-top:0;">🗞️ Redaktion</h3>
                        <p style="font-size:12px; opacity:0.7; margin-bottom:15px;">Schreibe hier den Hauptartikel für das nächste A5-Faltheft.</p>
                        <textarea onchange="mgmt.data.newsDraft=this.value; mgmt.save()" 
                                  style="width:100%; height:140px; background:rgba(0,0,0,0.2); color:white; border:1px solid #334155; padding:15px; border-radius:12px; font-family:inherit; line-height:1.5; font-size:14px; outline:none;">${this.data.newsDraft}</textarea>
                        
                        <div style="margin-top:20px; display:flex; gap:15px; align-items:center;">
                            <select onchange="mgmt.data.newsSettings.pages=parseInt(this.value); mgmt.save()" 
                                    style="flex:1; background:#0f172a; color:white; border:1px solid var(--accent); padding:12px; border-radius:10px;">
                                <option value="4" ${this.data.newsSettings.pages === 4 ? 'selected' : ''}>4 Seiten (1 Blatt)</option>
                                <option value="8" ${this.data.newsSettings.pages === 8 ? 'selected' : ''}>8 Seiten (2 Blätter)</option>
                                <option value="12" ${this.data.newsSettings.pages === 12 ? 'selected' : ''}>12 Seiten (3 Blätter)</option>
                            </select>
                            <button class="action-btn" style="flex:1.5; padding:15px; box-shadow: 0 5px 20px var(--accent-glow);" onclick="newspaper.open()">
                                🖨️ DRUCKEN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * HILFSFUNKTION FÜR FINANZ-LISTEN
     */
    renderFinanceList: function(type, color) {
        return this.data[type].map(i => `
            <div class="budget-row" style="margin-bottom:10px;">
                <input type="text" value="${i.label}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'label', this.value)" 
                       style="flex:2.5; background:#0f172a !important; color:white !important; border:1px solid #334155; padding:10px; border-radius:8px;">
                <div style="flex:1; position:relative; display:flex; align-items:center;">
                    <input type="number" value="${i.amount}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'amount', this.value)" 
                           style="width:100%; background:#0f172a !important; color:white !important; border:1px solid #334155; padding:10px; border-radius:8px; text-align:right; padding-right:25px;">
                    <span style="position:absolute; right:10px; color:${color}; font-weight:bold;">€</span>
                </div>
                <button onclick="mgmt.deleteFinanceRow('${type}', ${id})" 
                        style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:18px; padding:0 5px;">✕</button>
            </div>
        `).join('');
    }
};

// Modul beim Laden initialisieren
window.addEventListener('load', () => mgmt.init());
