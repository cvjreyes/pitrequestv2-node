import jwt from "jsonwebtoken";

export async function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  const token2 = token.split("!").join(".")
  jwt.verify(token2, process.env.NODE_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.email = user.email;
    req.roles = user.roles;
    next();
  });
}
