export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookies("token", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.clearCookies("refresh_token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
};
