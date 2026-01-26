/**
 * Toni 2.0 - Storage & Aktentasche
 * Verantwortlich für das Speichern und das Dashboard-Klemmbrett
 */

// Speichert den aktuellen Kader und die Punkte im LocalStorage
function saveSquadData() {
    localStorage.setItem('toni_ginga_squad', JSON.stringify(squad));
}

// Lädt die Daten beim Starten der Seite
function loadSquadData() {
    const savedData = localStorage.getItem('toni_ginga_squad');
    if (savedData) {
        squad = JSON.parse(savedData);
        if (typeof renderSquad === 'function') renderSquad();
        if (typeof drawBoard === 'function') drawBoard();
    }
}

/**
 * Öffnet das Klemmbrett (Dashboard) für den Trainer
 */
function exportToKlemmbrett() {
    const oldOverlay = document.getElementById('dashboard-overlay');
    if (oldOverlay) oldOverlay.remove();

    // Berechnung der Team-Stats
    const totalPoints = squad.reduce((sum, p) => sum + (p.points.tech + p.points.scan + p.points.fit + p.points.star), 0);

    const dashboardHtml = `
        <div id="dashboard-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:3000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px);">
            <div style="background:#0f1720; width:90%; max-width:800px; padding:30px; border-radius:20px; border:1px solid #2ecc71; color:white; font-family:'Inter', sans-serif;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <h2 style="margin:0; color:#2ecc71;">💼 TRAININGSDATEN: ${sessionStorage.getItem('toni_name') || 'Trainer'}</h2>
                    <button onclick="document.getElementById('dashboard-overlay').remove()" style="background:none; border:none; color:white; font-size:24px; cursor:pointer;">✕</button>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:25px;">
                    <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px;">
                        <span style="font-size:12px; color:#9aa3ad;">GESAMT-GINGA-FAKTOR</span>
                        <div style="font-size:24px; font-weight:bold; color:#f1c40f;">${totalPoints} Punkte</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px;">
                        <span style="font-size:12px; color:#9aa3ad;">AKTIVE SPIELER</span>
                        <div style="font-size:24px; font-weight:bold; color:#2ecc71;">${squad.filter(p => p.status === 'present').length} / ${squad.length}</div>
                    </div>
                </div>

                <div style="max-height:300px; overflow-y:auto; margin-bottom:20px; background:rgba(0,0,0,0.2); border-radius:10px;">
                    <table style="width:100%; border-collapse:collapse; text-align:left;">
                        <thead>
                            <tr style="border-bottom:1px solid #333; color:#9aa3ad; font-size:12px;">
                                <th style="padding:10px;">SPIELER</th>
                                <th style="padding:10px;">⚽</th>
                                <th style="padding:10px;">👁️</th>
                                <th style="padding:10px;">🏃</th>
                                <th style="padding:10px;">⭐</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${squad.map(p => `
                                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                                    <td style="padding:10px;">#${p.nr} ${p.name}</td>
                                    <td style="padding:10px;">${p.points.tech}</td>
                                    <td style="padding:10px;">${p.points.scan}</td>
                                    <td style="padding:10px;">${p.points.fit}</td>
                                    <td style="padding:10px; color:#f1c40f;">${p.points.star}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="display:flex; gap:15px;">
                    <button onclick="window.print()" style="flex-grow:1; padding:15px; background:#2ecc71; border:none; border-radius:10px; color:white; font-weight:bold; cursor:pointer;">ALS PDF SPEICHERN / DRUCKEN</button>
                    <button onclick="resetAllData()" style="padding:15px; background:#e74c3c; border:none; border-radius:10px; color:white; font-weight:bold; cursor:pointer;">DATEN RESET</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', dashboardHtml);
}

function resetAllData() {
    if (confirm("Möchtest du wirklich alle Kaderdaten und Punkte löschen?")) {
        localStorage.removeItem('toni_ginga_squad');
        location.reload();
    }
}

// Beim Laden der App die Daten herbeiholen
document.addEventListener('DOMContentLoaded', loadSquadData);
