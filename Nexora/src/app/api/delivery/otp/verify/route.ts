import connectDB from "@/lib/database";
import emitEventHandler from "@/lib/emit.event.handler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { orderId, OTP } = await req.json();
    if (!orderId || !OTP)
      return NextResponse.json(
        { message: `OrderID and OTP both are required!!` },
        { status: 400 },
      );

    const order = await Order.findById(orderId);

    if (!order)
      return NextResponse.json({ message: `Order not found` }, { status: 400 });

    if (order.deliveryOTP !== OTP) {
      return NextResponse.json({ message: `Invalid OTP` }, { status: 400 });
    }

    order.deliveryOTPVerification = true;
    order.status = "Delivered";
    order.deliverdAt = Date.now();
    if (order.paymentMethod === "COD") order.isPaid = true;
    await order.save();

    await DeliveryAssignment.findOneAndUpdate(
      { order: orderId },
      {
        assignedTo: null,
        status: "Completed",
      },
    );

    await emitEventHandler("order-delivered",{orderStatus: order.status, orderId, orderAmount: order.totalAmount});

    return NextResponse.json(
      { message: `OTP verification successful` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Verify OTP Error ${error}` },
      { status: 500 },
    );
  }
};
