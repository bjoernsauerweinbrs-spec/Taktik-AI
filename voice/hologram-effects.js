/**
 * =========================================
 * TONI 2.0 – HOLOGRAM EFFECTS CONTROLLER
 * Zustandssteuerung für das visuelle Feedback
 * =========================================
 */
(function() {
    window.Hologram = {
        container: null,

        init() {
            this.container = document.getElementById('hologram-container');
            console.log("✨ Hologramm-Effekte geladen.");
        },

        // Wechselt in den Sprech-Modus
        setSpeaking(isActive) {
            if (!this.container) return;
            const statusText = document.getElementById('hologram-status');

            if (isActive) {
                this.container.classList.add('pulse-active');
                if (statusText) statusText.textContent = "Toni spricht...";
            } else {
                this.container.classList.remove('pulse-active');
                if (statusText) statusText.textContent = "Toni Standby";
            }
        },

        // Wechselt in den Analyse-Modus (Cyan)
        setScanning(isActive) {
            if (!this.container) return;
            const statusText = document.getElementById('hologram-status');

            if (isActive) {
                this.container.classList.add('scan-active');
                if (statusText) statusText.textContent = "Analysiere Daten...";
            } else {
                this.container.classList.remove('scan-active');
                if (statusText) statusText.textContent = "Toni Standby";
            }
        }
    };
})();
