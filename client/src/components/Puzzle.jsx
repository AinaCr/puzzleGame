import { useState, useEffect, useRef, useContext } from "react";
import Block from "./block"; // Composant pour chaque bloc du puzzle
import css from "../styles/myStyle.module.css"; // Styles du puzzle
import imgFile from "../assets/image2.jpg"; // Image par défaut
import { color, time } from "framer-motion"; // Pour les animations si besoin
import { AuthContext } from "../variables/variableExport"; // Contexte global pour user et puzzle
import Ask from "./ask";

function Puzzle() {
  //=====================================================================
  // ===================== Références ================================
  //=====================================================================
  const btnRef = useRef();   // Référence pour bouton "voir solution"
  const inputRef = useRef(); // Référence pour input file pour changer image

  //=====================================================================
  // ===================== Variables globales ========================
  //=====================================================================
  let classStyle = undefined; // Classe CSS de la grille selon difficulté
  let blockStyle = undefined; // Classe CSS des blocs selon difficulté
  const styleClick = {
    boxShadow: '0px 4px 0px rgb(22, 21, 21)',
    top: '4px'
  };

  // Déstructuration des variables du contexte global
  const {
    userName, setUserName,
    userId, setUserId,
    imagePuzzle, setImagePuzzle,
    row, setRow,
    column, setColumn,
    start, easy, normal, hard,
    setStart, restart, setRestart,
    time, seconde, setSeconde, setTime,
    minuteActive, setMinuteActive,
    newPosition, setNewPosition,
    dificulete, setDificult,
    isMobile,setMobile
  } = useContext(AuthContext);

  //=====================================================================
  // ===================== States internes ============================
  //=====================================================================
  const [blockP, setBlock] = useState([]);       // Tableau contenant tous les blocs du puzzle
  const [endRow, setEndRow] = useState([]);     // Position finale en ligne
  const [endColumn, setEndColumn] = useState([]); // Position finale en colonne
  const [tempRow, setTempRow] = useState([]);   // Pour solution temporaire
  const [tempColumn, setTempColumn] = useState([]);
  const [optionDificult, setOptionDificult] = useState(false); // Afficher options difficulté
  const [view, setView] = useState(false);      // Afficher solution temporairement
  const [move, setMove] = useState([false,false,false,false]); // Animation des boutons de direction
  const [path, setPath] = useState(null);       // Fichier image choisi
  const [minute, setMinute] = useState(0);      // Timer minute
  const [edit, setEdit] = useState(false);      // Modifier pseudo
  const [user, setUser] = useState('');         // Valeur du pseudo input
  const [answer, setAnswer] = useState(true);   // Validation pseudo
  const [answerSent, setAnswerSent] = useState(''); // Message d'erreur pseudo
  const regexName = /^[A-Za-z][A-Za-zÀ-ÿ\s\p{Emoji_Presentation}\p{Extended_Pictographic}]*$/u; // Validation pseudo
  const [imagePath, setImagePath] = useState(''); // Chemin de l'image uploadée
  const [changeImage, setImage] = useState(imagePuzzle); // Image affichée dans le puzzle
  const [screenWidth,setWidth]=useState(window.innerWidth);
  const [sceenHeight,setHeight]=useState(window.innerHeight);
  const [win,setWin]=useState(false)
  

  //=====================================================================
  // ===================== Fonction création des blocs =================
  //=====================================================================
  const creatBlock = () => {
    let uniteC = 0;
    let uniteR = 0;
    let blockCase = [];

    // On définit la taille d'une pièce et de l'image totale
    let pSize = 0; // Taille d'une pièce
    let tSize = 0; // Taille totale (background-size)

    // =================== Difficulté Easy (3x3) ============================
    if(dificulete === easy) {
      pSize = isMobile ? 98 : 150;
      tSize = pSize * 3;

      for(let i = 0; i <= 8; i++) {
        if(i === 3) { uniteC = 0; uniteR = -pSize; }
        else if(i === 6) { uniteC = 0; uniteR = -(pSize * 2); }

        const border = i === 8 ? "2px solid rgb(204, 119, 34)" : undefined;

        blockCase.push({
          style: {
            backgroundPosition: `-${uniteC}px ${uniteR}px`,
            backgroundSize: `${tSize}px ${tSize}px`,
            gridRow: `${row[i]}`,
            gridColumn: `${column[i]}`,
            border
          }
        });
        uniteC += pSize;
      }
    }

    // =================== Difficulté Normal (4x4) ==========================
    else if(dificulete === normal) {
      pSize = isMobile ? 73 : 112; // 100px pour desktop (ajustable)
      tSize = pSize * 4;

      for(let i = 0; i <= 15; i++) {
        if(i === 4) { uniteC = 0; uniteR = -pSize; }
        else if(i === 8) { uniteC = 0; uniteR = -(pSize * 2); }
        else if(i === 12) { uniteC = 0; uniteR = -(pSize * 3); }

        const border = i === 15 ? "2px solid rgb(230, 171, 8)" : undefined;

        blockCase.push({
          style: {
            backgroundPosition: `-${uniteC}px ${uniteR}px`,
            backgroundSize: `${tSize}px ${tSize}px`,
            gridRow: `${row[i]}`,
            gridColumn: `${column[i]}`,
            border
          }
        });
        uniteC += pSize;
      }
    }

    // =================== Difficulté Hard (5x5) ============================
    else {
      pSize = isMobile ? 58 : 90; // 80px pour desktop (ajustable)
      tSize = pSize * 5;

      for(let i = 0; i <= 24; i++) {
        if(i === 5) { uniteC = 0; uniteR = -pSize; }
        else if(i === 10) { uniteC = 0; uniteR = -(pSize * 2); }
        else if(i === 15) { uniteC = 0; uniteR = -(pSize * 3); }
        else if(i === 20) { uniteC = 0; uniteR = -(pSize * 4); }

        const border = i === 24 ? "2px solid rgb(230, 171, 8)" : undefined;

        blockCase.push({
          style: {
            backgroundPosition: `-${uniteC}px ${uniteR}px`,
            backgroundSize: `${tSize}px ${tSize}px`,
            gridRow: `${row[i]}`,
            gridColumn: `${column[i]}`,
            border
          }
        });
        uniteC += pSize;
      }
    }

    setBlock(blockCase.map(obj => ({ ...obj })));
}



    
//=================================== Fonction pour générer une position aléatoire des blocs ==========================================
const randomPosition = () => {
  const position = [];  // Tableau qui stocke les positions aléatoires déjà choisies (pour éviter les doublons)
  const row = [];       // Tableau pour stocker la ligne de chaque bloc
  const column = [];    // Tableau pour stocker la colonne de chaque bloc
  let nb = null;        // Variable temporaire pour stocker la valeur aléatoire

  // =================== Difficulté Easy ============================
  if(dificulete === easy) {
    for (let i = 0; i <= 8; i++) {
      // Générer un nombre aléatoire entre 1 et 9
      nb = Math.floor(Math.random() * 9) + 1;

      // Vérifier si ce nombre a déjà été choisi
      if(position.includes(nb)) {
        let multi = true;
        // Boucle pour trouver un nombre non utilisé
        while(multi) {
          nb = Math.floor(Math.random() * 9) + 1;
          if(!position.includes(nb)) multi = false;
        }
      }
      // Ajouter le nombre valide dans le tableau des positions
      position.push(nb);

      // Définir la ligne et la colonne correspondante selon le numéro choisi
      switch (position[i]) {
        case 1: row.push(1); column.push(1); break;
        case 2: row.push(1); column.push(2); break;
        case 3: row.push(1); column.push(3); break;
        case 4: row.push(2); column.push(1); break;
        case 5: row.push(2); column.push(2); break;
        case 6: row.push(2); column.push(3); break;
        case 7: row.push(3); column.push(1); break;
        case 8: row.push(3); column.push(2); break;
        case 9: row.push(3); column.push(3); break;
      }
    }
  }

  // =================== Difficulté Normal ===========================
  else if(dificulete === normal) {
    for(let i = 0; i <= 15; i++) {
      nb = Math.floor(Math.random() * 16) + 1;
      if(position.includes(nb)) {
        let multi = true;
        while(multi) {
          nb = Math.floor(Math.random() * 16) + 1;
          if(!position.includes(nb)) multi = false;
        }
      }
      position.push(nb);

      switch(position[i]) {
        case 1: row.push(1); column.push(1); break;
        case 2: row.push(1); column.push(2); break;
        case 3: row.push(1); column.push(3); break;
        case 4: row.push(1); column.push(4); break;
        case 5: row.push(2); column.push(1); break;
        case 6: row.push(2); column.push(2); break;
        case 7: row.push(2); column.push(3); break;
        case 8: row.push(2); column.push(4); break;
        case 9: row.push(3); column.push(1); break;
        case 10: row.push(3); column.push(2); break;
        case 11: row.push(3); column.push(3); break;
        case 12: row.push(3); column.push(4); break;
        case 13: row.push(4); column.push(1); break;
        case 14: row.push(4); column.push(2); break;
        case 15: row.push(4); column.push(3); break;
        case 16: row.push(4); column.push(4); break;
      }
    }
  }

  // =================== Difficulté Hard =============================
  else if(dificulete === hard) {
    for(let i = 0; i <= 24; i++) {
      nb = Math.floor(Math.random() * 25) + 1;
      if(position.includes(nb)) {
        let multi = true;
        while(multi) {
          nb = Math.floor(Math.random() * 25) + 1;
          if(!position.includes(nb)) multi = false;
        }
      }
      position.push(nb);

      switch(position[i]) {
        case 1: row.push(1); column.push(1); break;
        case 2: row.push(1); column.push(2); break;
        case 3: row.push(1); column.push(3); break;
        case 4: row.push(1); column.push(4); break;
        case 5: row.push(1); column.push(5); break;
        case 6: row.push(2); column.push(1); break;
        case 7: row.push(2); column.push(2); break;
        case 8: row.push(2); column.push(3); break;
        case 9: row.push(2); column.push(4); break;
        case 10: row.push(2); column.push(5); break;
        case 11: row.push(3); column.push(1); break;
        case 12: row.push(3); column.push(2); break;
        case 13: row.push(3); column.push(3); break;
        case 14: row.push(3); column.push(4); break;
        case 15: row.push(3); column.push(5); break;
        case 16: row.push(4); column.push(1); break;
        case 17: row.push(4); column.push(2); break;
        case 18: row.push(4); column.push(3); break;
        case 19: row.push(4); column.push(4); break;
        case 20: row.push(4); column.push(5); break;
        case 21: row.push(5); column.push(1); break;
        case 22: row.push(5); column.push(2); break;
        case 23: row.push(5); column.push(3); break;
        case 24: row.push(5); column.push(4); break;
        case 25: row.push(5); column.push(5); break;
      }
    }
  }

  // Mettre à jour les states row et column pour le puzzle
  setColumn([...column]);
  setRow([...row]);
};


  const teste1=row;
  const teste2=column;

 //=================================== Fonction pour créer les positions exactes du puzzle ==========================================
/*
  La fonction `positionExact` définit les positions "correctes" des blocs
  pour que le puzzle soit considéré comme réussi. Ces positions dépendent
  de la difficulté : Easy = 3x3, Normal = 4x4, Hard = 5x5.
*/
const positionExact = () => {
  const arrayC = [];  // Colonnes exactes
  const arrayR = [];  // Lignes exactes
  let numberR = null; // Variable temporaire pour la ligne

  // =================== Difficulté Easy ============================
  if(dificulete === easy) {
    for (let i = 0; i <= 8; i++) {
      if(i <= 2) {
        numberR = 1; // Première ligne
        arrayR.push(numberR);
        arrayC.push((i + 1) % 4); // Colonnes 1,2,3
      } else if(i > 2 && i <= 5) {
        numberR = 2; // Deuxième ligne
        arrayR.push(numberR);
        arrayC.push(arrayC[i % 3]); // Colonnes 1,2,3 répétées
      } else {
        numberR = 3; // Troisième ligne
        arrayR.push(numberR);
        arrayC.push(arrayC[i % 3]);
      }
    }
  }

  // =================== Difficulté Normal ===========================
  else if(dificulete === normal) {
    for (let i = 0; i <= 15; i++) {
      if(i <= 3) {
        numberR = 1;
        arrayR.push(numberR);
        arrayC.push((i + 1) % 5); // Colonnes 1 à 4
      } else if(i > 3 && i <= 7) {
        numberR = 2;
        arrayR.push(numberR);
        arrayC.push(arrayC[i % 4]);
      } else if(i > 7 && i <= 11) {
        numberR = 3;
        arrayR.push(numberR);
        arrayC.push(arrayC[i % 4]);
      } else {
        numberR = 4;
        arrayR.push(numberR);
        arrayC.push(arrayC[i % 4]);
      }
    }
  }

  // =================== Difficulté Hard =============================
  else if(dificulete === hard) {
    for (let i = 0; i <= 24; i++) {
      if(i <= 4) {
        numberR = 1;
        arrayR.push(numberR);
        arrayC.push((i + 1) % 6); // Colonnes 1 à 5
      } else if(i > 4 && i <= 9) {
        numberR = 2;
        arrayR.push(numberR);
        arrayC.push(arrayC[i % 5]);
      } else if(i > 9 && i <= 14) {
        numberR = 3;
        arrayR.push(numberR);
        arrayC.push(arrayC[i % 5]);
      } else if(i > 14 && i <= 19) {
        numberR = 4;
        arrayR.push(numberR);
        arrayC.push(arrayC[i % 5]);
      } else {
        numberR = 5;
        arrayR.push(numberR);
        arrayC.push(arrayC[i % 5]);
      }
    }
  }

  // Mettre à jour les états finaux pour vérifier la réussite du puzzle
  setEndRow([...arrayR]);
  setEndColumn([...arrayC]);
};


//==================================== Fonction de vérification du puzzle ==========================================
/*
  Vérifie si chaque bloc est à sa position exacte.
  Retourne true si le puzzle est terminé, false sinon.
*/
const verification = () => {
  let success = true;

  if(dificulete === hard) {
    for(let i = 0; i <= 24; i++) {
      if(row[i] !== endRow[i] || column[i] !== endColumn[i]) {
        success = false;
      }
    }
  } else if(dificulete === normal) {
    for(let i = 0; i <= 15; i++) {
      if(row[i] !== endRow[i] || column[i] !== endColumn[i]) {
        success = false;
      }
    }
  } else if(dificulete === easy) {
    for(let i = 0; i <= 8; i++) {
      if(row[i] !== endRow[i] || column[i] !== endColumn[i]) {
        success = false;
      }
    }
  }

  return success;
};


//==================================== Fonction pour déplacer le bloc vide vers le haut ==================================
/*
  Déplace le bloc vide (dernier bloc) vers le haut si possible.
  Vérifie la difficulté pour adapter le nombre de cases.
*/
const moveUp = () => {
  if(start) {  // Vérifie si le jeu est lancé
    const copyRow = [...row];
    const copyColumn = [...column];
    let tempColumn = null;
    let tempRow = null;

    if(dificulete === hard) {
      for(let i = 0; i <= 23; i++) {
        // Vérifie si la case au-dessus du bloc vide peut être échangée
        if(copyColumn[i] === copyColumn[24] && copyRow[i] === copyRow[24] - 1) {
          // Échange la colonne
          tempColumn = copyColumn[24];
          copyColumn[24] = copyColumn[i];
          copyColumn[i] = tempColumn;

          // Échange la ligne
          tempRow = copyRow[24];
          copyRow[24] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    } else if(dificulete === normal) {
      for(let i = 0; i <= 14; i++) {
        if(copyColumn[i] === copyColumn[15] && copyRow[i] === copyRow[15] - 1) {
          tempColumn = copyColumn[15];
          copyColumn[15] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[15];
          copyRow[15] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    } else if(dificulete === easy) {
      for(let i = 0; i <= 7; i++) {
        if(copyColumn[i] === copyColumn[8] && copyRow[i] === copyRow[8] - 1) {
          tempColumn = copyColumn[8];
          copyColumn[8] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[8];
          copyRow[8] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    }

    // Met à jour les états row et column avec la nouvelle position
    setColumn([...copyColumn]);
    setRow([...copyRow]);
  }
};
//==================================== Déplacement vers le bas ==========================================
/*
  Déplace le bloc vide (dernier bloc) vers le bas si possible.
  Fonction adaptée selon la difficulté (taille de la grille).
*/
const moveDown = () => {
  if(start) {
    const copyRow = [...row];
    const copyColumn = [...column];
    let tempColumn = null;
    let tempRow = null;

    if(dificulete === hard) {
      for(let i = 0; i <= 23; i++) {
        if(copyColumn[i] === copyColumn[24] && copyRow[i] === copyRow[24] + 1) {
          // Échange de colonne
          tempColumn = copyColumn[24];
          copyColumn[24] = copyColumn[i];
          copyColumn[i] = tempColumn;

          // Échange de ligne
          tempRow = copyRow[24];
          copyRow[24] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    } else if(dificulete === normal) {
      for(let i = 0; i <= 14; i++) {
        if(copyColumn[i] === copyColumn[15] && copyRow[i] === copyRow[15] + 1) {
          tempColumn = copyColumn[15];
          copyColumn[15] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[15];
          copyRow[15] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    } else if(dificulete === easy) {
      for(let i = 0; i <= 7; i++) {
        if(copyColumn[i] === copyColumn[8] && copyRow[i] === copyRow[8] + 1) {
          tempColumn = copyColumn[8];
          copyColumn[8] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[8];
          copyRow[8] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    }

    setColumn([...copyColumn]);
    setRow([...copyRow]);
  }
};

//==================================== Déplacement vers la gauche ==========================================
/*
  Déplace le bloc vide vers la gauche si possible.
  Vérifie les positions adjacentes à gauche selon la difficulté.
*/
const moveLeft = () => {
  if(start) {
    const copyRow = [...row];
    const copyColumn = [...column];
    let tempColumn = null;
    let tempRow = null;

    if(dificulete === hard) {
      for(let i = 0; i <= 23; i++) {
        if(copyColumn[i] === copyColumn[24] - 1 && copyRow[i] === copyRow[24]) {
          tempColumn = copyColumn[24];
          copyColumn[24] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[24];
          copyRow[24] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    } else if(dificulete === normal) {
      for(let i = 0; i <= 14; i++) {
        if(copyColumn[i] === copyColumn[15] - 1 && copyRow[i] === copyRow[15]) {
          tempColumn = copyColumn[15];
          copyColumn[15] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[15];
          copyRow[15] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    } else if(dificulete === easy) {
      for(let i = 0; i <= 7; i++) {
        if(copyColumn[i] === copyColumn[8] - 1 && copyRow[i] === copyRow[8]) {
          tempColumn = copyColumn[8];
          copyColumn[8] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[8];
          copyRow[8] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    }

    setColumn([...copyColumn]);
    setRow([...copyRow]);
  }
};

//==================================== Déplacement vers la droite ==========================================
/*
  Déplace le bloc vide vers la droite si possible.
  Vérifie les positions adjacentes à droite selon la difficulté.
*/
const moveRight = () => {
  if(start) {
    const copyRow = [...row];
    const copyColumn = [...column];
    let tempColumn = null;
    let tempRow = null;

    if(dificulete === hard) {
      for(let i = 0; i <= 23; i++) {
        if(copyColumn[i] === copyColumn[24] + 1 && copyRow[i] === copyRow[24]) {
          tempColumn = copyColumn[24];
          copyColumn[24] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[24];
          copyRow[24] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    } else if(dificulete === normal) {
      for(let i = 0; i <= 14; i++) {
        if(copyColumn[i] === copyColumn[15] + 1 && copyRow[i] === copyRow[15]) {
          tempColumn = copyColumn[15];
          copyColumn[15] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[15];
          copyRow[15] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    } else if(dificulete === easy) {
      for(let i = 0; i <= 7; i++) {
        if(copyColumn[i] === copyColumn[8] + 1 && copyRow[i] === copyRow[8]) {
          tempColumn = copyColumn[8];
          copyColumn[8] = copyColumn[i];
          copyColumn[i] = tempColumn;

          tempRow = copyRow[8];
          copyRow[8] = copyRow[i];
          copyRow[i] = tempRow;
          break;
        }
      }
    }

    setColumn([...copyColumn]);
    setRow([...copyRow]);
  }
};
//==================== Restaure la vue temporaire du puzzle ====================
/*
  Permet de remettre la grille dans la position temporaire enregistrée
  si l'utilisateur annule un aperçu ou un changement.
*/
const keepView = () => {
  setColumn([...tempColumn]);  // Remet les colonnes sauvegardées
  setRow([...tempRow]);        // Remet les lignes sauvegardées
  setView(false);              // Cache le mode "view"
  setTempColumn([]);           // Vide la sauvegarde temporaire
  setTempRow([]);              // Vide la sauvegarde temporaire
};

//==================== Clique pour ouvrir le sélecteur de fichier ====================
/*
  Simule un clic sur l'input file pour changer l'image du puzzle.
*/
const clicChange = () => {
  inputRef.current.click();  // Déclenche le click de l'input invisible
  setPath(null);             // Réinitialise le chemin sélectionné
};

//==================== Gestion du changement de fichier ====================
/*
  Récupère le fichier sélectionné par l'utilisateur.
*/
const changeFile = (e) => {
  setPath(e.target.files[0]);  // Sauvegarde le fichier choisi
};

//==================== Envoi d'une réaction (like) ====================
/*
  Envoie une "réaction" pour l'utilisateur actuel au backend.
*/
const sendReact = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/sendReact`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ idUser: userId })
    });

    if (response.ok) {
      console.log("Réaction envoyée avec succès");
    } else {
      console.log(await response.json());
    }
  } catch (err) {
    console.log("Erreur lors de l'envoi de la réaction:", err);
  }
};

//==================== Upload d'image pour le puzzle ====================
/*
  Envoie l'image sélectionnée au serveur et met à jour l'état local et contextuel.
*/
const uploadImage = async () => {
  const formData = new FormData();
  formData.append("file", path);  // Le fichier sélectionné
  formData.append("meta", JSON.stringify({ id: userId }));  // Metadata avec id utilisateur

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/uploads`, {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      const imgUrl = `${import.meta.env.VITE_API_URL}/uploads/${data.nameFile}`;

      setImage(imgUrl);        // Change l'image du puzzle
      setImagePuzzle(imgUrl);  // Met à jour l'image dans le contexte
      sendReact();             // Envoie une réaction après le changement
      console.log("Image mise à jour:", imgUrl);
    }
  } catch (err) {
    console.log("Erreur lors de l'envoi de l'image:", err);
  }
};

//==================== Envoi des données de challenge ====================
/*
  Envoie le score et la difficulté du puzzle joué par l'utilisateur au backend.
*/
const sendClashData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/clash`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        score: time,
        chalenge: dificulete
      })
    });

    const data = await response.json();

    if (response.status === 200) {
      console.log("Challenge envoyé:", data);
    } else {
      console.log("Erreur challenge:", data.message);
    }
  } catch (err) {
    console.log("Erreur fetch clash:", err);
  }
};

//==================== Changement de pseudo utilisateur ====================
/*
  Modifie le nom d'utilisateur si la validation regex est respectée.
  Vérifie les doublons côté serveur.
*/
const changeUserName = async () => {
  if (regexName.test(user)) {  // Vérifie que le pseudo commence par une lettre
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/changeNameUsers`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldName: userName,
          newName: user
        })
      });

      const data = await response.json();

      if (response.ok) {
        setEdit(false);   // Ferme le mode édition
        setUserName(user); // Met à jour le pseudo
        setAnswer(true);   // Pseudo valide
        console.log("Nom utilisateur changé:", data.message);
      } else {
        if (data.message === `Duplicate entry '${user}' for key 'Users.pseudo'`) {
          setAnswer(false);
          setAnswerSent("Pseudo déjà utilisé par un autre joueur");
        }
        setEdit(false);
        setUser('');
        console.error("Erreur backend:", data.message);
      }
    } catch (err) {
      console.log("Erreur changement pseudo:", err);
    }
  } else {
    setAnswer(false);
    setAnswerSent("Le nom doit commencer par une lettre");
  }
};



 

//===================================================================================================================================
//-------------------------------------------------------- LES useEffect ----------------------------------------------------------
//===================================================================================================================================



useEffect(()=>{
  if(screenWidth < 1024 ){
   return setMobile(true)
  }
  setMobile(false)
},[sceenHeight,screenWidth])

//=========================== Timer du puzzle =====================================
/*
  Ce useEffect gère le compteur de temps du puzzle.
  - S'exécute uniquement si le puzzle a commencé (start=true)
  - Met à jour le temps toutes les secondes
  - Calcule secondes et minutes séparément pour l'affichage
*/
useEffect(() => {
  if (!start) return;  // Si le jeu n'a pas commencé, ne rien faire

  const interval = setInterval(() => {
    setTime((prev) => {
      const newTime = prev + 1;
      setSeconde(newTime % 60);               // Mise à jour des secondes
      setMinuteActive(newTime > 59);          // Active le flag minuteActive si > 59s
      setMinute(Math.floor(newTime / 60) % 60); // Calcul des minutes modulo 60
      return newTime;
    });
  }, 1000);

  // Nettoyage à la fin pour éviter les multiples intervals
  return () => clearInterval(interval);
}, [start]);

//=========================== Reset du puzzle =====================================
/*
  Réinitialise le puzzle si restart=true :
  - stoppe le jeu (start=false)
  - remet le compteur à zéro
*/
useEffect(() => {
  if (restart) {
    setStart(false);
    setRestart(false);
    setTime(0);
    setSeconde(0);
    setMinute(0);
  }
}, [restart]);

//=========================== Upload d'image ======================================
/*
  Si un fichier est sélectionné (path != null) :
  - lance l'upload de l'image
  - déclenche un redémarrage du puzzle
*/
useEffect(() => {
  if (path !== null) {
    uploadImage();
    setRestart(true);
  }
}, [path]);

//=========================== Position aléatoire =================================
/*
  Au chargement du composant :
  - génère une position aléatoire pour les blocs du puzzle si newPosition=true
*/
useEffect(() => {
  if (newPosition) randomPosition();
}, []);

//=========================== Gestion du mode "view" ==============================
/*
  Si view=true, le joueur regarde une prévisualisation du puzzle :
  - Empêche les clics droits sur la fenêtre
  - Ajoute des listeners pour remettre la grille à sa position temporaire
  - Supprime les listeners au cleanup
*/
useEffect(() => {
  if (view) {
    const stopClic = (e) => e.preventDefault();  // Empêche le menu contextuel

    // Fonction principale pour garder la view
    const keep = (e) => keepView(e);

    // Desktop
    btnRef.current.addEventListener('mouseout', keep);
    btnRef.current.addEventListener('mouseup', keep);

    // Mobile
    btnRef.current.addEventListener('touchend', keep);
    btnRef.current.addEventListener('touchcancel', keep);

    // Empêche le menu contextuel
    window.addEventListener('contextmenu', stopClic);

    return () => {
      // Desktop
      btnRef.current.removeEventListener('mouseout', keep);
      btnRef.current.removeEventListener('mouseup', keep);

      // Mobile
      btnRef.current.removeEventListener('touchend', keep);
      btnRef.current.removeEventListener('touchcancel', keep);

      window.removeEventListener('contextmenu', stopClic);
    };
  }
}, [view]);

//=========================== Vérification de fin de puzzle ======================
/*
  Surveille les positions actuelles et les positions exactes :
  - Si endRow et endColumn ont des valeurs
  - Appelle verification() pour savoir si le puzzle est terminé
  - Si terminé, envoie les données du challenge au serveur
*/
useEffect(() => {
  if (endRow.length > 0 && endColumn.length > 0) {
    const end = verification();  // Vérifie si toutes les pièces sont à leur place
    if (end && !view) {
      console.log("Puzzle terminé !");
      sendClashData();           // Envoie le score et la difficulté
      setWin(true)
      setInterval(() => {
        setWin(false)
      }, 20000);
      
    }
  }
}, [column, row, endColumn, endRow]);


//===================================================================================================================================
//============================= Création des blocs et gestion des mouvements clavier ================================================
//===================================================================================================================================

 useEffect(()=>{
      if(row.length>0 && column.length>0){
        creatBlock();

      const testeEvent=(e)=>{
        if(start){

        const copyRow=[...row]
        const copyColumn=[...column]
        let tempColumn=null;
        let tempRow=null;
//=======================================mouvement si hard==================================================================================
        if(dificulete===hard){


          if(e.key==="ArrowUp"){
            setMove([true,false,false,false])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
            for(let i=0;i<=23;i++){
              if(copyColumn[i]===copyColumn[24] && copyRow[i] ===copyRow[24]-1){
                  tempColumn=copyColumn[24];
                  copyColumn[24]=copyColumn[i];
                  copyColumn[i]=tempColumn

                  tempRow=copyRow[24];
                  copyRow[24]=copyRow[i];
                  copyRow[i]=tempRow
                  break
              }
            }
          


        }else if(e.key==="ArrowDown"){
          setMove([false,true,false,false])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
          for(let i =0;i<=23;i++){
            if(copyColumn[i]===copyColumn[24] && copyRow[i] ===copyRow[24]+1){
              tempColumn=copyColumn[24];
                copyColumn[24]=copyColumn[i];
                copyColumn[i]=tempColumn

                tempRow=copyRow[24];
                copyRow[24]=copyRow[i];
                copyRow[i]=tempRow
                break
            }
          }
        }else if (e.key==="ArrowLeft"){
            setMove([false,false,true,false])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
          for(let i =0;i<=23;i++){
            if(copyColumn[i]===copyColumn[24] - 1 && copyRow[i] ===copyRow[24]){
              tempColumn=copyColumn[24];
                copyColumn[24]=copyColumn[i];
                copyColumn[i]=tempColumn

                tempRow=copyRow[24];
                copyRow[24]=copyRow[i];
                copyRow[i]=tempRow
                break
            }
          }
        
        }else if (e.key==="ArrowRight"){
            setMove([false,false,false,true])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
          for(let i =0;i<=23;i++){
            if(copyColumn[i]===copyColumn[24] + 1 && copyRow[i] ===copyRow[24]){
              tempColumn=copyColumn[24];
                copyColumn[24]=copyColumn[i];
                copyColumn[i]=tempColumn

                tempRow=copyRow[24];
                copyRow[24]=copyRow[i];
                copyRow[i]=tempRow
                break
            }
          }
        
        }
        //======================================+++++++++++++++++mouvement si normal===========================================================
    }else if(dificulete===normal){
          setMove([true,false,false,false])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);


          if(e.key==="ArrowUp"){
            for(let i=0;i<=14;i++){
              if(copyColumn[i]===copyColumn[15] && copyRow[i] ===copyRow[15]-1){
                  tempColumn=copyColumn[15];
                  copyColumn[15]=copyColumn[i];
                  copyColumn[i]=tempColumn

                  tempRow=copyRow[15];
                  copyRow[15]=copyRow[i];
                  copyRow[i]=tempRow
                  break
              }
            }
          


        }else if(e.key==="ArrowDown"){
          setMove([false,true,false,false])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
          for(let i =0;i<=14;i++){
            if(copyColumn[i]===copyColumn[15] && copyRow[i] ===copyRow[15]+1){
              tempColumn=copyColumn[15];
                copyColumn[15]=copyColumn[i];
                copyColumn[i]=tempColumn

                tempRow=copyRow[15];
                copyRow[15]=copyRow[i];
                copyRow[i]=tempRow
                break
            }
          }
        }else if (e.key==="ArrowLeft"){
            setMove([false,false,true,false])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
          for(let i =0;i<=14;i++){
            if(copyColumn[i]===copyColumn[15] - 1 && copyRow[i] ===copyRow[15]){
              tempColumn=copyColumn[15];
                copyColumn[15]=copyColumn[i];
                copyColumn[i]=tempColumn

                tempRow=copyRow[15];
                copyRow[15]=copyRow[i];
                copyRow[i]=tempRow
                break
            }
          }
        
        }else if (e.key==="ArrowRight"){
            setMove([false,false,false,true])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
          for(let i =0;i<=14;i++){
            if(copyColumn[i]===copyColumn[15] + 1 && copyRow[i] ===copyRow[15]){
              tempColumn=copyColumn[15];
                copyColumn[15]=copyColumn[i];
                copyColumn[i]=tempColumn

                tempRow=copyRow[15];
                copyRow[15]=copyRow[i];
                copyRow[i]=tempRow
                break
            }
          }
        
        }

        
    
    }else if(dificulete===easy){
//==============================================mouvement si easy==========================================================================================



          if(e.key==="ArrowUp"){
           setMove([true,false,false,false])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
            for(let i=0;i<=7;i++){
              if(copyColumn[i]===copyColumn[8] && copyRow[i] ===copyRow[8]-1){
                  tempColumn=copyColumn[8];
                  copyColumn[8]=copyColumn[i];
                  copyColumn[i]=tempColumn

                  tempRow=copyRow[8];
                  copyRow[8]=copyRow[i];
                  copyRow[i]=tempRow
                  break
              }
            }
          


        }else if(e.key==="ArrowDown"){
        
          setMove([false,true,false,false])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
          for(let i =0;i<=7;i++){
            if(copyColumn[i]===copyColumn[8] && copyRow[i] ===copyRow[8]+1){
              tempColumn=copyColumn[8];
                copyColumn[8]=copyColumn[i];
                copyColumn[i]=tempColumn

                tempRow=copyRow[8];
                copyRow[8]=copyRow[i];
                copyRow[i]=tempRow
                break
            }
          }
        }else if (e.key==="ArrowLeft"){
         setMove([false,false,true,false])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);
          for(let i =0;i<=7;i++){
            if(copyColumn[i]===copyColumn[8] - 1 && copyRow[i] ===copyRow[8]){
              tempColumn=copyColumn[8];
                copyColumn[8]=copyColumn[i];
                copyColumn[i]=tempColumn

                tempRow=copyRow[8];
                copyRow[8]=copyRow[i];
                copyRow[i]=tempRow
                break
            }
          }
        
        }else if (e.key==="ArrowRight"){
         setMove([false,false,false,true])
            setTimeout(() => {
            setMove([false,false,false,false])  
            }, 100);

          for(let i =0;i<=7;i++){
            if(copyColumn[i]===copyColumn[8] + 1 && copyRow[i] ===copyRow[8]){
              tempColumn=copyColumn[8];
                copyColumn[8]=copyColumn[i];
                copyColumn[i]=tempColumn

                tempRow=copyRow[8];
                copyRow[8]=copyRow[i];
                copyRow[i]=tempRow
                break
            }
          }
        
        }

  
        
          
      
      
    
    
    }
//=======================================fin des mouvement==================================================================================

    setColumn([...copyColumn]);
      setRow([...copyRow]);

  


        }
      }

      

      window.addEventListener("keydown",testeEvent)

      return ()=>{
        window.removeEventListener("keydown", testeEvent)
      }
      }
      
    },[column,row,dificulete,start])

//=========================== Initialisation des positions selon la difficulté =====================================
useEffect(() => {
  if (newPosition) randomPosition();  // Position aléatoire des blocs si demandé
  positionExact();                    // Position finale correcte pour la vérification
}, [dificulete]);


 

  
 
// Définition des styles selon la difficulté
if(dificulete === easy){
  classStyle = css.layoutEasy
  blockStyle = css.blockEasy
}else if(dificulete === normal){
  classStyle = css.layoutNormal
  blockStyle = css.blockNormal
}else{
  classStyle = css.layoutHard
  blockStyle = css.blockHard
}

// Style de l'image du puzzle
const imgStyle = {
  backgroundImage: `url(${changeImage})`
}

return(
  <>
    
        {win && <Ask sentence={"You Win"} btnSent={"OK"} onDelete={()=>{setWin(false)}} onClose={()=>{setWin(false)}}/>}
    <div className={css.boxPuzzle}>

      {/* Bloc affichant le pseudo de l'utilisateur et bouton d'édition */}
      {!edit && 
        <div className={css.blockName}>
          <p className={css.userName}>{userName}</p>
          <button className={css.btnEdit} onClick={()=>{setEdit(true)}}></button>
        </div>
      }

      {/* Bloc pour éditer le pseudo */}
      {edit &&     
        <div className={css.blockName}>
          <p className={css.userName}>
            <input type="text" value={user} onChange={(e)=>{setUser(e.target.value)}} className={css.userInput} maxLength={10}/>
          </p>
          <button className={css.nameValide} onClick={changeUserName}>OK</button>
        </div>
      }

      {/* Affichage du message d'erreur si le pseudo est incorrect */}
      {!answer && <p style={{color:"black"}} className={css.answerLogin}>{answerSent}</p>}
            
      {/* Conteneur des blocs du puzzle */}
      <div className={`${classStyle}`}>
        {blockP.map((blk,i)=>(
          <Block key={i} style={{...blk.style,...imgStyle}} className={`${blockStyle}`}/>
        ))}
      </div>
      <div className={css.blockBtn}>
              {/* Contrôles principaux : options et direction */}
                <div className={css.control}>

                  {/* Options par défaut (pas encore sélectionné) */}
                  {!optionDificult && 
                    <div className={css.option}>

                      {/* Bouton "voir solution" */}
                      <div
                          className={css.btnOption}
                          ref={btnRef}
                          onMouseDown={() => {
                            setColumn([...endColumn]);
                            setRow([...endRow]);
                            setTempColumn([...column]);
                            setTempRow([...row]);
                            setView(true);
                          }}
                          onTouchStart={() => {   // Événement mobile
                            setColumn([...endColumn]);
                            setRow([...endRow]);
                            setTempColumn([...column]);
                            setTempRow([...row]);
                            setView(true);
                          }}>
                              <button className={view ? css.viewOption : css.viewOptionClose}></button>
                          </div>


                      {/* Bouton pour changer l'image */}
                      <div className={css.btnOption}>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          style={{display:"none"}}
                          ref={inputRef}
                          onChange={changeFile}
                        />
                        <button className={css.btnChange} onClick={clicChange}></button>
                      </div>

                      {/* Bouton pour changer la difficulté */}
                      <div className={css.btnOption} onClick={()=>setOptionDificult(true)}>
                        <button className={css.btnDifi} ></button>
                      </div>
                      
                    </div>
                  }

                  {/* Menu de sélection de difficulté */}
                  {optionDificult && 
                    <div className={css.option}>

                      {/* Difficulté facile */}
                      <div className={css.btnOption} onClick={()=>{
                          setDificult(easy);
                          setOptionDificult(false);
                          setNewPosition(true);
                          if(dificulete != easy){ setRestart(true); setMinuteActive(false) }
                        }}>
                        <button className={css.btnEasy} ></button>
                      </div>

                      {/* Difficulté normale */}
                      <div className={css.btnOption} onClick={()=>{
                          setDificult(normal);
                          setOptionDificult(false);
                          setNewPosition(true);
                          if(dificulete != normal){ setRestart(true); setMinuteActive(false) }
                        }}>
                        <button className={css.btnEasy} ></button>
                        <button className={css.btnEasy} ></button>
                      </div>

                      {/* Difficulté difficile */}
                      <div className={css.btnOption} onClick={()=>{
                          setDificult(hard);
                          setOptionDificult(false);
                          setNewPosition(true);
                          if(dificulete != hard){ setRestart(true); setMinuteActive(false) }
                        }}>
                        <button className={css.btnEasy}></button>
                        <button className={css.btnEasy}></button>
                        <button className={css.btnEasy}></button>
                      </div>

                    </div>
                  }

                  {/* Contrôles directionnels */}
                  <div className={css.boxDirection}>
                    <button className={`${css.btnUp} ${move[0]? css.click : css.off}`}  onClick={moveUp}></button>
                    <button className={`${css.btnDown} ${move[1]? css.click : css.off}`} onClick={moveDown}></button>
                    <button className={`${css.btnLeft} ${move[2]? css.click : css.off}`} onClick={moveLeft}></button>
                    <button className={`${css.btnRight} ${move[3]? css.click : css.off}`} onClick={moveRight}></button>
                  </div>
                  
                </div>

                {/* Chronomètre et contrôles start/restart */}
                <div className={css.chronoBlock}>

                  {/* Boutons start / restart */}
                  <div className={css.chronoBlock1}>
                    <button className={css.btnStart} onClick={()=>setStart((prev)=>!prev)}>
                      {!start? 'start': 'pause'}
                    </button>
                    <button className={css.btnStart} onClick={()=>{setRestart(true); randomPosition(); setMinuteActive(false)}}>
                      Restart
                    </button>
                  </div>
                      
                  {/* Affichage du temps */}
                  <div className={css.chronoBlock2}>
                    <div style={{display:"flex",alignItems:'center',paddingLeft:'6px',height:'50px'}}>
                      {minuteActive && <p className={css.chronoNumber}>{minute}min {seconde}s</p>} 
                      {!minuteActive && <p className={css.chronoNumber}>{seconde}s</p>} 
                    </div>
                    <div className={css.chronoImage}></div>
                  </div> 
                      
                </div> 
      </div>
      

    </div>
  </>
)
}
export default Puzzle;
