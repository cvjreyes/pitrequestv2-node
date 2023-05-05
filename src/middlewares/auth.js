import Jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export async function checkAuth(req, res, next) {
  const token = req.headers?.authorization;
  if (!token) return res.status(401).json("Unauthorized token");
  const verifyToken = token.split("!").join(".");
  Jwt.verify(verifyToken, process.env.NODE_TOKEN_SECRET, (err, user) => {
    if (err) return send(res, false, "Invalid token");
    req.email = user.email;
    next();
  });
}
