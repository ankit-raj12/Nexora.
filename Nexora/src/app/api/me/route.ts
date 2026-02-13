import { auth } from "@/auth";
import connectDB from "@/lib/database";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user)
      return NextResponse.json(
        {
          message: "User is not authenticated.",
        },
        { status: 400 },
      );

    await connectDB();
    const user = await User.findById(session.user.id).select("-password");
    if(!user) return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 400 },
      );

    return NextResponse.json(user, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error while fetching user ${error}`,
      },
      { status: 500 },
    );
  }
}
