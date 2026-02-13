import { model, models, Schema, Types } from "mongoose";

export interface MessageInterface {
  id?: Types.ObjectId;
  orderId: Types.ObjectId;
  text: string;
  senderId: Types.ObjectId;
  time: string;
  updateAt?: Date;
  createAt?: Date;
}

const messageSchema = new Schema<MessageInterface>(
  {
    orderId: {
      type: Types.ObjectId,
      ref: "Order",
    },
    text: {
      type: String,
      required: true,
    },
    senderId: {
      type: Types.ObjectId,
      ref: "User",
    },
    time: String,
  },
  { timestamps: true },
);

const Message = models.Message || model("Message", messageSchema);
export default Message;
