
import dotenv from 'dotenv'
dotenv.config()
console.log("Ma clé Host est :", process.env.DB_HOST);
console.log("Mon Port est :", process.env.PORT);
import express from 'express'    // Framework serveur backend
import path from 'path'          // Gestion des chemins de fichiers
import cors from 'cors'          // Autorisation Cross-Origin pour frontend
import userRoutes from './routes/userRoutes.js';
import { fileURLToPath } from 'url'  // Conversion d'URL en chemin de fichier
import db from './config/db.js'



// ======================= Initialisation du serveur =======================
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


app.use(cors())               // Autorise toutes les requêtes cross-origin
app.use(express.json())       // Parse automatiquement le JSON dans req.body
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
const PORT = process.env.PORT            // Port d'écoute du serveur

app.use("/user", userRoutes);

// ======================= Gestion des chemins ============================









// ======================= Servir le frontend React ========================
app.use(express.static(path.join(__dirname,"../client/dist")))

// ======================= Lancer le serveur ==============================
app.listen(PORT,()=>{
    console.log(`🚀 Serveur lancé sur : http://localhost:${PORT}`)
})
