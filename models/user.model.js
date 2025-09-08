import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: {
      type: Number,
      default: 5,
      min: 0,
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
