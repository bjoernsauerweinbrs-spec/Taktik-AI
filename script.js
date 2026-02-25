/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8)
   ========================================================================= */

const eliteStore = {
    config: { passkey: "1234", version: "15.8" },
    mgmt: { budget: 4500000, morale: 82, weather: "18°C" },
    // Finanz-Datenbank (Pro & Amateur)
    finance: {
        pro: {
            tvRights: 2500000,
            sponsoring: 1200000,
            stadiumIncome: 800000,
            transfers: -500000,
            maintenance: -150000
        },
        amateur: {
            memberships: 45000,
            equipment: -2500,
            travel: -1200,
            events: 5000
        }
    },
    // Spieler-Daten (wie zuvor)
    players: [
        { id: 1, name: "NEUER", pos: "TW", rating: 89, stats: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 }, bio: { weight: 92, kfa: 11, muscle: 48, water: 62, heart: 48, vo2: 60 }, contract: { salary: 15000, expiry: 2026 } },
        { id: 10, name: "KANE", pos: "ST", rating: 90, stats: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 }, bio: { weight: 86, kfa: 12, muscle: 47, water: 59, heart: 46, vo2: 58 }, contract: { salary: 25000, expiry: 2027 } }
        // ... (Weitere Spieler bleiben im Speicher)
    ]
};

// 1. BOOT & INITIALISIERUNG
function systemBootSequence() {
    const input = document.getElementById('passkey');
    if (input.value === eliteStore.config.passkey) {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('main-interface').classList.remove('hidden');
        initializeDashboard();
    } else { alert("ZUGRIFF VERWEIGERT."); }
}

function initializeDashboard() {
    updateClock();
    setInterval(updateClock, 1000);
    refreshBudgetDisplay();
    switchModule('kader');
}

function refreshBudgetDisplay() {
    const total = Object.values(eliteStore.finance.pro).reduce((a, b) => a + b, 0) + 
                  Object.values(eliteStore.finance.amateur).reduce((a, b) => a + b, 0);
    eliteStore.mgmt.budget = total;
    document.getElementById('kpi-budget').innerText = total.toLocaleString() + " €";
}

// 2. MODUL-ROUTER
function switchModule(modId) {
    const stage = document.getElementById('module-content');
    if (modId === 'kader') renderSquad();
    if (modId === 'finance') renderOffice();
}

// 3. OFFICE PRIME - DAS MANAGEMENT MODUL
function renderOffice() {
    const stage = document.getElementById('module-content');
    const f = eliteStore.finance;

    stage.innerHTML = `
        <div class="office-container fade-in">
            <header class="office-header">
                <h2><i class="fa-solid fa-briefcase"></i> OFFICE PRIME // VEREINSMANAGEMENT</h2>
            </header>

            <div class="office-grid">
                <section class="office-panel pro-panel">
                    <h3>PROFI-ABTEILUNG</h3>
                    ${renderFinanceRows(f.pro, 'pro')}
                </section>

                <section class="office-panel amateur-panel">
                    <h3>AMATEUR-BEREICH / JUGEND</h3>
                    ${renderFinanceRows(f.amateur, 'amateur')}
                    <button class="btn-action" onclick="addAmateurExpense()"><i class="fa-solid fa-plus"></i> EQUIPMENT KAUFEN</button>
                </section>

                <section class="office-panel ai-panel">
                    <h3>NEURAL SECRETARY</h3>
                    <p class="small">KI-gestützte Dokumentenerstellung</p>
                    <div class="ai-letter-tools">
                        <button onclick="generateLetter('sponsoring')">SPONSOREN-ANFRAGE</button>
                        <button onclick="generateLetter('parents')">ELTERNBRIEF (TRAINING)</button>
                        <button onclick="generateLetter('excuse')">ENTSCHULDIGUNG (SCHULE/ARBEIT)</button>
                    </div>
                    <textarea id="ai-letter-output" placeholder="Toni entwirft hier dein Dokument..."></textarea>
                </section>
            </div>
        </div>
    `;
}

function renderFinanceRows(obj, category) {
    return Object.keys(obj).map(key => `
        <div class="finance-row">
            <span>${key.toUpperCase()}:</span>
            <input type="number" value="${obj[key]}" onchange="updateFinance('${category}', '${key}', this.value)">
            <small>€</small>
        </div>
    `).join('');
}

function updateFinance(cat, key, val) {
    eliteStore.finance[cat][key] = parseInt(val);
    refreshBudgetDisplay();
}

function addAmateurExpense() {
    const item = prompt("Was möchtest du kaufen? (z.B. Hütchen, Bälle)");
    const cost = prompt("Kosten in €?");
    if(item && cost) {
        eliteStore.finance.amateur[item] = -parseInt(cost);
        refreshBudgetDisplay();
        renderOffice();
    }
}

// AI SEKRETARIAT LOGIK
function generateLetter(type) {
    const output = document.getElementById('ai-letter-output');
    const coach = "Trainer Müller";
    
    const templates = {
        sponsoring: `Sehr geehrte Damen und Herren,\n\nals Trainer von TONI 2.0 bin ich auf der Suche nach starken Partnern. Wir bieten Ihnen eine moderne Plattform für Ihr Branding...`,
        parents: `Liebe Eltern,\n\nam kommenden Samstag findet unser wichtiges Spieltag-Event statt. Bitte achten Sie auf die korrekte Ausrüstung (Schienbeinschoner!)...`,
        excuse: `Hiermit bestätige ich, dass Spieler [NAME] am gestrigen Trainingstag aufgrund einer sportärztlichen Untersuchung entschuldigt war...`
    };

    output.value = "Toni analysiert... \n\n" + templates[type];
    console.log("KI-Brief generiert:", type);
}

// 4. KADER-REDIZIERUNG (WIE ZUVOR)
function renderSquad() {
    const stage = document.getElementById('module-content');
    stage.innerHTML = `<div class="pitch-container">SQUAD ANSICHT AKTIV (4-4-2)</div>`;
}

function updateClock() {
    const clock = document.getElementById('clock-display');
    if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE');
}
