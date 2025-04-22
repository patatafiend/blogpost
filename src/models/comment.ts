import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
