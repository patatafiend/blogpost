import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Post from "@/models/post";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;
    await connectToDB();

    const post = await Post.findById(id);
    if (!post || !post.image) {
      return NextResponse.json(
        { message: "Image not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ imageUrl: post.image }, { status: 200 });
  } catch (err) {
    console.error("Error fetching image:", err);
    return NextResponse.json(
      { message: "Failed to fetch image." },
      { status: 500 }
    );
  }
}
