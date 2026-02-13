import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/database";
import Item from "@/models/item.model";
import { NextRequest, NextResponse } from "next/server";

const nextError = (field: string) => {
  return NextResponse.json(
    { message: `${field} is required to add item` },
    { status: 400 },
  );
};

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();
    if (session?.user?.role !== "admin")
      return NextResponse.json(
        { message: "Only admin can list Items.. " },
        { status: 400 },
      );

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const unit = formData.get("unit") as string;
    const amount = formData.get("amount") as string;
    const file = formData.get("image") as Blob;
    const category = formData.get("category") as string;

    let imageURL;
    if (file) {
      imageURL = await uploadOnCloudinary(file);
    }

    if (!name) return nextError("Item name");
    if (!price) return nextError("Item price");
    if (!unit) return nextError("Item unit");
    if (!amount) return nextError("Item amount");
    if (!category) return nextError("Item category");

    const item = await Item.create({
      name,
      price,
      unit,
      image: imageURL,
      amount,
      category,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error while adding Item ${error}` },
      { status: 500 },
    );
  }
};
