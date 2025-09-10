export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "None",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "None",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Lax",
    path: "/",
    secure: isProd,
  });
  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    secure: isProd,
  });
};
