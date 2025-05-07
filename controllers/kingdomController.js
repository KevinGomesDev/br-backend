import { getKingdoms } from '../models/kingdomModel.js';

export async function listKingdoms(req, res) {
  try {
    const kingdoms = await getKingdoms();
    res.status(200).json(kingdoms);
  } catch (error) {
    console.error("Erro ao buscar reinos:", error);
    res.status(500).json({ error: "Erro ao buscar reinos" });
  }
}
