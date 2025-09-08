import sendToken from "../utils/sendToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { verifyToken } from "../utils/jwt.js";
import { clearAuthCookies } from "../utils/cookies.js";

// -------- Signup --------
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  const credits = 5;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ messgae: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      credits,
    });

    sendToken(res, user._id);
    res.status(201).json({
      user: {
        username,
        email,
        credits,
        id: user._id,
        createdAt: user.createdAt,
      },
      message: "Signup succesful",
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// -------- Login --------
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    sendToken(res, user._id);
    res.json({
      user: {
        username: user.username,
        email: user.email,
        credits: user.credits,
        id: user._id,
        createdAt: user.createdAt,
      },
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// -------- Refresh Token --------
export const refreshToken = (req, res) => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);

  if (!decoded) {
    return res
      .status(401)
      .json({ message: "Refresh token invalid or expired" });
  }

  sendToken(res, decoded.id);
  res.status(200).json({ message: "Token refreshed" });
};

//-------- update name of the user --------
export const updatedUsername = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  const trimmedName = name.trim();

  if (!name || trimmedName === "") {
    return res.status(400).json({ messgae: "Name is required" });
  }

  if (trimmedName.length > 100) {
    return res
      .status(400)
      .json({ message: "Name must be under 100 characters" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username: name.trim() },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Name updated successfully",
      name: user.username,
    });
  } catch (error) {
    console.error("Error updating name", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------- Logout --------
export const logout = (req, res) => {
  clearAuthCookies(res);
  res.status(200).json({ message: "Logged out successfully" });
};
