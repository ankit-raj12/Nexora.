import React from "react";
import AdminDashboardClient from "./AdminDashboardClient";
import connectDB from "@/lib/database";
import Order from "@/models/order.model";
import User from "@/models/user.model";

const AdminDashboard = async () => {
  await connectDB();
  const orders = await Order.find({}).lean();
  const users = await User.find({ role: "user" }).lean();
  const deliveryBoys = await User.find({
    role: "deliveryBoy",
    isOnline: true,
  }).lean();

  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  // Chart Data Preparation
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });

    // Filter orders for this specific day
    const dayOrders = orders.filter((o) => {
      const oDate = new Date(o.createdAt);
      return (
        oDate.getDate() === date.getDate() &&
        oDate.getMonth() === date.getMonth() &&
        oDate.getFullYear() === date.getFullYear()
      );
    });

    const dayRevenue = dayOrders.reduce(
      (acc, curr) => acc + (curr.totalAmount || 0),
      0,
    );
    chartData.push({ name: dayStr, revenue: dayRevenue });
  }

  const todaysOrdersList = orders.filter(
    (order) => new Date(order.createdAt) >= startOfToday,
  );
  const todayRevenue = todaysOrdersList.reduce(
    (acc, curr) => (curr.totalAmount || 0) + acc,
    0,
  );

  const lastSevenDaysOrders = orders.filter(
    (order) => new Date(order.createdAt) >= sevenDaysAgo,
  );

  const lastSevenDaysRevenue = lastSevenDaysOrders.reduce(
    (acc, curr) => (curr.totalAmount || 0) + acc,
    0,
  );

  const lastMonth = new Date();
  lastMonth.setDate(today.getDate() - 30);

  const lastMonthOrders = orders.filter(
    (order) => new Date(order.createdAt) >= lastMonth,
  );

  const lastMonthRevenue = lastMonthOrders.reduce(
    (acc, curr) => (curr.totalAmount || 0) + acc,
    0,
  );

  const data = {
    totalOrders: orders.length,
    totalCustomers: users.length,
    totalDeliveryBoys: deliveryBoys.length,
    chartData,
    recentOrders: [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5),
    pendingDeliveries: orders.filter((order) => order.status !== "Delivered"),
    totalRevenue: orders.reduce(
      (acc, current) => acc + (current.totalAmount || 0),
      0,
    ),
    todaysOrder: todaysOrdersList.length,
    todayRevenue,
    lastSevenDaysOrders: lastSevenDaysOrders.length,
    lastSevenDaysRevenue,
    lastMonthOrders: lastMonthOrders.length,
    lastMonthRevenue,
  };
  const parsedData = JSON.parse(JSON.stringify(data));

  return (
    <div className="bg-[#e0e5ec] min-h-screen">
      <AdminDashboardClient data={parsedData} />
    </div>
  );
};

export default AdminDashboard;
