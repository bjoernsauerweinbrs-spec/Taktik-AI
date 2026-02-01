// =========================================
// Toni 2.0 – Hologramm & Neon-Effekte (FINALE VERSION)
// =========================================

function initHologramEffects() {
    const holo = document.createElement("div");
    holo.id = "toni-hologram";
    document.body.appendChild(holo);
}

// -----------------------------------------
// Grundzustand
// -----------------------------------------
function activateHologram() {
    const holo = document.getElementById("toni-hologram");
    if (!holo) return;

    holo.classList.add("active");
}

function deactivateHologram() {
    const holo = document.getElementById("toni-hologram");
    if (!holo) return;

    holo.classList.remove("active");
}

// -----------------------------------------
// Pulse-Effekt (bei Voice oder KI)
// -----------------------------------------
function pulseHologram() {
    const holo = document.getElementById("toni-hologram");
    if (!holo) return;

    holo.classList.add("pulse");
    setTimeout(() => holo.classList.remove("pulse"), 600);
}

// -----------------------------------------
// Scan-Effekt (Analyse-Momente)
// -----------------------------------------
function scanHologram() {
    const holo = document.getElementById("toni-hologram");
    if (!holo) return;

    holo.classList.add("scan");
    setTimeout(() => holo.classList.remove("scan"), 800);
}