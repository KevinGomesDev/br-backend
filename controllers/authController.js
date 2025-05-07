import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../models/userModel.js";
import jwt from "jsonwebtoken";

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Por enquanto só retornamos sucesso (sem token ainda)
    // Gera token com id e email do usuário
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Adicione no .env
      { expiresIn: "1h" }
    );

    // Envia como cookie HTTP-only
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // em prod, só HTTPS
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hora
      })
      .status(200)
      .json({
        message: "Login bem-sucedido.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Usuário criado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function me(req, res) {
  const { id, email } = req.user;
  res.json({ id, email });
}

export { register, login, me };
