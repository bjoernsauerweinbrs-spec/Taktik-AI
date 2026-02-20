const eliteStore = {
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 1, name: "M. Neuer", pos: "TW", rating: 89, stats: [87, 45, 91, 55, 92, 80], load: 1.2 },
        { id: 2, name: "J. Musiala", pos: "ZOM", rating: 91, stats: [92, 85, 88, 94, 35, 70], load: 0.8 }
    ],
    role: 'trainer'
};

window.onload = () => {
    initClock();
    renderLockerRoom();
    initTacticBoard();
};

function setRole(role) {
    document.body.className = `role-${role}`;
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    eliteStore.role = role;
}

function showModule(id) {
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    if (id === 'vr-center') initVR();
}

/**
 * VR ENGINE: Pitch Control & Spatial Mapping
 */
function initVR() {
    const container = document.getElementById('vr-players');
    container.innerHTML = '';
    
    // Simuliert Spieler-Avatare im 3D-Raum (Meta Quest Ready)
    eliteStore.players.forEach((p, i) => {
        const avatar = document.createElement('a-entity');
        const x = (i * 10) - 15;
        const z = -20;
        
        avatar.setAttribute('position', `${x} 0.9 ${z}`);
        avatar.innerHTML = `
            <a-cylinder color="${p.load > 1 ? '#ef4444' : '#22c55e'}" height="1.8" radius="0.4"></a-cylinder>
            <a-text value="${p.name}" position="0 1.5 0" align="center" scale="2 2 2"></a-text>
            <a-circle rotation="-90 0 0" radius="5" color="#22c55e" opacity="0.2" position="0 -0.85 0"></a-circle>
        `;
        container.appendChild(avatar);
    });
}

/**
 * KI SPRACHSTEUERUNG
 */
const voiceEngine = {
    toggle: function() {
        const btn = document.getElementById('mic-btn');
        btn.classList.toggle('active');
        const text = btn.classList.contains('active') ? "Analyse gestartet. Raumkontrolle bei 64%." : "Analyse beendet.";
        this.speak(text);
    },
    speak: function(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'de-DE';
        window.speechSynthesis.speak(msg);
    }
};

function initClock() {
    setInterval(() => {
        document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}
