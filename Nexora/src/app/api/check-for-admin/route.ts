import connectDB from "@/lib/database";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    await connectDB();
    const existAdmin = await User.findOne({ role: "admin" });
    if (existAdmin)
      return NextResponse.json({ existAdmin: true }, { status: 200 });
    else return NextResponse.json({ existAdmin: false }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error checking admin ${error}` },
      { status: 500 },
    );
  }
};
