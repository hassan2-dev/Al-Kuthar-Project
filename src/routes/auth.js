import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// مستخدم مؤقت (للتجربة)
const user = {
  id: 1,
  username: "admin",
  password: "$2b$10$IWcBcrheVrPHfmBXLAOTWucOAu76RefK4ruKqM/1mlNSUN3HT9j7q"
  // كلمة المرور: 123456
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username) {
    return res.status(401).send("اسم المستخدم خطأ");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).send("كلمة المرور خطأ");
  }

  const token = jwt.sign(
    { userId: user.id },
    "secret123",
    { expiresIn: "1d" }
  );

  res.json({ token });
});

export default router;