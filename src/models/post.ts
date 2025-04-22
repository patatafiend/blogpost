import mongoose, { Schema, Document, Model } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  image?: string; // Optional image field
  userEmail: string; // User's email or ID
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: false },
    userEmail: { type: String, required: true }, // User's email or ID
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;