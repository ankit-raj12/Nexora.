import connectDB from "@/lib/database";
import Item from "@/models/item.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) => {
  try {
    await connectDB();
    const { itemId } = await params;
    const item = await Item.findById(itemId);
    if (!item)
      return NextResponse.json({ message: "No items found!" }, { status: 400 });
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Getting groceries error ${error}` },
      { status: 500 },
    );
  }
};
