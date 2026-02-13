import { model, models, Schema, Types } from "mongoose";
export interface DeliveryAssignmentInterface {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  brodcastedTo: Types.ObjectId[] | null;
  assignedTo: Types.ObjectId | null;
  status: "Brodcasted" | "Assigned" | "Completed";
  acceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryAssignment = new Schema<DeliveryAssignmentInterface>(
  {
    order : {
        type: Types.ObjectId,
        ref: "Order"
    },
    brodcastedTo : [{
        type: Types.ObjectId,
        ref: "User"
    }],
    assignedTo : {
        type: Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Brodcasted" , "Assigned" , "Completed"],
        default: "Brodcasted"
    },
    acceptedAt: {
        type: Date,
    }

  },
  { timestamps: true },
);

const DeliveryAssignment =
  models.DeliveryAssignment || model("DeliveryAssignment", deliveryAssignment);

export default DeliveryAssignment;
