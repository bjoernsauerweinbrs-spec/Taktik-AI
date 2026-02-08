/**
 * TONI 2.0 - SEKTOR TRAINING (AI ADVISOR PRO)
 * Status: STABILISIERT & MATERIAL-SAFE
 */
window.SektorTraining = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Layout-Fix gegen Clipping
        content.style.paddingBottom = "150px";
        content.style.overflowY = "auto";

        this.render();
    },

    /**
     * Hilfsfunktion: Holt sicher die Anzahl aus dem Inventar, ohne abzustürzen
     */
    getInvCount(key) {
        try {
            const inv = window.Database.inventory;
            return (inv && inv[key] && inv[key].count !== undefined) ? inv[key].count : 0;
        } catch(e) { return 0; }
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const coach = window.coachInfo || { name: "Coach" };

        // Material-Check für die UI
        const balls = this.getInvCount('balls');
        const cones = this.getInvCount('cones');
        const goals = this.getInvCount('miniGoals');
        const bibs  = this.getInvCount('bibs');

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 2px solid var(--neon-green); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px;">TRAINING & KI-ADVISOR</h2>
                    <span style="color: var(--text-dim); font-size: 0.75rem;">COACH ${coach.name.toUpperCase()} | MATERIAL-SYNC: AKTIV</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div class="management-grid" style="display: grid; grid-template-columns: 1fr 350px; gap: 30px;">
                
                <div>
                    <div style="background: rgba(57, 255, 20, 0.03); padding: 25px; border-radius: 15px; border: 1px solid rgba(57, 255, 20, 0.2);">
                        <h3 style="color:var(--neon-green); margin-bottom:15px; font-size:1rem;"><i class="fas fa-robot"></i> TONIS ÜBUNGS-VORSCHLAG</h3>
                        <p style="font-size:0.85rem; color:#ccc; margin-bottom:20px;">Thema eingeben (z.B. "Umschaltspiel" oder "Flanken"). Ich plane mit deinem Equipment.</p>
                        
                        <div style="display:flex; gap:15px; margin-bottom:20px;">
                            <input type="text" id="training-focus-input" class="pro-textarea" placeholder="Was willst du heute trainieren?" style="flex:1; border: 1px solid #333;">
                            <button class="pro-btn-gold" onclick="window.SektorTraining.askToni()">GENERIEREN</button>
                        </div>

                        <div id="toni-suggestion-output" style="background: rgba(0,0,0,0.5); padding: 25px; border-radius: 12px; min-height: 250px; border-left: 5px solid var(--neon-green); color: #fff; font-size: 0.95rem; line-height: 1.7;">
                            <div style="opacity:0.3; text-align:center; padding-top:80px;">
                                <i class="fas fa-brain" style="font-size: 2.5rem; margin-bottom:15px;"></i><br>Warte auf taktische Vorgabe...
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    
                    <div style="background: rgba(0,209,255,0.05); padding: 20px; border-radius: 15px; border: 1px solid var(--data-cyan);">
                        <h4 style="color:var(--data-cyan); font-size:0.75rem; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px;">Material-Check</h4>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; font-size:0.75rem;">
                            <div style="color:${balls < 10 ? 'var(--status-error)' : '#ccc'};"><i class="fas fa-futbol"></i> Bälle: ${balls}</div>
                            <div style="color:${cones < 15 ? 'var(--status-error)' : '#ccc'};"><i class="fas fa-vial"></i> Hütchen: ${cones}</div>
                            <div style="color:${goals < 2 ? 'var(--status-error)' : '#ccc'};"><i class="fas fa-door-open"></i> Tore: ${goals}</div>
                            <div style="color:#ccc;"><i class="fas fa-shirt"></i> Leibchen: ${bibs}</div>
                        </div>
                        <button class="tactic-btn" style="width:100%; margin-top:15px; font-size:0.65rem; border-color:var(--data-cyan);" onclick="openSection('material')">LAGER VERWALTEN</button>
                    </div>

                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid #333;">
                        <h4 style="color:#fff; font-size:0.8rem; margin-bottom:15px;">LETZTE ÜBUNGEN</h4>
                        <div id="mini-archive-list" style="max-height: 250px; overflow-y:auto; padding-right:5px;"></div>
                        <button class="tactic-btn" style="width:100%; margin-top:15px;" onclick="alert('Manuelle Eingabe wird im nächsten Update aktiviert.')">+ MANUELL</button>
                    </div>
                </div>
            </div>
        `;
        this.renderMiniArchive();
    },

    async askToni() {
        const input = document.getElementById('training-focus-input');
        const output = document.getElementById('toni-suggestion-output');
        if (!input || !input.value) return;

        output.innerHTML = `<div style="text-align:center; padding-top:100px;"><span class="thinking">Toni analysiert Kaderstärke und Material...</span></div>`;

        const matInfo = `Bälle: ${this.getInvCount('balls')}, Hütchen: ${this.getInvCount('cones')}, Tore: ${this.getInvCount('miniGoals')}`;
        const playerCount = window.Database.players ? window.Database.players.length : 15;

        const prompt = `Handel als Profi-Trainer. Fokus: ${input.value}. Spieler: ${playerCount}. Material: ${matInfo}. Struktur: Name, Aufbau, Ablauf, Coaching Points. Kurz und knackig.`;

        if (window.aiOnline) {
            try {
                const savedIP = localStorage.getItem('toni_mac_ip') || 'localhost';
                const response = await fetch(`http://${savedIP}:11434/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: 'phi3', prompt: prompt, stream: false })
                });
                const data = await response.json();
                output.innerHTML = `
                    <div class="fadeIn">
                        <strong style="color:var(--neon-green);">TRAININGS-PLAN:</strong><br><br>
                        ${data.response.replace(/\n/g, '<br>')}
                    </div>
                    <button class="pro-btn-gold" style="margin-top:20px; width:100%;" onclick="window.SektorTraining.saveSuggestion('${input.value}')">PLAN SPEICHERN</button>`;
                window.ToniVoice.speak("Der Plan steht. Ich habe die Übung auf dein Material angepasst.");
            } catch (e) {
                output.innerHTML = "<span style='color:red;'>Fehler: KI-Kern nicht erreichbar.</span>";
            }
        } else {
            output.innerHTML = "KI-OFFLINE: Aktiviere mich im Setup, um den Advisor zu nutzen.";
        }
    },

    saveSuggestion(title) {
        const output = document.getElementById('toni-suggestion-output').innerText;
        const newSession = {
            title: title || "Übung",
            desc: output,
            players: window.Database.players ? window.Database.players.length : 0
        };
        if (!window.Database.trainingSessions) window.Database.trainingSessions = [];
        window.Database.trainingSessions.unshift(newSession);
        if(window.Database.save) window.Database.save();
        this.renderMiniArchive();
    },

    renderMiniArchive() {
        const list = document.getElementById('mini-archive-list');
        if(!list) return;
        const sessions = window.Database.trainingSessions || [];
        if (sessions.length === 0) {
            list.innerHTML = `<p style="font-size:0.7rem; color:#444; text-align:center;">Keine Archivdaten.</p>`;
            return;
        }
        list.innerHTML = sessions.map((s) => `
            <div style="padding:12px; background:rgba(0,0,0,0.3); border-radius:8px; margin-bottom:10px; border-left: 3px solid var(--neon-green);">
                <div style="font-size:0.8rem; font-weight:bold; color:#fff;">${s.title}</div>
                <div style="font-size:0.65rem; color:var(--neon-green);">${s.players} Spieler | KI-OPTIMIERT</div>
            </div>
        `).join('');
    }
};
