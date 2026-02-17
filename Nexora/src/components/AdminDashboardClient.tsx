"use client";

import { useState } from "react";
import { OrderInterface } from "@/models/order.model";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart2, User, Package, Truck, DollarSign, Clock } from "lucide-react";

interface PropsInterface {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalDeliveryBoys: number;
  pendingDeliveries: OrderInterface[];
  todaysOrder: number;
  todayRevenue: number;
  lastSevenDaysOrders: number;
  lastSevenDaysRevenue: number;
  lastMonthOrders: number;
  lastMonthRevenue: number;
  chartData: { name: string; revenue: number }[];
  recentOrders: OrderInterface[];
}

export default function AdminDashboardClient({
  data,
}: {
  data: PropsInterface;
}) {
  // Helper for currency formatting
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumSignificantDigits: 3,
    }).format(amount);
  };

  const [filter, setFilter] = useState<
    "today" | "last 7 days" | "lastMonth" | "total"
  >("total");

  const currentRevenue =
    filter === "today"
      ? data.todayRevenue
      : filter === "lastMonth"
        ? data.lastMonthRevenue
        : filter === "last 7 days"
          ? data.lastMonthRevenue
          : data.totalRevenue;

  const currentOrder =
    filter === "today"
      ? data.todaysOrder
      : filter === "lastMonth"
        ? data.lastMonthOrders
        : filter === "last 7 days"
          ? data.lastSevenDaysOrders
          : data.totalOrders;

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-slate-700 font-sans pt-4 md:pt-4">
      <div className="flex flex-col lg:flex-row min-h-screen relative">
        {/* Main Content */}
        <main className="flex-1 min-w-0 p-3 md:p-4 lg:p-8 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-700">
                Admin Dashboard
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                {"Welcome back! Here's your performance overview"}
              </p>
            </div>

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value as
                    | "today"
                    | "last 7 days"
                    | "lastMonth"
                    | "total",
                )
              }
              className="w-full sm:w-fit px-4 py-2 text-xs md:text-sm rounded-xl bg-[#e0e5ec] neu-input font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all whitespace-nowrap"
            >
              <option value="total">Total</option>
              <option value="today">Today</option>
              <option value="last 7 days">Last 7 Days</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Stats & Chart */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] md:shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] flex flex-col justify-between h-32 md:h-40 group hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start">
                    <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] md:shadow-[inset_5px_5px_10px_#babecc,inset_-5px_-5px_10px_#ffffff]">
                      <DollarSign className="text-green-500 w-4 h-4 md:w-6 md:h-6" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-base text-slate-500 font-medium mb-1">
                      Total Revenue
                    </p>
                    <h3 className="text-lg md:text-3xl font-bold text-slate-700 truncate">
                      {formatCurrency(currentRevenue)}
                    </h3>
                  </div>
                </div>

                <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] md:shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] flex flex-col justify-between h-32 md:h-40 group hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start">
                    <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] md:shadow-[inset_5px_5px_10px_#babecc,inset_-5px_-5px_10px_#ffffff]">
                      <Package className="text-blue-500 w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg">
                      Orders
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-base text-slate-500 font-medium mb-1">
                      Total Orders
                    </p>
                    <h3 className="text-lg md:text-3xl font-bold text-slate-700">
                      {currentOrder}
                    </h3>
                  </div>
                </div>

                <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] md:shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] flex flex-col justify-between h-32 md:h-40 group hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start">
                    <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] md:shadow-[inset_5px_5px_10px_#babecc,inset_-5px_-5px_10px_#ffffff]">
                      <User className="text-purple-500 w-4 h-4 md:w-6 md:h-6" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-base text-slate-500 font-medium mb-1">
                      Active Customers
                    </p>
                    <h3 className="text-lg md:text-3xl font-bold text-slate-700">
                      {data.totalCustomers}
                    </h3>
                  </div>
                </div>

                <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] md:shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] flex flex-col justify-between h-32 md:h-40 group hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start">
                    <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] md:shadow-[inset_5px_5px_10px_#babecc,inset_-5px_-5px_10px_#ffffff]">
                      <Truck className="text-orange-500 w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg">
                      Staff
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-base text-slate-500 font-medium mb-1">
                      Delivery Partners
                    </p>
                    <h3 className="text-lg md:text-3xl font-bold text-slate-700">
                      {data.totalDeliveryBoys}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] md:shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff]">
                <div className="flex justify-between items-center mb-4 md:mb-8">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-700">
                      Revenue Trends
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500">
                      Last 7 Days Performance
                    </p>
                  </div>
                  <button className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-600 bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] md:shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] hover:text-blue-600 transition-colors">
                    Weekly Report
                  </button>
                </div>
                <div className="h-56 md:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#cbd5e1"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#e0e5ec",
                          borderRadius: "12px",
                          border: "none",
                          boxShadow:
                            "8px 8px 16px #babecc, -8px -8px 16px #ffffff",
                          fontSize: "12px",
                        }}
                        itemStyle={{ color: "#334155", fontWeight: "bold" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                        activeDot={{ r: 6, stroke: "#e0e5ec", strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Column - Interactions */}
            <div className="space-y-6 md:space-y-8">
              {/* Pending Tasks / Orders */}
              <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-[#e0e5ec] neu-inset">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="text-base md:text-lg font-bold text-slate-700">
                    Live Orders
                  </h3>
                  <button className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#e0e5ec] neu-button transition-all flex items-center justify-center text-[10px] md:text-xs font-bold text-orange-500">
                    {data.pendingDeliveries.length}
                  </button>
                </div>

                <div className="space-y-3 md:space-y-4 max-h-96 md:max-h-125 overflow-y-auto px-2 md:px-3 py-2 custom-scrollbar">
                  {data.pendingDeliveries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 md:py-10 opacity-60">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] md:shadow-[inset_5px_5px_10px_#babecc,inset_-5px_-5px_10px_#ffffff] flex items-center justify-center mb-2 md:mb-3">
                         <Package size={24} className="text-slate-400 md:w-7.5 md:h-7.5" />
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-slate-500">All caught up!</p>
                      <p className="text-[10px] md:text-xs text-slate-400">No pending orders at the moment</p>
                    </div>
                  ) : (
                    data.pendingDeliveries
                      .slice(0, 5)
                      .map((order: OrderInterface, idx) => (
                        <div
                          key={idx}
                          className="group p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#e0e5ec] neu-flat transition-all cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2 md:mb-3">
                            <div className="flex flex-col">
                                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
                                <span className="text-xs md:text-sm font-bold text-slate-700 font-mono">
                                    #{order._id?.toString().slice(-6).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-[8px] md:text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-wider shadow-sm">
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-3 border-t border-slate-200/60">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-inner">
                              <Package size={18} className="text-slate-500 group-hover:text-blue-500 transition-colors md:w-5.5 md:h-5.5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm md:text-base font-bold text-slate-800 flex items-center gap-1">
                                ₹{order.totalAmount}
                                <span className="text-[8px] md:text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 rounded-md">COD</span>
                              </p>
                              <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                                <Clock size={10} className="md:w-3 md:h-3" />
                                {new Date(
                                  order.createdAt as Date,
                                ).toLocaleDateString("en-IN", {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  {data.pendingDeliveries.length > 5 && (
                    <button className="w-full text-center text-[10px] md:text-xs font-bold text-slate-500 hover:text-blue-600 py-2 md:py-3 uppercase tracking-wider transition-colors bg-[#e0e5ec] rounded-lg md:rounded-xl hover:bg-slate-200/50 mt-2">
                      View All Orders
                    </button>
                  )}
                </div>
              </div>

              {/* Performance / Highlights */}
              <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] md:shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff]">
                <h3 className="text-base md:text-lg font-bold text-slate-700 mb-4 md:mb-6">
                  Daily Highlights
                </h3>

                <div className="space-y-4 md:space-y-6">

                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg mt-2 md:mt-4">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                      <div>
                        <p className="text-blue-100 text-[10px] md:text-xs font-medium mb-0.5 md:mb-1">
                          {"Today's Revenue"}
                        </p>
                        <h4 className="text-xl md:text-2xl font-bold">
                          ₹{formatCurrency(data.todayRevenue).replace("₹", "")}
                        </h4>
                      </div>
                      <div className="p-1.5 md:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <BarChart2 size={16} className="text-white md:w-5 md:h-5" />
                      </div>
                    </div>
                    <p className="text-[10px] md:text-xs text-blue-100 bg-white/10 inline-block px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg">
                      {data.todaysOrder}     Orders processed today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
