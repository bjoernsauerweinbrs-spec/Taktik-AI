/**
 * TONI 2.0 - SEKTOR TRAINING (AI ADVISOR PRO)
 * Fokus: KI-Übungs-Generator mit automatischem Material-Check.
 */
window.SektorTraining = {
    open() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;
        this.render();
    },

    render() {
        const content = document.querySelector('.briefcase-window');
        const coach = window.coachInfo || { name: "Coach" };
        const inv = window.Database.inventory;

        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid var(--neon-green); padding-bottom: 20px;">
                <div>
                    <h2 style="color:var(--neon-green); letter-spacing: 2px;">TRAINING & KI-ADVISOR</h2>
                    <span style="color: #888; font-size: 0.7rem;">COACH ${coach.name.toUpperCase()} | MATERIAL-SYNC: AKTIV</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="tactic-btn" onclick="window.BriefcaseUI.renderMainGrid()">ZENTRALE</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 380px; gap: 30px;">
                
                <div>
                    <div style="background: rgba(57, 255, 20, 0.05); padding: 25px; border-radius: 15px; border: 1px solid var(--neon-green);">
                        <h3 style="color:var(--neon-green); margin-bottom:15px;"><i class="fas fa-microchip"></i> TONIS ÜBUNGS-VORSCHLAG</h3>
                        <p style="font-size:0.8rem; color:#ccc; margin-bottom:20px;">Nenn mir den Fokus (z.B. Tiefenläufe). Ich erstelle die Einheit passend zu deinem Material.</p>
                        
                        <div style="display:flex; gap:10px; margin-bottom:20px;">
                            <input type="text" id="training-focus-input" class="pro-textarea" placeholder="Thema eingeben..." style="flex:1;">
                            <button class="pro-btn-gold" onclick="window.SektorTraining.askToni()">ANALYSIEREN & PLANEN</button>
                        </div>

                        <div id="toni-suggestion-output" style="background: rgba(0,0,0,0.4); padding: 20px; border-radius: 10px; min-height: 250px; border-left: 4px solid var(--neon-green); color: #fff; font-size: 0.9rem; line-height: 1.6;">
                            <div style="opacity:0.2; text-align:center; padding-top:80px;">
                                <i class="fas fa-brain" style="font-size: 3rem;"></i><br>Warte auf taktische Vorgabe...
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:20px;">
                    
                    <div style="background: rgba(0,209,255,0.05); padding: 20px; border-radius: 15px; border: 1px solid var(--data-cyan);">
                        <h4 style="color:var(--data-cyan); font-size:0.75rem; margin-bottom:12px; text-transform:uppercase;">Verfügbares Material</h4>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.7rem;">
                            <div style="color:${inv.balls.count < 10 ? 'var(--status-error)' : '#ccc'};"><i class="fas fa-futbol"></i> Bälle: ${inv.balls.count}</div>
                            <div style="color:${inv.cones.count < 15 ? 'var(--status-error)' : '#ccc'};"><i class="fas fa-triangle-exclamation"></i> Hütchen: ${inv.cones.count}</div>
                            <div style="color:${inv.miniGoals.count < 2 ? 'var(--status-error)' : '#ccc'};"><i class="fas fa-door-open"></i> Minitore: ${inv.miniGoals.count}</div>
                            <div style="color:#ccc;"><i class="fas fa-shirt"></i> Leibchen: ${inv.bibs.count}</div>
                        </div>
                        <button class="tactic-btn" style="width:100%; margin-top:10px; font-size:0.6rem;" onclick="openSection('material')">ZUM LAGER</button>
                    </div>

                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; border: 1px solid #333;">
                        <h4 style="color:#fff; font-size:0.8rem; margin-bottom:15px;">LETZTE ÜBUNGEN</h4>
                        <div id="mini-archive-list" style="max-height: 300px; overflow-y:auto;"></div>
                        <button class="tactic-btn" style="width:100%; margin-top:15px;" onclick="window.SektorTraining.createNewSession()">+ MANUELL</button>
                    </div>
                </div>
            </div>
        `;
        this.renderMiniArchive();
    },

    async askToni() {
        const input = document.getElementById('training-focus-input');
        const output = document.getElementById('toni-suggestion-output');
        if (!input.value) return;

        output.innerHTML = `<div style="text-align:center; padding-top:100px;"><span class="thinking">Toni scannt Materialkammer und entwirft Taktik...</span></div>`;

        // Material-String für die KI aufbereiten
        const inv = window.Database.inventory;
        const materialInfo = `Bälle: ${inv.balls.count}, Hütchen: ${inv.cones.count}, Minitore: ${inv.miniGoals.count}, Leibchen: ${inv.bibs.count}`;

        const prompt = `Handel als Elite-Fußballtrainer. Erstelle eine Übung.
                        FOKUS: ${input.value}. 
                        SPIELER: ${window.Database.players.length}.
                        MATERIAL IM SCHRANK: ${materialInfo}.
                        WICHTIG: Wenn Material fehlt, schlage Alternativen vor.
                        STRUKTUR: Name, Aufbau (benötigtes Material), Ablauf, Coaching Points.`;

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
                        <strong style="color:var(--neon-green);">TONIS VORSCHLAG:</strong><br><br>
                        ${data.response.replace(/\n/g, '<br>')}
                    </div>
                    <button class="pro-btn-gold" style="margin-top:20px; width:100%;" onclick="window.SektorTraining.saveSuggestion('${input.value}')">IN MAPPE ÜBERNEHMEN</button>`;
                window.ToniVoice.speak("Plan steht, Coach. Ich habe das vorhandene Material berücksichtigt.");
            } catch (e) {
                output.innerHTML = "Fehler: KI-Verbindung zum MacBook unterbrochen.";
            }
        } else {
            output.innerHTML = "Toni ist offline. Ohne KI-Kern kann ich dein Material nicht intelligent abgleichen.";
        }
    },

    saveSuggestion(title) {
        const output = document.getElementById('toni-suggestion-output').innerText;
        const newSession = {
            title: title || "KI-Übung",
            desc: output,
            duration: 20,
            players: window.Database.players.length,
            img: null
        };
        if (!window.Database.trainingSessions) window.Database.trainingSessions = [];
        window.Database.trainingSessions.unshift(newSession);
        window.Database.save();
        this.renderMiniArchive();
        alert("Übung gespeichert!");
    },

    renderMiniArchive() {
        const list = document.getElementById('mini-archive-list');
        const sessions = window.Database.trainingSessions || [];
        if (sessions.length === 0) {
            list.innerHTML = `<p style="font-size:0.7rem; color:#444;">Keine Übungen vorhanden.</p>`;
            return;
        }
        list.innerHTML = sessions.map((s) => `
            <div style="padding:10px; background:rgba(0,0,0,0.3); border-radius:8px; margin-bottom:10px; border-left: 2px solid var(--neon-green);">
                <div style="font-size:0.75rem; font-weight:bold; color:var(--neon-green);">${s.title}</div>
                <div style="font-size:0.6rem; color:#666;">${s.players} Spieler | KI-Plan</div>
            </div>
        `).join('');
    }
};
