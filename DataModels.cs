using System;
using System.Collections.Generic;

// Diese Datei definiert nur die "Container" für unsere Daten.
// Sie muss [System.Serializable] sein, damit wir sie später in JSON umwandeln können.

namespace ToniVR.Core
{
    [System.Serializable]
    public class PlayerProfile
    {
        public int id;              // ID aus dem Web-Dashboard (z.B. 101)
        public string name;         // "M. Müller"
        public string position;     // "ST"
        public int rating;          // 88
        
        // Konstruktor
        public PlayerProfile(int _id, string _name, string _pos, int _rating)
        {
            id = _id;
            name = _name;
            position = _pos;
            rating = _rating;
        }
    }

    [System.Serializable]
    public class DrillResult
    {
        public string drillID;      // z.B. "scanning_maestro"
        public int playerID;        // Wer hat trainiert?
        public float score;         // Punktzahl (z.B. 850)
        public float reactionTime;  // Durchschnittliche Reaktionszeit in ms
        public float accuracy;      // Trefferquote (0.0 bis 1.0)
        public string timestamp;    // Wann wurde trainiert?
        
        public DrillResult() 
        {
            timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }

    [System.Serializable]
    public class TrainingSession
    {
        // Diese Klasse empfängt den Befehl vom Trainer-PC
        public string activeDrillID;
        public int difficultyLevel; // 1-5
        public int durationSeconds;
    }
}
