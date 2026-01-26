<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Toni - Dein Taktik-Coach</title>
    <style>
        :root {
            --pitch-green: #ffffff;
            --line-color: #333;
            --sidebar-bg: #f4f4f4;
            --accent-color: #d32f2f;
        }
        body { font-family: 'Segoe UI', sans-serif; margin: 0; display: flex; height: 100vh; overflow: hidden; }
        #squad-sidebar { width: 250px; background: var(--sidebar-bg); border-right: 2px solid #ddd; display: flex; flex-direction: column; }
        #main-stage { flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; background: #eee; }
        #toni-sidebar { width: 300px; background: var(--sidebar-bg); border-left: 2px solid #ddd; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; }
        .controls { position: absolute; top: 20px; z-index: 10; display: flex; gap: 10px; background: white; padding: 10px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .btn { padding: 8px 15px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #fff; font-weight: bold; }
        .btn.active { background: var(--accent-color); color: white; border-color: var(--accent-color); }
        #pitch { width: 800px; height: 500px; background: var(--pitch-green); border: 3px solid var(--line-color); position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        .center-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: var(--line-color); }
        .center-circle { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 120px; height: 120px; border: 2px solid var(--line-color); border-radius: 50%; }
        .player-dot { position: absolute; width: 35px; height: 35px; border-radius: 50%; border: 2px solid white; cursor: move; z-index: 20; color: white; font-weight: bold; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .red { background: #d32f2f; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
        .player-label { position: absolute; top: 40px; white-space: nowrap; background: rgba(255,255,255,0.8); color: black; padding: 2px 5px; border-radius: 3px; font-size: 10px; }
        #toni-output { flex-grow: 1; overflow-y: auto; margin-top: 15px; font-size: 0.9em; line-height: 1.5; }
        .chat-input { width: 100%; padding: 10px; border-radius: 20px; border: 1px solid #ccc; margin-top: 10px; }
    </style>
</head>
<body>
    <script>
        if(sessionStorage.getItem('toni_auth') !== 'true') { window.location.href = 'index.html'; }
    </script>

    <div id="squad-sidebar">
        <h3 style="padding: 15px; margin: 0; border-bottom: 1px solid #ddd;">Kader-Matrix</h3>
        <div id="player-list" style="padding: 10px; overflow-y: auto; flex-grow: 1;">
            <p style="color: #666; font-size: 0.9em;">Warte auf Kaderdaten...</p>
        </div>
        <button class="btn" style="margin: 10px;" onclick="addNewPlayerPrompt()">+ Spieler</button>
    </div>

    <div id="main-stage">
        <div class="controls">
            <div id="briefcase" onclick="exportToKlemmbrett()">💼</div>
            <button class="btn active" onclick="switchMode('11v11', this)">11 gegen 11</button>
            <button class="btn" onclick="switchMode('training', this)">Training</button>
            <button class="btn" onclick="switchMode('funino', this)">Funino</button>
        </div>
        <div id="pitch">
            <div class="center-line"></div>
            <div class="center-circle"></div>
        </div>
    </div>

    <div id="toni-sidebar">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 50px; height: 50px; background: #2e7d32; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">T</div>
            <strong>Toni (Fachmann)</strong>
        </div>
        <div id="toni-output">
            <p>Hallo Björn! Ich bin bereit. Wähle einen Modus.</p>
        </div>
        <input type="text" class="chat-input" placeholder="Frag Toni..." onkeypress="if(event.key === 'Enter') { handleChatInput(this.value); this.value=''; }">
    </div>

    <script src="js/logic.js"></script>
    <script src="js/board.js"></script>
    <script src="js/chat.js"></script>
    <script src="js/storage.js"></script>
</body>
</html>
