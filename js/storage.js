/**
 * Toni 2.0 - Dashboard & Archiv Engine
 * Verwaltet den Kader-Status, Trainingspläne und Notizen.
 */

/**
 * Öffnet das Dashboard-Overlay (Die Aktentasche)
 */
function exportToKlemmbrett() {
    const old = document.getElementById('dashboard-overlay');
    if (old) old.remove();

    const plans = JSON.parse(localStorage.getItem('toni_training_plans') || '[]');

    const dashboardHtml = `
        <div id="dashboard-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:3000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); font-family:'Inter', sans-serif;">
            <div style="background:#fff; width:95%; max-width:1000px; height:90vh; border-radius:20px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.5);">
                
                <div style="display:flex; background:#f4f4f4; border-bottom:1px solid #ddd; padding:0 20px;">
                    <button onclick="switchTab('players')" id="tab-btn-players" style="padding:20px; border:none; background:none; cursor:pointer; font-weight:bold; border-bottom:3px solid #2e7d32; color:#2e7d32;">Kader-Matrix</button>
                    <button onclick="switchTab('plans')" id="tab-btn-plans" style="padding:20px; border:none; background:none; cursor:pointer; font-weight:bold; color:#666;">Trainingspläne</button>
                    <div style="flex-grow:1;"></div>
                    <button onclick="document.getElementById('dashboard-overlay').remove()" style="padding:20px; border:none; background:none; cursor:pointer; font-size:24px;">✕</button>
                </div>

                <div style="flex-grow:1; overflow-y:auto; padding:30px;">
                    
                    <div id="view-players">
                        <h2 style="margin-top:0;">Leistungsdaten & Anwesenheit</h2>
                        <table style="width:100%; border-collapse:collapse; text-align:left;">
                            <thead>
                                <tr style="background:#2e7d32; color:white;">
                                    <th style="padding:12px;">Spieler</th>
                                    <th>Status</th>
                                    <th>Technik</th>
                                    <th>Wahrnehmung</th>
                                    <th>Fitness</th>
                                    <th>Sonder</th>
                                    <th>Gesamt</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${squad.map(p => {
                                    const sum = p.points.tech + p.points.scan + p.points.fit + p.points.special;
                                    const st = p.status === 'team' ? 'Anwesend' : (p.status === 'spiel' ? 'Nur Spiel' : 'Abwesend');
                                    return `
                                        <tr style="border-bottom:1px solid #eee;">
                                            <td style="padding:12px;"><strong>#${p.nr} ${p.name}</strong></td>
                                            <td><span style="font-size:0.8em; padding:3px 8px; border-radius:10px; background:#e0e0e0;">${st}</span></td>
                                            <td>${p.points.tech}</td>
                                            <td>${p.points.scan}</td>
                                            <td>${p.points.fit}</td>
                                            <td>${p.points.special}</td>
                                            <td><strong>${sum}</strong></td>
                                        </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div id="view-plans" style="display:none;">
                        <h2 style="margin-top:0;">Gespeicherte Trainingseinheiten</h2>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                            ${plans.length === 0 ? '<p>Noch keine Pläne gespeichert, Björn.</p>' : plans.map(p => `
                                <div style="border:1px solid #ddd; border-radius:12px; padding:15px; background:#f9f9f9;">
                                    <div style="display:flex; justify-content:space-between;">
                                        <strong style="color:#2e7d32;">${p.date}</strong>
                                        <button onclick="deletePlan(${p.id})" style="border:none; background:none; color:red; cursor:pointer;">Löschen</button>
                                    </div>
                                    <h4 style="margin:10px 0;">${p.title}</h4>
                                    <div style="background:white; border:1px solid #ccc; height:150px; overflow:hidden; position:relative; transform:scale(0.3); transform-origin:top left; width:333%;">
                                        ${p.boardSnap}
                                    </div>
                                    <div style="margin-top:10px; font-size:0.85em; color:#444; max-height:100px; overflow-y:auto; border-bottom:1px solid #ddd; padding-bottom:10px;">
                                        ${p.desc}
                                    </div>
                                    <textarea onchange="updatePlanNotes(${p.id}, this.value)" style="width:100%; height:80px; margin-top:10px; border-radius:5px; border:1px solid #ccc; padding:5px; font-family:sans-serif;" placeholder="Deine Notizen (z.B. David Luiz war heute...)">${p.notes || ''}</textarea>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div style="padding:20px; border-top:1px solid #eee; display:flex; gap:10px;">
                    <button onclick="window.print()" style="padding:12px 24px; background:#2e7d32; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">🖨️ Klemmbrett-Export (PDF)</button>
                    <button onclick="clearToniData()" style="padding:12px 24px; background:#ffebee; color:#c62828; border:none; border-radius:8px; cursor:pointer;">Alle Daten zurücksetzen</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', dashboardHtml);
}

function switchTab(tab) {
    document.getElementById('view-players').style.display = tab === 'players' ? 'block' : 'none';
    document.getElementById('view-plans').style.display = tab === 'plans' ? 'block' : 'none';
    
    document.getElementById('tab-btn-players').style.color = tab === 'players' ? '#2e7d32' : '#666';
    document.getElementById('tab-btn-players').style.borderBottom = tab === 'players' ? '3px solid #2e7d32' : 'none';
    
    document.getElementById('tab-btn-plans').style.color = tab === 'plans' ? '#2e7d32' : '#666';
    document.getElementById('tab-btn-plans').style.borderBottom = tab === 'plans' ? '3px solid #2e7d32' : 'none';
}

function updatePlanNotes(id, text) {
    let plans = JSON.parse(localStorage.getItem('toni_training_plans') || '[]');
    const idx = plans.findIndex(p => p.id === id);
    if (idx !== -1) {
        plans[idx].notes = text;
        localStorage.setItem('toni_training_plans', JSON.stringify(plans));
    }
}

function deletePlan(id) {
    if(confirm("Plan wirklich löschen?")) {
        let plans = JSON.parse(localStorage.getItem('toni_training_plans') || '[]');
        plans = plans.filter(p => p.id !== id);
        localStorage.setItem('toni_training_plans', JSON.stringify(plans));
        exportToKlemmbrett(); // Refresh
    }
}

function saveSquadData() {
    localStorage.setItem('toni_squad_data', JSON.stringify(squad));
}

function loadSquadData() {
    const s = localStorage.getItem('toni_squad_data');
    if (s) {
        squad = JSON.parse(s);
        if (typeof renderSquad === "function") renderSquad();
    }
}

function clearToniData() {
    if(confirm("ACHTUNG: Alle Spielerdaten und Pläne werden gelöscht!")) {
        localStorage.clear();
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', loadSquadData);
