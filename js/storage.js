/**
 * Toni 2.0 - Storage & Dashboard Engine
 * Verwaltet die "Aktentasche" und die Datensicherung.
 */

/**
 * Kernfunktion: Öffnet die Aktentasche (Dashboard-Ansicht)
 */
function exportToKlemmbrett() {
    // Falls ein altes Overlay existiert, entfernen
    const oldOverlay = document.getElementById('dashboard-overlay');
    if (oldOverlay) oldOverlay.remove();

    // HTML für das Dashboard-Overlay erstellen
    const dashboardHtml = `
        <div id="dashboard-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:2000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
            <div style="background:white; width:90%; max-width:800px; max-height:85vh; padding:30px; border-radius:20px; overflow-y:auto; box-shadow:0 25px 50px rgba(0,0,0,0.5); position:relative; font-family:'Inter', sans-serif;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h2 style="margin:0; color:#1b5e20;">💼 Aktentasche: Trainings-Analyse</h2>
                    <button onclick="document.getElementById('dashboard-overlay').remove()" style="font-size:24px; cursor:pointer; border:none; background:none; color:#666;">✕</button>
                </div>
                
                <p style="color:#666; font-size:0.9em; margin-bottom:20px;">Hier sind die aktuellen Leistungsdaten deines Kaders, Björn.</p>
                
                <div style="background:#f9f9f9; border-radius:12px; padding:20px; margin-bottom:20px;">
                    <table style="width:100%; text-align:left; border-collapse:collapse;">
                        <thead>
                            <tr style="border-bottom:2px solid #2e7d32; color:#2e7d32;">
                                <th style="padding:10px;">Spieler</th>
                                <th style="padding:10px;">Status</th>
                                <th style="padding:10px; text-align:center;">⚽ Technik</th>
                                <th style="padding:10px; text-align:center;">👁️ Scanning</th>
                                <th style="padding:10px; text-align:center;">Gesamt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${squad.map(p => {
                                const total = p.points.tech + p.points.scan;
                                const statusLabel = p.status === 'team' ? 'Feld' : (p.status === 'bank' ? 'Bank' : 'Abwesend');
                                return `
                                    <tr style="border-bottom:1px solid #eee;">
                                        <td style="padding:12px;"><strong>#${p.nr} ${p.name}</strong></td>
                                        <td style="padding:12px;"><span style="font-size:0.8em; padding:2px 8px; border-radius:10px; background:#e0e0e0;">${statusLabel}</span></td>
                                        <td style="padding:12px; text-align:center;">${p.points.tech}</td>
                                        <td style="padding:12px; text-align:center;">${p.points.scan}</td>
                                        <td style="padding:12px; text-align:center;"><strong style="color:#2e7d32;">${total}</strong></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="display:flex; gap:15px;">
                    <button onclick="window.print()" style="flex-grow:1; padding:12px; background:#2e7d32; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">🖨️ Für Klemmbrett drucken (PDF)</button>
                    <button onclick="clearAllData()" style="padding:12px; background:#ffebee; color:#c62828; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Reset Daten</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dashboardHtml);
}

/**
 * Daten im LocalStorage sichern
 */
function saveSquadData() {
    localStorage.setItem('toni_squad_data', JSON.stringify(squad));
    console.log("Daten in Aktentasche gesichert.");
}

/**
 * Daten beim Start laden
 */
function loadSquadData() {
    const saved = localStorage.getItem('toni_squad_data');
    if (saved) {
        squad = JSON.parse(saved);
        if (typeof renderSquad === "function") renderSquad();
    }
}

/**
 * Alles auf Null setzen (Sicherheitsfunktion)
 */
function clearAllData() {
    if(confirm("Möchtest du wirklich alle Punkte und Spielerdaten zurücksetzen?")) {
        localStorage.removeItem('toni_squad_data');
        location.reload();
    }
}

// Beim Start automatisch laden
document.addEventListener('DOMContentLoaded', () => {
    loadSquadData();
});
