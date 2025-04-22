import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Post from "@/models/post";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const userEmail = formData.get("userEmail") as string;
    const image = formData.get("image") as File;

    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required." }, { status: 400 });
    }

    let imagePath = null;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadPath = path.join(process.cwd(), "public/uploads", image.name);
      await fs.writeFile(uploadPath, buffer);
      imagePath = `/uploads/${image.name}`;
    }

    await connectToDB();
    const newPost = await Post.create({
      title,
      content,
      userEmail,
      image: imagePath,
    });

    return NextResponse.json({ message: "Post created successfully!", post: newPost }, { status: 201 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: "Failed to create post." }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const posts = await Post.find({});
    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: "Failed to fetch posts." }, { status: 500 });
  }
}