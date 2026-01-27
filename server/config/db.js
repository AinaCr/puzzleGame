import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Ces 2 lignes servent à retrouver le chemin du fichier ca.pem
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // Indispensable (22395 dans ton cas)
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
   
    ca: fs.readFileSync(path.join(__dirname, '../ca.pem')),
  },
  waitForConnections: true,
  connectionLimit: 10,
});

// Petit test automatique
pool.getConnection()
  .then((connection) => {
    console.log("✅ Connexion Aiven réussie !");
    connection.release();
  })
  .catch(err => {
    console.error("❌ ERREUR DÉTAILLÉE :");
    console.error("Code :", err.code);       // Ex: 'ETIMEDOUT' ou 'ECONNREFUSED'
    console.error("Message :", err.message); // Le texte de l'erreur
    console.error("Erreur complète :", err);
  });

export default pool;