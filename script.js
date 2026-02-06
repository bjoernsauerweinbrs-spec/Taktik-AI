/**
 * TONI 2.0 - BRIDGE SCRIPT
 * Verbindet HTML-Buttons mit der Modul-Logik
 */

// 1. Die Haupt-Funktion für den Button (TASCHE)
function toggleBriefcase() {
    const modal = document.getElementById('briefcase-modal');
    if (!modal) return console.error("Modal nicht gefunden!");

    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        // Falls wir eine dynamische Inhalts-Logik nutzen:
        if (typeof window.BriefcaseUI !== 'undefined') {
            window.BriefcaseUI.renderMainGrid();
        }
    }
}

// 2. Navigation innerhalb der Tasche
function openSection(section) {
    console.log("Öffne Sektor:", section);
    if (section === 'kabine' && window.SektorSporttasche) {
        window.SektorSporttasche.open();
    } else if (section === 'analyse' && window.SektorAnalyse) {
        window.SektorAnalyse.open();
    } else {
        alert("Sektor " + section + " ist in Arbeit...");
    }
}

// 3. Initialisierung beim Laden
window.onload = () => {
    console.log("TONI 2.0 Cockpit geladen.");
    
    // Arena starten, falls vorhanden
    if (window.arena && document.getElementById('main-canvas')) {
        window.arena.init('main-canvas');
    }
};
