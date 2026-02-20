/* ==========================================================
   MANAGEMENT & REDAKTION MODUL - UNGEKÜRZT
   ========================================================== */

const mgmt = {
    // Datenstruktur für das Vereins-Wesen
    data: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        clubName: "FC TONI 2.0 ELITE",
        clubLogo: "https://cdn-icons-png.flaticon.com/512/1165/1165187.png",
        income: [
            { id: 1, label: "Hauptsponsor CyberFit", amount: 12000 },
            { id: 2, label: "Ticket-Einnahmen", amount: 4500 }
        ],
        expenses: [
            { id: 3, label: "Platzmiete & Energie", amount: 1200 },
            { id: 4, label: "Ausrüstung & Bälle", amount: 850 }
        ],
        sponsors: [
            { id: 1, name: "CyberFit Wearables", logo: "https://via.placeholder.com/150x80?text=CyberFit" },
            { id: 2, name: "Elite Energy Drink", logo: "https://via.placeholder.com/150x80?text=EliteEnergy" },
            { id: 3, name: "Sauerwein Coaching", logo: "https://via.placeholder.com/150x80?text=Sauerwein" }
        ],
        newsDraft: "Die Ära Toni 2.0 hat begonnen. Mit modernster VR-Technologie und kognitivem Training setzen wir neue Maßstäbe im Amateurfußball.",
        newsSettings: {
            pages: 4,
            showTactics: true,
            showBio: true,
            showSponsors: true
        }
    },

    init: function() {
        this.render();
    },

    save: function() {
        localStorage.setItem('toni_mgmt', JSON.stringify(this.data));
        this.render();
    },

    // FINANZ-LOGIK
    updateFinance: function(type, id, field, value) {
        const list = this.data[type];
        const item = list.find(i => i.id === id);
        if (item) {
            item[field] = field === 'amount' ? parseInt(value) || 0 : value;
            this.save();
        }
    },

    addFinanceRow: function(type) {
        this.data[type].push({
            id: Date.now(),
            label: "Neue Position",
            amount: 0
        });
        this.save();
    },

    deleteFinanceRow: function(type, id) {
        this.data[type] = this.data[type].filter(i => i.id !== id);
        this.save();
    },

    // SPONSOREN-LOGIK
    updateSponsor: function(id, field, value) {
        const sponsor = this.data.sponsors.find(s => s.id === id);
        if (sponsor) {
            sponsor[field] = value;
            this.save();
        }
    },

    addSponsor: function() {
        this.data.sponsors.push({
            id: Date.now(),
            name: "Neuer Partner",
            logo: ""
        });
        this.save();
    },

    // HAUPT-RENDERING
    render: function() {
        const container = document.getElementById('mgmt-content');
        if (!container) return;

        const totalIncome = this.data.income.reduce((s, i) => s + i.amount, 0);
        const totalExpenses = this.data.expenses.reduce((s, i) => s + i.amount, 0);
        const saldo = totalIncome - totalExpenses;

        container.innerHTML = `
            <div class="mgmt-card" style="border-top: 5px solid var(--accent);">
                <div style="display:flex; gap:20px; align-items:center;">
                    <div style="width:80px; height:80px; background:#0f172a; border-radius:15px; padding:10px;">
                        <img src="${this.data.clubLogo}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <div style="flex:1;">
                        <input type="text" value="${this.data.clubName}" onchange="mgmt.data.clubName=this.value; mgmt.save()" style="font-size:24px; font-weight:900; width:100%;">
                        <input type="text" value="${this.data.clubLogo}" onchange="mgmt.data.clubLogo=this.value; mgmt.save()" placeholder="Logo URL" style="font-size:12px; margin-top:5px;">
                    </div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                <div class="mgmt-card">
                    <h3>💰 Budget-Planung</h3>
                    <div style="margin-bottom:15px;">
                        <h4 style="color:var(--accent)">Einnahmen</h4>
                        ${this.renderFinanceList('income')}
                        <button onclick="mgmt.addFinanceRow('income')" style="background:none; border:1px dashed var(--accent); color:var(--accent); width:100%; padding:8px; cursor:pointer;">+ Hinzufügen</button>
                    </div>
                    <div style="margin-bottom:15px;">
                        <h4 style="color:var(--danger)">Ausgaben</h4>
                        ${this.renderFinanceList('expenses')}
                        <button onclick="mgmt.addFinanceRow('expenses')" style="background:none; border:1px dashed var(--danger); color:var(--danger); width:100%; padding:8px; cursor:pointer;">+ Hinzufügen</button>
                    </div>
                    <div style="text-align:center; padding:15px; background:#0f172a; border-radius:10px;">
                        <span>Verfügbares Budget:</span>
                        <h2 style="margin:5px 0; color:${saldo >= 0 ? 'var(--accent)' : 'var(--danger)'}">${saldo.toLocaleString()} €</h2>
                    </div>
                </div>

                <div class="mgmt-card">
                    <h3>🤝 Sponsoring-Partner</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        ${this.data.sponsors.map(s => `
                            <div style="background:#0f172a; padding:10px; border-radius:10px;">
                                <input type="text" value="${s.name}" onchange="mgmt.updateSponsor(${s.id}, 'name', this.value)" style="font-size:11px; margin-bottom:5px;">
                                <input type="text" value="${s.logo}" onchange="mgmt.updateSponsor(${s.id}, 'logo', this.value)" placeholder="Logo URL" style="font-size:9px;">
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="mgmt.addSponsor()" class="action-btn" style="width:100%; margin-top:15px;">+ Neuer Partner</button>
                </div>
            </div>

            <div class="mgmt-card" style="border: 2px solid var(--accent);">
                <h2 style="color:var(--accent); margin-top:0;">📰 Toni 2.0 Redaktions-Büro</h2>
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:30px;">
                    <div>
                        <label>Haupt-Story (Leitartikel):</label>
                        <textarea onchange="mgmt.data.newsDraft=this.value; mgmt.save()" style="width:100%; height:150px; margin-top:10px; font-family:inherit; line-height:1.6;">${this.data.newsDraft}</textarea>
                    </div>
                    <div>
                        <label>Heft-Einstellungen:</label>
                        <select onchange="mgmt.data.newsSettings.pages=parseInt(this.value); mgmt.save()" style="width:100%; margin:10px 0;">
                            <option value="4" ${this.data.newsSettings.pages === 4 ? 'selected' : ''}>4 Seiten (1 Blatt)</option>
                            <option value="8" ${this.data.newsSettings.pages === 8 ? 'selected' : ''}>8 Seiten (2 Blätter)</option>
                            <option value="12" ${this.data.newsSettings.pages === 12 ? 'selected' : ''}>12 Seiten (3 Blätter)</option>
                        </select>
                        <div style="font-size:13px; color:var(--text-muted); margin-top:10px;">
                            <input type="checkbox" checked disabled> Automatische Taktik-Grafik<br>
                            <input type="checkbox" checked disabled> Spieler-Fokus (Bild & Stats)<br>
                            <input type="checkbox" checked disabled> Sponsoren-Rückseite
                        </div>
                        <button class="action-btn" style="width:100%; margin-top:20px; font-size:18px;" onclick="newspaper.open()">JETZT GENERIEREN</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderFinanceList: function(type) {
        return this.data[type].map(i => `
            <div class="mgmt-list-item">
                <input type="text" value="${i.label}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'label', this.value)" style="flex:2;">
                <input type="number" value="${i.amount}" onchange="mgmt.updateFinance('${type}', ${i.id}, 'amount', this.value)" style="flex:1;">
                <button onclick="mgmt.deleteFinanceRow('${type}', ${i.id})" style="background:none; border:none; color:var(--danger); cursor:pointer;">✕</button>
            </div>
        `).join('');
    }
};

window.addEventListener('load', () => mgmt.init());
