/* ==========================================================
   TONI 2.0 | ELITE MASTER SCRIPT
   ========================================================== */

const eliteStore = {
    players: [
        { id: 1, name: "M. Neuer", pos: "TW", rating: 89, stats: [87,55,90,60,91,85], load: [12,14,12,15,13,12,14] },
        { id: 2, name: "H. Kane", pos: "ST", rating: 91, stats: [82,93,85,84,45,88], load: [20,18,22,25,20,19,24] }
    ]
};

window.onload = () => {
    renderLockerRoom();
    renderMgmt();
    trainingEngine.init();
};

/**
 * MODUL STEUERUNG
 */
function showModule(id) {
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

/**
 * VR TRAINING ENGINE (META QUEST)
 */
const trainingEngine = {
    timer: null,
    
    init: function() {
        console.log("VR Engine bereit.");
    },

    startLevel: function(lvl) {
        const assets = document.getElementById('training-assets');
        assets.innerHTML = '';
        this.stopTimer();

        if (lvl === 1) { // SCANNING
            voiceEngine.speak("Scanning Drill. Identifizieren Sie die Spieler hinter Ihnen.");
            for(let i=0; i<3; i++) this.create3DPlayer(assets, (i*10)-10, 15, "red");
        } 
        else if (lvl === 2) { // GAP FINDER
            voiceEngine.speak("Lücke finden. Wo ist der freie Passweg?");
            this.create3DPlayer(assets, -5, -15, "blue");
            this.create3DPlayer(assets, 5, -15, "blue");
            this.create3DPlayer(assets, 0, -25, "green"); // Ziel
        }
        else if (lvl === 3) { // PRESSURE
            voiceEngine.speak("Elite Pressing. Sie haben 3 Sekunden!");
            const p = this.create3DPlayer(assets, 0, -5, "red");
            p.setAttribute('animation', 'property: position; to: 0 0.9 -1; dur: 3000');
            this.startTimer(3);
        }
    },

    create3DPlayer: function(parent, x, z, color) {
        const el = document.createElement('a-entity');
        el.setAttribute('position', `${x} 0.9 ${z}`);
        el.innerHTML = `<a-cylinder color="${color}" height="1.8" radius="0.5"></a-cylinder>`;
        parent.appendChild(el);
        return el;
    },

    startTimer: function(s) {
        let time = s;
        const hud = document.getElementById('vr-timer');
        this.timer = setInterval(() => {
            time--;
            hud.setAttribute('value', `TIME: ${time}`);
            if(time <= 0) { clearInterval(this.timer); voiceEngine.speak("Zeit abgelaufen."); }
        }, 1000);
    },

    stopTimer: function() { clearInterval(this.timer); document.getElementById('vr-timer').setAttribute('value', ''); }
};

/**
 * MANAGER BEREICH (LABOR)
 */
function renderMgmt() {
    const dashboard = document.getElementById('mgmt-dashboard');
    dashboard.innerHTML = `
        <div class="mgmt-card">
            <h3>Finanz-Status (ROI)</h3>
            <p>Budget: 12.500.000 €</p>
            <p>Sponsoring-Einnahmen: +2.4M € (Prognose)</p>
        </div>
        <div class="mgmt-card">
            <h3>Infrastruktur</h3>
            <p>Analyse-Zentrum Lvl 5</p>
            <p>Effekt: +20% Trainingsgeschwindigkeit</p>
        </div>
    `;
}

/**
 * TRAINER BEREICH (MEDICAL)
 */
function renderLockerRoom() {
    const container = document.getElementById('player-container');
    container.innerHTML = eliteStore.players.map(p => {
        const acwr = (p.load.slice(-7).reduce((a,b)=>a+b)/7) / (p.load.reduce((a,b)=>a+b)/p.load.length);
        return `
            <div class="fut-card">
                <div style="font-size:12px">${p.rating} ${p.pos}</div>
                <div style="font-weight:900; margin:15px 0;">${p.name}</div>
                <div style="font-size:10px; background:${acwr > 1.5 ? 'red' : 'green'}; color:white; padding:5px;">
                    ACWR: ${acwr.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * KI SPRACHE
 */
const voiceEngine = {
    speak: function(text) {
        const m = new SpeechSynthesisUtterance(text);
        m.lang = 'de-DE';
        window.speechSynthesis.speak(m);
        document.getElementById('toni-msg').setAttribute('value', text);
    },
    toggle: function() { this.speak("System Analyse aktiv."); }
};
