/* js/board.js 
   Zuständig für: Spielfeld-Interaktion, Ampelsystem, Kader-Management und Animationen 
*/

const ToniBoard = {
    activeModus: '11v11', // Standard
    players: [],

    init() {
        console.log("ToniBoard: Initialisiere System...");
        this.loadKader();
        this.renderKaderSidebar();
        this.setupDropZones();
        this.resetToStandardFormation();
        
        // Sprache initialisieren (Männliche Stimme bevorzugt)
        this.initVoice();
    },

    // 1. KADER & AMPELSYSTEM
    loadKader() {
        // Lädt Daten aus storage.js oder nutzt Standardwerte
        this.players = ToniStorage.getKader();
        // Falls Team Blau (KI) noch nicht existiert, erstellen wir 11 Dummy-Gegner
        for (let i = 1; i <= 11; i++) {
            if (!this.players.find(p => p.id === 'away' + i)) {
                this.players.push({
                    id: 'away' + i,
                    name: 'Gegner ' + i,
                    nummer: i,
                    status: 'blue', // KI-Team
                    stats: { technik: 50, taktik: 50, kondition: 50, uebersicht: 50 }
                });
            }
        }
    },

    renderKaderSidebar() {
        const container = document.getElementById('player-pool');
        if (!container) return;
        container.innerHTML = "";

        // Nur Heim-Spieler (Rot/Gelb) in der Sidebar anzeigen
        this.players.filter(p => p.status !== 'blue').forEach(player => {
            const item = document.createElement('div');
            item.className = 'player-list-item';
            item.draggable = true;
            item.id = 'list-' + player.id;
            
            // Ampel-Farbe bestimmen
            let statusColor = '#2ecc71'; // grün
            if (player.status === 'yellow') statusColor = '#f1c40f';
            if (player.status === 'red') statusColor = '#e74c3c';

            item.innerHTML = `
                <div class="ampel-status" style="background: ${statusColor}" 
                     onclick="ToniBoard.cycleStatus('${player.id}')"></div>
                <span style="flex: 1;">${player.nummer}. ${player.name}</span>
                <i class="fas fa-grip-vertical" style="color: #475569;"></i>
            `;

            item.ondragstart = (e) => {
                e.dataTransfer.setData("playerId", player.id);
            };

            container.appendChild(item);
        });
    },

    cycleStatus(playerId) {
        const p = this.players.find(x => x.id === playerId);
        if (p.status === 'green') p.status = 'yellow';
        else if (p.status === 'yellow') p.status = 'red';
        else p.status = 'green';

        ToniStorage.saveKader(this.players);
        this.renderKaderSidebar();
        this.refreshBoard(); // Board aktualisieren (Rote Spieler entfernen/hinzufügen)
    },

    // 2. BOARD-LOGIK (SPIELER POSITIONIEREN)
    refreshBoard() {
        const pitch = document.getElementById('pitch');
        const benchRed = document.getElementById('bench-red');
        const benchBlue = document.getElementById('bench-blue');
        
        // Nur die Spieler-Elemente auf dem Pitch entfernen
        document.querySelectorAll('.player-token').forEach(el => el.remove());
        benchRed.innerHTML = '<div class="bench-label">Auswechselbank (Heim)</div>';
        benchBlue.innerHTML = '<div class="bench-label">Auswechselbank (Blau / KI)</div>';

        this.players.forEach(player => {
            if (player.status === 'red') return; // Abwesende Spieler nicht anzeigen

            const token = this.createPlayerToken(player);
            
            // Automatische Erkennung: Wer ist auf dem Feld, wer auf der Bank?
            // In der Grundordnung setzen wir die ersten 11 auf das Feld
            if (player.onPitch) {
                pitch.appendChild(token);
            } else {
                if (player.status === 'blue') {
                    benchBlue.appendChild(token);
                } else {
                    benchRed.appendChild(token);
                }
            }
        });
    },

    createPlayerToken(player) {
        const div = document.createElement('div');
        div.className = 'player-token ' + (player.status === 'blue' ? 'away' : 'home');
        div.id = 'token-' + player.id;
        div.innerText = player.nummer;
        div.draggable = true;
        
        // Style-Zuweisung (Brasilien-Style: Rund, Schatten)
        div.style.position = 'absolute';
        div.style.width = '35px';
        div.style.height = '35px';
        div.style.borderRadius = '50%';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.fontWeight = 'bold';
        div.style.cursor = 'grab';
        div.style.zIndex = '100';
        div.style.border = '2px solid white';
        div.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';

        if (player.status === 'blue') {
            div.style.background = 'radial-gradient(circle at 30% 30%, #3498db, #2980b9)';
        } else {
            div.style.background = 'radial-gradient(circle at 30% 30%, #e74c3c, #c0392b)';
        }

        div.ondragstart = (e) => {
            e.dataTransfer.setData("playerId", player.id);
        };

        return div;
    },

    // 3. FORMATIONEN & MODI
    resetToStandardFormation() {
        // Standard 4-4-2 Koordinaten (in %)
        const formation11v11 = [
            {id: 'home1', x: 5, y: 50}, {id: 'home2', x: 20, y: 20}, {id: 'home3', x: 20, y: 40},
            {id: 'home4', x: 20, y: 60}, {id: 'home5', x: 20, y: 80}, {id: 'home6', x: 45, y: 30}
            // ... usw für alle 11
        ];

        this.players.forEach((p, index) => {
            if (index < 11 || p.status === 'blue') {
                p.onPitch = true;
                // Hier würden wir die x/y Koordinaten zuweisen
            } else {
                p.onPitch = false;
            }
        });
        this.refreshBoard();
    },

    // 4. VOICE (Männliche Toni-Stimme)
    initVoice() {
        window.speechSynthesis.onvoiceschanged = () => {
            const voices = window.speechSynthesis.getVoices();
            // Suche nach einer männlichen deutschen Stimme
            this.toniVoice = voices.find(v => v.lang.startsWith('de') && (v.name.includes('Male') || v.name.includes('Stefan') || v.name.includes('Google Deutsch')));
            console.log("Toni Stimme geladen:", this.toniVoice ? this.toniVoice.name : "Standard");
        };
    },

    speak(text) {
        if (!text) return;
        const msg = new SpeechSynthesisUtterance(text);
        if (this.toniVoice) msg.voice = this.toniVoice;
        msg.lang = 'de-DE';
        msg.rate = 0.9; // Etwas langsamer für fachmännischen Klang
        msg.pitch = 0.8; // Tiefer für männlichen Klang
        window.speechSynthesis.speak(msg);
    },

    // 5. DROP-ZONEN LOGIK
    setupDropZones() {
        const pitch = document.getElementById('pitch');
        pitch.ondragover = (e) => e.preventDefault();
        pitch.ondrop = (e) => {
            const id = e.dataTransfer.getData("playerId");
            const player = this.players.find(p => p.id === id);
            if (player) {
                player.onPitch = true;
                this.refreshBoard();
                // Position anpassen (berechnet aus Maus-Koordinaten)
                const token = document.getElementById('token-' + id);
                if (token) {
                    const rect = pitch.getBoundingClientRect();
                    token.style.left = (e.clientX - rect.left - 17) + 'px';
                    token.style.top = (e.clientY - rect.top - 17) + 'px';
                }
            }
        };
    }
};

// Hilfsfunktion zum Hinzufügen neuer Spieler (z.B. David Luiz)
function addPlayerPrompt() {
    const name = prompt("Name des neuen Spielers:");
    const num = prompt("Rückennummer:");
    if (name && num) {
        const newId = 'home_' + Date.now();
        ToniBoard.players.push({
            id: newId,
            name: name,
            nummer: parseInt(num),
            status: 'green',
            onPitch: false,
            stats: { kondition: 50, uebersicht: 50, technik: 50, taktik: 50, sonder: 0 }
        });
        ToniStorage.saveKader(ToniBoard.players);
        ToniBoard.renderKaderSidebar();
        ToniBoard.refreshBoard();
    }
}
