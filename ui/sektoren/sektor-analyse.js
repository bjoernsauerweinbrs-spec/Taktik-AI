/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE HUB)
 * Fokus: Full Biometrie & Dynamisches Radar-Chart (Spider-Web)
 * Status: ETAPPE 4.5 - ANALYSE-ZENTRUM VOLLSTÄNDIG VERSIEGELT
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
            content.innerHTML = `<div style="padding:40px; text-align:center; color:#444;">KEIN KADER GELADEN.</div>`;
            return;
        }

        const bmi = (player.weight / ((player.height/100) * (player.height/100))).toFixed(1);

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 260px 1fr; gap: 20px; height: 100%; overflow: hidden;">
                
                <div style="background: rgba(0,0,0,0.4); border-radius: 15px; padding: 15px; overflow-y: auto; border: 1px solid #222;">
                    <h3 style="font-size: 0.6rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 20px; font-family:'Orbitron';">BIO-MONITORING</h3>
                    ${players.map(p => `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 10px; border-radius: 8px; cursor: pointer; border: 1px solid ${this.selectedPlayerId == p.id ? 'var(--data-cyan)' : '#222'}; 
                             background: ${this.selectedPlayerId == p.id ? 'rgba(0,209,255,0.08)' : 'rgba(255,255,255,0.02)'}; transition: 0.2s;">
                            <div style="font-weight: bold; font-size: 0.75rem; color:#fff; font-family:'Orbitron';">${p.name.toUpperCase()}</div>
                            <div style="font-size: 0.55rem; color: #666;">OVR: ${p.rat} | BMI: ${bmi}</div>
                        </div>`).join('')}
                </div>

                <div style="overflow-y: auto; padding-right:15px; padding-bottom:40px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                        <h2 style="margin:0; font-size: 1.8rem; color: #fff; font-family:'Orbitron';">${player.name.toUpperCase()}</h2>
                        <button onclick="window.SektorAnalyse.openEditor()" class="pro-btn-gold" style="font-size:0.65rem;"><i class="fas fa-microscope"></i> LABOR-EDIT</button>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 300px; gap: 20px;">
                        
                        <div style="display: grid; gap: 20px;">
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 12px; padding: 15px;">
                                <h4 style="font-size: 0.55rem; color: var(--neon-green); font-family:'Orbitron'; margin-bottom:12px;">BIOMETRIE</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                    ${this.miniStat("BMI", bmi)}
                                    ${this.miniStat("FETT %", player.fat)}
                                    ${this.miniStat("MUSKEL", player.muscle)}
                                    ${this.miniStat("VO2 MAX", player.vo2)}
                                </div>
                            </div>
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 12px; padding: 15px;">
                                <h4 style="font-size: 0.55rem; color: var(--data-cyan); font-family:'Orbitron'; margin-bottom:12px;">SPORTUHR VITAL</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                    ${this.miniStat("RUHEPULS", player.rhr)}
                                    ${this.miniStat("RECOVERY", player.recovery + "%")}
                                    ${this.miniStat("SCHLAF", player.sleep)}
                                    ${this.miniStat("GEWICHT", player.weight + "kg")}
                                </div>
                            </div>
                        </div>

                        <div style="background: #000; border: 1px solid #222; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center;">
                            <h4 style="font-size: 0.55rem; color: #fff; font-family:'Orbitron'; margin-bottom:15px; letter-spacing:1px;">PERFORMANCE RADAR</h4>
                            <canvas id="radarChart" width="250" height="250"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Timeout damit das Canvas Element im DOM existiert
        setTimeout(() => this.drawRadar(player), 50);
    },

    miniStat(l, v) {
        return `<div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:5px;"><div style="font-size:0.45rem; color:#666;">${l}</div><div style="font-size:0.8rem; color:#fff; font-family:'Orbitron';">${v || '---'}</div></div>`;
    },

    drawRadar(p) {
        const canvas = document.getElementById('radarChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const cx = 125, cy = 125, r = 90;
        const stats = [p.pac||50, p.sho||50, p.pas||50, p.dri||50, p.def||50, p.phy||50];
        const labels = ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"];

        ctx.clearRect(0,0,250,250);
        
        // 1. Hintergrund-Netz (6-Eck)
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

        // 2. Achsen & Labels
        ctx.font = "8px Orbitron";
        ctx.fillStyle = "#666";
        ctx.textAlign = "center";
        for(let i=0; i<6; i++) {
            let ang = (Math.PI/3) * i - Math.PI/2;
            ctx.beginPath(); ctx.moveTo(cx,cy);
            ctx.lineTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
            ctx.stroke();
            ctx.fillText(labels[i], cx + (r+15) * Math.cos(ang), cy + (r+15) * Math.sin(ang) + 4);
        }

        // 3. Daten-Fläche (Neon Green Glow)
        ctx.beginPath();
        ctx.strokeStyle = "var(--neon-green)";
        ctx.fillStyle = "rgba(57, 255, 20, 0.3)";
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
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(15px);";
        overlay.innerHTML = `
            <div style="background:#0a0a0a; border:2px solid var(--data-cyan); padding:30px; border-radius:20px; width:500px; font-family:'Orbitron'; color:#fff;">
                <h3 style="color:var(--data-cyan); margin-bottom:20px; font-size:0.8rem;">BIOMETRIE-INPUT: ${p.name.toUpperCase()}</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                    ${["height", "weight", "fat", "muscle", "water", "visceral", "bone", "rhr", "vo2", "recovery", "sleep"].map(f => `
                        <div><label style="font-size:0.4rem; color:#666;">${f.toUpperCase()}</label>
                        <input type="number" id="ed-${f}" value="${p[f]||0}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px;"></div>
                    `).join('')}
                </div>
                <div style="display:flex; gap:10px; margin-top:25px;">
                    <button onclick="document.getElementById('labor-editor-overlay').remove()" style="flex:1; background:#222; color:#fff; border:none; padding:12px; cursor:pointer;">STOP</button>
                    <button onclick="window.SektorAnalyse.saveData()" style="flex:2; background:var(--data-cyan); color:#000; border:none; padding:12px; cursor:pointer; font-weight:bold;">DATEN-SYNC</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
    },

    saveData() {
        const p = window.Database.players.find(x => x.id == this.selectedPlayerId);
        if(p) {
            ["height", "weight", "fat", "muscle", "water", "visceral", "bone", "rhr", "vo2", "recovery", "sleep"].forEach(f => {
                p[f] = parseFloat(document.getElementById('ed-'+f).value);
            });
            window.Database.save();
            document.getElementById('labor-editor-overlay').remove();
            this.render();
        }
    }
};
