import mongoose from "mongoose";

const mongoURL = process.env.MONGO_URL as string;

const connectDB = async () => {
  if (!mongoURL) throw new Error("MongoDB URL not found");

  let cached = global.mongo;

  if (!cached) {
    cached = global.mongo = { connection: null, pending: null };
  }

  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.pending) {
    cached.pending = mongoose.connect(mongoURL).then((con) => con.connection);
  }

  try {
    cached.connection = await cached.pending;
    return cached.connection;
  } catch (error) {
    cached.pending = null;
    throw error;
  }
};

export default connectDB;
