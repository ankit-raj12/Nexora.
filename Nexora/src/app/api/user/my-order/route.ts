import { auth } from "@/auth";
import connectDB from "@/lib/database";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export const GET = async () => {
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
    const orders = await Order.find({ user: session.user.id }).populate(
      "user assignedDeliveryBoy",
      "email mobile name role",
    );
    if (!orders)
      return NextResponse.json(
        { message: "Not any orders yet" },
        { status: 200 },
      );
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in getting orders ${error}` },
      { status: 500 },
    );
  }
};
