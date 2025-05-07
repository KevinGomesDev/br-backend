import pg from "pg";
import fs from "fs";
import dotenv from "dotenv";

const { Pool } = pg;

const envFile = fs.existsSync(".env.local") ? ".env.local" : ".env";
dotenv.config({ path: envFile });

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

async function connect() {
  if (!global.pool) {
    console.log("Criando pool de conexão...");
    global.pool = pool;
  }
  return global.pool; // Retorna o pool diretamente
}

export { connect };
