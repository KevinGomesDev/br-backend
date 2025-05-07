import express from 'express';
import dotenv from 'dotenv';
import { connect } from './db.js';
import kingdomRoutes from './routes/kingdomRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use('/kingdom', kingdomRoutes);

// Inicialização
connect().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}).catch(err => {
  console.error("Erro ao conectar ao banco:", err);
});
