// =========================================
// Toni 2.0 – Stadionzeitung UI (FINALE VERSION)
// Realistische Vereinszeitung mit Sponsorenbereich
// =========================================

function initStadionzeitungUI() {
    console.log("Stadionzeitung wird geladen…");

    const content = document.getElementById("aktentasche-content");
    if (!content) return;

    content.innerHTML = `
        <div class="stadionzeitung-header">
            <h2>Stadionzeitung – Vereinsreport</h2>
            <div class="sponsor-banner">
                Präsentiert von <strong>Toni 2.0 – Der intelligente Co‑Trainer</strong>
            </div>
        </div>

        <div class="stadionzeitung-layout">
            <div class="stadionzeitung-main" id="stadionzeitung-main"></div>
            <div class="stadionzeitung-sidebar" id="stadionzeitung-sidebar"></div>
        </div>

        <div class="stadionzeitung-footer">
            © Toni 2.0 – Automatisch erstellt durch den intelligenten Co‑Trainer
        </div>
    `;

    renderStadionzeitungMain();
    renderStadionzeitungSidebar();
}

// -----------------------------------------
// Hauptbereich (Artikel)
// -----------------------------------------
function renderStadionzeitungMain() {
    const main = document.getElementById("stadionzeitung-main");
    if (!main) return;

    main.innerHTML = `
        ${renderHeadlineArticle()}
        ${renderTrainingReport()}
        ${renderPlayerFocus()}
        ${renderTacticAnalysis()}
        ${renderClubNews()}
    `;
}

// -----------------------------------------
// Sidebar (Sponsoren, Statistiken, KI-Kommentar)
// -----------------------------------------
function renderStadionzeitungSidebar() {
    const side = document.getElementById("stadionzeitung-sidebar");
    if (!side) return;

    side.innerHTML = `
        ${renderSponsorBox()}
        ${renderTeamStatsBox()}
        ${renderExpertComment()}
    `;
}

// -----------------------------------------
// Rubrik: Schlagzeile
// -----------------------------------------
function renderHeadlineArticle() {
    return `
        <article class="sz-article">
            <h3 class="sz-title">Fulda steigert Trainingsintensität – Neue Impulse im Zentrum</h3>
            <p class="sz-text">
                Das heutige Training zeigte deutliche Fortschritte im Spielaufbau und in der
                vertikalen Staffelung. Besonders die zentrale Achse überzeugte mit hoher
                Passqualität und stabiler Raumaufteilung.
            </p>
        </article>
    `;
}

// -----------------------------------------
// Rubrik: Trainingsbericht
// -----------------------------------------
function renderTrainingReport() {
    return `
        <article class="sz-article">
            <h3 class="sz-title">Trainingsbericht</h3>
            <p class="sz-text">
                Im Fokus stand heute das Umschaltspiel. Die Mannschaft arbeitete intensiv an
                schnellen Übergängen nach Ballgewinn. Die Passwege wurden klarer, die
                Laufwege abgestimmter und die Entscheidungsfindung präziser.
            </p>
        </article>
    `;
}

// -----------------------------------------
// Rubrik: Spieler im Fokus
// -----------------------------------------
function renderPlayerFocus() {
    const player = TONI.players[Math.floor(Math.random() * TONI.players.length)];

    return `
        <article class="sz-article">
            <h3 class="sz-title">Spieler im Fokus: ${player.name}</h3>
            <p class="sz-text">
                ${player.name} zeigte heute eine starke Leistung. Mit hoher Intensität,
                guter Entscheidungsfindung und stabiler Fitness war er einer der
                auffälligsten Spieler im Training.
            </p>
        </article>
    `;
}

// -----------------------------------------
// Rubrik: Taktikanalyse
// -----------------------------------------
function renderTacticAnalysis() {
    return `
        <article class="sz-article">
            <h3 class="sz-title">Taktikanalyse</h3>
            <p class="sz-text">
                Die Anpassung der Pressinghöhe führte zu mehr Ballgewinnen im zweiten Drittel.
                Zudem zeigte die Mannschaft Fortschritte im diagonalen Überladen der Halbräume.
            </p>
        </article>
    `;
}

// -----------------------------------------
// Rubrik: Vereinsnews
// -----------------------------------------
function renderClubNews() {
    return `
        <article class="sz-article">
            <h3 class="sz-title">Vereinsnews</h3>
            <p class="sz-text">
                Der Trainingsplan für die kommende Woche steht fest. Der Fokus liegt auf
                Stabilität im Zentrum, Belastungssteuerung und taktischer Variabilität.
            </p>
        </article>
    `;
}

// -----------------------------------------
// Sidebar: Sponsorenbox
// -----------------------------------------
function renderSponsorBox() {
    return `
        <div class="sz-box sponsor-box">
            <h4>Sponsor der Woche</h4>
            <p><strong>Toni 2.0 – Der intelligente Co‑Trainer</strong></p>
            <p>Offizieller Technologiepartner für modernes Training.</p>
        </div>
    `;
}

// -----------------------------------------
// Sidebar: Teamstatistik
// -----------------------------------------
function renderTeamStatsBox() {
    const avgFitness = randomValue();
    const avgForm = randomValue();

    return `
        <div class="sz-box">
            <h4>Teamstatistik</h4>
            <p>Ø Fitness: <strong>${avgFitness}</strong></p>
            <p>Ø Form: <strong>${avgForm}</strong></p>
        </div>
    `;
}

// -----------------------------------------
// Sidebar: Expertenkommentar (KI)
// -----------------------------------------
function renderExpertComment() {
    return `
        <div class="sz-box">
            <h4>Expertenkommentar</h4>
            <p>
                „Die aktuelle Formkurve zeigt eine klare Stabilisierung im Zentrum.
                Besonders die Abstimmung im Pressing wirkt verbessert.“
            </p>
            <p class="sz-ki">– Toni 2.0, Co‑Trainer Analyse</p>
        </div>
    `;
}

// -----------------------------------------
// Demo-Zufallswerte
// -----------------------------------------
function randomValue() {
    return Math.floor(Math.random() * 100);
}