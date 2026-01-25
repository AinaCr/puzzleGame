// ======================= IMPORTATIONS =======================
import { useState, useEffect, useRef, useContext } from "react" // Hooks React
import css from "../styles/myStyle2.module.css"                          // Styles CSS modulaires
import { AuthContext } from "../variables/variableExport"                  // Contexte global pour le clash
import 'bootstrap/dist/css/bootstrap.min.css'      // Styles Bootstrap
import Spinner from "react-bootstrap/Spinner"

// ======================= COMPOSANT PRINCIPAL =======================
function Clash() {
    // ======================= CONSTANTES =======================
    const easy = 'easy'
    const normal = 'normal'
    const hard = 'hard'

    // Tableau pour afficher rang fictif si nécessaire (1 à 7)
    const bbl = [1, 2, 3, 4, 5, 6, 7]

    // Valeurs par défaut si aucun utilisateur n’est dans le classement
    const userNullHard = [{
        pseudo: "none",
        gameID: 0,
        score: 0,
        dificulete: "hard"
    }]
    const userNullNormal = [{
        pseudo: "none",
        gameID: 0,
        score: 0,
        dificulete: "normal"
    }]

    // ======================= STATE =======================
    const [difficulte, setDificult] = useState(easy) // Difficulté sélectionnée
    const { clashData, setClashData, easyClash,spin,setSpin } = useContext(AuthContext) // Données globales du classement
    

    // ======================= FONCTIONS FETCH =======================

    // Récupération classement Hard
    async function getHard() {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/hardClash`)
        const data = await response.json()
        setSpin(true)

        if (response.ok) {
            setClashData(data)
            console.log(data)
        } else {
            setClashData(userNullHard)
        }
        }catch(err){
            console.log("erreur::",err)
        }finally{
            setSpin(false)
        }
    }

    // Récupération classement Normal
    async function getNormal() {
        try{
            setSpin(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/normalClash`)
            const data = await response.json()

            if (response.ok) {
                setClashData(data)
                console.log(data)
            } else {
                setClashData(userNullNormal)
            }
        }catch(err){
            console.log("erreure==",err)
        }finally{
            setSpin(false)
        }
    }

    // ======================= COMPOSANT POUR CHAQUE LIGNE =======================
    function Block({ rang, nom, score }) {
        return (
            <div className={css.tableau}>
                <p>{rang}</p>   {/* Rang du joueur */}
                <p>{nom}</p>    {/* Nom du joueur */}
                <p>{score}</p>  {/* Score du joueur */}
            </div>
        )
    }

    // ======================= RENDER =======================
    return (
        <>
            {/* Sélection de la difficulté */}
            {!spin && <div className={css.levelBox}>
                {/* Bouton Easy */}
                <div className={difficulte === easy ? css.btnOptionActive : css.btnOption}
                     onClick={() => { setDificult(easy); easyClash() }}>
                    <button className={css.btnEasy}></button>
                </div>

                {/* Bouton Normal */}
                <div className={difficulte === normal ? css.btnOptionActive : css.btnOption}
                     onClick={() => { setDificult(normal); getNormal() }}>
                    <button className={css.btnEasy}></button>
                    <button className={css.btnEasy}></button>
                </div>

                {/* Bouton Hard */}
                <div className={difficulte === hard ? css.btnOptionActive : css.btnOption}
                     onClick={() => { setDificult(hard); getHard() }}>
                    <button className={css.btnEasy}></button>
                    <button className={css.btnEasy}></button>
                    <button className={css.btnEasy}></button>
                </div>
            </div>}

            {/* Tableau du classement */}

            {spin &&    <div className={css.boxSpinner}>
                                    <Spinner className={css.spin} animation="border" variant="warning"/>
                            </div>}
            {!spin && <div className={css.tableauInf}>
                {/* Ligne header vide */}
                <div className={css.tableau}>
                    <div className={css.rang}></div>
                    <div className={css.user}></div>
                    <div className={css.timer}></div>
                </div>

                {/* Lignes des joueurs */}
                
                {clashData.map((blk, i) =>
                    <Block key={i} rang={i + 1} nom={blk.pseudo} score={blk.score} />
                )}
                </div>}
        </>
    )
}

export default Clash
