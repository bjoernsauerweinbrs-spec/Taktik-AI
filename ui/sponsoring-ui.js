// =========================================
// Toni 2.0 – Sponsoring & Finanzen UI (FINALE VERSION)
// =========================================

function initSponsoringUI() {
    console.log("Sponsoring-Modul wird geladen…");

    const content = document.getElementById("aktentasche-content");
    if (!content) return;

    content.innerHTML = `
        <h2>Sponsoring & Finanzen</h2>

        <div class="sponsoring-layout">
            <div class="sponsoring-main" id="sponsoring-main"></div>
            <div class="sponsoring-sidebar" id="sponsoring-sidebar"></div>
        </div>
    `;

    renderSponsoringMain();
    renderSponsoringSidebar();
}

// -----------------------------------------
// Hauptbereich: Sponsorenübersicht & Verträge
// -----------------------------------------
function renderSponsoringMain() {
    const main = document.getElementById("sponsoring-main");
    if (!main) return;

    main.innerHTML = `
        ${renderSponsorOverview()}
        ${renderSponsorList()}
    `;
}

function renderSponsorOverview() {
    const totalSponsors = 3;
    const mainPartner = "Toni 2.0 – Der intelligente Co‑Trainer";

    return `
        <section class="sz-article">
            <h3 class="sz-title">Sponsorenübersicht</h3>
            <p class="sz-text">
                Aktuell sind ${totalSponsors} Hauptsponsoren aktiv. Der zentrale Technologiepartner
                ist <strong>${mainPartner}</strong>, der die Analyse- und Trainingsprozesse
                digital unterstützt.
            </p>
        </section>
    `;
}

function renderSponsorList() {
    const sponsors = [
        {
            name: "Toni 2.0 – Der intelligente Co‑Trainer",
            type: "Technologiepartner",
            level: "Hauptsponsor",
            contract: "2025–2028"
        },
        {
            name: "Sporthaus Müller",
            type: "Ausrüster",
            level: "Premium-Partner",
            contract: "2024–2027"
        },
        {
            name: "Energie RheinMain",
            type: "Energiepartner",
            level: "Partner",
            contract: "2023–2026"
        }
    ];

    let html = `
        <section class="sz-article">
            <h3 class="sz-title">Aktive Sponsoren</h3>
    `;

    sponsors.forEach(s => {
        html += `
            <div class="sponsor-row">
                <div class="sponsor-info">
                    <div class="sponsor-name">${s.name}</div>
                    <div class="sponsor-type">${s.type} – ${s.level}</div>
                </div>
                <div class="sponsor-contract">
                    Vertrag: <strong>${s.contract}</strong>
                </div>
            </div>
        `;
    });

    html += `</section>`;
    return html;
}

// -----------------------------------------
// Sidebar: Toni-Branding & Potenzialanalyse
// -----------------------------------------
function renderSponsoringSidebar() {
    const side = document.getElementById("sponsoring-sidebar");
    if (!side) return;

    side.innerHTML = `
        ${renderToniBrandBox()}
        ${renderRevenuePotentialBox()}
        ${renderSponsoringNotesBox()}
    `;
}

function renderToniBrandBox() {
    return `
        <div class="sz-box sponsor-box">
            <h4>Technologiepartner</h4>
            <p><strong>Toni 2.0 – Der intelligente Co‑Trainer</strong></p>
            <p>
                Unterstützt den Verein bei Analyse, Trainingssteuerung und taktischer Vorbereitung.
            </p>
        </div>
    `;
}

function renderRevenuePotentialBox() {
    const potential = randomValue();

    return `
        <div class="sz-box">
            <h4>Sponsoring-Potenzial</h4>
            <p>Aktuelle Auslastung: <strong>${potential}%</strong></p>
            <p>
                Zusätzliche Flächen: Bandenwerbung, Trikotärmel, digitale Kanäle,
                Stadionzeitung und Social Media.
            </p>
        </div>
    `;
}

function renderSponsoringNotesBox() {
    return `
        <div class="sz-box">
            <h4>Notizen & Ideen</h4>
            <textarea class="analysis-notes" placeholder="Ideen für neue Sponsoren, Pakete, Aktionen…"></textarea>
        </div>
    `;
}

// -----------------------------------------
// Demo-Zufallswerte
// -----------------------------------------
function randomValue() {
    return Math.floor(Math.random() * 100);
}