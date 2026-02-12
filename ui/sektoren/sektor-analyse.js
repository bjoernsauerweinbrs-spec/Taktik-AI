/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE HUB)
 * Fokus: Biometrie-Sync, FIFA-Stats & KI-Diagnose (TOTY-READY)
 * Status: ETAPPE 4 - LABOR VOLLSTÄNDIG VERSIEGELT
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
            return (team === "Senioren") ? p.team === "Senioren" : p.jugend === team;
        });
    },

    /**
     * Synchronisiert das Design mit der Arena-Logik (Bronze bis Elite)
     */
    getCardDesign(rat) {
        if (rat >= 90) return { rank: "elite", color: "var(--data-cyan)", label: "TOTY / ELITE" };
        if (rat >= 80) return { rank: "gold", color: "var(--accent-gold)", label: "GOLD / PRO" };
        if (rat >= 70) return { rank: "silver", color: "#C0C0C0", label: "SILVER / ADVANCED" };
        return { rank: "bronze", color: "#CD7F32", label: "BRONZE / TALENT" };
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
            content.innerHTML = `<div style="padding:40px; text-align:center; color:#666; font-family:'Orbitron';">KEIN KADER GELADEN.</div>`;
            return;
        }

        const cardStyle = this.getCardDesign(player.rat);
        const bmi = this.calculateBMI(player.height, player.weight);

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 260px 1fr; gap: 25px; height: 100%;">
                
                <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; overflow-y: auto; border: 1px solid #222;">
                    <h3 style="font-size: 0.6rem; color: var(--neon-green); letter-spacing: 2px; margin-bottom: 20px; font-family:'Orbitron'; text-transform:uppercase;">BIOMETRIE-FEED: ${team}</h3>
                    ${players.map(p => {
                        const isSelected = this.selectedPlayerId == p.id;
                        const pRank = this.getCardDesign(p.rat);
                        return `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 10px; border-radius: 8px; cursor: pointer; border-left: 3px solid ${isSelected ? 'var(--neon-green)' : pRank.color}; 
                             background: ${isSelected ? 'rgba(57,255,20,0.05)' : 'rgba(255,255,255,0.02)'}; transition: 0.2s;">
                            <div style="font-weight: bold; font-size: 0.75rem; color:#fff; font-family:'Orbitron';">${p.name.toUpperCase()}</div>
                            <div style="font-size: 0.55rem; color: #666; margin-top:4px;">OVR: ${p.rat} | ${p.pos}</div>
                        </div>`;
                    }).join('')}
                </div>

                <div style="overflow-y: auto; padding-right:10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #222; padding-bottom: 20px;">
                        <div style="display:flex; align-items:center; gap:20px;">
                             <div class="fifa-card-mini" data-rank="${cardStyle.rank}" style="transform: scale(0.8); margin-left:-15px;">
                                <div class="mini-rat">${player.rat}</div>
                                <div class="mini-pos">${player.pos}</div>
                             </div>
                             <div>
                                <h2 style="margin:0; font-size: 1.8rem; color: #fff; font-family:'Orbitron';">${player.name.toUpperCase()}</h2>
                                <span style="color:${cardStyle.color}; font-size: 0.6rem; font-family:'Orbitron'; font-weight:900; letter-spacing:1px;">STATUS: ${cardStyle.label}</span>
                             </div>
                        </div>
                        <button onclick="window.SektorAnalyse.openEditor()" class="tactic-btn" style="border-color:var(--data-cyan); color:var(--data-cyan);">
                            <i class="fas fa-edit"></i> BIO-UPDATE
                        </button>
                    </div>

                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            ${this.renderStatCard("BODY-MASS-INDEX", bmi, (bmi > 25.5 ? "ADJUSTMENT" : "OPTIMAL"), (bmi > 25.5 ? "var(--status-error)" : "var(--neon-green)"))}
                            ${this.renderStatCard("KÖRPERFETT", (player.fat || "11") + "%", "ATHLETIC", "var(--neon-green)")}
                            ${this.renderStatCard("GRÖSSE", (player.height || "---") + " CM", "STATUR", "#fff")}
                            ${this.renderStatCard("GEWICHT", (player.weight || "---") + " KG", "MASSE", "#fff")}
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 12px; padding: 20px;">
                            <h4 style="font-size: 0.6rem; color: var(--neon-green); font-family:'Orbitron'; margin-bottom:15px; letter-spacing:1px;">PERFORMANCE-INDEX (FIFA SYNC)</h4>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                ${['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(s => `
                                    <div style="text-align:center; background:#000; padding:10px; border-radius:8px; border:1px solid #333;">
                                        <div style="font-size:0.5rem; color:#666; margin-bottom:4px;">${s.toUpperCase()}</div>
                                        <div style="font-family:'Orbitron'; font-size:1rem; color:${(player[s] > 80) ? 'var(--neon-green)' : '#fff'};">${player[s] || 50}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:30px; background:rgba(0,209,255,0.03); border:1px solid rgba(0,209,255,0.15); border-radius:12px; padding:20px; display:flex; gap:25px; align-items:center;">
                        <div style="width:60px; height:60px; background:var(--data-cyan); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(0,209,255,0.3);">
                            <i class="fas fa-brain" style="font-size:1.8rem; color:#000;"></i>
                        </div>
                        <div>
                            <strong style="color:var(--data-cyan); font-family:'Orbitron'; font-size:0.75rem; letter-spacing:1px;">TONI'S BIOMETRIE-REPORT:</strong>
                            <p style="margin:8px 0 0 0; font-size:0.75rem; color:#ccc; line-height:1.6; font-family:'Inter';">
                                Analyse für <strong>${player.name}</strong> abgeschlossen. 
                                ${(player.phy < 75 && bmi < 21) ? 'Physischer Rückstand erkannt. Krafttraining und Masseaufbau priorisieren.' : ''}
                                ${(bmi > 25.5) ? 'BMI außerhalb der Elite-Norm. Fokus auf Cardio-Intervalle legen.' : 'Körperliche Verfassung im Profi-Bereich.'}
                                Die Kombination aus <strong>${player.pac} PAC</strong> und <strong>${player.dri} DRI</strong> macht die Einheit zu einem wertvollen Aktivposten in der Offensive.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, status, color) {
        return `
            <div style="background: rgba(0,0,0,0.5); padding: 18px; border-radius: 12px; border: 1px solid #222; border-top: 2px solid ${color};">
                <div style="font-size: 0.5rem; color: #666; font-family:'Orbitron'; letter-spacing:1px;">${label}</div>
                <div style="font-size: 1.4rem; font-weight: 900; color: #fff; margin: 6px 0; font-family:'Orbitron';">${value}</div>
                <div style="font-size: 0.5rem; color: ${color}; font-weight: bold; text-transform:uppercase;">● ${status}</div>
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
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.92); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(15px);";
        overlay.innerHTML = `
            <div style="background:#0a0a0a; border:1px solid var(--data-cyan); padding:35px; border-radius:20px; width:420px; font-family:'Orbitron'; box-shadow: 0 0 100px #000;">
                <h3 style="color:var(--data-cyan); margin-bottom:25px; font-size:0.8rem; letter-spacing:2px;">LABOR-EINGRIFF: ${p.name.toUpperCase()}</h3>
                <div style="display:grid; gap:20px;">
                    <div><label style="font-size:0.55rem; color:#666; margin-bottom:8px; display:block;">GRÖSSE (CM)</label><input type="number" id="edit-h" value="${p.height || 180}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; border-radius:5px;"></div>
                    <div><label style="font-size:0.55rem; color:#666; margin-bottom:8px; display:block;">GEWICHT (KG)</label><input type="number" id="edit-w" value="${p.weight || 75}" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; border-radius:5px;"></div>
                    <div><label style="font-size:0.55rem; color:#666; margin-bottom:8px; display:block;">KÖRPERFETT (%)</label><input type="number" id="edit-f" value="${p.fat || 11}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:12px; border-radius:5px;"></div>
                </div>
                <div style="display:flex; gap:12px; margin-top:35px;">
                    <button onclick="document.getElementById('bio-editor').remove()" style="flex:1; background:#222; color:#fff; border:none; padding:12px; cursor:pointer; font-family:'Orbitron'; font-size:0.7rem;">ABBRECHEN</button>
                    <button onclick="window.SektorAnalyse.saveData()" style="flex:1; background:var(--data-cyan); color:#000; border:none; padding:12px; cursor:pointer; font-weight:bold; font-family:'Orbitron'; font-size:0.7rem;">DATEN SICHERN</button>
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
            if(window.ToniVoice) window.ToniVoice.speak("Biometrische Daten für " + p.name.split(' ').pop() + " versiegelt.");
        }
    }
};
