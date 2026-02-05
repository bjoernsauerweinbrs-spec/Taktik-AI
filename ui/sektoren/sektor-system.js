// ui/sektoren/sektor-system.js
// SektorSystem: System-Setup für API-Key, Club-Name und Gateway-Statusanzeige

window.SektorSystem = {
    containerId: 'active-content',

    init(containerId = 'active-content') {
        this.containerId = containerId;
        if (window.ToniEvents && typeof window.ToniEvents.on === 'function') {
            // listen for gateway status changes if ToniGateway exposes status
            window.ToniEvents.on('gateway:status', (s) => this.render());
            // listen for players updates to show quick stats
            window.ToniEvents.on('players:updated', () => this.render());
        }
        this.render();
    },

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('[SektorSystem] container not found:', this.containerId);
            return;
        }

        const apiKey = localStorage.getItem('toni_api_key') || '';
        const clubName = localStorage.getItem('toni_club_name') || 'FC TONI';
        const gatewayStatus = (window.ToniGateway && window.ToniGateway.status) ? window.ToniGateway.status : 'unknown';
        const playersCount = (window.ToniDB && typeof window.ToniDB.getPlayers === 'function') ? window.ToniDB.getPlayers().length : 0;

        container.innerHTML = `
            <div style="padding:20px;">
                <h2>SYSTEM-SETUP</h2>
                <div style="margin-bottom:12px;">
                    <label><strong>Club-Name</strong></label><br/>
                    <input type="text" id="club-name-input" value="${clubName}" placeholder="Club-Name" style="width:100%;padding:8px;margin-top:6px;">
                    <button id="save-club-btn" style="margin-top:8px;">SPEICHERN</button>
                </div>

                <div style="margin-bottom:12px;">
                    <label><strong>OpenAI API Key (optional)</strong></label><br/>
                    <input type="password" id="api-key-input" value="${apiKey}" placeholder="OpenAI Key" style="width:100%;padding:8px;margin-top:6px;">
                    <div style="margin-top:8px;">
                        <button id="save-api-btn">SPEICHERN</button>
                        <button id="clear-api-btn" style="margin-left:8px;">LÖSCHEN</button>
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#ccc;">
                        Hinweis: Für Produktion bitte einen sicheren Server-Proxy verwenden. Keys nicht in localStorage ablegen.
                    </div>
                </div>

                <div style="margin-bottom:12px;">
                    <strong>Gateway-Status:</strong>
                    <div id="gateway-status" style="margin-top:6px;padding:8px;border-radius:6px;background:#111;color:#fff;">
                        ${gatewayStatus.toUpperCase()}
                    </div>
                </div>

                <div style="margin-top:16px;">
                    <strong>Quick Stats</strong>
                    <div style="margin-top:8px;">Spieler im Kader: <strong>${playersCount}</strong></div>
                    <div style="margin-top:8px;">
                        <button id="seed-players-btn">Seed-Daten neu erzeugen</button>
                        <button id="clear-players-btn" style="margin-left:8px;">Kader löschen</button>
                    </div>
                </div>
            </div>
        `;

        // attach handlers
        const saveApiBtn = document.getElementById('save-api-btn');
        const clearApiBtn = document.getElementById('clear-api-btn');
        const saveClubBtn = document.getElementById('save-club-btn');
        const seedBtn = document.getElementById('seed-players-btn');
        const clearPlayersBtn = document.getElementById('clear-players-btn');

        if (saveApiBtn) {
            saveApiBtn.addEventListener('click', () => {
                const val = document.getElementById('api-key-input').value;
                localStorage.setItem('toni_api_key', val);
                alert('API-Key gespeichert (lokal). Für Produktion: Server-Proxy verwenden.');
                this.render();
            });
        }

        if (clearApiBtn) {
            clearApiBtn.addEventListener('click', () => {
                localStorage.removeItem('toni_api_key');
                alert('API-Key entfernt.');
                this.render();
            });
        }

        if (saveClubBtn) {
            saveClubBtn.addEventListener('click', () => {
                const val = document.getElementById('club-name-input').value || 'FC TONI';
                localStorage.setItem('toni_club_name', val);
                alert('Club-Name gespeichert.');
                this.render();
            });
        }

        if (seedBtn) {
            seedBtn.addEventListener('click', () => {
                // re-seed players by clearing and calling ToniDB.init()
                localStorage.removeItem('toni_players');
                if (window.ToniDB && typeof window.ToniDB.init === 'function') {
                    window.ToniDB.init();
                    alert('Seed-Daten neu erzeugt.');
                } else {
                    alert('ToniDB nicht verfügbar.');
                }
            });
        }

        if (clearPlayersBtn) {
            clearPlayersBtn.addEventListener('click', () => {
                localStorage.removeItem('toni_players');
                if (window.ToniEvents && typeof window.ToniEvents.emit === 'function') {
                    window.ToniEvents.emit('players:updated', []);
                }
                alert('Kader gelöscht.');
                this.render();
            });
        }
    }
};
