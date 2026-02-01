// =========================================
// Toni 2.0 – Beratungsmodul UI (FINALE VERSION)
// =========================================

function initBeratungUI() {
    console.log("Beratungsmodul wird geladen…");

    const content = document.getElementById("aktentasche-content");
    if (!content) return;

    content.innerHTML = `
        <h2>Beratung – Toni 2.0 Analyseempfehlungen</h2>

        <div class="beratung-layout">
            <div class="beratung-main" id="beratung-main"></div>
            <div class="beratung-sidebar" id="beratung-sidebar"></div>
        </div>
    `;

    renderBeratungMain();
    renderBeratungSidebar();
}

// -----------------------------------------
// Hauptbereich: Empfehlungen
// -----------------------------------------
function renderBeratungMain() {
    const main = document.getElementById("beratung-main");
    if (!main) return;

    main.innerHTML = `
        ${renderTacticalAdvice()}
        ${renderPlayerAdvice()}
        ${renderTrainingAdvice()}
        ${renderStrategicAdvice()}
    `;
}

// -----------------------------------------
// Sidebar: KI-Kommentar & Notizen
// -----------------------------------------
function renderBeratungSidebar() {
    const side = document.getElementById("beratung-sidebar");
    if (!side) return;

    side.innerHTML = `
        ${renderKIComment()}
        ${renderTrainerNotes()}
    `;
}

// -----------------------------------------
// Taktische Beratung
// -----------------------------------------
function renderTacticalAdvice() {
    return `
        <section class="sz-article">
            <h3 class="sz-title">Taktische Empfehlung</h3>
            <p class="sz-text">
                Die aktuelle Trainingsanalyse zeigt, dass eine leichte Anpassung der
                Pressinghöhe zu mehr Ballgewinnen im Zentrum führen könnte.
            </p>
        </section>
    `;
}

// -----------------------------------------
// Spielerbezogene Beratung
// -----------------------------------------
function renderPlayerAdvice() {
    const player = TONI.players[Math.floor(Math.random() * TONI.players.length)];

    return `
        <section class="sz-article">
            <h3 class="sz-title">Spielerfokus: ${player.name}</h3>
            <p class="sz-text">
                ${player.name} zeigt erhöhte Belastungswerte. Eine reduzierte Intensität
                im nächsten Training wäre sinnvoll, um Überlastung zu vermeiden.
            </p>
        </section>
    `;
}

// -----------------------------------------
// Trainingsberatung
// -----------------------------------------
function renderTrainingAdvice() {
    return `
        <section class="sz-article">
            <h3 class="sz-title">Trainingssteuerung</h3>
            <p class="sz-text">
                Die letzten Einheiten waren intensiv. Eine regenerative Einheit könnte
                helfen, die Gesamtbelastung zu stabilisieren.
            </p>
        </section>
    `;
}

// -----------------------------------------
// Strategische Beratung
// -----------------------------------------
function renderStrategicAdvice() {
    return `
        <section class="sz-article">
            <h3 class="sz-title">Strategische Empfehlung</h3>
            <p class="sz-text">
                Die Kaderstruktur zeigt ein leichtes Ungleichgewicht im Zentrum.
                Ein zusätzlicher Achter würde langfristig Stabilität bringen.
            </p>
        </section>
    `;
}

// -----------------------------------------
// KI-Kommentar
// -----------------------------------------
function renderKIComment() {
    return `
        <div class="sz-box">
            <h4>Toni 2.0 – KI-Kommentar</h4>
            <p>
                „Die aktuelle Formkurve zeigt eine positive Entwicklung. Besonders die
                Abstimmung im Umschaltspiel wirkt verbessert.“
            </p>
            <p class="sz-ki">– Toni 2.0, Co‑Trainer Analyse</p>
        </div>
    `;
}

// -----------------------------------------
// Trainer-Notizen
// -----------------------------------------
function renderTrainerNotes() {
    return `
        <div class="sz-box">
            <h4>Eigene Notizen</h4>
            <textarea class="analysis-notes" placeholder="Eigene Gedanken, Ideen, Entscheidungen…"></textarea>
        </div>
    `;
}