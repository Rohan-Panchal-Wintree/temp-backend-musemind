import mongoose, { Schema, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    credits: { type: Number, required: true },
    currency: { type: String, required: true },
    amount: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

// Top-level document per user holding an array of orders
const OrdersSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    orders: { type: [OrderItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Orders || model("Orders", OrdersSchema);
