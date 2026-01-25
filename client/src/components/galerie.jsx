// ======================= IMPORTATIONS =======================
import { useState, useEffect, useContext } from "react" // Hooks React
import css from "../styles/myStyle2.module.css"                // Styles CSS modulaires
import { AuthContext } from "../variables/variableExport"         // Contexte global pour le jeu/utilisateur
import Spinner from "react-bootstrap/Spinner"
import Ask from "./ask"



// ======================= COMPOSANT PRINCIPAL =======================
function Galerie({ backgroundImage,nameUser, chemin, countLike, like, idPost, idUser }) {
    // ======================= STATE =======================
    const [likeCount, setLikeCount] = useState(countLike) // Nombre de likes affiché
    const [heart, setHeart] = useState(false)            // Etat du bouton coeur (like actif ou non)
    const [ask,setAsk]=useState(false)

    // Contexte global pour gérer puzzle / galerie / clash et minuterie
    const {
        setImagePuzzle,
        userId,
        puzzle,
        setPuzzle,
        galerie,
        setGalerie,
        clash,
        setClash,
        setStart,
        time,
        seconde,
        setSeconde,
        setTime,
        minuteActive,
        setMinuteActive,
        spin,
        setSpin,
        admin,setAdmin,
    } = useContext(AuthContext)

    // ======================= FONCTIONS =======================

    // Retour à la page Puzzle
    const puzzlePage = () => {
        setGalerie(false)
        setClash(false)
        setPuzzle(true)
        setMinuteActive(false)
        setSeconde(0)
        setTime(0)
        setStart(false)
    }

    const removePub=async()=>{
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/removePub`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    post:idPost
                })
            })
            

            if(response.ok){
                setAsk(false)
                console.log("Pub supprimer");
            }else{
                console.log("Pub Non supprimer")
            }
        }catch(err){
            console.log("erreur==",err)
        }
    }

    // Création d'une réaction (like) dans la base si l'utilisateur n'a jamais liké ce post
    const sendReact = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/createReact`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    idUser: userId,
                    post: idPost
                })
            })
            const data = await response.json()
            if (response.ok) {
                console.log("reaction envoyée")
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log("erreur===", err)
        }
    }

    // Récupère si l'utilisateur a déjà liké ce post
    const getLike = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/getLike?post=${idPost}&users=${userId}`)
            const data = await response.json()
            if (response.ok) {
                console.log("données récupérées pour la reaction")
                setHeart(data.react)
            }
            if (response.status === 404) { // Si aucun enregistrement trouvé
                console.log(data)
                sendReact()          // Crée une réaction initiale
                setHeart(data.react)
            }
        } catch (err) {
            console.log("erreur====", err)
        }
    }

    // Récupère le nombre de likes du post
    const getReactCount = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/getReactCount?post=${idPost}`)
            const data = await response.json()
            if (response.ok) {
                console.log("données récupérées du nombre de likes")
                setLikeCount(data.reactCount)
                getLike() // Vérifie si l'utilisateur a déjà liké
            }
        } catch (err) {
            console.log("erreur====", err)
        }
    }

    // Ajoute un like au post
    const addReact = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/addReact`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    post: idPost,
                    users: userId
                })
            })
            if (response.ok) {
                getReactCount() // Met à jour le compteur après ajout
            }
        } catch (err) {
            console.log("erreur====", err)
        }
    }

    // Retire un like au post
    const reduceReact = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/reduceReact`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    post: idPost,
                    users: userId
                })
            })
            if (response.ok) {
                getReactCount() // Met à jour le compteur après suppression
            }
        } catch (err) {
            console.log("erreur====", err)
        }
    }

    // Gestion du clic sur le bouton coeur
    const handleReact = () => {
        if (heart) {
            reduceReact() // Si déjà liké, retire le like
        } else {
            addReact()    // Sinon ajoute un like
        }
    }

    // ======================= EFFECTS =======================
    useEffect(() => {
        getLike()        // Vérifie si l'utilisateur a liké le post
        getReactCount()  // Récupère le nombre total de likes
    }, [])

    // ======================= RENDER =======================
    return (<>
        {ask && <Ask sentence={"you're really going to do it"} btnSent={"DELETE"} onDelete={()=>{removePub()}} onClose={()=>{setAsk(false)}}/>}
        <div className={css.bodyPub} >
            {/* Image du post */}
            <div className={css.imgPub} style={{ backgroundImage: `url(${backgroundImage})` }}>
                {/* Affichage du compteur de likes */}
                <div className={css.reactCountBox}>
                    <div className={css.reactCount}>
                        <div className={css.likeBox}>
                            <div className={css.like}></div>
                        </div>
                        <p className={css.likeCount}>{likeCount}</p>
                    </div>
                    {admin && <div className={css.boxDelete}>
                        <div className={css.delete} onClick={()=>{setAsk(true)}}></div>
                    </div>}
                </div>
            </div>

            
            {/* Informations sur le post et boutons */}
            <div className={css.boxLabel}>
                <div className={css.labelPub}>
                    <p>{nameUser}</p>
                </div>
                <div className={css.boxReaction}>
                    {/* Bouton pour lancer le puzzle à partir de l'image */}
                    <button
                        className={css.play}
                        onClick={() => {
                            console.log('chemin ===', chemin)
                            setImagePuzzle(`${import.meta.env.VITE_API_URL}/uploads/${chemin}`)
                            puzzlePage()
                        }}
                    ></button>

                    {/* Bouton like / coeur */}
                    <button
                        style={{ backgroundImage: heart ? "url(coeur.png)" : "url(icons8-aimer-32.png)" }}
                        className={css.reaction}
                        onClick={handleReact}
                    ></button>
                </div>
            </div>
        </div>
    </>)
}

export default Galerie
