<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sauerwein Taktik-Coach</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        #soccer-field {
            background-color: #2e7d32;
            background-image: 
                linear-gradient(white 2px, transparent 2px),
                linear-gradient(90deg, white 2px, transparent 2px);
            background-size: 50px 50px;
            position: relative;
            border: 4px solid white;
            border-radius: 8px;
            height: 500px;
            touch-action: none;
        }
        .player {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            cursor: move;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
    </style>
</head>
<body class="bg-slate-900 text-white font-sans">

    <header class="p-6 bg-slate-800 border-b-4 border-yellow-500 text-center">
        <h1 class="text-3xl font-bold uppercase tracking-widest">Sauerwein Taktik-Pro</h1>
        <p class="text-yellow-400">BVB-Zertifizierte Expertise & Professioneller Co-Trainer</p>
    </header>

    <main class="p-4 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2">
            <h2 class="text-xl mb-4 font-semibold text-white">Spielfeld (Interaktiv)</h2>
            <div id="soccer-field" class="w-full overflow-hidden shadow-2xl mb-4">
                <div class="player bg-blue-600" style="top: 250px; left: 50px;">1</div>
                <div class="player bg-blue-600" style="top: 100px; left: 150px;">4</div>
                <div class="player bg-red-600" style="top: 250px; right: 50px;">9</div>
            </div>
            <p class="text-sm text-slate-400">Info: Spieler lassen sich per Touch verschieben.</p>
        </div>

        <div class="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <h3 class="text-xl font-bold">Professioneller Co-Trainer</h3>
            </div>
            <div id="ai-chat" class="h-64 overflow-y-auto mb-4 p-3 bg-slate-900 rounded border border-slate-700 text-sm leading-relaxed">
                <p class="text-yellow-400 font-bold mb-2">System-Check 2026:</p>
                <p>Bereit, Chef! Ich stehe an der Seitenlinie. Sobald wir die KI-Brücke aktiviert haben, analysiere ich hier deine Spielzüge nach der Sauerwein-Methodik.</p>
            </div>
            <button class="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 rounded uppercase transition-all">
                Sprachsteuerung starten
            </button>
            
            <div class="mt-8 border-t border-slate-700 pt-4 text-xs">
                <p class="text-slate-500 uppercase tracking-tighter mb-2">Themenschwerpunkt:</p>
                <span class="bg-slate-700 px-2 py-1 rounded">Funino (Nino-System)</span>
                <span class="bg-slate-700 px-2 py-1 rounded ml-2">Umschaltspiel</span>
            </div>
        </div>

    </main>

    <footer class="p-10 text-center text-slate-500 text-xs">
        &copy; 2026 Björn Sauerwein - Expert Training Systems.
    </footer>

    <script>
        // Einfache Drag-Logik für das iPhone
        const players = document.querySelectorAll('.player');
        players.forEach(player => {
            player.addEventListener('touchmove', function(e) {
                let touch = e.touches[0];
                let field = document.getElementById('soccer-field').getBoundingClientRect();
                let x = touch.clientX - field.left - 15;
                let y = touch.clientY - field.top - 15;
                
                // Begrenzung innerhalb des Feldes
                if(x > 0 && x < field.width - 30) player.style.left = x + 'px';
                if(y > 0 && y < field.height - 30) player.style.top = y + 'px';
            });
        });
    </script>
</body>
</html>