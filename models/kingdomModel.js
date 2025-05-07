import { connect } from "../db.js";

async function getKingdoms() {
  const client = await connect();
  const res = await client.query("SELECT * FROM kingdoms");
  return res.rows;
}

async function createKingdom({ name, description, type }) {
  const db = await connect();
  const query =
    "INSERT INTO kingdoms (name, description, type) VALUES ($1, $2, $3) RETURNING *";
  const values = [name, description, type];
  const result = await db.query(query, values);
  return result.rows[0];
}

export { getKingdoms, createKingdom };
