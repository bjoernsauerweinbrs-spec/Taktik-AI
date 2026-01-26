/**
 * Toni 2.0 - Board Engine (Finaler Kern)
 */
var pitch = document.getElementById('pitch');

function drawBoard() {
    if (!pitch) return;
    
    // Spielfeld-Struktur: Mittellinie und Kreis
    pitch.innerHTML = 
        '<div class="center-line" style="position:absolute; left:50%; width:2px; height:100%; background:rgba(0,0,0,0.2);"></div>' +
        '<div class="center-circle" style="position:absolute; top:50%; left:50%; width:100px; height:100px; border:2px solid rgba(0,0,0,0.2); border-radius:50%; transform:translate(-50%,-50%);"></div>' +
        '<div id="ball" style="position:absolute; top:50%; left:50%; width:15px; height:15px; background:white; border-radius:50%; transform:translate(-50%,-50%); border:1px solid black; z-index:10; cursor:move;">⚽</div>';

    // Spieler aus dem Kader (Team Rot) zeichnen
    if (typeof squad !== 'undefined') {
        squad.forEach(function(p) {
            if (p.status === 'team') {
                createPlayerDot(p, 'red');
            }
        });
    }
}

function createPlayerDot(p, colorClass) {
    var dot = document.createElement('div');
    dot.className = 'player-dot ' + colorClass;
    // Startposition: Mitte oder gespeicherte Werte
    dot.style.left = p.x || '50%';
    dot.style.top = p.y || '50%';
    
    // Name und Nummer unter dem Spieler
    dot.innerHTML = p.nr + '<div class="player-label">#' + p.nr + ' ' + p.name + '</div>';
    
    // CSS direkt für die Dots (falls style.css noch lädt)
    dot.style.position = "absolute";
    dot.style.width = "35px";
    dot.style.height = "35px";
    dot.style.borderRadius = "50%";
    dot.style.display = "flex";
    dot.style.alignItems = "center";
    dot.style.justifyContent = "center";
    dot.style.color = "white";
    dot.style.fontWeight = "bold";
    dot.style.cursor = "move";
    dot.style.zIndex = "20";
    dot.style.background = colorClass === 'red' ? '#d32f2f' : '#1976d2';
    dot.style.border = "2px solid white";

    makeDraggable(dot, p.id);
    pitch.appendChild(dot);
}

function makeDraggable(el, playerId) {
    var isDragging = false;
    el.onmousedown = function() { isDragging = true; el.style.cursor = 'grabbing'; };
    
    document.onmousemove = function(e) {
        if (!isDragging) return;
        var rect = pitch.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        
        var posX = Math.max(0, Math.min(100, x)) + '%';
        var posY = Math.max(0, Math.min(100, y)) + '%';
        
        el.style.left = posX;
        el.style.top = posY;

        // Position im Speicher aktualisieren
        var p = squad.find(function(player) { return player.id === playerId; });
        if (p) { p.x = posX; p.y = posY; }
    };
    
    document.onmouseup = function() { 
        isDragging = false; 
        el.style.cursor = 'move';
        if (typeof saveSquadData === "function") saveSquadData(); 
    };
}

// Initialer Start
document.addEventListener('DOMContentLoaded', drawBoard);
