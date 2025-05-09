import { connect } from "../db.js";

async function findUserByEmail(email) {
  const db = await connect();
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function findUserById(id) {
  const db = await connect();
  const res = await db.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [id]
  );
  return res.rows[0];
}

async function createUser({ name, email, password }) {
  const db = await connect();
  const result = await db.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password]
  );
  return result.rows[0];
}

export { findUserByEmail, createUser, findUserById };
