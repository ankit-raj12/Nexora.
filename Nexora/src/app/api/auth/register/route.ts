import connectDB from "@/lib/database";
import User from "@/models/user.model";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );

    await connectDB();

    const existingEmail = await User.findOne({ email });
    if (existingEmail){
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    if (password.length < 6)
      return NextResponse.json(
        { message: "Password atleast have 6 characters" },
        { status: 400 },
      );
      
      if (name.length < 3)
        return NextResponse.json(
          { message: "Name should be atleast 3 characters long" },
          { status: 400 },
        );

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error while registering -> ${error}` },
      { status: 500 },
    );
  }
}
