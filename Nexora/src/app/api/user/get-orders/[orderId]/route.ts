import connectDB from "@/lib/database";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) => {
  try {
    await connectDB();
    const { orderId } = await context.params;
    if (!orderId)
      return NextResponse.json(
        { message: "Please provide an order id" },
        { status: 400 },
      );

    const order = await Order.findById(orderId).populate(
      "assignedDeliveryBoy user",
      "-password",
    );
    if (!order)
      return NextResponse.json(
        { message: "Order not found!" },
        { status: 400 },
      );

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error while getting order ${error}` },
      { status: 500 },
    );
  }
};
