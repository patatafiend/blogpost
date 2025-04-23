import mongoose, { Schema, Document, Model } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  image?: Buffer;
  imageType?: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: Buffer, required: false },
    imageType: { type: String, required: false },
    userEmail: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
