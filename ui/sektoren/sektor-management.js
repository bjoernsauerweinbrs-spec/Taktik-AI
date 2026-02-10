/**
 * TONI 2.0 - SEKTOR MANAGEMENT & BUSINESS
 * Fokus: Partner-Pool, Kalkulator & Infrastruktur-Investments
 * Status: MASTER-SYNC 2026
 */
window.SektorManagement = {
    
    init() {
        if (!window.Database.sponsors) {
            window.Database.sponsors = [
                { name: "Global Sports Tech", type: "Hauptpartner", logo: null, isMain: true, value: 50000 },
                { name: "Regio-Drink", type: "Premium-Partner", logo: null, isMain: false, value: 12000 }
            ];
        }
        this.saveAndSync(false);
    },

    open() {
        this.init();
        const content = document.getElementById('active-content');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        const sponsors = window.Database.sponsors || [];
        const totalRevenue = sponsors.reduce((acc, s) => acc + (parseInt(s.value) || 0), 0);
        const avgRating = this.getAverageRating();
        const marketLeverage = (avgRating / 70).toFixed(2);

        content.innerHTML = `
            <div class="fadeIn">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid var(--accent-gold); padding-bottom:15px;">
                    <div>
                        <h2 style="color:var(--accent-gold); font-family:'Orbitron'; margin:0; font-size:1.2rem; letter-spacing:2px;">BUSINESS-ZENTRALE</h2>
                        <span style="color:#666; font-size:0.7rem; text-transform:uppercase;">${window.coachInfo.verein || 'VEREIN'} | FINANZ-STRATEGIE</span>
                    </div>
                    <div style="text-align:right;">
                        <div style="color:var(--neon-green); font-family:'Orbitron'; font-size:1.1rem;">${totalRevenue.toLocaleString()} €</div>
                        <div style="color:#444; font-size:0.5rem; letter-spacing:1px;">REVENUE p.A. (HEBEL: x${marketLeverage})</div>
                    </div>
                </div>

                <div class="management-grid">
                    <div class="mgmt-card" style="border-color: var(--accent-gold);">
                        <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 12px; letter-spacing: 1px; font-family:'Orbitron'; font-size:0.7rem;">
                            <i class="fas fa-handshake"></i> PARTNER-POOL
                        </div>
                        <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Verwaltung der Sponsoren für Stadionzeitung & Trikots.</p>
                        <button class="pro-btn-gold" style="width: 100%; font-size:0.7rem;" onclick="window.SektorManagement.showSponsorManager()">POOL ÖFFNEN</button>
                    </div>

                    <div class="mgmt-card" style="border-color: var(--data-cyan);">
                        <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 12px; letter-spacing: 1px; font-family:'Orbitron'; font-size:0.7rem;">
                            <i class="fas fa-chart-line"></i> DEAL-KALKULATOR
                        </div>
                        <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">KI-Preiskalkulation basierend auf dem Kader-Rating (${avgRating}).</p>
                        <button class="pro-btn-gold" style="width: 100%; border-color: var(--data-cyan); color: var(--data-cyan); font-size:0.7rem;" onclick="window.SektorManagement.showFinance()">RECHNER STARTEN</button>
                    </div>

                    <div class="mgmt-card" style="border-color: var(--neon-green);">
                        <div style="color: var(--neon-green); font-weight: 900; margin-bottom: 12px; letter-spacing: 1px; font-family:'Orbitron'; font-size:0.7rem;">
                            <i class="fas fa-microscope"></i> INFRASTRUKTUR
                        </div>
                        <p style="font-size: 0.75rem; color: #888; margin-bottom: 20px;">Investitionen in Analysezentrum & Academy-Campus.</p>
                        <button class="pro-btn-gold" style="width: 100%; border-color: var(--neon-green); color: var(--neon-green); font-size:0.7rem;" onclick="window.SektorManagement.showUpgrades()">UPGRADES</button>
                    </div>
                </div>

                <div id="mgmt-sub-content" style="margin-top: 30px;"></div>
            </div>
        `;
    },

    getAverageRating() {
        const players = window.Database.players || [];
        if (players.length === 0) return 60;
        const sum = players.reduce((acc, p) => acc + (parseInt(p.rat) || 0), 0);
        return Math.round(sum / players.length);
    },

    showSponsorManager() {
        const sub = document.getElementById('mgmt-sub-content');
        const sponsors = window.Database.sponsors || [];
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid #333;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3 style="color: var(--accent-gold); margin:0; font-family:'Orbitron'; font-size:0.8rem;">AKTIVE PARTNER</h3>
                    <button class="tactic-btn" style="color: var(--neon-green); border-color: var(--neon-green);" onclick="window.SektorManagement.addSponsor()">+ NEUER PARTNER</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                    ${sponsors.map((s, i) => `
                        <div style="background:#000; padding:15px; border-radius:10px; border: 1px solid ${s.isMain ? 'var(--accent-gold)' : '#222'}; text-align:center;">
                            <div style="height:60px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                                ${s.logo ? `<img src="${s.logo}" style="max-height:50px; max-width:100%;">` : '<i class="fas fa-handshake" style="opacity:0.2;"></i>'}
                            </div>
                            <div style="font-weight:bold; font-size:0.8rem;">${s.name}</div>
                            <div style="color:var(--accent-gold); font-size:0.6rem; margin-top:5px;">${s.value.toLocaleString()} €</div>
                            <div style="display:flex; gap:5px; margin-top:10px;">
                                <button class="tactic-btn" style="flex:1; font-size:0.5rem;" onclick="window.SektorManagement.setMainSponsor(${i})">MAIN</button>
                                <button class="tactic-btn" style="flex:1; font-size:0.5rem; color:var(--status-error);" onclick="window.SektorManagement.deleteSponsor(${i})">X</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sub.scrollIntoView({ behavior: 'smooth' });
    },

    showFinance() {
        const sub = document.getElementById('mgmt-sub-content');
        const leverage = (this.getAverageRating() / 70);
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(255,255,255,0.02); padding: 25px; border-radius: 15px; border: 1px solid var(--data-cyan);">
                <h3 style="color: var(--data-cyan); margin-bottom: 20px; font-family:'Orbitron'; font-size:0.8rem;">DEAL-KALKULATOR</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button class="tactic-btn" onclick="window.SektorManagement.calc('trikot', ${leverage})">TRIKOT (BRUST)</button>
                        <button class="tactic-btn" onclick="window.SektorManagement.calc('bande', ${leverage})">WERBEBANDE</button>
                        <button class="tactic-btn" onclick="window.SektorManagement.calc('junioren', ${leverage})">JUGEND-PATENSCHAFT</button>
                    </div>
                    <div id="calc-result" style="background:rgba(0,0,0,0.5); border-radius:10px; display:flex; align-items:center; justify-content:center; text-align:center; padding:20px;">
                        <span style="color:#444; font-size:0.7rem;">Wähle eine Kategorie für die KI-Analyse...</span>
                    </div>
                </div>
            </div>
        `;
    },

    calc(type, leverage) {
        const res = document.getElementById('calc-result');
        let base = 0, label = "";
        if(type === 'trikot') { base = 2500; label = "Trikot-Sponsoring"; }
        if(type === 'bande') { base = 800; label = "Bandenwerbung"; }
        if(type === 'junioren') { base = 1200; label = "Academy-Sponsor"; }

        const price = Math.round(base * leverage);
        res.innerHTML = `<div><div style="color:var(--data-cyan); font-size:0.6rem;">${label}</div><div style="font-size:1.5rem; font-weight:900; color:#fff;">${price.toLocaleString()} €</div><div style="color:var(--neon-green); font-size:0.5rem;">PERFORMANCE-GEPRÜFT</div></div>`;
    },

    showUpgrades() {
        const sub = document.getElementById('mgmt-sub-content');
        sub.innerHTML = `
            <div class="fadeIn" style="background: rgba(57,255,20,0.02); padding: 25px; border-radius: 15px; border: 1px solid var(--neon-green);">
                <h3 style="color: var(--neon-green); margin-bottom: 20px; font-family:'Orbitron'; font-size:0.8rem;">INFRASTRUKTUR-ERWEITERUNG</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:10px;">
                        <div style="font-weight:bold; font-size:0.75rem;">ACADEMY CAMPUS</div>
                        <p style="font-size:0.6rem; color:#666; margin:10px 0;">Verbessert die Talent-Entwicklung in der Academy um 15%.</p>
                        <button class="tactic-btn" style="width:100%; font-size:0.6rem;" onclick="alert('In Planung...')">INVESTIEREN</button>
                    </div>
                    <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:10px;">
                        <div style="font-weight:bold; font-size:0.75rem;">MEDIZIN-LAB PRO</div>
                        <p style="font-size:0.6rem; color:#666; margin:10px 0;">Schaltet detaillierte HRV-Daten im Analyse-Zentrum frei.</p>
                        <button class="tactic-btn" style="width:100%; font-size:0.6rem;" onclick="alert('Wird vorbereitet...')">AUSBAUEN</button>
                    </div>
                </div>
            </div>
        `;
    },

    setMainSponsor(index) {
        window.Database.sponsors.forEach((s, i) => s.isMain = (i === index));
        this.saveAndSync();
    },

    addSponsor() {
        const name = prompt("Name des Partners:");
        if (!name) return;
        window.Database.sponsors.push({ name, type: "Partner", logo: null, value: 1000, isMain: false });
        this.saveAndSync();
    },

    deleteSponsor(index) {
        if(confirm("Löschen?")) { window.Database.sponsors.splice(index, 1); this.saveAndSync(); }
    },

    saveAndSync(rerender = true) {
        if(window.Database.save) window.Database.save();
        if(rerender) this.renderSponsorList();
    }
};
