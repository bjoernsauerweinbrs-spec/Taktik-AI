/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE HUB)
 * Fokus: Full Biometrie, Pulsierendes Herz & Radar-Sync
 * Status: CLEAN & SYNCED 2026
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
        return window.Database.players.filter(p => (team === "Senioren") ? p.team === "Senioren" : p.jugend === team);
    },

    render() {
        const content = document.getElementById('active-content');
        if (!content) return;

        const team = window.currentTeamContext || "Senioren";
        const players = this.getFilteredPlayers(team);
        const player = players.find(p => p.id == this.selectedPlayerId) || players[0];
        
        if (!player) {
            content.innerHTML = `<div style="padding:40px; text-align:center; color:#444; font-family:'Orbitron';">KEINE DATEN VERFÜGBAR.</div>`;
            return;
        }

        const heightM = (player.height || 180) / 100;
        const bmi = ((player.weight || 75) / (heightM * heightM)).toFixed(1);

        content.innerHTML = `
            <style>
                @keyframes heartBeat {
                    0% { transform: scale(1); filter: drop-shadow(0 0 5px #ff3131); }
                    15% { transform: scale(1.3); filter: drop-shadow(0 0 15px #ff3131); }
                    30% { transform: scale(1); }
                    45% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
                .biometric-heart { 
                    color: #ff3131; 
                    font-size: 2.5rem; 
                    animation: heartBeat ${60 / (player.rhr || 60)}s infinite; 
                }
            </style>
            
            <div class="fadeIn" style="display: grid; grid-template-columns: 280px 1fr; gap: 20px; height: 100%; overflow: hidden;">
                
                <div style="background: rgba(0,0,0,0.4); border-radius: 15px; padding: 15px; overflow-y: auto; border: 1px solid rgba(0,209,255,0.1);">
                    <h3 style="font-size: 0.6rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 20px; font-family:'Orbitron';">BIO-MONITORING</h3>
                    ${players.map(p => `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 10px; border-radius: 8px; cursor: pointer; border: 1px solid ${this.selectedPlayerId == p.id ? 'var(--data-cyan)' : '#222'}; 
                             background: ${this.selectedPlayerId == p.id ? 'rgba(0,209,255,0.08)' : 'rgba(255,255,255,0.02)'}; transition: 0.2s;">
                            <div style="font-weight: bold; font-size: 0.75rem; color:#fff; font-family:'Orbitron';">${p.name.toUpperCase()}</div>
                            <div style="font-size: 0.55rem; color: #666;">PULS: ${p.rhr || '--'} | SpO2: ${p.spo2 || '--'}%</div>
                        </div>`).join('')}
                </div>

                <div style="overflow-y: auto; padding-right:15px; padding-bottom:50px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                        <div>
                            <h2 style="margin:0; font-size: 1.8rem; color: #fff; font-family:'Orbitron';">${player.name.toUpperCase()}</h2>
                            <span style="color:var(--data-cyan); font-size:0.6rem; letter-spacing:1px;">PERFORMANCE HUB</span>
                        </div>
                        <button onclick="window.SektorAnalyse.openEditor()" class="pro-btn-gold" style="font-size:0.65rem;"><i class="fas fa-microscope"></i> LABOR-EDIT</button>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 320px; gap: 20px;">
                        <div style="display: grid; gap: 20px;">
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 30px;">
                                <div class="biometric-heart"><i class="fas fa-heart-pulse"></i></div>
                                <div style="flex:1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                    ${this.miniStat("RUHEPULS", (player.rhr || 60) + " BPM", "var(--neon-red)")}
                                    ${this.miniStat("SpO2", (player.spo2 || 98) + " %", "var(--data-cyan)")}
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 12px; padding: 15px;">
                                    <h4 style="font-size: 0.55rem; color: var(--neon-green); font-family:'Orbitron'; margin-bottom:12px;">BODY-INDEX</h4>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                        ${this.miniStat("BMI", bmi)}
                                        ${this.miniStat("FETT", player.fat + " %")}
                                        ${this.miniStat("MUSKEL", player.muscle + " KG")}
                                    </div>
                                </div>
                                <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 12px; padding: 15px;">
                                    <h4 style="font-size: 0.55rem; color: var(--accent-gold); font-family:'Orbitron'; margin-bottom:12px;">WATCH-SYNC</h4>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                        ${this.miniStat("REC", (player.recovery || 0) + "%")}
                                        ${this.miniStat("SLEEP", (player.sleep || 0) + " H")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="background: #000; border: 1px solid #222; border-radius: 12px; padding: 20px;">
                            <canvas id="radarChart" width="280" height="280"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        setTimeout(() => this.drawRadar(player), 50);
    },

    miniStat(l, v, color = "#fff") {
        return `<div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px; border-left: 2px solid ${color};">
                <div style="font-size:0.45rem; color:#666; margin-bottom:4px; font-family:'Orbitron';">${l}</div>
                <div style="font-size:0.9rem; color:${color}; font-family:'Orbitron'; font-weight:bold;">${v}</div>
            </div>`;
    },

    drawRadar(p) {
        const canvas = document.getElementById('radarChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const cx = 140, cy = 140, r = 100;
        const stats = [p.pac||50, p.sho||50, p.pas||50, p.dri||50, p.def||50, p.phy||50];
        const labels = ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"];

        ctx.clearRect(0,0,280,280);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        for(let j=1; j<=4; j++) {
            ctx.beginPath();
            for(let i=0; i<6; i++) {
                let ang = (Math.PI/3) * i - Math.PI/2;
                let x = cx + (r * j/4) * Math.cos(ang);
                let y = cy + (r * j/4) * Math.sin(ang);
                i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
            }
            ctx.closePath(); ctx.stroke();
        }

        ctx.beginPath();
        ctx.strokeStyle = "#39FF14";
        ctx.fillStyle = "rgba(57, 255, 20, 0.2)";
        ctx.lineWidth = 2;
        for(let i=0; i<6; i++) {
            let ang = (Math.PI/3) * i - Math.PI/2;
            let valR = (stats[i]/100) * r;
            let x = cx + valR * Math.cos(ang);
            let y = cy + valR * Math.sin(ang);
            i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
    },

    selectPlayer(id) { this.selectedPlayerId = id; this.render(); },

    openEditor() {
        const p = window.Database.players.find(x => x.id == this.selectedPlayerId);
        if(!p) return;
        const overlay = document.createElement('div');
        overlay.id = "labor-editor-overlay";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.96); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(20px);";
        overlay.innerHTML = `
            <div style="background:#05080F; border:2px solid var(--data-cyan); padding:35px; border-radius:15px; width:520px; font-family:'Orbitron'; color:#fff;">
                <h3 style="color:var(--data-cyan); margin-bottom:25px; font-size:0.9rem;">LABOR-INPUT: ${p.name.toUpperCase()}</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                    ${["height", "weight", "fat", "muscle", "rhr", "spo2", "recovery", "sleep"].map(f => `
                        <div><label style="font-size:0.5rem; color:#666;">${f.toUpperCase()}</label>
                        <input type="number" id="ed-${f}" value="${p[f]||0}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:var(--data-cyan); padding:10px; border-radius:4px; font-family:'Orbitron';"></div>
                    `).join('')}
                </div>
                <div style="display:flex; gap:15px; margin-top:30px;">
                    <button onclick="document.getElementById('labor-editor-overlay').remove()" style="flex:1; background:#111; color:#fff; border:1px solid #333; padding:15px; cursor:pointer;">STOP</button>
                    <button onclick="window.SektorAnalyse.saveData()" style="flex:2; background:var(--data-cyan); color:#000; border:none; padding:15px; cursor:pointer; font-weight:bold;">DATEN-SYNC</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
    },

    saveData() {
        const p = window.Database.players.find(x => x.id == this.selectedPlayerId);
        if(p) {
            ["height", "weight", "fat", "muscle", "rhr", "spo2", "recovery", "sleep"].forEach(f => {
                p[f] = parseFloat(document.getElementById('ed-'+f).value);
            });
            window.Database.save();
            document.getElementById('labor-editor-overlay').remove();
            this.render();
        }
    }
};
