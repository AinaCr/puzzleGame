import { createContext, useState } from "react";

// Création du contexte global pour l'authentification et les données du puzzle
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    //==================== Variables utilisateur ====================
    const [userName, setUserName] = useState("")       // Nom de l'utilisateur
    const [userMail, setUserMail] = useState("")       // Email de l'utilisateur
    const [userId, setUserId] = useState('')           // ID unique de l'utilisateur
    const [imagePuzzle, setImagePuzzle] = useState("/imge.jpg")  // Image utilisée pour le puzzle

    //==================== Variables puzzle ====================
    const [row, setRow] = useState([])                // Lignes des blocs du puzzle
    const [column, setColumn] = useState([])          // Colonnes des blocs du puzzle
    const [start, setStart] = useState(false)         // Contrôle du démarrage du chronomètre
    const [restart, setRestart] = useState(false)     // Contrôle du redémarrage du puzzle
    const [time, setTime] = useState(0)               // Temps total écoulé en secondes
    const [seconde, setSeconde] = useState(0)         // Seconde actuelle pour l'affichage
    const [minuteActive, setMinuteActive] = useState(false)  // Booléen pour afficher les minutes
    const [newPosition, setNewPosition] = useState(true)     // Contrôle le positionnement aléatoire du puzzle

    //==================== Données de clash et affichage ====================
    const [clashData, setClashData] = useState([])    // Données des challenges/clash
    const [puzzle, setPuzzle] = useState(true)        // Affichage de la vue puzzle
    const [galerie, setGalerie] = useState(false)     // Affichage de la galerie
    const [clash, setClash] = useState(false)         // Affichage du clash
    const [dataPost, setDataPost] = useState([])      // Données des posts ou images partagées

    //==================== variable d'affichage du spin ====================
    const [spin,setSpin]=useState(true)
    const [admin,setAdmin]=useState(false)
    //==================== variable du screen ====================
    const [isMobile,setMobile]=useState(true)

    //==================== Variables de difficulté ====================
    const easy = "easy"        // Niveau facile
    const normal = "normal"    // Niveau normal
    const hard = "hard"        // Niveau difficile
    const userNull = [{        // Valeur par défaut si clashData vide
        pseudo: "none",
        gameID: 0,
        score: 0,
        dificulete: "easy"
    }]
    const [dificulete, setDificult] = useState(easy)  // Variable qui contient la difficulté actuelle

    //==================== Fonction pour récupérer les données clash facile ====================
    async function easyClash() {
        try{
              setSpin(true)
            const response = await fetch("http://localhost:3000/user/easyClash")
        const data = await response.json()
      
        
        if (response.ok) {
            setClashData(data)  // Mise à jour des données clash
            console.log(data)
            
        } else {
            setClashData(userNull)  // Valeur par défaut si erreur
        }
        }catch(err){
            console.log("erreur===",err)
        }finally{
            setSpin(false)
        }
    }

    //==================== Fourniture des variables et fonctions via le contexte ====================
    return (
        <AuthContext.Provider value={{
            userName, setUserName,
            userMail, setUserMail,
            userId, setUserId,
            imagePuzzle, setImagePuzzle,
            row, setRow,
            column, setColumn,
            start, setStart,
            restart, setRestart,
            time, setTime,
            seconde, setSeconde,
            minuteActive, setMinuteActive,
            newPosition, setNewPosition,
            easy, normal, hard,
            dificulete, setDificult,
            clashData, setClashData,
            easyClash,
            puzzle, setPuzzle,
            galerie, setGalerie,
            clash, setClash,
            dataPost, setDataPost,
            spin,setSpin,
            admin,setAdmin,
            isMobile,setMobile
        }}>
            {children}
        </AuthContext.Provider>
    )
}
