import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Post from "@/models/post";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    await connectToDB();

    const post = await Post.findById(id);
    if (!post || !post.image || !post.imageType) {
      return NextResponse.json({ message: "Image not found." }, { status: 404 });
    }

    return new NextResponse(post.image, {
      headers: {
        "Content-Type": post.imageType,
        "Content-Length": post.image.length.toString(),
      },
    });
  } catch (err) {
    console.error("Error fetching image:", err);
    return NextResponse.json({ message: "Failed to fetch image." }, { status: 500 });
  }
}
