import { auth } from "@/auth";
import connectDB from "@/lib/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { role, mobile } = await req.json();
    if (!role)
      return NextResponse.json(
        { message: "Please select a role" },
        { status: 400 },
      );
    if (!mobile)
      return NextResponse.json(
        { message: "Please enter the mobile number" },
        { status: 400 },
      );

    const session = await auth();
    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      {
        role,
        mobile,
      },
      { new: true },
    );
    if (!user)
      return NextResponse.json(
        { message: "User not found!!" },
        { status: 400 },
      );
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Edit role error ${error}` },
      { status: 200 },
    );
  }
};
