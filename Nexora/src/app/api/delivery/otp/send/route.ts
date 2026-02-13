import connectDB from "@/lib/database";
import { sendMail } from "@/lib/nodemailer";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { orderId } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order)
      return NextResponse.json({ message: `Order not found` }, { status: 400 });
    const OTP = Math.floor(Math.random() * 9000 + 1000).toString();
    order.deliveryOTP = OTP;
    await order.save();

    const deliveryHTML = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e0e5ec; }
              .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .card { background-color: #e0e5ec; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5); }
              .logo { font-size: 28px; font-weight: bold; color: #4a5568; margin-bottom: 20px; letter-spacing: 1px; }
              .title { color: #4a5568; font-size: 24px; margin-bottom: 20px; font-weight: 600; }
              .otp-box { font-size: 36px; font-weight: bold; color: #2d3748; letter-spacing: 8px; margin: 30px 0; background: #e0e5ec; padding: 20px; border-radius: 12px; box-shadow: inset 5px 5px 10px rgba(163, 177, 198, 0.4), inset -5px -5px 10px rgba(255, 255, 255, 0.8); display: inline-block; }
              .message { color: #718096; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
              .footer { margin-top: 30px; font-size: 12px; color: #a0aec0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="card">
                  <div class="logo">NEXORA</div>
                  <div class="title">Delivery Verification</div>
                  <div class="message">Please share this One Time Password (OTP) with the delivery agent to confirm your order receipt.</div>
                  <div class="otp-box">${OTP}</div>
                  <div class="message">Do not share this code with anyone else.</div>
                  <div class="footer">&copy; ${new Date().getFullYear()} Nexora. All rights reserved.</div>
              </div>
          </div>
      </body>
      </html>
    `;
    await sendMail(order.user.email, "Delivery OTP", deliveryHTML);

    return NextResponse.json(
      { message: `OTP sent successfully` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Send OTP Error ${error}` },
      { status: 500 },
    );
  }
};
