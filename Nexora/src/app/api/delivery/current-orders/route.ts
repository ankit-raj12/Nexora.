import { auth } from "@/auth";
import connectDB from "@/lib/database";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    const session = await auth();
    const currentOrder = await Order.findOne({
      assignedDeliveryBoy: session?.user?.id,
      status: { $ne: "Delivered" },
    })
      .populate("user assignedDeliveryBoy", "-password")
      .lean();
    if (!currentOrder)
      return NextResponse.json(
        { message: `Couldn't find any current order` },
        { status: 400 },
      );

    return NextResponse.json(currentOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error while getting current order ${error}` },
      { status: 500 },
    );
  }
};
