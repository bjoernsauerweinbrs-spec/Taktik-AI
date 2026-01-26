// Funktion für Toni, um Linien zu zeichnen
function drawTacticalLine(fromX, fromY, toX, toY, isDashed = false) {
    const svg = document.getElementById('tactical-svg') || createSvgLayer();
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    
    line.setAttribute("x1", fromX + "%");
    line.setAttribute("y1", fromY + "%");
    line.setAttribute("x2", toX + "%");
    line.setAttribute("y2", toY + "%");
    line.setAttribute("stroke", isDashed ? "blue" : "red");
    line.setAttribute("stroke-width", "2");
    if(isDashed) line.setAttribute("stroke-dasharray", "5,5");
    
    svg.appendChild(line);
}

function createSvgLayer() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "tactical-svg";
    svg.style = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:50;";
    pitch.appendChild(svg);
    return svg;
}
