/**
 * =========================================
 * TONI 2.0 – TRAININGSBUCH (PERFORMANCE)
 * Belastungssteuerung & Session Planner
 * =========================================
 */
(function() {
    window.Trainingsbuch = {
        sessions: [
            { id: 101, date: "2026-02-02", title: "Taktik: Umschaltspiel", load: 1.2, status: "Planned" },
            { id: 102, date: "2026-02-03", title: "Physis: Kraftausdauer", load: 1.5, status: "High Load" },
            { id: 103, date: "2026-02-04", title: "Regeneration", load: 0.5, status: "Recovery" }
        ],

        init() {
            console.log("📅 Trainingsbuch: Performance-Engine bereit.");
        },

        // Schaltet zum Trainingsplaner um
        show() {
            const stage = document.getElementById('stage');
            const canvas = document.getElementById('main-canvas');
            const tools = document.querySelector('.tools-overlay');
            
            canvas.style.display = 'none';
            if (tools) tools.style.display = 'none';

            let planner = document.getElementById('training-planner');
            if (!planner) {
                planner = document.createElement('div');
                planner.id = 'training-planner';
                stage.appendChild(planner);
            }
            this.renderPlanner();
            this.updateSidebar();
        },

        renderPlanner() {
            const container = document.getElementById('training-planner');
            container.innerHTML = `
                <div class="planner-wrapper">
                    <header class="planner-header">
                        <h2>Trainings-Periodisierung</h2>
                        <div class="acwr-indicator">ACWR: <span style="color: #28C76F">1.05 (Optimal)</span></div>
                    </header>
                    
                    <div class="calendar-grid">
                        ${this.generateCalendarDays()}
                    </div>

                    <div class="visual-load-curve">
                        <h3>Belastungskurve (Visual Planner)</h3>
                        <div class="chart-placeholder"></div>
                    </div>
                </div>
            `;
        },

        generateCalendarDays() {
            const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
            return days.map(day => `
                <div class="calendar-day">
                    <span class="day-label">${day}</span>
                    <div class="drop-zone" ondragover="event.preventDefault()">
                        ${this.getSessionsForDay(day)}
                    </div>
                </div>
            `).join('');
        },

        getSessionsForDay(day) {
            // Mock-Logik für Demo-Zwecke
            const session = this.sessions[Math.floor(Math.random() * this.sessions.length)];
            const color = session.load > 1.3 ? '#FF6A00' : '#00D1FF';
            return `
                <div class="session-card" style="border-left: 3px solid ${color}">
                    <small>${session.status}</small>
                    <h4>${session.title}</h4>
                </div>
            `;
        },

        updateSidebar() {
            const sidebar = document.getElementById('setcard-content');
            sidebar.innerHTML = `
                <div class="planner-sidebar">
                    <h3 style="color: #FF6A00;">Übungs-Datenbank</h3>
                    <div class="drill-item" draggable="true">⚽ 4vs4 + 2 Rondo</div>
                    <div class="drill-item" draggable="true">🏃 Sprint-Intervall</div>
                    <div class="drill-item" draggable="true">🛡️ Abwehrkette Verschieben</div>
                    
                    <div class="periodization-info">
                        <h4>Wochenziel</h4>
                        <p>Fokus: Taktische Flexibilität & Regeneration vor Matchday.</p>
                    </div>
                    <button class="holo-button" onclick="alert('Plan exportiert')">PLAN PUSHEN</button>
                </div>
            `;
        }
    };
})();
