/**
 * TONI 2.0 - SEKTOR ANALYSE (ELITE PERFORMANCE CENTER)
 * Fokus: Biometrie-Monitoring (Waage & Sportuhr) + FIFA-Sync
 * Status: ETAPPE 4.2 - LABOR VOLLSTÄNDIG VERSIEGELT
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

    calculateBMI(h, w) {
        if (!h || !w) return "---";
        const hm = h / 100;
        return (w / (hm * hm)).toFixed(1);
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

        const bmi = this.calculateBMI(player.height, player.weight);

        content.innerHTML = `
            <div class="fadeIn" style="display: grid; grid-template-columns: 280px 1fr; gap: 20px; height: 100%; overflow: hidden;">
                
                <div style="background: rgba(0,0,0,0.4); border-radius: 15px; padding: 15px; overflow-y: auto; border: 1px solid #222;">
                    <h3 style="font-size: 0.6rem; color: var(--data-cyan); letter-spacing: 2px; margin-bottom: 20px; font-family:'Orbitron';">BIO-MONITORING</h3>
                    ${players.map(p => {
                        const isSelected = this.selectedPlayerId == p.id;
                        return `
                        <div onclick="window.SektorAnalyse.selectPlayer('${p.id}')" 
                             style="padding: 12px; margin-bottom: 10px; border-radius: 8px; cursor: pointer; border: 1px solid ${isSelected ? 'var(--data-cyan)' : '#222'}; 
                             background: ${isSelected ? 'rgba(0,209,255,0.08)' : 'rgba(255,255,255,0.02)'}; transition: 0.2s;">
                            <div style="font-weight: bold; font-size: 0.75rem; color:#fff; font-family:'Orbitron';">${p.name.toUpperCase()}</div>
                            <div style="font-size: 0.55rem; color: #666; margin-top:4px;">BMI: ${this.calculateBMI(p.height, p.weight)} | OVR: ${p.rat}</div>
                        </div>`;
                    }).join('')}
                </div>

                <div style="overflow-y: auto; padding-right:15px; padding-bottom:40px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 20px;">
                        <div>
                            <h2 style="margin:0; font-size: 1.8rem; color: #fff; font-family:'Orbitron';">${player.name.toUpperCase()}</h2>
                            <span style="color:var(--neon-green); font-size: 0.6rem; font-family:'Orbitron'; font-weight:900; letter-spacing:2px;">STATUS: AKTIV-ANALYSE</span>
                        </div>
                        <button onclick="window.SektorAnalyse.openEditor()" class="pro-btn-gold" style="font-size:0.65rem;">
                            <i class="fas fa-microscope"></i> LABOR-DATEN EDITIEREN
                        </button>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 12px; padding: 20px;">
                            <h4 style="font-size: 0.6rem; color: var(--neon-green); font-family:'Orbitron'; margin-bottom:15px;"><i class="fas fa-weight"></i> KÖRPERFETT-WAAGE</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                ${this.renderStat("BMI", bmi)}
                                ${this.renderStat("KÖRPERFETT", (player.fat || "---") + "%")}
                                ${this.renderStat("MUSKELMASSE", (player.muscle || "---") + "%")}
                                ${this.renderStat("WASSER", (player.water || "---") + "%")}
                                ${this.renderStat("VISZERALFETT", (player.visceral || "---"))}
                                ${this.renderStat("KNOCHENMASSE", (player.bone || "---") + " KG")}
                            </div>
                        </div>

                        <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 12px; padding: 20px;">
                            <h4 style="font-size: 0.6rem; color: var(--data-cyan); font-family:'Orbitron'; margin-bottom:15px;"><i class="fas fa-stopwatch"></i> SMART-WATCH PERFORMANCE</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                ${this.renderStat("RUHEPULS", (player.rhr || "---") + " BPM")}
                                ${this.renderStat("VO2 MAX", (player.vo2 || "---"))}
                                ${this.renderStat("RECOVERY", (player.recovery || "---") + "%")}
                                ${this.renderStat("SCHLAF-SCORE", (player.sleep || "---"))}
                                ${this.renderStat("GRÖSSE", (player.height || "---") + " CM")}
                                ${this.renderStat("GEWICHT", (player.weight || "---") + " KG")}
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:20px; background: rgba(0,209,255,0.03); border: 1px solid rgba(0,209,255,0.2); border-radius: 12px; padding: 20px;">
                        <h4 style="font-size: 0.6rem; color: #fff; font-family:'Orbitron'; margin-bottom:15px;">FELD-LEISTUNG (FIFA STATS)</h4>
                        <div style="display: flex; justify-content: space-between; gap: 10px;">
                            ${['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(s => `
                                <div style="flex:1; text-align:center; background:#000; padding:10px; border-radius:5px; border:1px solid #333;">
                                    <div style="font-size:0.5rem; color:#666; margin-bottom:5px;">${s.toUpperCase()}</div>
                                    <div style="font-family:'Orbitron'; font-size:1.1rem; color:#39FF14;">${player[s] || 50}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStat(label, value) {
        return `
            <div style="background:rgba(0,0,0,0.4); padding:10px; border-radius:6px; border-left: 2px solid #333;">
                <div style="font-size:0.5rem; color:#666; text-transform:uppercase;">${label}</div>
                <div style="font-size:0.9rem; color:#fff; font-weight:bold; font-family:'Orbitron'; margin-top:2px;">${value}</div>
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
        overlay.id = "labor-editor-overlay";
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(15px);";
        
        overlay.innerHTML = `
            <div style="background:#0a0a0a; border:2px solid var(--data-cyan); padding:30px; border-radius:20px; width:600px; max-height:90vh; overflow-y:auto; font-family:'Orbitron'; color:#fff;">
                <h3 style="color:var(--data-cyan); margin-bottom:25px; font-size:0.9rem; letter-spacing:2px; text-align:center;">LABOR-INPUT: ${p.name.toUpperCase()}</h3>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px;">
                    <div>
                        <h4 style="color:var(--neon-green); font-size:0.6rem; margin-bottom:15px; border-bottom:1px solid #222; padding-bottom:5px;">BIO-WAAGE DATA</h4>
                        ${this.renderInput("GRÖSSE (CM)", "edit-height", p.height)}
                        ${this.renderInput("GEWICHT (KG)", "edit-weight", p.weight)}
                        ${this.renderInput("KÖRPERFETT (%)", "edit-fat", p.fat)}
                        ${this.renderInput("MUSKELMASSE (%)", "edit-muscle", p.muscle)}
                        ${this.renderInput("VISZERALFETT", "edit-visceral", p.visceral)}
                        ${this.renderInput("KNOCHENMASSE (KG)", "edit-bone", p.bone)}
                        ${this.renderInput("WASSER (%)", "edit-water", p.water)}
                    </div>
                    <div>
                        <h4 style="color:var(--data-cyan); font-size:0.6rem; margin-bottom:15px; border-bottom:1px solid #222; padding-bottom:5px;">SPORTUHR DATA</h4>
                        ${this.renderInput("RUHEPULS (BPM)", "edit-rhr", p.rhr)}
                        ${this.renderInput("VO2 MAX", "edit-vo2", p.vo2)}
                        ${this.renderInput("RECOVERY (%)", "edit-recovery", p.recovery)}
                        ${this.renderInput("SCHLAF-SCORE (1-100)", "edit-sleep", p.sleep)}
                    </div>
                </div>

                <div style="display:flex; gap:15px; margin-top:35px; border-top:1px solid #222; padding-top:20px;">
                    <button onclick="document.getElementById('labor-editor-overlay').remove()" style="flex:1; background:#222; color:#fff; border:none; padding:15px; cursor:pointer; font-family:'Orbitron';">STOP</button>
                    <button onclick="window.SektorAnalyse.saveData()" style="flex:2; background:var(--data-cyan); color:#000; border:none; padding:15px; cursor:pointer; font-weight:bold; font-family:'Orbitron';">SYNC LABOR-DATEN</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    renderInput(label, id, value) {
        return `
            <div style="margin-bottom:12px;">
                <label style="font-size:0.5rem; color:#666; display:block; margin-bottom:4px;">${label}</label>
                <input type="number" id="${id}" value="${value || 0}" step="0.1" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:10px; border-radius:4px;">
            </div>`;
    },

    saveData() {
        const p = window.Database.players.find(x => x.id == this.selectedPlayerId);
        if(p) {
            const fields = ["height", "weight", "fat", "muscle", "visceral", "bone", "water", "rhr", "vo2", "recovery", "sleep"];
            fields.forEach(f => {
                const el = document.getElementById('edit-' + f);
                if(el) p[f] = parseFloat(el.value);
            });

            window.Database.save();
            document.getElementById('labor-editor-overlay').remove();
            this.render();
            if(window.ToniVoice) window.ToniVoice.speak("Biometrie-Sync für " + p.name.split(' ').pop() + " erfolgreich.");
        }
    }
};
