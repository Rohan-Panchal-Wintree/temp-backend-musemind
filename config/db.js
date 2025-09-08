import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected host: ${connect.connection.host}`);
  } catch (error) {
    console.error(error);
    console.error("DB connection error:", error.messag);
    process.exit(1);
  }
};

export default connectDB;
