import connectDB from "@/lib/database";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { senderId, text, orderId, time } = await req.json();
    const room = await Order.findById(orderId);
    if (!room)
      return NextResponse.json({ message: `Room not found` }, { status: 400 });

    const message = await Message.create({ senderId, text, orderId, time });

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error creating chat ${error}` },
      { status: 500 },
    );
  }
}
