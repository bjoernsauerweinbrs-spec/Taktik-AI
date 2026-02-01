// =========================================
// Toni 2.0 – Kader & Transfers UI (FINALE VERSION)
// =========================================

function initKaderUI() {
    console.log("Kader-Modul wird geladen…");

    const content = document.getElementById("aktentasche-content");
    if (!content) return;

    content.innerHTML = `
        <h2>Kader & Transfers</h2>

        <div class="kader-filter">
            <button data-pos="ALL">Alle</button>
            <button data-pos="GK">Tor</button>
            <button data-pos="DEF">Abwehr</button>
            <button data-pos="MID">Mittelfeld</button>
            <button data-pos="ATT">Angriff</button>
        </div>

        <div id="kader-overview" class="kader-overview"></div>
        <div id="kader-list" class="kader-list"></div>
    `;

    renderKaderOverview();
    renderKaderList("ALL");

    // Filter aktivieren
    document.querySelectorAll(".kader-filter button").forEach(btn => {
        btn.addEventListener("click", () => {
            renderKaderList(btn.dataset.pos);
        });
    });
}

// -----------------------------------------
// Kaderübersicht
// -----------------------------------------
function renderKaderOverview() {
    const box = document.getElementById("kader-overview");
    if (!box) return;

    const total = TONI.players.length;
    const avgFitness = randomValue();
    const avgForm = randomValue();

    box.innerHTML = `
        <div class="kader-stats">
            <div class="kader-stat-box">
                <div class="kader-stat-label">Kadergröße</div>
                <div class="kader-stat-number">${total}</div>
            </div>

            <div class="kader-stat-box">
                <div class="kader-stat-label">Ø Fitness</div>
                <div class="kader-stat-number">${avgFitness}</div>
            </div>

            <div class="kader-stat-box">
                <div class="kader-stat-label">Ø Form</div>
                <div class="kader-stat-number">${avgForm}</div>
            </div>
        </div>
    `;
}

// -----------------------------------------
// Spielerliste
// -----------------------------------------
function renderKaderList(filter) {
    const list = document.getElementById("kader-list");
    if (!list) return;

    list.innerHTML = "";

    const players = TONI.players.filter(p => {
        if (filter === "ALL") return true;
        return p.position === filter;
    });

    players.forEach(player => {
        list.appendChild(renderPlayerRow(player));
    });
}

// -----------------------------------------
// Spielerzeile
// -----------------------------------------
function renderPlayerRow(player) {
    const row = document.createElement("div");
    row.classList.add("kader-row");

    const fitness = randomValue();
    const form = randomValue();

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
                <div class="rating-label">Form</div>
                <div class="rating-bar"><div style="width:${form}%"></div></div>
            </div>
        </div>

        <button class="kader-details-btn">Details</button>
    `;

    row.querySelector(".kader-details-btn").addEventListener("click", () => {
        openPlayerDetails(player);
    });

    return row;
}

// -----------------------------------------
// Spieler-Detailpanel
// -----------------------------------------
function openPlayerDetails(player) {
    const content = document.getElementById("aktentasche-content");
    if (!content) return;

    const fitness = randomValue();
    const form = randomValue();
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
            <div class="analysis-value-box"><div class="analysis-value-label">Form</div><div class="analysis-value-number">${form}</div></div>
            <div class="analysis-value-box"><div class="analysis-value-label">Intensität</div><div class="analysis-value-number">${intensity}</div></div>
            <div class="analysis-value-box"><div class="analysis-value-label">Belastung</div><div class="analysis-value-number">${load}</div></div>
        </div>

        <h3>Notizen</h3>
        <textarea class="analysis-notes" placeholder="Trainer-Notizen…"></textarea>

        <h3>Transferstatus</h3>
        <button class="transfer-btn">Transfer prüfen</button>
    `;

    content.querySelector(".back-btn").addEventListener("click", initKaderUI);
}

// -----------------------------------------
// Demo-Zufallswerte
// -----------------------------------------
function randomValue() {
    return Math.floor(Math.random() * 100);
}