// ======================= IMPORTATIONS =======================
import { useNavigate } from "react-router-dom"       // Hook pour navigation
import css from "./styles/myStyle.module.css"               // Styles CSS modulaires
import { useState, useContext, useEffect } from "react"  // Hooks React
import { AuthContext } from "./variables/variableExport"      // Contexte global pour utilisateur

// ======================= COMPOSANT PRINCIPAL =======================
function App() {
    // ======================= CONTEXT ET STATE =======================
    const { userName, setUserName, userId, setUserId,admin,setAdmin } = useContext(AuthContext)
    const [mail, setMail] = useState('')          // State pour l’email de l’utilisateur
    const [create, setCreate] = useState(true)    // true = inscription, false = connexion
    const [answer, setAnswer] = useState(true)    // Feedback valide ou erreur
    const [answerSent, setAnswerSent] = useState('') // Message d’erreur ou info

    // Regex pour validation
    const regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/     // Vérifie format email
    const regexName = /^[A-Za-z][A-Za-zÀ-ÿ\s\p{Emoji_Presentation}\p{Extended_Pictographic}]*$/u; // Nom valide : commence par lettre, peut inclure accents ou emoji

    const navigate = useNavigate() // Pour naviguer vers Accueille après login/inscription

    // ======================= FONCTIONS =======================

    // Récupère l’ID utilisateur depuis le backend par pseudo
    const getId = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/getId?name=${userName}`)
            const data = await response.json()

            if (response.status === 200) {
                console.log(`data=${data.userID}`)
                console.log(data)
                setUserId(data.userID)
                
                console.log("id utilisateur recuper")
                console.log(userId)
            } else {
                console.log("id non recupere")
                console.log(data.message)
            }
        } catch (err) {
            console.log("erreur lors de fetch::", err)
        }
    }

    // Gestion inscription ou connexion selon create
    const userData = async (e) => {
        console.log("inscription")
        e.preventDefault()

        if (create) {
            // ----------------- INSCRIPTION -----------------
            if (regexName.test(userName)) {           // Vérifie le pseudo
                if (regexMail.test(mail)) {          // Vérifie email
                    try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name: userName, email: mail })
                        })

                        const data = await response.json()

                        if (response.status === 201) {
                            console.log(data)
                            navigate('Accueille') // Redirection vers la page principale
                            
                            getId() // Récupère l’ID de l’utilisateur
                        } else {
                            // Gestion erreurs spécifiques MySQL / backend
                            if (data.message === `Duplicate entry '${userName}' for key 'Users.pseudo'`) {
                                setAnswer(false)
                                setAnswerSent("Pseudo deja utiliser par un autre joueur")
                            }
                            if (data.message === `Duplicate entry '${mail}' for key 'Users.email'`) {
                                setAnswer(false)
                                setAnswerSent("Email deja utiliser par un autre joueur")
                            }
                            if (response.status === 400) {
                                setAnswer(false)
                                setAnswerSent("Tout les champs sont obligatoir")
                            }

                            console.error("Pseudo deja utiliser par un autre joueur:", data)
                        }
                    } catch (err) {
                        console.error('erreur de fetch:', err)
                    }
                } else {
                    setAnswer(false)
                    setAnswerSent("Email invalide")
                }
            } else {
                setAnswer(false)
                setAnswerSent("Le nom doit commencer par une lettre")
            }
        } else {
            // ----------------- CONNEXION -----------------
            if (regexMail.test(mail)) { // Vérifie email
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/search?email=${mail}`)
                    const data = await response.json()

                    if (response.status === 200) {
                        setUserName(data.pseudo)
                        navigate('Accueille')
                        console.log("Utilisateur trouvé:", data.pseudo)
                        setUserId(data.userID)
                        setAdmin(data.admins)
                    } else {
                        console.log(data.message)
                        setAnswer(false)
                        setAnswerSent("Address mail introuvable")
                    }
                } catch (err) {
                    console.log("erreur: ", err)
                }
            } else {
                setAnswer(false)
                setAnswerSent("Email invalide")
            }
        }
    }

    // ======================= RENDER =======================
    return (
        <div className={css.body}>
            <div className={css.container}>
                {/* Input pseudo uniquement pour inscription */}
                {create && <input className={css.form} onChange={(e) => setUserName(e.target.value)} placeholder="Pseudo" maxLength={10} />}
                
                {/* Input email */}
                <input className={css.form} value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Email" />

                {/* Message d’erreur / feedback */}
                {!answer && <p className={css.answerLogin}>{answerSent}</p>}

                {/* Bouton connexion / inscription */}
                <button className={css.btnConnect} onClick={userData}>{`${create ? 'inscription' : 'connexion'}`}</button>

                {/* Lien switch entre inscription et connexion */}
                <p className={css.sentence} onClick={() => setCreate(prev => !prev)}>
                    {create ? "Vous avez deja un compte?" : "Vous n'aver pas encore de compte?"}
                </p>
            </div>
        </div>
    )
}

export default App
