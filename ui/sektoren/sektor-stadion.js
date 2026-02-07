/**
 * TONI 2.0 - SEKTOR STADION (DIE EINSATZ-MAPPE)
 * Clipboard-System für Trainingsphasen und Match-Planung.
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
                    <span style="color: #555; font-size: 0.7rem;">STRATEGISCHE PLANUNG & DOKUMENTATION</span>
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

        if (this.currentTab === 'training') {
            html += this.renderTrainingView();
        } else {
            html += this.renderMatchView();
        }

        content.innerHTML = html;
    },

    renderTrainingView() {
        const tp = window.Database.trainingPlan;
        return `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 300px; gap: 20px;">
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    ${this.renderPlanStep('warmup', '1. AUFWÄRMEN', tp.warmup)}
                    ${this.renderPlanStep('mainPart', '2. HAUPTTEIL', tp.mainPart)}
                    ${this.renderPlanStep('coolDown', '3. AUSLAUFEN', tp.coolDown)}
                </div>
                
                <div style="background: rgba(0,0,0,0.3); border: 1px solid #222; border-radius: 15px; padding: 20px;">
                    <h4 style="color: var(--accent-gold); font-size: 0.8rem; margin-bottom: 15px; letter-spacing: 1px;">MATERIAL-CHECKLISTE</h4>
                    <div id="material-list" style="color: #888; font-size: 0.85rem; line-height: 1.8;">
                        <i class="fas fa-check-circle" style="color:var(--neon-green)"></i> 12x Markierungshütchen<br>
                        <i class="fas fa-check-circle" style="color:var(--neon-green)"></i> 8x Trainingsbälle (Gr. 5)<br>
                        <i class="fas fa-check-circle" style="color:var(--neon-green)"></i> 2x Minitore<br>
                        <i class="fas fa-check-circle" style="color:var(--neon-green)"></i> 1x Koordinationsleiter
                    </div>
                    <button class="pro-btn-gold" style="width:100%; margin-top:20px; font-size:0.7rem;" onclick="alert('Drucke Trainingsblatt...')">
                        <i class="fas fa-print"></i> PLAN DRUCKEN
                    </button>
                </div>
            </div>
        `;
    },

    renderMatchView() {
        const mp = window.Database.matchPlan;
        return `
            <div class="fadeIn" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h4 style="color: var(--neon-green); font-size: 0.8rem; margin-bottom: 10px;">GEGNER-ANALYSE (KI)</h4>
                    <div style="background: #000; border: 1px solid #222; padding: 15px; border-radius: 10px; min-height: 100px;">
                        <p style="color: var(--text-dim); font-size: 0.9rem; font-style: italic;">"${mp.opponentInfo}"</p>
                        <button class="tactic-btn" style="margin-top: 10px; font-size: 0.6rem;" onclick="alert('Toni scannt das Internet...')">KI-UPDATE STARTEN</button>
                    </div>

                    <h4 style="color: var(--neon-green); font-size: 0.8rem; margin-top: 20px; margin-bottom: 10px;">MOTIVATIONSSPRUCH</h4>
                    <textarea class="pro-textarea" onchange="window.Database.updateMatchInfo('motivation', this.value)" 
                              placeholder="Heute zählt nur der Wille!">${mp.motivation}</textarea>
                </div>

                <div>
                    <h4 style="color: var(--accent-gold); font-size: 0.8rem; margin-bottom: 10px;">AUFSTELLUNGS-SNAPSHOT</h4>
                    <div style="width: 100%; height: 250px; background: #051205; border: 1px solid #222; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-camera" style="font-size: 2rem; color: #222;"></i>
                        <span style="color: #222; margin-left: 10px;">Snapshot aus Arena laden</span>
                    </div>
                    
                    <h4 style="color: var(--neon-green); font-size: 0.8rem; margin-top: 20px; margin-bottom: 10px;">COACH NOTIZEN</h4>
                    <textarea class="pro-textarea" style="height: 100px;" onchange="window.Database.updateMatchInfo('notes', this.value)" 
                              placeholder="Taktische Anweisungen für die Halbzeit...">${mp.notes}</textarea>
                </div>
            </div>
        `;
    },

    renderPlanStep(stepId, title, data) {
        return `
            <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 20px; border-left: 4px solid var(--neon-green);">
                <div style="display: flex; justify-content: space-between;">
                    <h4 style="font-size: 0.9rem; color: #fff;">${title}</h4>
                    <button style="background:none; border:none; color:var(--neon-green); cursor:pointer;" onclick="alert('Arena Snapshot wird eingefügt...')">
                        <i class="fas fa-camera"></i> Snapshot
                    </button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 180px; gap: 15px; margin-top: 10px;">
                    <textarea class="pro-textarea" style="height: 80px;" 
                              onchange="window.Database.updateTrainingStep('${stepId}', 'desc', this.value)"
                              placeholder="Beschreibung der Übung...">${data.desc}</textarea>
                    <div style="background: #000; border: 1px solid #222; border-radius: 8px; display:flex; align-items:center; justify-content:center;">
                        <i class="fas fa-image" style="color: #111; font-size: 1.5rem;"></i>
                    </div>
                </div>
            </div>
        `;
    }
};
