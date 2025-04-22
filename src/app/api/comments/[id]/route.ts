import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Comment from "@/models/comment";

// DELETE comment
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await connectToDB();

    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}

// UPDATE comment
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await connectToDB();

    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (err) {
    console.error("Error updating comment:", err);
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}
