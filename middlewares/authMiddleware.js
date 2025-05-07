import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Não autenticado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // salva os dados do token no req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ou expirado." });
  }
}

export { verifyToken };
