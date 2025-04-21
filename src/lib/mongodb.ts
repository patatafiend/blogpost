import mongoose from "mongoose";
import { buffer } from "stream/consumers";

const MONGODB_URI = process.env.MONGO;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function connectToDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  const options = {
    bufferCommands: false,
  }
  await mongoose.connect(MONGODB_URI!, options);
  return mongoose;
}
export default connectToDB;