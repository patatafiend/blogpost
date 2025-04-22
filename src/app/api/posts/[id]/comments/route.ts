import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Comment from "@/models/comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET comments
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // Await the params object

  await connectToDB();

  const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 });

  return NextResponse.json({ comments });
}

// POST a new comment
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // Await the params object

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text) {
    return NextResponse.json({ message: "Comment text is required." }, { status: 400 });
  }

  await connectToDB();

  const newComment = await Comment.create({
    text,
    postId: id,
    userEmail: session.user?.email,
  });

  return NextResponse.json({ message: "Comment posted!", comment: newComment });
}
