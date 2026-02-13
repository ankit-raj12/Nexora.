import connectDB from "@/lib/database";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId } = await req.json();
    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: `Room not found` }, { status: 400 });

    const messages = await Message.find({ orderId: order._id });

    if (!messages)
      return NextResponse.json(
        { message: `No messages found` },
        { status: 400 },
      );

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error getting messages ${error}` },
      { status: 500 },
    );
  }
}
