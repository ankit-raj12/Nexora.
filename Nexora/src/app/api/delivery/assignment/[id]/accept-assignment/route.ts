import { auth } from "@/auth";
import emitEventHandler from "@/lib/emit.event.handler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context.params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    const assignment = await DeliveryAssignment.findById(id);

    // context: { params: Promise<{ id: string; }>; })
    // context: { params: Promise<{ id: string; }>; }
    if (!assignment)
      return NextResponse.json(
        { message: "Assignment not found!!" },
        { status: 400 },
      );

    if (assignment.status !== "Brodcasted") {
      return NextResponse.json(
        { message: "Assignment expired!!" },
        { status: 400 },
      );
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["Brodcasted", "Completed"] },
    });

    if (alreadyAssigned)
      return NextResponse.json(
        { message: "Cannot accept a new assignment when already assigned one" },
        { status: 400 },
      );

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "Assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order)
      return NextResponse.json(
        { message: "Order not found!!" },
        { status: 400 },
      );

    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    const populatedOrder = await order.populate([
      { path: "assignedDeliveryBoy" },
      { path: "user" },
    ]);

    // await DeliveryAssignment.updateMany(
    //   {
    //     _id: { $ne: assignment._id },
    //     brodcastedTo: deliveryBoyId,
    //     status: "Brodcasted",
    //   },
    //   {
    //     $pull: { brodcastedTo: deliveryBoyId },
    //   },
    // );

    await emitEventHandler("accept-assignment", populatedOrder);

    return NextResponse.json(
      { message: "Order accepted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error while accepting assignment ${error}` },
      { status: 500 },
    );
  }
};
