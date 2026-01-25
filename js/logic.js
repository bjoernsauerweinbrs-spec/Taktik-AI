/* --- TRAINING LOGIC: ATTENDANCE, BANK & PLAYLIST --- */

let attendance = {}; 
let currentPhaseIndex = 0;
let playlist = {
    phases: [
        { title: "Warmup", coaching: ["Locker einlaufen", "Kurze Pässe"] },
        { title: "Hauptteil", coaching: ["Umschaltspiel forcieren", "Abschluss suchen"] }
    ]
};

/* --- KADER & ANWESENHEIT --- */
function syncNames() {
    const rawText = document.getElementById('player-list-raw').value;
    const lines = rawText.split('\n');
    
    // Reset attendance
    attendance = {};
    
    lines.forEach(line => {
        const match = line.match(/^(\d+)\s+([^\[]+?)\s+(red|blue|rot|blau)$/i);
        if (match) {
            const num = match[1];
            const team = (match[3].toLowerCase() === 'blue' || match[3].toLowerCase() === 'blau') ? 'away' : 'home';
            const id = team + num;
            attendance[id] = true;
            
            // Namen im DOM aktualisieren
            const el = document.getElementById(id);
            if (el) {
                const name = match[2].trim().split(' ')[0]; // Nur Vorname
                el.innerText = name;
            }
        }
    });
    
    renderAttendanceList();
    if (typeof resetBoard === 'function') resetBoard();
}

function renderAttendanceList() {
    const container = document.getElementById('attendance-list');
    if (!container) return;
    
    container.innerHTML = '<h4>Anwesenheit</h4>';
    Object.keys(attendance).forEach(id => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.padding = '5px 0';
        
        const label = document.createElement('span');
        label.innerText = id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = attendance[id];
        checkbox.onclick = () => {
            attendance[id] = checkbox.checked;
            if (typeof resetBoard === 'function') resetBoard();
        };
        
        row.appendChild(label);
        row.appendChild(checkbox);
        container.appendChild(row);
    });
}

/* --- BANK LOGIK --- */
function addToBank(id) {
    const bankList = document.getElementById('bank-list');
    if (!bankList) return;
    
    const div = document.createElement('div');
    div.className = 'bank-player';
    div.innerText = id;
    bankList.appendChild(div);
}

/* --- PLAYLIST & PHASEN --- */
function loadPhase(idx) {
    currentPhaseIndex = idx;
    const phase = playlist.phases[idx];
    
    document.getElementById('playlist-title').innerText = `Übung ${idx + 1} von ${playlist.phases.length}`;
    
    const list = document.getElementById('coaching-list');
    if (list) {
        list.innerHTML = phase.coaching.map(p => `<li>${p}</li>`).join('');
    }
}

function nextPhase() {
    if (currentPhaseIndex < playlist.phases.length - 1) {
        loadPhase(currentPhaseIndex + 1);
    }
}

function prevPhase() {
    if (currentPhaseIndex > 0) {
        loadPhase(currentPhaseIndex - 1);
    }
}

function addPhase() {
    playlist.phases.push({
        title: "Neue Phase",
        coaching: ["Neue Anweisung hier eingeben"]
    });
    loadPhase(playlist.phases.length - 1);
}

/* --- UTILS --- */
function toggleKader() {
    const wb = document.getElementById('whiteboard');
    if (wb) wb.classList.toggle('open');
}

function exportPlanPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Coach Toni 2.0 - Trainingsplan", 20, 20);
    
    doc.setFontSize(12);
    playlist.phases.forEach((phase, i) => {
        const y = 40 + (i * 30);
        doc.text(`Phase ${i+1}: ${phase.title}`, 20, y);
        doc.text(`Coaching: ${phase.coaching.join(', ')}`, 20, y + 10);
    });
    
    doc.save("Toni_Trainingsplan.pdf");
}

/* --- INITIALISIERUNG --- */
window.onload = () => {
    loadPhase(0);
    // Falls Stimmen verzögert geladen werden
    if (typeof setupVoice === 'function') {
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = setupVoice;
        }
    }
};

// Global machen
window.syncNames = syncNames;
window.toggleKader = toggleKader;
window.nextPhase = nextPhase;
window.prevPhase = prevPhase;
window.addPhase = addPhase;
window.addToBank = addToBank;
window.exportPlanPDF = exportPlanPDF;
