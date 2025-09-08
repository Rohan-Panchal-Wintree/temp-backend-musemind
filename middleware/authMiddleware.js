import { verifyToken } from "../utils/jwt.js";

/**
 * Middleware to protect routes by verifying JWT from cookies.
 * If valid, sets `req.user` with decoded token payload.
 */

const protect = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  const decoded = verifyToken(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = { id: decoded.id };
  next();
};

export default protect;
