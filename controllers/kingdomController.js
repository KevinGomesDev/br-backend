import { getKingdoms, createKingdom } from "../models/kingdomModel.js";

async function listKingdoms(req, res) {
  try {
    const kingdoms = await getKingdoms();
    res.status(200).json(kingdoms);
  } catch (error) {
    console.error("Erro ao buscar reinos:", error);
    res.status(500).json({ error: "Erro ao buscar reinos" });
  }
}

async function addKingdom(req, res) {
  const { name, description, type } = req.body;

  const validTypes = [
    "aberration",
    "beast",
    "celestial",
    "construct",
    "dragon",
    "elemental",
    "fae",
    "fiend",
    "giant",
    "humanoid",
    "monstrosity",
    "ooze",
    "plant",
    "undead",
    "insect",
  ];

  if (!name || !type) {
    return res.status(400).json({ error: "Campos obrigatórios: name e type" });
  }

  if (!validTypes.includes(type)) {
    return res
      .status(400)
      .json({ error: "Tipo inválido. Consulte os tipos permitidos." });
  }
  try {
    const newKingdom = await createKingdom({ name, description, type });
    res.status(201).json(newKingdom);
  } catch (error) {
    console.error("Erro ao criar reino:", error);
    res.status(500).json({ error: "Erro ao criar reino" });
  }
}

export { listKingdoms, addKingdom };
