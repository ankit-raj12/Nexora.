import connectDB from "@/lib/database";
import Item from "@/models/item.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const  itemId  = await req.json();
    if (!itemId)
      return NextResponse.json(
        { message: `Couldn't find the item Id` },
        { status: 400 },
      );
    await connectDB();
    await Item.findByIdAndDelete(itemId);
    return NextResponse.json(
      { message: `Sucessfully deleted the item` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error deleting groceries in backend ${error}` },
      { status: 500 },
    );
  }
};
