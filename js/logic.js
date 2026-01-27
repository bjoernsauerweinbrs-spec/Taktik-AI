/**
 * Toni 2.0 - Elite Logic Center
 * Verwaltung von Kader, Ampelsystem und BMI
 */

let squad = [
    { id: "p1", nr: 1, name: "Thorsten", pos: "TW", height: 1.90, weight: 88, status: "green", stats: {tech: 85, scan: 90, fit: 80} },
    { id: "p2", nr: 11, name: "David Luiz", pos: "IV", height: 1.89, weight: 84, status: "yellow", stats: {tech: 80, scan: 75, fit: 85} }
];

// Tab-Inhalte laden
window.loadTabContent = function(tab) {
    const area = document.getElementById('tab-content-area');
    
    if (tab === 'kader') {
        renderKaderTab(area);
    } else if (tab === 'sporttasche') {
        area.innerHTML = `
            <h3>🎒 Sporttasche</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="card"><h4>Samba-Technik</h4><p>Übungen für Beidfüßigkeit & Ginga</p></div>
                <div class="card"><h4>Trainingsmaterial</h4><p>Hütchen, Stangen, Koordinationsleiter</p></div>
            </div>`;
    } else if (tab === 'analyse') {
        area.innerHTML = `<h3>📊 Analyse-Zentrum</h3><p>Video-Analyse, Kabinen-Ansprachen und Performance-Werte werden hier nach der Toni-Analyse abgelegt.</p>`;
    } else if (tab === 'match') {
        area.innerHTML = `<h3>🏆 Spieltag-Zentrale</h3><button class="btn-green" style="width:auto; padding:10px 20px;">+ NEUES MATCH ERSTELLEN</button>`;
    }
};

function renderKaderTab(container) {
    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3>Kader-Verwaltung</h3>
            <button class="btn-green" style="width:auto; padding:10px 20px;" onclick="addPlayerPrompt()">+ SPIELER VERPFLICHTEN</button>
        </div>
        <div id="kader-list-full"></div>
    `;
    
    const list = document.getElementById('kader-list-full');
    squad.forEach(p => {
        const bmi = (p.weight / (p.height * p.height)).toFixed(1);
        const card = document.createElement('div');
        card.style = "background:#0d1117; border:1px solid #30363d; padding:15px; border-radius:10px; margin-bottom:10px; display:flex; align-items:center; gap:20px;";
        
        card.innerHTML = `
            <div style="font-size:24px; font-weight:900; color:#2ecc71; width:40px;">#${p.nr}</div>
            <div style="flex-grow:1;">
                <div style="font-weight:bold; font-size:18px;">${p.name} <span style="font-size:12px; color:#8b949e;">(${p.pos})</span></div>
                <div style="font-size:12px; color:#8b949e;">Größe: ${p.height}m | Gewicht: ${p.weight}kg | <strong>BMI: ${bmi}</strong></div>
            </div>
            
            <div style="display:flex; gap:5px;">
                <div onclick="updateStatus('${p.id}', 'red')" style="width:20px; height:20px; border-radius:50%; background:${p.status==='red'?'#f85149':'#300'}; cursor:pointer; border:1px solid white;"></div>
                <div onclick="updateStatus('${p.id}', 'yellow')" style="width:20px; height:20px; border-radius:50%; background:${p.status==='yellow'?'#f1c40f':'#330'}; cursor:pointer; border:1px solid white;"></div>
                <div onclick="updateStatus('${p.id}', 'green')" style="width:20px; height:20px; border-radius:50%; background:${p.status==='green'?'#2ecc71':'#030'}; cursor:pointer; border:1px solid white;"></div>
            </div>

            <button onclick="removePlayer('${p.id}')" style="background:none; border:none; color:#f85149; cursor:pointer; font-weight:bold;">✕</button>
        `;
        list.appendChild(card);
    });
    syncToBoard();
}

function updateStatus(id, newStatus) {
    const p = squad.find(x => x.id === id);
    if(p) p.status = newStatus;
    renderKaderTab(document.getElementById('tab-content-area'));
}

function addPlayerPrompt() {
    const name = prompt("Name des Spielers:");
    const nr = prompt("Trikotnummer:");
    const pos = prompt("Position (z.B. TW, IV, ST):");
    const h = parseFloat(prompt("Größe in m (z.B. 1.85):")) || 0;
    const w = parseFloat(prompt("Gewicht in kg:")) || 0;
    
    if(name && nr) {
        squad.push({ id: "p"+Date.now(), nr, name, pos, height: h, weight: w, status: "green", stats: {tech:0, scan:0, fit:0} });
        renderKaderTab(document.getElementById('tab-content-area'));
    }
}

function removePlayer(id) {
    squad = squad.filter(p => p.id !== id);
    renderKaderTab(document.getElementById('tab-content-area'));
    const bPlayer = document.getElementById(id);
    if(bPlayer) bPlayer.remove();
}

function syncToBoard() {
    squad.forEach(p => {
        let bPlayer = document.getElementById(p.id);
        if(!bPlayer && p.status !== 'red') {
            createPlayerOnBoard('red', p.nr, p.name, p.id, 100, 100);
        } else if (p.status === 'red' && bPlayer) {
            bPlayer.remove();
        }
    });
}

function createPlayerOnBoard(team, nr, name, id, x, y) {
    const p = document.createElement('div');
    p.className = `player ${team}`;
    p.id = id;
    p.innerText = nr;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    
    const label = document.createElement('div');
    label.className = 'player-label';
    label.innerText = name;
    p.appendChild(label);

    // Einfaches Dragging
    p.onmousedown = function(e) {
        let shiftX = e.clientX - p.getBoundingClientRect().left;
        let shiftY = e.clientY - p.getBoundingClientRect().top;
        function moveAt(pageX, pageY) {
            const rect = document.getElementById('pitch').getBoundingClientRect();
            p.style.left = (pageX - rect.left - shiftX) + 'px';
            p.style.top = (pageY - rect.top - shiftY) + 'px';
        }
        function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
        document.addEventListener('mousemove', onMouseMove);
        p.onmouseup = function() { document.removeEventListener('mousemove', onMouseMove); p.onmouseup = null; };
    };
    document.getElementById('pitch').appendChild(p);
}
