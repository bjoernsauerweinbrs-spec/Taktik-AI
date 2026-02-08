/**
 * TONI 2.0 - VISION ENGINE (ELITE BIOMECHANICS)
 * Fokus: Gelenkwinkel-Analyse & Echtzeit-Coaching.
 */
window.ToniVision = {
    detector: null,
    isReady: false,
    lastFeedbackTime: 0,

    // Referenz-Winkel für Profi-Tricks (Beispielwerte)
    drills: {
        "zidane turn": { knee_angle: 120, hip_angle: 160, label: "Tief bleiben!" },
        "torschuss": { knee_angle: 145, ankle_angle: 90, label: "Standbein fest!" }
    },

    async init() {
        console.log("Toni Vision: Lade TensorFlow Pose-Detection...");
        try {
            const detectorConfig = {
                runtime: 'mediapipe',
                solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
                modelType: 'full'
            };
            this.detector = await poseDetection.createDetector(
                poseDetection.SupportedModels.MediaPipePose, 
                detectorConfig
            );
            this.isReady = true;
            console.log("Toni Vision: Biomechanik-Zentrale online.");
        } catch (err) {
            console.error("Toni Vision Fehler:", err);
        }
    },

    async analyzeFrame(video, canvas) {
        if (!this.isReady || !this.detector) return;

        const poses = await this.detector.estimatePoses(video);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (poses && poses.length > 0) {
            const keypoints = poses[0].keypoints;
            this.drawEliteSkeleton(ctx, keypoints);
            this.runProComparison(keypoints);
        }
    },

    /**
     * Berechnet den Winkel zwischen drei Punkten (z.B. Hüfte-Knie-Ankle)
     */
    calculateAngle(p1, p2, p3) {
        const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - 
                        Math.atan2(p1.y - p2.y, p1.x - p2.x);
        let angle = Math.abs((radians * 180.0) / Math.PI);
        if (angle > 180.0) angle = 360 - angle;
        return angle;
    },

    runProComparison(keypoints) {
        const now = Date.now();
        if (now - this.lastFeedbackTime < 3000) return; // Nur alle 3 Sek. Feedback

        const leftKnee = keypoints.find(k => k.name === 'left_knee');
        const leftHip = keypoints.find(k => k.name === 'left_hip');
        const leftAnkle = keypoints.find(k => k.name === 'left_ankle');

        if (leftKnee?.score > 0.5 && leftHip?.score > 0.5 && leftAnkle?.score > 0.5) {
            const currentAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
            
            // Logik: Wenn wir im "Zidane" Modus sind
            const ref = this.drills["zidane turn"];
            if (currentAngle > ref.knee_angle + 20) {
                window.ToniVoice.speak(`Coach, Schwerpunkt zu hoch! Dein Winkel liegt bei ${Math.round(currentAngle)} Grad. Geh tiefer!`);
                this.lastFeedbackTime = now;
            }
        }
    },

    drawEliteSkeleton(ctx, keypoints) {
        const connections = [
            ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_hip'],
            ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'],
            ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
            ['right_hip', 'right_knee'], ['right_knee', 'right_ankle'],
            ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
            ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist']
        ];

        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        connections.forEach(([p1, p2]) => {
            const kp1 = keypoints.find(k => k.name === p1);
            const kp2 = keypoints.find(k => k.name === p2);

            if (kp1?.score > 0.5 && kp2?.score > 0.5) {
                // Farb-Feedback: Alles okay = Neon-Grün
                ctx.strokeStyle = '#39FF14'; 
                ctx.beginPath();
                ctx.moveTo(kp1.x, kp1.y);
                ctx.lineTo(kp2.x, kp2.y);
                ctx.stroke();
            }
        });

        // Gelenkpunkte markieren
        keypoints.forEach(kp => {
            if (kp.score > 0.5) {
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(kp.x, kp.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
};

window.ToniVision.init();
