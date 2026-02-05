/**
 * TONI 2.0 - CORE ENGINE (ACTION & GATEWAY INTEGRATION)
 * Steuert den Denkprozess, die Navigation und die Arena-Befehle.
 */
window.ToniCore = {
    isProcessing: false,

    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;
        
        this.updateStatus("TONI DENKT NACH...", "var(--accent-orange)");
        this.addUserMessage(text);

        const cmd = text.toLowerCase();

        // 1. NAVIGATION (Sofort-Ausführung)
        if (cmd.includes("öffne") || cmd.includes("gehe zu") || cmd.includes("zeige")) {
            this.handleNavigation(cmd);
            this.finishProcess();
            return;
        }

        // 2. TAKTISCHE ANFRAGE ÜBER GATEWAY
        const context = this.getBoardContext();
        
        try {
            // Erstversuch: Ollama via Gateway
            let result = await window.ToniGateway.callOllama(text, context);
            
            // Backup: OpenAI via Gateway
            if (!result) {
                console.log("ToniCore: Ollama offline, wechsle zu OpenAI...");
                result = await window.ToniGateway.callOpenAI(text, context);
            }

            // Ergebnis verarbeiten
            if (result && result.text) {
                // Taktische Bewegung ausführen falls vorhanden
                if (result.tacticalMove && window.arena) {
                    this.executeMove(result.tacticalMove);
                }
                
                // Antwort anzeigen (Befehle werden im Gateway bereits gefiltert)
                this.finalizeResponse(result.text);
            } else {
                this.finalizeResponse("Coach, ich konnte keine Verbindung zu meinen Taktik-Modulen herstellen.");
            }

        } catch (e) {
            console.error("ToniCore Error:", e);
            this.finalizeResponse("Systemfehler in der Denk-Einheit. Bitte Seite neu laden.");
        }

        this.finishProcess();
    },

    executeMove: function(move) {
        if (move.pos && window.arena.applyTacticalFormation) {
            window.arena.applyTacticalFormation(move.pos);
            this.updateStatus("BOARD AKTUALISIERT", "var(--neon-green)");
        }
    },

    getBoardContext: function() {
        const squad = window.ToniDB ? window.ToniDB.getPlayers() : [];
        const active = squad.filter(p => p.isPresent).map(p => p.name).join(", ");
        const starters = squad.filter(p => p.isStarter).map(p => p.name).join(", ");
        return {
            anwesend: active,
            startelf: starters,
            modus: window.arena?.pitchMode || 'pro'
        };
    },

    handleNavigation: function(cmd) {
        if (!window.BriefcaseUI) return;
        
        if (cmd.includes("kabine") || cmd.includes("mannschaft")) SektorSporttasche.render();
        else if (cmd.includes("training")) SektorTraining.render();
        else if (cmd.includes("analyse") || cmd.includes("labor")) SektorAnalyse.render();
        else if (cmd.includes("system") || cmd.includes("einstellung")) SektorSystem.render();
        else if (cmd.includes("heft") || cmd.includes("zeitung")) SektorTemplates.render();
        
        // Overlay öffnen falls zu
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay && !overlay.classList.contains('active')) {
            window.BriefcaseUI.toggle();
        }
    },

    addUserMessage: function(text) {
        const container = document.getElementById('chat-messages');
        if(container) {
            container.innerHTML += `<div style="margin-bottom:10px; color:var(--text-dim); font-size:0.85rem;"><b>Björn:</b> ${text}</div>`;
            container.scrollTop = container.scrollHeight;
        }
    },

    finalizeResponse: function(answer) {
        const container = document.getElementById('chat-messages');
        if(container) {
            container.innerHTML += `<div style="margin-bottom:15px; color:#fff; border-left: 2px solid var(--neon-green); padding-left:10px;"><b>Toni:</b> ${answer}</div>`;
            container.scrollTop = container.scrollHeight;
        }
        if(window.ToniTTS) window.ToniTTS.speak(answer, "warm");
    },
    
    updateStatus: function(text, color) {
        const el = document.getElementById('toni-status-text');
        if(el) { el.innerText = text; el.style.color = color; }
    },

    finishProcess: function() {
        this.isProcessing = false;
        setTimeout(() => this.updateStatus("BEREIT", "var(--neon-green)"), 2000);
    }
};
