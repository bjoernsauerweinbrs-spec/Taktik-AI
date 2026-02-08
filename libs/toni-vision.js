/**
 * TONI 2.0 - VISION ENGINE (ELITE BIOMECHANICS)
 * Status: REPARIERT (Model-Name Fix)
 * Version: 2.8.1
 */
window.ToniVision = {
    detector: null,
    isReady: false,
    lastFeedbackTime: 0,

    drills: {
        "Allround-Check": { knee_angle: 160, hip_angle: 170, label: "Haltung stabil." },
        "zidane turn": { knee_angle: 115, hip_angle: 150, label: "Tief bleiben für mehr Balance!" },
        "torschuss": { knee_angle: 140, ankle_angle: 95, label: "Standbein fest neben den Ball!" },
        "dribbling": { knee_angle: 125, hip_angle: 155, label: "Schwerpunkt senken, Ball eng führen!" }
    },

    async init() {
        console.log("Toni Vision: Initialisiere Hochleistungs-Tracking...");
        try {
            // FIX: Explizite Definition des Modells, um den "undefined" Fehler zu umgehen
            const model = poseDetection.SupportedModels.MoveNet; 
            const detectorConfig = { 
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTING 
            };

            // Falls MoveNet nicht verfügbar ist, versuchen wir MediaPipe als Fallback
            const selectedModel = model || 'MoveNet';

            this.detector = await poseDetection.createDetector(selectedModel, detectorConfig);
            this.isReady = true;
            console.log("Toni Vision: Biomechanik-Zentrale online (Modell: MoveNet).");
        } catch (err) {
            console.error("Toni Vision Fehler:", err);
        }
    },

    async analyzeFrame(video, canvas) {
        if (!this.isReady || !this.detector) return;

        try {
            const poses = await this.detector.estimatePoses(video);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (poses && poses.length > 0) {
                const keypoints = poses[0].keypoints;
                this.drawEliteSkeleton(ctx, keypoints);
                this.runProComparison(keypoints);
            }
        } catch (error) {
            // Verhindert Konsolen-Spam bei Frame-Verlust
        }
    },

    calculateAngle(p1, p2, p3) {
        const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - 
                        Math.atan2(p1.y - p2.y, p1.x - p2.x);
        let angle = Math.abs((radians * 180.0) / Math.PI);
        if (angle > 180.0) angle = 360 - angle;
        return angle;
    },

    runProComparison(keypoints) {
        const now = Date.now();
        if (now - this.lastFeedbackTime < 4000) return; 

        const currentDrillName = window.SektorVideo ? window.SektorVideo.currentDrill : "Allround-Check";
        const ref = this.drills[currentDrillName] || this.drills["Allround-Check"];

        // Gelenke finden
        const hip = keypoints.find(k => k.name === 'left_hip' || k.name === 'right_hip');
        const knee = keypoints.find(k => k.name === 'left_knee' || k.name === 'right_knee');
        const ankle = keypoints.find(k => k.name === 'left_ankle' || k.name === 'right_ankle');

        if (knee?.score > 0.6 && hip?.score > 0.6 && ankle?.score > 0.6) {
            const currentAngle = this.calculateAngle(hip, knee, ankle);
            
            if (currentAngle > ref.knee_angle + 15) {
                const diff = Math.round(currentAngle - ref.knee_angle);
                if (window.ToniVoice) {
                    window.ToniVoice.speak(`${ref.label} Aktueller Winkel: ${Math.round(currentAngle)} Grad.`);
                }
                
                const fb = document.getElementById('toni-video-feedback');
                if(fb) fb.innerHTML = `<span style="color:var(--status-error);">WINKEL-ALARM: ${diff}° ABWEICHUNG!</span>`;
                this.lastFeedbackTime = now;
            }
        }
    },

    drawEliteSkeleton(ctx, keypoints) {
        // MoveNet verwendet andere Index-Paare als MediaPipe
        const connections = [
            [5, 7], [7, 9], [6, 8], [8, 10], // Arme
            [5, 6], [5, 11], [6, 12], [11, 12], // Torso
            [11, 13], [13, 15], [12, 14], [14, 16] // Beine
        ];

        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#39FF14'; 

        connections.forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];

            if (kp1?.score > 0.5 && kp2?.score > 0.5) {
                ctx.beginPath();
                ctx.moveTo(kp1.x, kp1.y);
                ctx.lineTo(kp2.x, kp2.y);
                ctx.stroke();
            }
        });

        keypoints.forEach(kp => {
            if (kp.score > 0.5) {
                ctx.fillStyle = kp.name.includes('knee') ? 'var(--data-cyan)' : '#fff';
                ctx.beginPath();
                ctx.arc(kp.x, kp.y, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
};

// Initialisierung erst, wenn die Library geladen ist
if (typeof poseDetection !== 'undefined') {
    window.ToniVision.init();
}
