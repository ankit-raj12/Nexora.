import connectDB from "@/lib/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { userId, location } = await req.json();
    if (!userId || !location)
      return NextResponse.json(
        {
          message: "Couldn't get userId or location",
        },
        { status: 400 },
      );
    const user = await User.findByIdAndUpdate(userId, {
      location,
    });

    if (!user)
      return NextResponse.json(
        {
          message: "Couldn't find User",
        },
        { status: 404 },
      );
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Update location error", error },
      { status: 500 },
    );
  }
};
