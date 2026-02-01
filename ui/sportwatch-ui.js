// =========================================
// Toni 2.0 – Sportwatch / Belastungsanalyse UI (FINALE VERSION)
// =========================================

function initSportwatchUI() {
    console.log("Sportwatch-Modul wird geladen…");

    const content = document.getElementById("aktentasche-content");
    if (!content) return;

    content.innerHTML = `
        <h2>Sportwatch – Fitness & Belastung</h2>

        <div id="sportwatch-overview" class="sportwatch-overview"></div>
        <div id="sportwatch-list" class="sportwatch-list"></div>
    `;

    renderSportwatchOverview();
    renderSportwatchList();
}

// -----------------------------------------
// Team-Übersicht
// -----------------------------------------
function renderSportwatchOverview() {
    const box = document.getElementById("sportwatch-overview");
    if (!box) return;

    const avgFitness = randomValue();
    const avgIntensity = randomValue();
    const avgLoad = randomValue();

    box.innerHTML = `
        <div class="kader-stats">
            <div class="kader-stat-box">
                <div class="kader-stat-label">Ø Fitness</div>
                <div class="kader-stat-number">${avgFitness}</div>
            </div>

            <div class="kader-stat-box">
                <div class="kader-stat-label">Ø Intensität</div>
                <div class="kader-stat-number">${avgIntensity}</div>
            </div>

            <div class="kader-stat-box">
                <div class="kader-stat-label">Ø Belastung</div>
                <div class="kader-stat-number">${avgLoad}</div>
            </div>
        </div>
    `;
}

// -----------------------------------------
// Spielerliste
// -----------------------------------------
function renderSportwatchList() {
    const list = document.getElementById("sportwatch-list");
    if (!list) return;

    list.innerHTML = "";

    TONI.players.forEach(player => {
        list.appendChild(renderSportwatchRow(player));
    });
}

// -----------------------------------------
// Spielerzeile
// -----------------------------------------
function renderSportwatchRow(player) {
    const row = document.createElement("div");
    row.classList.add("kader-row");

    const fitness = randomValue();
    const intensity = randomValue();
    const load = randomValue();

    row.innerHTML = `
        <div class="kader-player-info">
            <div class="kader-player-number">${player.number}</div>
            <div class="kader-player-name">${player.name}</div>
            <div class="kader-player-pos">${player.position}</div>
        </div>

        <div class="kader-player-ratings">
            <div class="rating-box">
                <div class="rating-label">Fit</div>
                <div class="rating-bar"><div style="width:${fitness}%"></div></div>
            </div>

            <div class="rating-box">
                <div class="rating-label">Int</div>
                <div class="rating-bar"><div style="width:${intensity}%"></div></div>
            </div>

            <div class="rating-box">
                <div class="rating-label">Load</div>
                <div class="rating-bar"><div style="width:${load}%"></div></div>
            </div>
        </div>

        <button class="kader-details-btn">Details</button>
    `;

    row.querySelector(".kader-details-btn").addEventListener("click", () => {
        openSportwatchDetails(player);
    });

    return row;
}

// -----------------------------------------
// Detailpanel
// -----------------------------------------
function openSportwatchDetails(player) {
    const content = document.getElementById("aktentasche-content");
    if (!content) return;

    const fitness = randomValue();
    const intensity = randomValue();
    const load = randomValue();

    content.innerHTML = `
        <button class="back-btn">← Zurück</button>

        <div class="player-detail-header">
            <img src="https://via.placeholder.com/96" alt="Player">
            <div class="player-detail-name">${player.number} – ${player.name}</div>
            <div class="player-detail-pos">${player.position}</div>
        </div>

        <div class="analysis-grid">
            <div class="analysis-value-box"><div class="analysis-value-label">Fitness</div><div class="analysis-value-number">${fitness}</div></div>
            <div class="analysis-value-box"><div class="analysis-value-label">Intensität</div><div class="analysis-value-number">${intensity}</div></div>
            <div class="analysis-value-box"><div class="analysis-value-label">Belastung</div><div class="analysis-value-number">${load}</div></div>
        </div>

        <h3>Belastungsdiagramm</h3>
        <div class="analysis-chart" id="load-chart"></div>

        <h3>Notizen</h3>
        <textarea class="analysis-notes" placeholder="Trainer-Notizen…"></textarea>
    `;

    // Diagramm laden
    if (typeof renderLoadChart === "function") {
        renderLoadChart("load-chart", player);
    }

    content.querySelector(".back-btn").addEventListener("click", initSportwatchUI);
}

// -----------------------------------------
// Demo-Zufallswerte
// -----------------------------------------
function randomValue() {
    return Math.floor(Math.random() * 100);
}