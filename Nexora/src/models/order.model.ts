import { model, models, Schema, Types } from "mongoose";
import { UserInterface } from "./user.model";

export interface OrderInterface {
  _id?: Types.ObjectId;
  user: Types.ObjectId | UserInterface;
  items: [
    {
      item: Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      amount: number;
    },
  ];
  totalAmount: number;
  paymentMethod: "COD" | "Online";
  address: {
    name: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    mobile: string;
    latitude: string;
    longitude: string;
  };
  assignedDeliveryBoy?: Types.ObjectId;
  assignment?: Types.ObjectId | null;
  isPaid: boolean;
  status: "Recieved" | "Preparing" | "Out for Delivery" | "Delivered";
  deliveryOTP: string | null;
  deliveryOTPVerification: boolean;
  deliverdAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<OrderInterface>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        item: {
          type: Types.ObjectId,
          ref: "Item",
          required: true,
        },
        name: String,
        price: String,
        unit: String,
        image: String,
        amount: Number,
      },
    ],
    isPaid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Recieved", "Preparing", "Out for Delivery", "Delivered"],
      default: "Recieved",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    assignedDeliveryBoy: {
      type: Types.ObjectId,
      ref: "User",
    },
    assignment: {
      type: Types.ObjectId,
      ref: "DeliveryAssignment",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    address: {
      name: String,
      city: String,
      state: String,
      pincode: String,
      fullAddress: String,
      mobile: String,
      latitude: String,
      longitude: String,
    },
    deliveryOTP: {
      type: String,
      default: null,
    },
    deliveryOTPVerification: {
      type: Boolean,
      default: false,
    },
    deliverdAt: { type: Date },
  },
  { timestamps: true },
);

const Order = models.Order || model("Order", orderSchema);
export default Order;
