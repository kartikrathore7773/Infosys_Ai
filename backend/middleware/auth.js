import jwt from "jsonwebtoken";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required for authentication");
  }
  return secret;
};

export const generateToken = (payload) => {
  const secret = getSecret();
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const secret = getSecret();

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authorization token missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.sub, email: decoded.email };
    return next();
  } catch (error) {
    console.error("JWT verification failed", error);
    res.status(401);
    throw new Error("Invalid or expired token");
  }
};
