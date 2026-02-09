/**
 * TONI 2.0 - SYSTEM SETUP (PRO EDITION)
 * Fokus: API-Konfiguration, Club-Management & Finanz-Status
 */
window.SektorSystem = {
    containerId: 'active-content',

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Daten aus der zentralen Database und LocalStorage ziehen
        const apiKey = localStorage.getItem('toni_api_key') || '';
        const coach = window.coachInfo || { verein: "FC TONI", name: "Coach" };
        const playersCount = (window.Database && window.Database.players) ? window.Database.players.length : 0;
        
        // Finanz-Check für das System-Dashboard
        let totalIncome = 0;
        if(window.Database && window.SponsorPool) {
            window.Database.players.forEach(p => {
                const s = window.SponsorPool.find(sp => sp.id === p.sponsorId);
                if(s) totalIncome += s.fee;
            });
        }

        container.innerHTML = `
            <div style="padding:30px; color: #fff; animation: fadeIn 0.3s ease-out;">
                <h2 style="color:var(--neon-green); letter-spacing:2px; margin-bottom:30px;">SYSTEM-SETUP & GATEWAY</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    
                    <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="margin-bottom:20px;">
                            <label style="font-size:0.7rem; color:var(--neon-green); font-weight:bold; letter-spacing:1px;">CLUB-NAME</label>
                            <input type="text" id="club-name-input" value="${coach.verein}" 
                                   style="width:100%; padding:12px; background:#000; border:1px solid #333; color:#fff; margin-top:8px; border-radius:6px;">
                            <button class="tactic-btn" id="save-club-btn" style="margin-top:10px; width:100%;">NAME AKTUALISIEREN</button>
                        </div>

                        <div style="margin-bottom:12px;">
                            <label style="font-size:0.7rem; color:var(--neon-green); font-weight:bold; letter-spacing:1px;">OPENAI GATEWAY KEY</label>
                            <input type="password" id="api-key-input" value="${apiKey}" placeholder="sk-..." 
                                   style="width:100%; padding:12px; background:#000; border:1px solid #333; color:#fff; margin-top:8px; border-radius:6px;">
                            <div style="display:flex; gap:10px; margin-top:10px;">
                                <button class="tactic-btn" id="save-api-btn" style="flex:1;">SAVE KEY</button>
                                <button class="tactic-btn" id="clear-api-btn" style="background:#333; flex:1;">WIPE</button>
                            </div>
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="margin-bottom:25px;">
                            <label style="font-size:0.7rem; color:#888; font-weight:bold; letter-spacing:1px;">FINANZ-STATUS</label>
                            <div style="font-size:2rem; font-weight:900; color:var(--accent-gold); margin-top:5px;">${totalIncome.toLocaleString()} € <span style="font-size:0.8rem; color:#666;">/ Woche</span></div>
                        </div>

                        <div style="margin-bottom:25px;">
                            <label style="font-size:0.7rem; color:#888; font-weight:bold; letter-spacing:1px;">KADER-AUSLASTUNG</label>
                            <div style="font-size:1.5rem; font-weight:900; color:#fff; margin-top:5px;">${playersCount} Aktive Spieler</div>
                        </div>

                        <div style="padding-top:20px; border-top:1px solid rgba(255,255,255,0.1);">
                            <button id="seed-players-btn" style="background:none; border:1px solid #444; color:#888; padding:8px 15px; cursor:pointer; font-size:0.7rem; border-radius:4px;">RE-SEED DATABASE</button>
                            <button id="clear-players-btn" style="background:none; border:none; color:#551a1a; padding:8px 15px; cursor:pointer; font-size:0.7rem;">KADER LÖSCHEN</button>
                        </div>
                    </div>

                </div>

                <div style="margin-top:40px; text-align:center; color:#333; font-size:0.6rem; letter-spacing:3px;">
                    TONI 2.0 SYSTEM CORE — VERSION 2.26.1
                </div>
            </div>
        `;

        this.attachHandlers();
    },

    attachHandlers() {
        document.getElementById('save-club-btn')?.addEventListener('click', () => {
            const val = document.getElementById('club-name-input').value;
            if (window.coachInfo) {
                window.coachInfo.verein = val;
                localStorage.setItem('toni_coach_data', JSON.stringify(window.coachInfo));
                alert('Club-Name in Toni 2.0 gespeichert.');
                this.render();
            }
        });

        document.getElementById('save-api-btn')?.addEventListener('click', () => {
            const val = document.getElementById('api-key-input').value;
            localStorage.setItem('toni_api_key', val);
            alert('API-Key verschlüsselt hinterlegt.');
        });

        document.getElementById('clear-api-btn')?.addEventListener('click', () => {
            localStorage.removeItem('toni_api_key');
            document.getElementById('api-key-input').value = "";
            alert('Key gelöscht.');
        });

        document.getElementById('seed-players-btn')?.addEventListener('click', () => {
            if(confirm("Willst du den Kader wirklich auf Werkseinstellungen zurücksetzen? Alle individuellen Stats gehen verloren!")) {
                window.Database.createDemoTeam();
                location.reload();
            }
        });

        document.getElementById('clear-players-btn')?.addEventListener('click', () => {
            if(confirm("ACHTUNG: Den gesamten Kader unwiderruflich löschen?")) {
                window.Database.players = [];
                window.Database.save();
                location.reload();
            }
        });
    }
};
