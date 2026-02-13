import { auth } from "@/auth";
import emitEventHandler from "@/lib/emit.event.handler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
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

    await DeliveryAssignment.updateOne(
      {
        _id: { $eq: assignment._id },
        brodcastedTo: deliveryBoyId,
        status: "Brodcasted",
      },
      {
        $pull: { brodcastedTo: deliveryBoyId },
      },
    );

    await emitEventHandler("reject-assignment", assignment);

    return NextResponse.json(
      { message: "Order rejected successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error while rejecting assignment ${error}` },
      { status: 500 },
    );
  }
};
