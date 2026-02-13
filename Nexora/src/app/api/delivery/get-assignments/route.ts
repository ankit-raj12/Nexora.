import { auth } from "@/auth";
import connectDB from "@/lib/database";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    const session = await auth();
    const assignments = await DeliveryAssignment.find({
      brodcastedTo: session?.user?.id,
      status: "Brodcasted",
    }).populate("order");

    if (!assignments)
      return NextResponse.json(
        { message: "No assignments for now!!" },
        { status: 200 },
      );

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error while getting assignments ${error}` },
      { status: 500 },
    );
  }
};
