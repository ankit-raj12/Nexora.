import connectDB from "@/lib/database";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) => {
  try {
    await connectDB();
    const { orderId } = await context.params;
    const order = await Order.findById(orderId).populate(
      "assignedDeliveryBoy assignment",
      "-password",
    );

    if (!order)
      return NextResponse.json(
        { message: `Order not found!!` },
        { status: 400 },
      );

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error getting current order: ${error}` },
      { status: 500 },
    );
  }
};
