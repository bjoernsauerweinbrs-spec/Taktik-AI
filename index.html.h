<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interaktives Taktikboard</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; display: flex; flex-direction: column; height: 100vh; background: #222; color: white; }
        
        /* Spielfeld */
        #board { flex: 1; background: #2e7d32; position: relative; overflow: hidden; border-bottom: 5px solid #1b5e20; }
        .pitch-line { position: absolute; border: 1px solid rgba(255,255,255,0.3); }
        
        /* Spieler */
        .player { 
            width: 35px; height: 35px; border-radius: 50%; background: #d32f2f; border: 2px solid #fff; 
            position: absolute; cursor: move; display: flex; align-items: center; justify-content: center; 
            font-weight: bold; font-size: 12px; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); z-index: 10; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }

        /* Erklärungs-Bubbles */
        .explanation {
            position: absolute; background: white; color: black; padding: 5px 10px; border-radius: 8px;
            font-size: 13px; font-weight: 500; pointer-events: none; z-index: 20;
            transform: translate(-50%, -130%); box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            animation: fadeIn 0.5s;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -110%); } to { opacity: 1; transform: translate(-50%, -130%); } }

        /* Chat-Bereich */
        #chat { height: 35%; background: #f5f5f5; color: #333; display: flex; flex-direction: column; }
        #msg-box { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
        .bubble { padding: 10px 15px; border-radius: 18px; max-width: 80%; line-height: 1.4; }
        .ai { background: #e1e1e1; align-self: flex-start; }
        .user { background: #007bff; color: white; align-self: flex-end; }
        
        #controls { padding: 15px; background: white; border-top: 1px solid #ddd; display: flex; gap: 10px; }
        input { flex: 1; padding: 12px; border: 1px solid #ccc; border-radius: 25px; outline: none; }
        button { background: none; border: none; font-size: 24px; cursor: pointer; }
    </style>
</head>
<body>

<div id="board">
    <div style="top: 50%; width: 100%;" class="pitch-line"></div>
    <div style="top: 50%; left: 50%; width: 120px; height: 120px; border-radius: 50%; transform: translate(-50%, -50%);" class="pitch-line"></div>
    
    <div id="p1" class="player" style="top: 25%; left: 45%;">10</div>
    <div id="p2" class="player" style="top: 40%; left: 20%;">7</div>
    <div id="p3" class="player" style="top: 40%; left: 70%;">11</div>
    <div id="gk" class="player" style="top: 85%; left: 45%; background: #1976d2;">GK</div>
</div>

<div id="chat">
    <div id="msg-box">
        <div class="bubble ai">Das Board ist jetzt interaktiv. Ich kann die Spieler bewegen und taktische Erklärungen direkt auf dem Feld anzeigen!</div>
    </div>
    <div id="controls">
        <input type="text" id="input" placeholder="Frag mich nach einer Taktik...">
        <button id="mic">🎤</button>
        <button id="send">➤</button>
    </div>
</div>

<script>
    // FUNKTION FÜR DEN CO-TRAINER: Spieler bewegen & erklären
    function coachMove(id, x, y, message = "") {
        const player = document.getElementById(id);
        if (!player) return;
        
        // Spieler bewegen (Werte in Prozent)
        player.style.left = x + "%";
        player.style.top = y + "%";

        // Erklärung anzeigen
        if (message) {
            const note = document.createElement('div');
            note.className = 'explanation';
            note.innerText = message;
            note.style.left = x + "%";
            note.style.top = y + "%";
            document.getElementById('board').appendChild(note);
            
            // Nach 4 Sekunden wieder entfernen
            setTimeout(() => { note.style.opacity = '0'; setTimeout(() => note.remove(), 500); }, 4000);
        }
