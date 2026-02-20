/* ==========================================================
   TONI 2.0 ELITE | CORE ENGINE (VR & ANALYTICS)
   ========================================================== */

const eliteStore = {
    // Zentraler Datenspeicher (Single Source of Truth)
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], load: [15, 12, 18, 20, 15, 12, 19], img: "" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], load: [5, 4, 6, 5, 4, 5, 6], img: "" },
        { id: 103, name: "K. Schneider", pos: "IV", rating: 84, stats: [72, 68, 85, 78, 84, 82], load: [10, 10, 11, 12, 10, 9, 11], img: "" }
    ],
    formation: { toni: '4-4-2', trainer: '3-4-3' },
    activeModule: 'vr-center',
    isSimulating: false
};

/**
 * START-SEQUENZ
 */
window.onload = () => {
    console.log("SYSTEM BOOT: TONI 2.0 ELITE ACTIVE");
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initiales Rendering
    renderLockerRoom();
    showModule('vr-center');
};

/**
 * MODUL-MANAGER
 */
function showModule(modId) {
    document.querySelectorAll('.module-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(modId);
    if (target) target.classList.add('active');

    // Sidebar Update
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(modId));
    if (activeBtn) activeBtn.classList.add('active');

    if (modId === 'vr-center') init3DPitch();
    if (modId === 'mgmt-lab') mgmt.render();
}

/**
 * VR ANALYSIS ENGINE (A-FRAME)
 */
function init3DPitch() {
    const scene = document.querySelector('a-scene');
    if (!scene) return;

    // Bestehende Spieler-Modelle entfernen
    document.querySelectorAll('.player-model').forEach(p => p.remove());

    // Toni-Team (4-4-2) in 3D positionieren
    const toniColor = "#22c55e";
    spawn3DTeam(eliteStore.formation.toni, toniColor, "TONI_ASSET", 1);
    
    // Trainer-Team (3-4-3)
    const trainerColor = "#3b82f6";
    spawn3DTeam(eliteStore.formation.trainer, trainerColor, "TRAINER_ASSET", -1);
}

function spawn3DTeam(formation, color, label, side) {
    const scene = document.querySelector('a-scene');
    // Einfache Positions-Logik für 3D-Raum
    for(let i=0; i<5; i++) {
        const entity = document.createElement('a-entity');
        entity.setAttribute('class', 'player-model');
        const x = (i * 10) - 20;
        const z = side * 15;
        
        entity.setAttribute('position', `${x} 0.9 ${z}`);
        entity.innerHTML = `
            <a-cylinder color="${color}" height="1.8" radius="0.5" metalness="0.5"></a-cylinder>
            <a-text value="${label}" position="0 1.5 0" align="center" scale="1.5 1.5 1.5" look-at="[camera]"></a-text>
        `;
        scene.appendChild(entity);
    }
}

/**
 * MEDICAL HUB: ACWR CALCULATION
 */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = eliteStore.players.map(p => {
        // ACWR Logik: Akut (7 Tage) vs Chronisch (28 Tage)
        const acute = p.load.slice(-7).reduce((a,b) => a+b, 0) / 7;
        const chronic = p.load.reduce((a,b) => a+b, 0) / p.load.length;
        const acwr = chronic > 0 ? (acute / chronic) : 1.0;

        let medicalClass = "status-green";
        if (acwr > 1.3) medicalClass = "status-yellow";
        if (acwr > 1.5) medicalClass = "status-red";

        return `
            <div class="fut-card" onclick="openPlayerModal(${p.id})">
                <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
                <div class="card-name">${p.name}</div>
                <div class="card-stats">
                    <span>TEM: ${p.stats[0]}</span><span>DRI: ${p.stats[3]}</span>
                    <span>SCH: ${s[1]}</span><span>DEF: ${s[4]}</span>
                </div>
                <div class="medical-badge ${medicalClass}">
                    ACWR: ${acwr.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * VOICE AI ANALYST (Spatial Audio Toni)
 */
const voiceEngine = {
    isListening: false,
    synth: window.speechSynthesis,

    toggle: function() {
        if (!this.isListening) {
            this.speak("System-Analyse bereit. Ich überwache die Laufwege und die Belastungswerte, Coach.");
            document.getElementById('mic-btn').classList.add('active-mic');
            this.isListening = true;
        } else {
            this.isListening = false;
            document.getElementById('mic-btn').classList.remove('active-mic');
        }
    },

    speak: function(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'de-DE';
        msg.pitch = 0.8; // Seriöser Ton
        msg.rate = 1.0;
        this.synth.speak(msg);
        addMessage("Toni", text);
    }
};

/**
 * UTILS
 */
function updateClock() {
    const now = new Date();
    const clock = document.getElementById('system-clock');
    if (clock) clock.innerText = now.toLocaleTimeString('de-DE');
}

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;
    const div = document.createElement('div');
    div.className = `msg-${sender.toLowerCase()}`;
    div.innerHTML = `<strong>${sender.toUpperCase()}:</strong> ${text}`;
    history.appendChild(div);
}
