<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KI Co-Trainer</title>
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; height: 100vh; margin: 0; background-color: #f4f4f9; }
        #chat-container { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
        .message { padding: 10px; border-radius: 10px; max-width: 80%; }
        .user { align-self: flex-end; background-color: #007bff; color: white; }
        .ai { align-self: flex-start; background-color: #e9e9eb; color: black; }
        #input-area { padding: 20px; background: white; display: flex; align-items: center; gap: 10px; border-top: 1px solid #ccc; }
        input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        button { padding: 10px; cursor: pointer; border: none; background: none; font-size: 20px; }
        #mic-btn { color: #d9534f; }
    </style>
</head>
<body>

<div id="chat-container">
    <div class="message ai">Hallo! Ich bin dein Co-Trainer. Wie kann ich dir heute helfen?</div>
</div>

<div id="input-area">
    <input type="text" id="user-input" placeholder="Schreibe etwas...">
    <button id="mic-btn">🎤</button>
    <button id="send-btn">➤</button>
</div>

<script>
    const micBtn = document.getElementById('mic-btn');
    const userInput = document.getElementById('user-input');

    // Einfache Funktion für das Mikrofon (Web Speech API)
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'de-DE';

        micBtn.onclick = () => {
            recognition.start();
            micBtn.style.color = 'green';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            micBtn.style.color = '#d9534f';
        };

        recognition.onerror = () => { micBtn.style.color = '#d9534f'; };
    } else {
        micBtn.style.display = 'none'; // Verstecken, wenn Browser es nicht unterstützt
    }
</script>

</body>
</html>
