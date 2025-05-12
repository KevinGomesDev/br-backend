import express from "express";
import { connect } from "./db.js";
import kingdomRoutes from "./routes/kingdomRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const envFile = fs.existsSync(".env.local") ? ".env.local" : ".env";
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 3000;

// Corrigir __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS simples (mesma origem)
app.use(
  cors({
    origin: true, // permite a mesma origem
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Rotas API
app.use("/kingdom", kingdomRoutes);
app.use("/auth", authRoutes);

// Servir o frontend
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Inicialização
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco:", err);
  });
