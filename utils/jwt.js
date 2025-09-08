import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const generateToken = (userId) => {
  const jti = uuidv4();

  const accessToken = jwt.sign({ id: userId, jti }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: userId, jti },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};
