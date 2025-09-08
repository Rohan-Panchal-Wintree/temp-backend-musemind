import { generateToken } from "./jwt.js";
import { setAuthCookies } from "./cookies.js";

const sendToken = (res, userId) => {
  const { accessToken, refreshToken } = generateToken(userId);
  setAuthCookies(res, accessToken, refreshToken);
  return { accessToken, refreshToken };
};

export default sendToken;
