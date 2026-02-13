import Item from "@/models/item.model";
import connectDB from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ category: string }> },
) => {
  try {
    await connectDB();
    const { category } = await props.params;

    if (!category)
      return NextResponse.json(
        { message: `Couldn't get category` },
        { status: 400 },
      );

    const decodedCategory = decodeURIComponent(category);
    const items = await Item.find({ category: decodedCategory });

    if (items.length < 1)
      return NextResponse.json(
        { message: `Couldn't find the category` },
        { status: 404 },
      );

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error while getting category ${error}` },
      { status: 500 },
    );
  }
};
