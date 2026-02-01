// =========================================
// Toni 2.0 – Analysezentrum UI (NEUE VERSION)
// Team-Dashboard & Spieler-Dashboard
// =========================================

function initAnalysisCenterUI() {
    console.log("Analysezentrum wird geladen…");

    const content = document.getElementById("aktentasche-content");
    if (!content) return;

    content.innerHTML = `
        <h2>Analysezentrum</h2>
        <div id="analysis-wrapper" class="analysis-wrapper"></div>
    `;

    renderAnalysisCenter();
}

// -----------------------------------------
// Haupt-Renderfunktion
// -----------------------------------------
function renderAnalysisCenter() {
    const wrapper = document.getElementById("analysis-wrapper");
    if (!wrapper) return;

    wrapper.innerHTML = "";

    // Team-Übersicht
    wrapper.appendChild(renderTeamOverview());

    // Spieler-Übersicht
    TONI.players.forEach(player => {
        wrapper.appendChild(renderPlayerCard(player));
    });
}

// -----------------------------------------
// Team-Übersicht
// -----------------------------------------
function renderTeamOverview() {
    const box = document.createElement("div");
    box.classList.add("analysis-panel");

    const avgFitness = averageValue("fitness");
    const avgForm = averageValue("form");

    box.innerHTML = `
        <div class="analysis-title">Team-Übersicht</div>

        <div class="analysis-grid">
            <div class="analysis-value-box">
                <div class="analysis-value-label">Kadergröße</div>
                <div class="analysis-value-number">${TONI.players.length}</div>
            </div>

            <div class="analysis-value-box">
                <div class="analysis-value-label">Ø Fitness</div>
                <div class="analysis-value-number">${avgFitness}</div>
            </div>

            <div class="analysis-value-box">
                <div class="analysis-value-label">Ø Form</div>
                <div class="analysis-value-number">${avgForm}</div>
            </div>
        </div>

        <div class="analysis-title">Team-Diagramm</div>
        <div class="analysis-chart" id="team-chart"></div>
    `;

    // Diagramm laden
    if (typeof renderTeamChart === "function") {
        renderTeamChart("team-chart", TONI.players);
    }

    return box;
}

// -----------------------------------------
// Spielerkarte
// -----------------------------------------
function renderPlayerCard(player) {
    const box = document.createElement("div");
    box.classList.add("analysis-panel");

    const fitness = randomValue();
    const form = randomValue();
    const intensity = randomValue();
    const load = randomValue();

    box.innerHTML = `
        <div class="analysis-player-header">
            <img src="https://via.placeholder.com/64" alt="Player">
            <div class="analysis-player-name">${player.number} – ${player.name}</div>
        </div>

        <div class="analysis-grid">
            <div class="analysis-value-box">
                <div class="analysis-value-label">Fitness</div>
                <div class="analysis-value-number">${fitness}</div>
            </div>

            <div class="analysis-value-box">
                <div class="analysis-value-label">Form</div>
                <div class="analysis-value-number">${form}</div>
            </div>

            <div class="analysis-value-box">
                <div class="analysis-value-label">Intensität</div>
                <div class="analysis-value-number">${intensity}</div>
            </div>

            <div class="analysis-value-box">
                <div class="analysis-value-label">Belastung</div>
                <div class="analysis-value-number">${load}</div>
            </div>
        </div>

        <div class="analysis-title">Heatmap</div>
        <div class="analysis-heatmap"></div>

        <div class="analysis-title">Notizen</div>
        <textarea class="analysis-notes" placeholder="Trainer-Notizen…"></textarea>
        <button class="analysis-save-btn">Speichern</button>
    `;

    return box;
}

// -----------------------------------------
// Durchschnittswerte
// -----------------------------------------
function averageValue(type) {
    return Math.floor(Math.random() * 100);
}

// -----------------------------------------
// Demo-Zufallswerte
// -----------------------------------------
function randomValue() {
    return Math.floor(Math.random() * 100);
}