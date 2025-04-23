import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Post from "@/models/post";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const post = await Post.findById(params.id);
    if (!post || !post.image || !post.imageType) {
      return NextResponse.json(
        { message: "Image not found." },
        { status: 404 }
      );
    }

    
    return new NextResponse(new Uint8Array(post.image.buffer), {
      headers: {
        "Content-Type": post.imageType, 
        "Content-Length": post.image.length.toString(),
      },
    });
  } catch (err) {
    console.error("Error fetching image:", err);
    return NextResponse.json(
      { message: "Failed to fetch image." },
      { status: 500 }
    );
  }
}
