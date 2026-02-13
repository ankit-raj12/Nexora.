import connectDB from "@/lib/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { userId, socketId, onlineStatus } = await req.json();

    if (!onlineStatus) {
      const user = await User.findOneAndUpdate(
        {socketId},
        {
          isOnline: false,
          socketId: null,
        },
        { new: true },
      );
      if (!user)
        return NextResponse.json(
          { message: `User not found` },
          { status: 400 },
        );
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        socketId,
        isOnline: true,
      },
      { new: true },
    );
    if (!user)
      return NextResponse.json({ message: `User not found` }, { status: 400 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Socket API Error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
