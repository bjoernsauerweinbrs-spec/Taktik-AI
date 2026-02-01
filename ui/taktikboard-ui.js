// =========================================
// Toni 2.0 – Taktikboard UI
// Buttons, Tool-Auswahl, Interaktion
// =========================================

let currentTool = null;

// -----------------------------------------
// UI initialisieren
// -----------------------------------------
function initTaktikboardUI() {
    const toolsContainer = document.getElementById("taktik-tools");
    if (!toolsContainer) return;

    toolsContainer.innerHTML = "";

    // Buttons erzeugen
    createToolButton("Passweg", () => setTool("pass"));
    createToolButton("Laufweg", () => setTool("run"));
    createToolButton("Zone", () => setTool("zone"));
    createToolButton("Marker", () => setTool("marker"));
    createToolButton("Clear", () => clearTools());

    // Canvas-Click für Tools aktivieren
    arena.canvas.addEventListener("click", handleCanvasClick);

    console.log("Taktikboard UI bereit.");
}

// -----------------------------------------
// Tool-Button erzeugen
// -----------------------------------------
function createToolButton(label, callback) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.classList.add("holo-button");
    btn.addEventListener("click", callback);
    document.getElementById("taktik-tools").appendChild(btn);
}

// -----------------------------------------
// Tool setzen
// -----------------------------------------
function setTool(toolName) {
    currentTool = toolName;
    console.log("Tool aktiviert:", toolName);
}

// -----------------------------------------
// Canvas-Klicks verarbeiten
// -----------------------------------------
let firstPoint = null;

function handleCanvasClick(e) {
    if (!currentTool) return;

    const rect = arena.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch (currentTool) {

        case "pass":
            if (!firstPoint) {
                firstPoint = { x, y };
            } else {
                addPassLine(firstPoint.x, firstPoint.y, x, y);
                firstPoint = null;
            }
            break;

        case "run":
            if (!firstPoint) {
                firstPoint = { x, y };
            } else {
                addRunLine(firstPoint.x, firstPoint.y, x, y);
                firstPoint = null;
            }
            break;

        case "zone":
            if (!firstPoint) {
                firstPoint = { x, y };
            } else {
                const w = x - firstPoint.x;
                const h = y - firstPoint.y;
                addZone(firstPoint.x, firstPoint.y, w, h);
                firstPoint = null;
            }
            break;

        case "marker":
            addMarker(x, y);
            break;
    }
}