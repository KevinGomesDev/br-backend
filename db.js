import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING
});

async function connect() {
  if (!global.pool) {
    console.log("Criando pool de conexão...");
    global.pool = pool;
  }
  return global.pool; // Retorna o pool diretamente
}

export { connect };
