import connectDB from "@/lib/database";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user assignedDeliveryBoy", "-password");
    if (!orders)
      return NextResponse.json({ message: `No orders yet` }, { status: 400 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error while getting all orders for admin ${error}` },
      { status: 500 },
    );
  }
};
