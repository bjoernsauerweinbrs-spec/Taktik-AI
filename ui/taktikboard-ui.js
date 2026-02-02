// =========================================
// Toni 2.0 – Taktikboard UI (Vollständig)
// =========================================

let currentTool = null;
let firstPoint = null;

function initTaktikboardUI() {
    const toolsContainer = document.getElementById("taktik-tools");
    if (!toolsContainer) return;

    toolsContainer.innerHTML = `
        <h3>Taktik-Werkzeuge</h3>
        <div class="tool-grid">
            <button id="btn-pass" class="holo-button">Passweg</button>
            <button id="btn-run" class="holo-button">Laufweg</button>
            <button id="btn-zone" class="holo-button">Zone</button>
            <button id="btn-marker" class="holo-button">Marker</button>
            <button id="btn-clear" class="holo-button danger">Löschen</button>
        </div>
    `;

    // Event Listener
    document.getElementById("btn-pass").onclick = () => setTool("pass");
    document.getElementById("btn-run").onclick = () => setTool("run");
    document.getElementById("btn-zone").onclick = () => setTool("zone");
    document.getElementById("btn-marker").onclick = () => setTool("marker");
    document.getElementById("btn-clear").onclick = () => clearTools();

    // Klick auf das Spielfeld
    const canvas = document.getElementById("arena-canvas");
    canvas.addEventListener("mousedown", handleBoardClick);
    
    console.log("🎨 Taktikboard UI initialisiert.");
}

function setTool(name) {
    currentTool = name;
    firstPoint = null; // Reset bei Tool-Wechsel
    
    // Visuelles Feedback
    document.querySelectorAll(".holo-button").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(`btn-${name}`);
    if (activeBtn) activeBtn.classList.add("active");
}

function handleBoardClick(e) {
    if (!currentTool) return;

    const rect = arena.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === "marker") {
        addMarker(x, y);
    } else if (!firstPoint) {
        firstPoint = { x, y };
    } else {
        if (currentTool === "pass") addPassLine(firstPoint.x, firstPoint.y, x, y);
        if (currentTool === "run") addRunLine(firstPoint.x, firstPoint.y, x, y);
        if (currentTool === "zone") {
            const w = x - firstPoint.x;
            const h = y - firstPoint.y;
            addZone(firstPoint.x, firstPoint.y, w, h);
        }
        firstPoint = null;
    }
}
