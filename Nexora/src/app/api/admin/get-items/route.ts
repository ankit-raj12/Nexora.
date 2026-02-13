import connectDB from "@/lib/database";
import Item from "@/models/item.model";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    const items = await Item.find({});
    if (!items)
      return NextResponse.json({ message: "No items found!" }, { status: 400 });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Getting groceries error ${error}` },
      { status: 500 },
    );
  }
};
