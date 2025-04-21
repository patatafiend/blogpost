import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/user";
import connectToDB from "@/lib/mongodb";

export async function POST(request: Request) {
  const { name, email, password, confirmPassword } = await request.json();

  const isValidEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Invalid email address" },
      { status: 400 }
    );
  }
  if (password !== confirmPassword) {
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }
  try {
    await connectToDB();
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
