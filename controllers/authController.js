import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  findUserById,
} from "../models/userModel.js";

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
}

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

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = generateToken({ id: user.id, email: user.email });
    setAuthCookie(res, token);

    res.status(200).json({
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
    const newUser = await createUser({ name, email, password: hashedPassword });

    const token = generateToken({ id: newUser.id, email: newUser.email });
    setAuthCookie(res, token);

    res.status(201).json({
      message: "Usuário criado e autenticado com sucesso.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function me(req, res) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const { id, name, email } = user;
    res.json({ id, name, email });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário." });
  }
}

function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logout realizado com sucesso." });
}

export { login, register, me, logout };
