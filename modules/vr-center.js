/* --- PRO VR-CENTER MODUL (Mit Controller & Sprachsteuerung) --- */

const vrCenter = {
    isVRMode: false,

    launchVR: function() {
        this.isVRMode = true;
        addMessage("Toni", "System-Check: Meta Quest Controller erkannt. Sprachsteuerung aktiv.");
        
        const container = document.getElementById('vr-container');
        container.innerHTML = ""; 

        const scene = document.createElement('a-scene');
        scene.setAttribute('embedded', '');
        scene.setAttribute('renderer', 'antialias: true; colorManagement: true; shadowMapEnabled: true;');

        scene.innerHTML = `
            <a-assets>
                <a-asset-item id="pro-player" src="https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/RiggedFigure/glTF-Binary/RiggedFigure.glb"></a-asset-item>
                <img id="grass-texture" src="https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/terrain/grasslight-big.jpg">
            </a-assets>

            <a-entity light="type: ambient; intensity: 0.6"></a-entity>
            <a-entity light="type: directional; intensity: 0.8; castShadow: true" position="-5 10 5"></a-entity>
            <a-plane position="0 0 0" rotation="-90 0 0" width="50" height="50" src="#grass-texture" repeat="10 10" shadow="receive: true"></a-plane>
            <a-sky color="#223344"></a-sky>

            <a-entity id="target-player" 
                      gltf-model="#pro-player" 
                      position="3 0 -8" 
                      scale="1.5 1.5 1.5" 
                      shadow="cast: true">
            </a-entity>

            <a-entity oculus-touch-controls="hand: left"></a-entity>
            <a-entity oculus-touch-controls="hand: right" id="right-hand" ontriggerdown="vrCenter.handlePass()">
                <a-cursor color="#22c55e" raycaster="objects: .selectable"></a-cursor>
            </a-entity>

            <a-entity camera look-controls position="0 1.6 0"></a-entity>
        `;

        container.appendChild(scene);
        this.initVoiceCommand();
    },

    // Logik für den Pass per Controller
    handlePass: function() {
        addMessage("Toni", "Pass ausgeführt! Timing war perfekt.");
        
        // Visuelles Feedback in der VR: Ein Ball schießt zum Spieler
        const ball = document.createElement('a-sphere');
        ball.setAttribute('radius', '0.15');
        ball.setAttribute('color', 'white');
        ball.setAttribute('position', '0 0.2 -1');
        ball.setAttribute('animation', 'property: position; to: 3 0.2 -8; dur: 800; easing: easeOutQuad');
        
        document.querySelector('a-scene').appendChild(ball);
        
        setTimeout(() => ball.remove(), 1000);
    },

    // Sprachsteuerung
    initVoiceCommand: function() {
        if (!('webkitSpeechRecognition' in window)) {
            console.log("Spracherkennung nicht unterstützt.");
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'de-DE';
        recognition.continuous = true;

        recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
            console.log("Toni hört:", command);

            if (command.includes("pass") || command.includes("jetzt")) {
                this.handlePass();
            }
            if (command.includes("toni")) {
                addMessage("Toni", "Ich höre? Wie kann ich helfen, Coach?");
            }
        };

        recognition.start();
    }
};
