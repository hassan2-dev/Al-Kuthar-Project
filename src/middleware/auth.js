import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("غير مصرح");
  }

  // 🔥 هذا هو الحل
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("توكن غير صالح");
  }
};