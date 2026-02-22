using UnityEngine;
using Photon.Pun;
using Photon.Realtime;

namespace ToniVR.Network
{
    public class ToniNetworkManager : MonoBehaviourPunCallbacks
    {
        [Header("System Status")]
        public bool isTrainerPC = false; // Haken setzen im Inspector, wenn das der PC ist

        void Start()
        {
            Debug.Log("TONI VR: Verbinde zum Neural Server...");
            PhotonNetwork.ConnectUsingSettings(); // Nutzt die Photon App ID
        }

        public override void OnConnectedToMaster()
        {
            Debug.Log("TONI VR: Verbunden mit Master Server.");
            // Wir treten einem Raum namens "ToniLab" bei oder erstellen ihn
            RoomOptions options = new RoomOptions { MaxPlayers = 4 };
            PhotonNetwork.JoinOrCreateRoom("ToniLab", options, TypedLobby.Default);
        }

        public override void OnJoinedRoom()
        {
            Debug.Log("TONI VR: Im Trainingsraum 'ToniLab' angekommen.");
            
            if (isTrainerPC)
            {
                Debug.Log("MODUS: TRAINER COCKPIT");
            }
            else
            {
                Debug.Log("MODUS: SPIELER VR-BRILLE");
                // Hier würden wir später den Avatar spawnen
            }
        }
    }
}
