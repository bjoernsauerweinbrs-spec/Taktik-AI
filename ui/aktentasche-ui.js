// =========================================
// Toni 2.0 – Aktentasche UI
// Navigation, Panels, Interaktion
// =========================================

function initAktentascheUI() {
    const nav = document.getElementById("aktentasche-nav");
    const content = document.getElementById("aktentasche-content");

    if (!nav || !content) {
        console.warn("Aktentasche UI nicht gefunden.");
        return;
    }

    // Navigation erzeugen
    nav.innerHTML = "";
    createNavIcon("📊", "analysis");
    createNavIcon("📰", "stadionzeitung");
    createNavIcon("💼", "sponsoring");
    createNavIcon("🎧", "beratung");

    // Panels erzeugen
    content.innerHTML = `
        <div id="panel-analysis" class="aktentasche-panel">
            <h2 class="panel-title">Analysezentrum</h2>
            <div class="analysis-wrapper">
                <!-- Inhalte werden später dynamisch ergänzt -->
                <p>Spieler- und Team-Analyse wird hier angezeigt.</p>
            </div>
        </div>

        <div id="panel-stadionzeitung" class="aktentasche-panel">
            <h2 class="panel-title">Stadionzeitung</h2>
            <p>Hier kannst du Inhalte für die Stadionzeitung erstellen.</p>
        </div>

        <div id="panel-sponsoring" class="aktentasche-panel">
            <h2 class="panel-title">Sponsoring</h2>
            <p>Hier verwaltest du Sponsoren, Pakete und Präsentationen.</p>
        </div>

        <div id="panel-beratung" class="aktentasche-panel">
            <h2 class="panel-title">Beratung</h2>
            <p>Toni unterstützt dich hier mit KI‑gestützten Empfehlungen.</p>
        </div>
    `;

    // Standard: Analysezentrum öffnen
    openPanel("analysis");
}

// -----------------------------------------
// Navigation Icon erzeugen
// -----------------------------------------
function createNavIcon(icon, panelName) {
    const el = document.createElement("div");
    el.classList.add("nav-icon");
    el.textContent = icon;

    el.addEventListener("click", () => {
        openPanel(panelName);
        setActiveNav(el);
    });

    document.getElementById("aktentasche-nav").appendChild(el);
}

// -----------------------------------------
// Aktives Icon markieren
// -----------------------------------------
function setActiveNav(activeEl) {
    document.querySelectorAll("#aktentasche-nav .nav-icon")
        .forEach(el => el.classList.remove("active"));

    activeEl.classList.add("active");
}

// -----------------------------------------
// Panel öffnen
// -----------------------------------------
function openPanel(name) {
    document.querySelectorAll(".aktentasche-panel")
        .forEach(panel => panel.classList.remove("active"));

    const panel = document.getElementById(`panel-${name}`);
    if (panel) {
        panel.classList.add("active");
    }
}