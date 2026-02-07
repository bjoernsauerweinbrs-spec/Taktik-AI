/**
 * TONI 2.0 - SEKTOR STADION (DIE EINSATZ-MAPPE)
 * Hochprofessionelles Clipboard-System mit Live-Snapshots & Material-Logik.
 */
window.SektorStadion = {
    currentTab: 'training', // 'training' oder 'match'

    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.render(content);
    },

    render(content) {
        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom: 1px solid rgba(57, 255, 20, 0.2); padding-bottom: 15px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px;">EINSATZ-MAPPE</h2>
                    <span style="color: #555; font-size: 0.7rem; letter-spacing: 1px;">KLASSIFIZIERTE TRAININGS- & SPIELPLANUNG</span>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button class="tactic-btn" 
                            style="background: ${this.currentTab === 'training' ? 'var(--neon-green)' : '#111'}; color: ${this.currentTab === 'training' ? '#000' : '#fff'}"
                            onclick="window.SektorStadion.currentTab='training'; window.SektorStadion.open();">
                        <i class="fas fa-clipboard-list"></i> TRAINING
                    </button>
                    <button class="tactic-btn" 
                            style="background: ${this.currentTab === 'match' ? 'var(--neon-green)' : '#111'}; color: ${this.currentTab === 'match' ? '#000' : '#fff'}"
                            onclick="window.SektorStadion.currentTab='match'; window.SektorStadion.open();">
                        <i class="fas fa-shield-alt"></i> MATCH-PLAN
                    </button>
                </div>

                <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
            </div>
        `;

        html += (this.currentTab === 'training') ? this.renderTrainingView() : this.renderMatchView();
        content.innerHTML = html;
    },

    renderTrainingView() {
        const tp = window.Database.trainingPlan;
        return `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 300px; gap: 25px;">
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    ${this.renderPlanStep('warmup', '1. AUFWÄRMEN / WARM-UP', tp.warmup)}
                    ${this.renderPlanStep('mainPart', '2. HAUPTTEIL / DRILLS', tp.mainPart)}
                    ${this.renderPlanStep('coolDown', '3. AUSLAUFEN / REGEN.', tp.coolDown)}
                </div>
                
                <div style="background: rgba(0,0,0,0.4); border: 1px solid #222; border-radius: 15px; padding: 25px; align-self: start;">
                    <h4 style="color: var(--accent-gold); font-size: 0.7rem; margin-bottom: 20px; letter-spacing: 2px; text-transform: uppercase;">Material-Checkliste</h4>
                    <div id="material-list" style="color: #bbb; font-size: 0.85rem; line-height: 2;">
                        ${this.generateMaterialList()}
                    </div>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;">
                    <button class="pro-btn-gold" style="width:100%;" onclick="window.print()">
                        <i class="fas fa-print"></i> PDF / DRUCK EXPORT
                    </button>
                </div>
            </div>
        `;
    },

    renderMatchView() {
        const mp = window.Database.matchPlan;
        return `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
                <div style="display: flex; flex-direction: column; gap: 25px;">
                    <div>
                        <h4 style="color: var(--neon-green); font-size: 0.75rem; margin-bottom: 12px; letter-spacing: 1px;">GEGNER-ANALYSE (TONI KI)</h4>
                        <div style="background: #000; border: 1px solid #222; padding: 20px; border-radius: 12px; border-left: 3px solid var(--data-cyan);">
                            <p style="color: var(--text-dim); font-size: 0.9rem; font-style: italic; line-height: 1.5;">"${mp.opponentInfo}"</p>
                            <button class="tactic-btn" style="margin-top: 15px; font-size: 0.65rem;" onclick="window.SektorStadion.scanOpponent()">
                                <i class="fas fa-search-plus"></i> KI-SCAN STARTEN
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 style="color: var(--neon-green); font-size: 0.75rem; margin-bottom: 12px; letter-spacing: 1px;">MOTIVATION & LEADERSHIP</h4>
                        <textarea class="pro-textarea" style="height: 120px;" 
                                  onchange="window.Database.updateMatchInfo('motivation', this.value)" 
                                  placeholder="Eintragen: Was ist die Kernbotschaft für das Team?">${mp.motivation}</textarea>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 25px;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h4 style="color: var(--accent-gold); font-size: 0.75rem; letter-spacing: 1px;">AKTUELLSTE AUFSTELLUNG</h4>
                            <button class="tactic-btn" style="font-size: 0.6rem; margin: 0;" onclick="window.SektorStadion.takeSnapshot('lineup')">
                                <i class="fas fa-camera"></i> FIXIEREN
                            </button>
                        </div>
                        <div style="width: 100%; height: 280px; background: #051205; border: 1px solid #222; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                            ${mp.lineupImg ? `<img src="${mp.lineupImg}" style="width: 100%; height: 100%; object-fit: contain;">` 
                                           : `<div style="text-align:center; opacity:0.1"><i class="fas fa-users-cog" style="font-size:3rem;"></i><p>Kein Snapshot</p></div>`}
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="color: var(--neon-green); font-size: 0.75rem; margin-bottom: 12px; letter-spacing: 1px;">TACTICAL NOTES (MATCHDAY)</h4>
                        <textarea class="pro-textarea" style="height: 120px;" 
                                  onchange="window.Database.updateMatchInfo('notes', this.value)" 
                                  placeholder="Taktische Kniffe, Standardsituationen, Wechseloptionen...">${mp.notes}</textarea>
                    </div>
                </div>
            </div>
        `;
    },

    renderPlanStep(stepId, title, data) {
        return `
            <div style="background: rgba(255,255,255,0.02); border-radius: 15px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); border-left: 4px solid var(--neon-green);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4 style="font-size: 0.85rem; color: #fff; letter-spacing: 1px;">${title}</h4>
                    <button class="tactic-btn" style="font-size: 0.6rem; margin: 0;" onclick="window.SektorStadion.takeSnapshot('${stepId}')">
                        <i class="fas fa-camera"></i> ARENA SNAPSHOT
                    </button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 220px; gap: 20px;">
                    <textarea class="pro-textarea" style="height: 110px; font-size: 0.85rem;" 
                              onchange="window.Database.updateTrainingStep('${stepId}', 'desc', this.value)"
                              placeholder="Beschreibe Übungsablauf, Coaching-Punkte und Intensität...">${data.desc}</textarea>
                    <div style="background: #000; border: 1px solid #222; border-radius: 10px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                        ${data.img ? `<img src="${data.img}" style="width:100%; height:100%; object-fit:cover;">` 
                                   : `<i class="fas fa-project-diagram" style="color: #111; font-size: 2.5rem;"></i>`}
                    </div>
                </div>
            </div>
        `;
    },

    // --- FUNKTIONEN ---

    generateMaterialList() {
        if (!window.arena || !window.arena.elements) return "Kein Equipment in Arena platziert.";
        
        const counts = {};
        window.arena.elements.forEach(el => {
            if (el.type !== 'player') {
                counts[el.type] = (counts[el.type] || 0) + 1;
            }
        });

        const labels = { cone: 'Markierungshütchen', ball: 'Trainingsbälle', goal: 'Minitore' };
        let listHtml = "";
        
        for (let type in counts) {
            listHtml += `<div style="display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-check-circle" style="color:var(--neon-green); font-size:0.7rem;"></i> 
                            ${counts[type]}x ${labels[type] || type}
                         </div>`;
        }
        
        return listHtml || "Arena-Board ist leer.";
    },

    takeSnapshot(target) {
        if (!window.arena) return;
        const imgData = window.arena.getSnapshot();
        
        if (target === 'lineup') {
            window.Database.updateMatchInfo('lineupImg', imgData);
        } else {
            window.Database.updateTrainingStep(target, 'img', imgData);
        }
        
        // UI Refreshen um das Bild anzuzeigen
        this.open();
    },

    scanOpponent() {
        const team = prompt("Gegner-Team Name:");
        if (team) {
            window.Database.updateMatchInfo('opponentInfo', `KI-SCAN läuft für ${team.toUpperCase()}... Analyse von System, Standards und Schlüsselspielern wird durchgeführt.`);
            this.open();
            // Hier könnte man später eine echte API-Anfrage starten
            setTimeout(() => {
                window.Database.updateMatchInfo('opponentInfo', `ANALYSE ABGESCHLOSSEN: ${team} bevorzugt ein 4-2-3-1 mit hohem Pressing. Fokus auf linken Flügel (Top-Scorer). Schwäche bei defensiven Umschaltmomenten.`);
                this.open();
            }, 2000);
        }
    }
};
