import { connect } from "../db.js";

async function getKingdoms() {
    const client = await connect();
    const res = await client.query("SELECT * FROM kingdoms");
    return res.rows;
};

export { getKingdoms };