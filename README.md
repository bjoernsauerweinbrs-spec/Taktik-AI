⚽ Coach Toni 2.0 – Elite Taktik-Plattform
Toni 2.0 ist ein hochprofessionelles Taktik-Board für modernes Fußballtraining, das die brasilianische „Ginga“-Philosophie mit deutscher Taktik-Akribie verbindet [cite: 2026-01-25]. Es dient als interaktiver Co-Trainer für Björn und Nadine [cite: 2026-01-24].
🧠 Die Toni-Identität
Toni ist eine KI-Persönlichkeit mit einer männlichen, autoritären Stimme [cite: 2026-01-26]. Sein Fachwissen ist eine Symbiose aus zwei Weltklasse-Trainern:
 * Jürgen Klopp: Emotionale Führung, Leidenschaft und explosives Umschaltspiel.
 * Julian Nagelsmann: Technologische Präzision, innovative Raumanalyse und datenbasierte Entscheidungen.
🚀 Die Ginga-Startsequenz
Das System startet niemals statisch. Jede Sitzung beginnt mit einer synchronisierten Zeremonie:
 * Blackout: Die Anwendung startet in absoluter Dunkelheit.
 * Voice-Greeting: Toni begrüßt den Trainer persönlich (Björn/Nadine) [cite: 2026-01-26].
 * Altersklassen-Check: Toni fragt nach der Spielform (Senioren-Großfeld, Jugend oder Funino) [cite: 2026-01-25].
 * SVG-Construction: Das gewählte Spielfeld wird als animierte SVG-Pfad-Grafik „gezeichnet“, bevor die Spieler geladen werden.
💼 Die Zentrale Aktentasche (Single Hub)
Die gesamte Steuerung erfolgt über eine einzige, zustandsgesteuerte Sidebar:
 * Toni-Chat: Direkte Kommunikation und Steuerung der roten Spieler per Sprachbefehl [cite: 2026-01-23].
 * Kader-Management: Persistente Datenbank (IndexedDB) für Spieler inkl. Name, Position, Nummer, Größe, Gewicht und Ginga-Score [cite: 2026-01-24].
 * Matchplan: Schnellauswahl von Formationen und Gegner-Presets (Blaues Team) [cite: 2026-01-25].
 * Video-Analyse: Integrierte Schnittstelle für MP4-Uploads mit Event-Tagging und Zeitstempel-Mapping.
📱 Mobile- & Desktop-Optimierung
Das Board ist für 13“/15“ Laptops und Smartphones optimiert:
 * Kein Scrollen: Die Anwendung nutzt ein overflow: hidden Konzept. Das Spielfeld skaliert immer auf 100% der verfügbaren Fläche.
 * Ghost-Sidebar: Auf Smartphones ist die Aktentasche ein Slide-In-Overlay, um den vollen Fokus auf das Spielfeld zu ermöglichen.
 * Touch-Engine: Volle Unterstützung für Drag & Drop von Spielern und dem Ball via Touch-Events.
🚫 Die „Ginga“ No-Go Liste (Vorgaben für die Entwicklung)
Um die Qualität zu sichern, müssen folgende Regeln strikt eingehalten werden:
 * Keine doppelten Sidebars: Nur ein zentrales DOM-Element für die Aktentasche.
 * Promise-basierte Voice API: Aktionen dürfen erst nach dem Ende der Sprachausgabe (onend) erfolgen.
 * Keine statischen Spielfelder: Linien müssen animierte SVG-Pfade sein.
 * Volle Persistenz: Alle Kaderdaten und Video-Events müssen atomar in der IndexedDB gespeichert werden.
 * EventBus-Kommunikation: Module kommunizieren ausschließlich über den zentralen ToniEvents-Bus.
🛠 Technische Architektur
 * Frontend: HTML5, CSS3 (Modern Flex/Grid), Vanilla JavaScript.
 * Engine: SVG-Animate, CSS-Transitions für Player-Movements.
 * Database: IndexedDB (Browser-native Persistenz).
 * Voice: Web Speech API mit male-voice Heuristik.
