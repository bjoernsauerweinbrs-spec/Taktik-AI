/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE HUB)
 * Fokus: Biometrie-Sync, FIFA-Stats & KI-Diagnose
 * Status: MASTER-SYNC 2026 - FULL CONTROL COMPLETED
 */
window.SektorAnalyse = {
    selectedPlayerId: null,

    open() {
        const team = window.currentTeamContext || "Senioren";
        const players = this.getFilteredPlayers(team);
        if (!this.selectedPlayerId && players.length > 0) {
            this.selectedPlayerId = players[0].id;
        }
        this.render();
    },

    getFilteredPlayers(team) {
        if (!window.Database?.players) return [];
        return window.Database.players.filter(p => {
            if (team === "Senioren") return p.team === "Senioren";
            return p.jugend === team;
        });
    },

    getCardDesign(rat) {
        if (rat >= 80) return { color: "var(--accent-gold)", label: "GOLD / ELITE", glow: "0 0 20px rgba(255, 215, 0, 0.4)" };
        if (rat >= 70) return { color: "#C0C0C0", label: "SILVER / PRO", glow: "0 0 15px rgba(192, 192, 192, 0.3)" };
        return { color: "#CD7F32", label: "BRONZE / TALENT", glow: "0 0 10px rgba(205, 127, 50, 0.2)" };
    },

    calculateBMI(height, weight) {
        if (!height || !weight) return "---";
        const hMeter = height / 100;
        return (weight / (hMeter * hMeter)).toFixed(1);
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        const team = window.currentTeamContext || "Senioren";
        const players = this.getFilteredPlayers(team);
        const player = players.find(p => p.id == this.selectedPlayerId) || players[0];
        
        if (!player) {
            content.innerHTML = `<div style="padding:40px; text-align:center; color:#666;">KEIN KADER FÜR ${team.toUpperCase()} GEFUNDEN.</div>`;
            return;
        }

        const cardStyle = this.getCardDesign(player.rat);
        const bmi = this.calculateBMI(player.height, player.weight);

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 280px 1fr; gap: 25px; height: 100%;">
                
                <div style="background: rgba(0,0,0,0.2); border-right: 1px solid rgba(255,255,255,0.05); padding-right: 15px; overflow-y: auto;">
                    <h3 style="font-size: 0.6rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 20px; font-family:'Orbitron';">BIO-MONITORING: ${team.toUpperCase()}</h3>
                    ${players.map(p => {
                        const isSelected = this.selectedPlayerId == p.id;
                        return `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 8px; border-radius: 10px; cursor: pointer; border: 1px solid ${isSelected ? 'var(--data-cyan)' : '#222'}; 
                             background: ${isSelected ? 'rgba(0,209,255,0.05)' : 'transparent'}; transition: 0.3s;">
                            <div style="font-weight: 900; font-size: 0.75rem; color:#fff; font-family:'Orbitron';">${p.name.toUpperCase()}</div>
                            <div style="font-size: 0.55rem; color: #666;">BMI: ${this.calculateBMI(p.height, p.weight)} | OVR: ${p.rat}</div>
                        </div>`;
                    }).join('')}
                </div>

                <div style="overflow-y: auto; padding-right:10px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                        <div>
                            <h2 style="margin:0; font-size: 2.2rem; color: #fff; font-family:'Orbitron';">${player.name.toUpperCase()}</h2>
                            <div style="display:flex; gap:15px; margin-top:8px;">
                                <span style="color:${cardStyle.color}; font-size: 0.7rem; font-family:'Orbitron'; font-weight:900;">● ${cardStyle.label}</span>
                                <button onclick="window.SektorAnalyse.openEditor()" style="background:none; border:none; color:var(--data-cyan); cursor:pointer; font-size:0.6rem; font-family:'Orbitron'; text-decoration:underline;">[ BIOMETRIE ANPASSEN ]</button>
                            </div>
                        </div>
                        <div style="background: ${cardStyle.color}; color: #000; padding: 15px 25px; border-radius: 10px; font-family: 'Orbitron'; font-weight: 900; text-align: center; box-shadow: ${cardStyle.glow};">
                            <div style="font-size: 0.6rem;">OVERALL</div>
                            <div style="font-size: 1.8rem;">${player.rat}</div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            ${this.renderStatCard("BODY-MASS-INDEX", bmi, (bmi > 25 ? "OVERWEIGHT" : "OPTIMAL"), (bmi > 25 ? "var(--status-error)" : "var(--neon-green)"))}
                            ${this.renderStatCard("KÖRPERFETT", (player.fat || "11") + "%", "ATHLETIC", "var(--neon-green)")}
                            ${this.renderStatCard("GRÖSSE", (player.height || "---") + " CM", "STATUR", "#fff")}
                            ${this.renderStatCard("GEWICHT", (player.weight || "---") + " KG", "MASSE", "#fff")}
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 12px; padding: 15px;">
                            <h4 style="font-size: 0.6rem; color: var(--data-cyan); font-family:'Orbitron'; margin-bottom:15px;">PERFORMANCE-INDEX</h4>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                ${['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(s => `
                                    <div style="text-align:center; background:#000; padding:8px; border-radius:5px; border:1px solid #222;">
                                        <div style="font-size:0.5rem; color:#666;">${s.toUpperCase()}</div>
                                        <div style="font-family:'Orbitron'; font-size:0.9rem; color:#fff;">${player[s] || 50}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:25px; background:rgba(0,209,255,0.05); border:1px solid rgba(0,209,255,0.2); border-radius:12px; padding:20px; display:flex; gap:20px; align-items:center;">
                        <i class="fas fa-robot" style="font-size:2rem; color:var(--data-cyan);"></i>
                        <div>
                            <strong style="color:var(--data-cyan); font-family:'Orbitron'; font-size:0.8rem;">TONI'S DIAGNOSE:</strong>
                            <p style="margin:5px 0 0 0; font-size:0.75rem; color:#aaa; line-height:1.5;">
                                Basierend auf dem OVR von ${player.rat} und dem BMI von ${bmi} empfehle ich für ${player.name.split(' ').pop()} eine 
                                Steigerung im Bereich <strong>${(player.phy < 70) ? 'Physis / Kraft' : 'Schnelligkeit'}</strong>. 
                                Der aktuelle Zustand ist ${bmi > 25 ? 'über dem Limit - Ausdauertraining priorisieren.' : 'athletisch stabil.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, status, color) {
        return `
            <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 12px; border: 1px solid #222; border-top: 2px solid ${color};">
                <div style="font-size: 0.5rem; color: #666; font-family:'Orbitron';">${label}</div>
                <div style="font-size: 1.4rem; font-weight: 900; color: #fff; margin: 4px 0; font-family:'Orbitron';">${value}</div>
                <div style="font-size: 0.5rem; color: ${color}; font-weight: bold;">● ${status}</div>
            </div>`;
    },

    selectPlayer(id) {
        this.selectedPlayerId = id;
        this.render();
    },

    openEditor() {
        const p = window.Database.players.find(x => x.id == this.selectedPlayerId);
        if(!p) return;

        const overlay = document.createElement('div');
        overlay.id = "bio-editor";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);";
        overlay.innerHTML = `
            <div style="background:#0a0a0a; border:1px solid var(--data-cyan); padding:30px; border-radius:15px; width:400px; font-family:'Orbitron';">
                <h3 style="color:var(--data-cyan); margin-bottom:20px; font-size:0.8rem;">DIAGNOSE: ${p.name.toUpperCase()}</h3>
                <div style="display:grid; gap:15px;">
                    <div><label style="font-size:0.5rem; color:#666;">GRÖSSE (CM)</label><input type="number" id="edit-h" value="${p.height}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:8px;"></div>
                    <div><label style="font-size:0.5rem; color:#666;">GEWICHT (KG)</label><input type="number" id="edit-w" value="${p.weight}" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:8px;"></div>
                    <div><label style="font-size:0.5rem; color:#666;">KÖRPERFETT (%)</label><input type="number" id="edit-f" value="${p.fat || 11}" step="0.1" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:8px;"></div>
                </div>
                <div style="display:flex; gap:10px; margin-top:25px;">
                    <button onclick="document.getElementById('bio-editor').remove()" style="flex:1; background:#222; color:#fff; border:none; padding:10px; cursor:pointer;">ABBRECHEN</button>
                    <button onclick="window.SektorAnalyse.saveData()" style="flex:1; background:var(--data-cyan); color:#000; border:none; padding:10px; cursor:pointer; font-weight:bold;">SPEICHERN</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    saveData() {
        const p = window.Database.players.find(x => x.id == this.selectedPlayerId);
        if(p) {
            p.height = parseInt(document.getElementById('edit-h').value);
            p.weight = parseInt(document.getElementById('edit-w').value);
            p.fat = parseFloat(document.getElementById('edit-f').value);
            
            if(window.Database.save) window.Database.save();
            document.getElementById('bio-editor').remove();
            this.render();
            if(window.ToniVoice) window.ToniVoice.speak("Biometrie für " + p.name + " aktualisiert.");
        }
    }
};
