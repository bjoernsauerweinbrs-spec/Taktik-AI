(function() {
    window.ToniAI = {
        config: { niveau: '', goal: '' },

        // Simulation der globalen Informationsbeschaffung
        async fetchGlobalIntel() {
            console.log("🌐 Toni scannt: DFB-Akademie, CBF Brasil, Premier League Insights...");
            return new Promise(r => setTimeout(r, 1200));
        },

        async speak(text, options = []) {
            const container = document.getElementById('setcard-content');
            let actionHtml = options.map(opt => `<button class="tool-btn" onclick="${opt.action}">${opt.label}</button>`).join('');
            
            container.innerHTML = `
                <div class="toni-speech-bubble">
                    <div style="color:var(--data-cyan); font-size:9px; font-weight:900; letter-spacing:2px; margin-bottom:10px;">TONI // AI CO-TRAINER</div>
                    <div style="font-size:14px; line-height:1.6;">${text}</div>
                    <div style="margin-top:20px;">${actionHtml}</div>
                </div>
            `;
        },

        async startOnboarding() {
            await this.fetchGlobalIntel();
            this.speak(
                "Bom dia, Björn! Ich habe mich gerade weltweit über die neuesten Trainingsmethoden erkundigt. Mein System ist bereit. Bevor wir starten: Auf welchem Niveau trainierst du heute?",
                [
                    { label: "Profi / U19 Elite", action: "ToniAI.setLevel('Profi')" },
                    { label: "Leistungsbereich", action: "ToniAI.setLevel('Leistung')" },
                    { label: "Breitensport / Kids", action: "ToniAI.setLevel('Basis')" }
                ]
            );
        },

        setLevel(lvl) {
            this.config.niveau = lvl;
            this.speak(
                `Hervorragend, ${lvl}-Niveau. Und was ist unser primärer Fokus für die heutige Taktik-Session?`,
                [
                    { label: "Taktische Disziplin", action: "ToniAI.finishSetup('Taktik')" },
                    { label: "Funinho & Spielintelligenz", action: "ToniAI.finishSetup('Funinho')" },
                    { label: "Brasilianischer Style / Technik", action: "ToniAI.finishSetup('Style')" }
                ]
            );
        },

        finishSetup(goal) {
            this.config.goal = goal;
            localStorage.setItem('toni2_trainer_profile', JSON.stringify(this.config));
            this.speak(
                "Alles klar, Björn. Hier ist dein Briefing für das Board:<br><br>● <b>Rote Spieler:</b> Dein Team. Bewege sie frei.<br>● <b>Blaue Spieler:</b> Der Gegner. Ich simuliere ihre Reaktion.<br>● <b>Spielfeld:</b> Nutze die 16m-Zonen für das Stellungsspiel.<br><br>Lass uns gewinnen!",
                [{ label: "VERSTANDEN - ZUR ZENTRALE", action: "BriefcaseUI.toggle()" }]
            );
        }
    };
})();
