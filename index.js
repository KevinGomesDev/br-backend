import express from "express";
import { connect } from "./db.js";
import kingdomRoutes from "./routes/kingdomRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";

const envFile = fs.existsSync(".env.local") ? ".env.local" : ".env";
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.CLIENT_URL_ONE,
  process.env.CLIENT_URL_TWO,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("CORS bloqueado para:", origin);
        callback(new Error("Não permitido por CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Rotas
app.use("/kingdom", kingdomRoutes);
app.use("/auth", authRoutes);

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
