import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Post from "@/models/post";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";
import streamifier from "streamifier";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const userEmail = formData.get("userEmail") as string;
    const image = formData.get("image") as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required." },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    if (image && image.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { message: "Invalid image type." },
          { status: 400 }
        );
      }

      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "your_folder_name", // Optional: specify folder in Cloudinary
              public_id: uuidv4(),
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          streamifier.createReadStream(buffer).pipe(uploadStream);
        }
      );

      imageUrl = uploadResult.secure_url;
    }

    await connectToDB();
    const newPost = await Post.create({
      title,
      content,
      userEmail,
      image: imageUrl,
    });

    return NextResponse.json(
      { message: "Post created successfully!", post: newPost },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating post:", err);
    return NextResponse.json(
      { message: "Failed to create post." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDB();
    const posts = await Post.find({});
    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json(
      { message: "Failed to fetch posts." },
      { status: 500 }
    );
  }
}
