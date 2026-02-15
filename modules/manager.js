window.SektorManager = {
    render() {
        const grid = document.getElementById('briefcase-grid');
        grid.innerHTML = "";
        grid.style.display = "block";

        const container = document.createElement('div');
        container.className = 'manager-container';

        // --- Sponsoring Bereich ---
        const sponsorPanel = document.createElement('div');
        sponsorPanel.className = 'mgmt-card';
        sponsorPanel.innerHTML = `<h3 class="mgmt-header"><i class="fas fa-handshake"></i> SPONSORING-POOL</h3>`;
        
        window.ToniDatabase.sponsors.forEach(s => {
            sponsorPanel.innerHTML += `
                <div class="sponsor-item">
                    <img src="${s.logo}" style="height:30px; opacity:0.7;">
                    <div style="text-align:right">
                        <div style="font-family:'Orbitron'; font-size:0.7rem;">${s.name}</div>
                        <small style="color:var(--accent-gold)">${s.level}-PARTNER</small>
                    </div>
                </div>
            `;
        });

        // --- Event Bereich ---
        const eventPanel = document.createElement('div');
        eventPanel.className = 'mgmt-card';
        eventPanel.innerHTML = `<h3 class="mgmt-header"><i class="fas fa-calendar-alt"></i> VEREINS-EVENTS</h3>`;
        
        window.ToniDatabase.events.forEach(e => {
            eventPanel.innerHTML += `
                <div class="event-item">
                    <span>${e.title}</span>
                    <span class="event-date">${e.date}</span>
                </div>
            `;
        });

        eventPanel.innerHTML += `
            <button onclick="window.SektorManager.addEvent()" style="width:100%; margin-top:20px; padding:10px; background:transparent; border:1px solid var(--neon-green); color:var(--neon-green); font-family:'Orbitron'; cursor:pointer; font-size:0.6rem;">
                + NEUES EVENT PLANEN
            </button>
        `;

        container.appendChild(sponsorPanel);
        container.appendChild(eventPanel);
        grid.appendChild(container);
    },

    addEvent() {
        const title = prompt("Event Name:");
        const date = prompt("Datum (DD.MM.YYYY):");
        if(title && date) {
            window.ToniDatabase.addEvent(title, date);
            this.render();
            window.ToniBrain.speak("Event erfolgreich in den Vereinskalender eingetragen.");
        }
    }
};
