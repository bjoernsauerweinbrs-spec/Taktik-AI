window.SektorSetup = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = "";
        grid.style.display = "block";

        const currentUrl = window.location.href;

        const container = document.createElement('div');
        container.className = 'manager-container'; // Wir nutzen das bewährte Grid

        // --- Linkes Panel: Mobile Verbindung ---
        const mobilePanel = document.createElement('div');
        mobilePanel.className = 'mgmt-card';
        mobilePanel.innerHTML = `
            <h3 class="mgmt-header"><i class="fas fa-mobile-alt"></i> MOBILE SYNC</h3>
            <p style="font-size:0.75rem; color:#aaa; margin-bottom:20px;">Scanne diesen Code mit deinem Handy, um das Cockpit live auf dem Platz zu nutzen.</p>
            <div style="background:#fff; padding:15px; display:inline-block; border-radius:10px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentUrl}" alt="QR Code">
            </div>
            <p style="margin-top:15px; font-family:'Orbitron'; font-size:0.6rem; color:var(--neon-green);">${currentUrl}</p>
        `;

        // --- Rechtes Panel: System Intelligenz ---
        const aiPanel = document.createElement('div');
        aiPanel.className = 'mgmt-card';
        aiPanel.innerHTML = `
            <h3 class="mgmt-header"><i class="fas fa-brain"></i> SYSTEM UPGRADE</h3>
            <div class="event-item">
                <span>Cloud-Status</span>
                <span style="color:var(--neon-green)">ONLINE</span>
            </div>
            <div class="event-item">
                <span>Handy-Steuerung</span>
                <span style="color:var(--data-cyan)">BEREIT</span>
            </div>
            <button onclick="window.SektorSetup.explainCloud()" style="width:100%; margin-top:20px; padding:15px; background:var(--data-cyan); border:none; color:#000; font-family:'Orbitron'; font-weight:bold; cursor:pointer;">
                WIE WERDE ICH SCHLAUER?
            </button>
        `;

        container.appendChild(mobilePanel);
        container.appendChild(aiPanel);
        grid.appendChild(container);
    },

    explainCloud() {
        window.ToniBrain.speak("Um mich super schlau zu machen, verbinde ich mich mit den weltweit führenden KI-Servern. Über dein Handy kannst du mir dann Sprachbefehle direkt vom Spielfeldrand geben, während das MacBook in der Kabine das Taktikboard für die Spieler aktualisiert.");
    }
};
