import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import allRoutes from "./routes/index.js";

dotenv.config();
const app = express();

connectDB();

app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api", allRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
