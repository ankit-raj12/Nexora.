import connectDB from "@/lib/database";
import emitEventHandler from "@/lib/emit.event.handler";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { userId, items, address, totalAmount, paymentMethod } =
      await req.json();

    if (!userId || !items || !address || !totalAmount || !paymentMethod)
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 400 });

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    await newOrder.populate("user");

    await emitEventHandler("new-order", newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(`Error while creating order: ${error}`, {
      status: 500,
    });
  }
};
