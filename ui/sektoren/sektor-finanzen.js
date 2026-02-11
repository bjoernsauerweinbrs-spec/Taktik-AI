/**
 * TONI 2.0 - SEKTOR FINANZEN (ELITE TREASURY)
 * Fokus: Budget-Monitoring, Sponsoring-Erträge & Kosten-Kalkulation
 * Status: MASTER-SYNC 2026 - INITIAL RELEASE
 */
window.SektorFinanzen = {
    
    open() {
        const content = document.getElementById('active-content');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.getElementById('active-content');
        
        // Daten aus der Sponsoring-Datenbank ziehen
        const sponsors = window.Database.sponsors || [];
        const totalIncome = sponsors.reduce((sum, s) => sum + parseInt(s.income || 0), 0);
        
        // Fixe Betriebskosten (Musterwerte für 2026)
        const costs = {
            verband: 450,
            platzpflege: 1200,
            ausruestung: 800,
            versicherung: 350
        };
        const totalCosts = Object.values(costs).reduce((a, b) => a + b, 0);
        const balance = totalIncome - totalCosts;

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 350px; gap: 25px; height: 100%;">
                
                <div style="overflow-y: auto; padding-right:10px;">
                    <h2 style="color:var(--accent-gold); font-family:'Orbitron'; margin-bottom:25px; font-size:1.2rem;">FINANZ-COCKPIT 2026</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
                        <div style="background:#111; padding:20px; border-radius:12px; border-top:3px solid var(--neon-green);">
                            <div style="font-size:0.6rem; color:#666; font-family:'Orbitron';">GESAMT-EINNAHMEN</div>
                            <div style="font-size:1.5rem; color:#fff; font-weight:900; margin-top:5px;">+ ${totalIncome.toLocaleString()} €</div>
                        </div>
                        <div style="background:#111; padding:20px; border-radius:12px; border-top:3px solid var(--status-error);">
                            <div style="font-size:0.6rem; color:#666; font-family:'Orbitron';">BETRIEBSKOSTEN</div>
                            <div style="font-size:1.5rem; color:#fff; font-weight:900; margin-top:5px;">- ${totalCosts.toLocaleString()} €</div>
                        </div>
                        <div style="background:#111; padding:20px; border-radius:12px; border-top:3px solid ${balance >= 0 ? 'var(--data-cyan)' : 'var(--status-error)'};">
                            <div style="font-size:0.6rem; color:#666; font-family:'Orbitron';">SALDO</div>
                            <div style="font-size:1.5rem; color:${balance >= 0 ? 'var(--neon-green)' : 'var(--status-error)'}; font-weight:900; margin-top:5px;">${balance.toLocaleString()} €</div>
                        </div>
                    </div>

                    <div style="background:rgba(255,255,255,0.03); border:1px solid #333; border-radius:15px; padding:20px;">
                        <h4 style="color:#fff; font-family:'Orbitron'; font-size:0.8rem; margin-bottom:15px; border-bottom:1px solid #222; padding-bottom:10px;">KOSTEN-AUFSTELLUNG</h4>
                        <table style="width:100%; color:#aaa; font-size:0.8rem; border-collapse:collapse;">
                            <tr><td style="padding:10px 0;">Platzpflege & Instandhaltung</td><td style="text-align:right; color:#fff;">${costs.platzpflege} €</td></tr>
                            <tr><td style="padding:10px 0;">Verbandsabgaben & Schiedsrichter</td><td style="text-align:right; color:#fff;">${costs.verband} €</td></tr>
                            <tr><td style="padding:10px 0;">Ausrüstung & Trikotsätze</td><td style="text-align:right; color:#fff;">${costs.ausruestung} €</td></tr>
                            <tr><td style="padding:10px 0;">Versicherungen</td><td style="text-align:right; color:#fff;">${costs.versicherung} €</td></tr>
                        </table>
                    </div>
                </div>

                <div style="background:rgba(0,0,0,0.2); border-left:1px solid #333; padding-left:20px;">
                    <h3 style="color:var(--data-cyan); font-family:'Orbitron'; font-size:0.7rem; letter-spacing:1px; margin-bottom:20px;">FISKAL-ANALYSE</h3>
                    
                    <div style="background:rgba(0,209,255,0.05); border:1px solid rgba(0,209,255,0.2); padding:15px; border-radius:10px; margin-bottom:20px;">
                        <small style="color:var(--data-cyan); font-family:'Orbitron';">STATUS-CHECK:</small>
                        <p style="font-size:0.75rem; color:#ccc; line-height:1.4; margin-top:10px;">
                            ${balance >= 0 
                                ? "Das Budget ist stabil. Wir haben einen Überschuss, der in die Erweiterung des <strong>Analysezentrums</strong> investiert werden kann." 
                                : "Warnung: Die Kosten übersteigen die Sponsoring-Einnahmen. Akquise neuer Partner in der <strong>Stadionzeitung</strong> dringend empfohlen!"}
                        </p>
                    </div>

                    <div style="text-align:center; padding:20px; border:1px dashed #444; border-radius:10px;">
                        <i class="fas fa-chart-line" style="font-size:2rem; color:var(--accent-gold); margin-bottom:10px;"></i>
                        <div style="font-size:0.6rem; color:#666;">EVENT-PROGNOSE (NÄCHSTER SPIELTAG)</div>
                        <div style="font-size:1.1rem; color:var(--neon-green); font-family:'Orbitron'; font-weight:900;">+ 450 €</div>
                    </div>
                </div>
            </div>
        `;
    }
};
