// ======================= IMPORTATIONS =======================
import { Link, useNavigate } from "react-router-dom" // Gestion navigation
import { useState, useEffect, useContext } from "react" // Hooks React
import Puzzle from "../components/Puzzle"     // Composant puzzle
import Galerie from "../components/galerie"   // Composant galerie
import Clash from "../components/clash"       // Composant clash / classement
import { AuthContext } from "../variables/variableExport" // Contexte global pour état utilisateur
import css from "../styles/myStyle.module.css"        // Styles CSS modulaires
import css2 from '../styles/myStyle2.module.css'      // Styles supplémentaires
import Spinner from "react-bootstrap/Spinner"

// ======================= COMPOSANT PRINCIPAL =======================
function Accueille() {
    // ======================= CONTEXT ET STATE =======================
    const { spin,
        setSpin,
        userName,
        start,
        setStart,
        restart,
        setImagePuzzle,
        setUserName,
        setUserMail,
        setUserId,
        setRestart,
        setNewPosition,
        easyClash,
        clashData,
        puzzle,
        setPuzzle,
        galerie,
        setGalerie,
        clash,
        setClash
    } = useContext(AuthContext) // Récupère toutes les données globales

    const [dataPost, setDataPost] = useState([]) // State pour stocker les posts de la galerie
    const navigate = useNavigate() // Hook pour rediriger l’utilisateur
    const [emptyPost,setEmptyPost ]=useState(false)
    const [postSentence,setPostSentence ]=useState(false)

    // ======================= FONCTIONS =======================

    // Récupération des posts depuis le backend
    const getPost = async () => {
        try {
            setSpin(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/post`)
            const data = await response.json()

            if (response.status === 200) {
                console.log(data);
                
                setDataPost(data) // Stocke les posts dans le state
                console.log("like=", data.reaction)
                
            } else {
               if(response.status===404){

                    setTimeout(() => {
                        setEmptyPost(true)
                    }, 1000);
                }
                console.log('id introuvable')
                console.log(data.message)
            }
        } catch (err) {
            console.log("erreur de fetch==", err)
        }finally{
            setTimeout(() => {
                setSpin(false)
            }, 1000);
            
        }
    }

    // Déconnexion utilisateur : réinitialise le contexte et redirige
    const logOut = () => {
        setUserName("")
        setUserMail("")
        setUserId("")
        setGalerie(false)
        setClash(false)
        setPuzzle(true)
        setEmptyPost(false)
        setImagePuzzle("imge.jpg")
        navigate('/') // Retour à la page principale
    }

    // Switch vers la page Puzzle
    const puzzlePage = () => {
        setGalerie(false)
        setClash(false)
        setPuzzle(true)
        setEmptyPost(false)
    }

    // Switch vers la page Galerie
    const galeriePage = () => {
        setPuzzle(false)
        setClash(false)
        setGalerie(true)
        getPost() // Charge les posts
        setStart(false)
        setNewPosition(false)
    }

    // Switch vers la page Clash
    const clashPage = () => {
        setGalerie(false)
        setPuzzle(false)
        setClash(true)
        setStart(false)
        setNewPosition(false)
        setEmptyPost(false)
        easyClash() // Charge les données du classement
    }

    // Log du state clashData pour debug
    useEffect(() => {
        console.log("teste", clashData)
    }, [clashData])

    // ======================= RENDER =======================
    return (
        <div className={css.accueille}>
            {/* MENU PRINCIPAL */}
            <div className={css.menu}>
                <div className={css.boxBtn}>
                    {/* Bouton Puzzle */}
                    <button
                        style={{ backgroundImage: puzzle ? "url(icons8-puzzle-60l.png)" : "url(icons8-puzzle-60.png)" }}
                        className={`${css.btnMenu} ${css.btnPuzzle}`}
                        onClick={puzzlePage}>
                    </button>

                    {/* Bouton Galerie */}
                    <button
                        style={{ backgroundImage: galerie ? "url(mg.png)" : "url(icons8-image-60.png)" }}
                        className={`${css.btnMenu} ${css.btnGalerie}`}
                        onClick={galeriePage}>
                    </button>

                    {/* Bouton Clash / Classement */}
                    <button
                        style={{ backgroundImage: clash ? "url(icons8-classement-60lk.png)" : "url(icons8-classement-60.png)" }}
                        className={`${css.btnMenu} ${css.btnClash}`}
                        onClick={clashPage}>
                    </button>
                </div>
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className={css.containerPuzzle}>
                {/* Affiche le composant Puzzle si puzzle=true */}
                {puzzle && <Puzzle />}

                {/* Affiche la galerie si galerie=true */}
                {galerie &&
                    <div className={css2.bodyGalerie}>
                        {!spin && dataPost.map((blk) =>
                            <Galerie
                                key={blk.postID}
                                nameUser={blk.pseudo}
                                backgroundImage={`${import.meta.env.VITE_API_URL}/uploads/${blk.image}`}
                                chemin={blk.image}
                                like={blk.react}
                                countLike={blk.reactCount}
                                idPost={blk.postID}
                                idUser={blk.userID}
                            />
                        )}
                        {spin && <div className={css2.boxSpinner}>
                                    <Spinner className={css.spin} animation="border" variant="warning"/>
                                 </div>}
                        {emptyPost && <div className={css2.boxSpinner}>
                                <p style={{fontSize:"3em",color:"white"}}>Aucun poste n'a ete publier</p>
                            </div>}
                    </div>

                    
                }

                {/* Affiche Clash si clash=true */}
                {clash &&
                    <div className={css2.bodyClash}>
                        {/* Bouton déconnexion */}
                        <div className={css2.boxLogOut}>
                            <button className={css2.btnLogOut} onClick={logOut}></button>
                        </div>
                        <Clash />
                    </div>
                }
            </div>
        </div>
    )
}

export default Accueille
