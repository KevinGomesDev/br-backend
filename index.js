import express from "express";
import { connect } from "./db.js";
import kingdomRoutes from "./routes/kingdomRoutes.js";
import fs from "fs";
import dotenv from "dotenv";

const envFile = fs.existsSync(".env.local") ? ".env.local" : ".env";
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use("/", kingdomRoutes);

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
