window.SektorLabor = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = ""; // Clear
        grid.style.display = "block"; // Grid-Layout für Karten deaktivieren

        const bio = window.ToniDatabase.biometrics;

        const container = document.createElement('div');
        container.className = 'labor-container';

        // --- Linkes Panel: Körperanalyse ---
        const panelLeft = document.createElement('div');
        panelLeft.className = 'lab-panel';
        panelLeft.innerHTML = `<h3 class="lab-header"><i class="fas fa-child"></i> KÖRPERANALYSE</h3>`;
        
        panelLeft.appendChild(this.createDataRow('weight', bio.weight));
        panelLeft.appendChild(this.createDataRow('kfa', bio.kfa));

        // --- Rechtes Panel: Leistungsdaten ---
        const panelRight = document.createElement('div');
        panelRight.className = 'lab-panel';
        panelRight.innerHTML = `<h3 class="lab-header"><i class="fas fa-heartbeat"></i> LEISTUNGSDATEN</h3>`;

        panelRight.appendChild(this.createDataRow('rhr', bio.rhr));
        panelRight.appendChild(this.createDataRow('vo2', bio.vo2));

        container.appendChild(panelLeft);
        container.appendChild(panelRight);
        grid.appendChild(container);

        // Animation der Balken nach kurzem Delay
        setTimeout(() => this.animateBars(), 100);
    },

    createDataRow(key, data) {
        const row = document.createElement('div');
        row.className = 'data-row';

        // Berechnung der Balkenbreite (in Prozent)
        let percentage = (data.val / data.max) * 100;
        if (data.reverse) percentage = 100 - percentage; // Für Werte wo niedriger besser ist (Puls)
        percentage = Math.max(0, Math.min(100, percentage)); // Begrenzen auf 0-100%

        row.innerHTML = `
            <div class="data-label">
                <span>${data.label}</span>
            </div>
            <div style="display:flex; align-items:baseline;">
                <span class="data-value" onclick="window.SektorLabor.edit('${key}')">${data.val}</span>
                <span class="data-unit">${data.unit}</span>
            </div>
            <div class="bio-bar-bg">
                <div class="bio-bar-fill" data-width="${percentage}%"></div>
            </div>
        `;
        return row;
    },

    animateBars() {
        document.querySelectorAll('.bio-bar-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    },

    edit(key) {
        const bio = window.ToniDatabase.biometrics[key];
        const newVal = prompt(`Neuer Wert für ${bio.label} (${bio.unit}):`, bio.val);
        if(newVal !== null && newVal !== "") {
            window.ToniDatabase.updateBiometric(key, newVal);
            this.render(); // Refresh um neue Balken zu zeigen
            window.ToniBrain.speak(`Werte für ${bio.label} aktualisiert.`);
        }
    }
};
