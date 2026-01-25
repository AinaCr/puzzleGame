
import express from 'express'    // Framework serveur backend
import path from 'path'          // Gestion des chemins de fichiers
import cors from 'cors'          // Autorisation Cross-Origin pour frontend
import userRoutes from './routes/userRoutes.js';
import { fileURLToPath } from 'url'  // Conversion d'URL en chemin de fichier

// ======================= Initialisation du serveur =======================
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


app.use(cors())               // Autorise toutes les requêtes cross-origin
app.use(express.json())       // Parse automatiquement le JSON dans req.body
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
const PORT = process.env.PORT || 3000            // Port d'écoute du serveur

app.use("/user", userRoutes);

// ======================= Gestion des chemins ============================









// ======================= Servir le frontend React ========================
app.use(express.static(path.join(__dirname,"../client/dist")))

// ======================= Lancer le serveur ==============================
app.listen(PORT,()=>{
    console.log("http://localhost:3000")
})
