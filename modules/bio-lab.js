/* ==========================================================
   BIO-LAB MODUL (Wearable & Smart-Scale Analyse)
   ========================================================== */

const bioLab = {
    // Umfassende Datenstruktur für Profi-Metriken
    players: JSON.parse(localStorage.getItem('toni_bio')) || [
        { id: 1, name: "Müller", rhr: 48, hrv: 68, kfa: 11.2, mus: 45.2, h2o: 62.5, vo2: 58, rpe: 4, status: "fit" },
        { id: 2, name: "Schmidt", rhr: 59, hrv: 42, kfa: 13.8, mus: 40.5, h2o: 59.1, vo2: 51, rpe: 8, status: "warning" },
        { id: 3, name: "Schneider", rhr: 52, hrv: 55, kfa: 12.0, mus: 43.1, h2o: 61.2, vo2: 55, rpe: 5, status: "fit" }
    ],

    init: function() {
        this.render();
    },

    render: function() {
        const container = document.getElementById('bio-lab-container');
        if (!container) return;

        container.innerHTML = `
            <div style="background:var(--card); padding:25px; border-radius:20px; border:1px solid var(--accent); margin-bottom:30px; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
                <h3 style="margin-top:0; color:var(--accent);">Pro-CheckIn (Apple Watch / Garmin / Waage)</h3>
                <p style="font-size:12px; color:#94a3b8; margin-bottom:20px;">Synchronisiere hier die Morgendaten deiner Spieler.</p>
                
                <div class="bio-input-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap:12px;">
                    <div style="grid-column: span 2;">
                        <label style="font-size:10px; color:#94a3b8;">Spieler auswählen</label>
                        <select id="sel-player-bio" style="width:100%; padding:12px; background:#0f172a; color:white; border-radius:8px;">
                            ${this.players.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:10px; color:#94a3b8;">Ruhepuls (RHR)</label>
                        <input type="number" id="in-rhr" placeholder="z.B. 50">
                    </div>
                    <div>
                        <label style="font-size:10px; color:#94a3b8;">Stress (HRV)</label>
                        <input type="number" id="in-hrv" placeholder="z.B. 65ms">
                    </div>
                    <div>
                        <label style="font-size:10px; color:#94a3b8;">Körperfett (KFA%)</label>
                        <input type="number" step="0.1" id="in-kfa" placeholder="12.5">
                    </div>
                    <div>
                        <label style="font-size:10px; color:#94a3b8;">Muskelmasse (kg)</label>
                        <input type="number" step="0.1" id="in-mus" placeholder="45.0">
                    </div>
                    <div>
                        <label style="font-size:10px; color:#94a3b8;">Wasser (H2O%)</label>
                        <input type="number" step="0.1" id="in-h2o" placeholder="60.0">
                    </div>
                    <div>
                        <label style="font-size:10px; color:#94a3b8;">Ausdauer (VO2Max)</label>
                        <input type="number" id="in-vo2" placeholder="55">
                    </div>
                    <div style="grid-column: span 2;">
                        <label style="font-size:10px; color:#94a3b8;">Subjektive Last (RPE 1-10): <b id="rpe-display">5</b></label>
                        <input type="range" id="in-rpe" min="1" max="10" value="5" oninput="document.getElementById('rpe-display').innerText = this.value" style="width:100%;">
                    </div>
                    <button class="action-btn" style="grid-column: span 2; padding:15px; margin-top:10px;" onclick="bioLab.submitData()">ANALYSE STARTEN</button>
                </div>
            </div>

            <div class="card-grid">
                ${this.players.map(p => this.renderPlayerCard(p)).join('')}
            </div>
        `;
    },

    renderPlayerCard: function(p) {
        const statusColor = p.status === 'fit' ? 'var(--accent)' : (p.status === 'warning' ? 'var(--warning)' : 'var(--danger)');
        return `
            <div class="bio-card" style="border-left: 6px solid ${statusColor};">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <b style="font-size:18px;">${p.name}</b>
                    <span class="pulse-heart" style="font-size:20px;">❤️</span>
                </div>
                
                <div style="height:40px; margin:15px 0;">
                    <svg viewBox="0 0 100 25" style="width:100%; height:100%;">
                        <path class="ekg-path" d="M0 12 L10 12 L15 2 L20 22 L25 12 L35 12 L40 5 L45 20 L50 12 L100 12" stroke="${statusColor}" />
                    </svg>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:11px; color:#94a3b8;">
                    <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px;">
                        <span>RHR / HRV</span><br>
                        <b style="color:white; font-size:13px;">${p.rhr} / ${p.hrv}ms</b>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px;">
                        <span>VO2 Max</span><br>
                        <b style="color:white; font-size:13px;">${p.vo2}</b>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px;">
                        <span>KFA / H2O</span><br>
                        <b style="color:white; font-size:13px;">${p.kfa}% / ${p.h2o}%</b>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px;">
                        <span>Muskelmasse</span><br>
                        <b style="color:white; font-size:13px;">${p.mus} kg</b>
                    </div>
                </div>

                <div style="margin-top:12px;">
                    <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:4px;">
                        <span>Last (RPE)</span><span>${p.rpe}/10</span>
                    </div>
                    <div style="height:6px; background:#0f172a; border-radius:3px; overflow:hidden;">
                        <div style="width:${p.rpe * 10}%; height:100%; background: ${p.rpe > 7 ? 'var(--danger)' : 'var(--accent)'};"></div>
                    </div>
                </div>
            </div>
        `;
    },

    submitData: function() {
        const id = parseInt(document.getElementById('sel-player-bio').value);
        const rhr = parseInt(document.getElementById('in-rhr').value);
        const hrv = parseInt(document.getElementById('in-hrv').value);
        const kfa = parseFloat(document.getElementById('in-kfa').value);
        const mus = parseFloat(document.getElementById('in-mus').value);
        const h2o = parseFloat(document.getElementById('in-h2o').value);
        const vo2 = parseInt(document.getElementById('in-vo2').value);
        const rpe = parseInt(document.getElementById('in-rpe').value);

        if(!rhr || !hrv || !kfa) {
            addMessage("System", "⚠️ Bitte mindestens RHR, HRV und KFA für die Analyse eingeben.");
            return;
        }

        const player = this.players.find(p => p.id === id);
        player.rhr = rhr; player.hrv = hrv; player.kfa = kfa; 
        player.mus = mus || player.mus; player.h2o = h2o || player.h2o;
        player.vo2 = vo2 || player.vo2; player.rpe = rpe;

        // TONI ANALYSE LOGIK
        player.status = "fit";
        if(rhr > 60 || hrv < 45 || rpe > 7) player.status = "warning";
        if(rhr > 68 && hrv < 35) player.status = "danger";

        localStorage.setItem('toni_bio', JSON.stringify(this.players));
        this.render();
        addMessage("Toni", `Bio-Check abgeschlossen für ${player.name}. Belastungs-Empfehlung: ${player.status === 'fit' ? 'Volle Intensität' : 'Moderates Training'}.`);
    }
};

window.addEventListener('load', () => bioLab.init());
