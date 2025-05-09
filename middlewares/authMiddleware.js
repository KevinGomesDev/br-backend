import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Acesso não autorizado." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido ou expirado." });
    }

    req.user = decoded;
    next();
  });
}

export { verifyToken };
