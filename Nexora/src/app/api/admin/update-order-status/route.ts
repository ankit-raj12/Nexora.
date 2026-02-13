import connectDB from "@/lib/database";
import emitEventHandler from "@/lib/emit.event.handler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User, { UserInterface } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    await connectDB();
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Missing orderId or status" },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId).populate("user", "-password");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    let availableDeliveryBoys: UserInterface[] = [];

    if (status === "Out for Delivery" && !order.assignment) {
      const { longitude, latitude } = order.address;
      const nearbyDeliveryBoy = await User.find<UserInterface>({
        role: "deliveryBoy",
        isOnline: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000,
          },
        },
      });

      const nearbyDeliveryBoyIds = nearbyDeliveryBoy.map((b) => b._id);

      const busyDeliveryBoys = await DeliveryAssignment.find({
        assignedTo: { $in: nearbyDeliveryBoyIds },
        status: { $nin: ["Brodcasted", "Completed"] }, 
      }).distinct("assignedTo");

      const busyIdsSet = new Set(busyDeliveryBoys.map((b) => String(b)));

      availableDeliveryBoys = nearbyDeliveryBoy.filter(
        (b) => !busyIdsSet.has(String(b._id)),
      );

      if (availableDeliveryBoys.length === 0) {
        return NextResponse.json(
          { message: "No active/online delivery boys found nearby." },
          { status: 400 },
        );
      }

      const candidates = availableDeliveryBoys.map((b) => b._id);

      const deliveryAssignment = await DeliveryAssignment.create({
        order: orderId,
        brodcastedTo: candidates,
        status: "Brodcasted",
      });

      await deliveryAssignment.populate("order");
      for (const boyId of candidates) {
        const boy = await User.findById(boyId);
        if (boy.socketId) {
          await emitEventHandler(
            "new-assignment",
            { deliveryAssignment },
            boy.socketId,
          );
        }
      }

      order.assignment = deliveryAssignment._id;
    }

    order.status = status;
    await order.save();

    await emitEventHandler("update-status", { orderId, status });

    return NextResponse.json(
      {
        assignment: order.assignment,
        availableBoys: availableDeliveryBoys,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Status Error:", error);

    return NextResponse.json(
      { message: `Error while updating status` },
      { status: 500 },
    );
  }
};
