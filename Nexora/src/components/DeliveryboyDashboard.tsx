import connectDB from "@/lib/database";
import DeliveryBoyHome from "./DeliveryBoyHome";
import { auth } from "@/auth";
import Order from "@/models/order.model";

const DeliveryboyDashboard = async () => {
  await connectDB();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;
  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryOTPVerification: true,
  }).lean();
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (or) => new Date(or.deliverdAt).toDateString() === today,
  );
  let todayEarning = 0;
  if (todayOrders.length !== 0) {
    todayEarning =
      (todayOrders
        .map((order) => order.totalAmount)
        ?.reduce((acc, curr) => acc + curr) *
        15) /
      100;

    todayEarning = Math.round(todayEarning);
  }
  const todayOrderData = {
    todayOrders: todayOrders.length,
    todayEarning,
  };
  return (
    <>
      <DeliveryBoyHome todayOrderData={todayOrderData} />
    </>
  );
};

export default DeliveryboyDashboard;
