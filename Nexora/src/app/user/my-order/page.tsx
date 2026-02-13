/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getSocket } from "@/lib/socket";
import { OrderInterface } from "@/models/order.model";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Truck,
  Package,
  Calendar,
  Bike,
  Phone,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyOrdersPage() {
  const [ordersData, setOrdersData] = useState<OrderInterface[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  useEffect(() => {
    const getOrders = async () => {
      const orders = await fetch("/api/user/my-order", {
        method: "GET",
      }).then((res) => res.json());
      if (orders) {
        setOrdersData(orders.reverse());
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on("update-status", ({ orderId, status }) => {
      setOrdersData((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order._id?.toString() === orderId.toString()
            ? { ...order, status }
            : order,
        );
        return updatedOrders;
      });
    });
    return () => {
      socket.off("update-status");
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on("order-delivered", ({ orderStatus, orderId }) => {
      setOrdersData((prev) =>
        prev.map((order) =>
          order._id?.toString() === orderId.toString()
            ? { ...order, status: orderStatus, isPaid: true }
            : order,
        ),
      );
    });
    return () => {
      socket.off("order-delivered");
    };
  });

  useEffect(() => {
    const socket = getSocket();
    const handleAcceptOrder = (assignment: OrderInterface) => {
      setOrdersData((prev) =>
        prev.map((order) => (order._id == assignment._id ? assignment : order)),
      );
    };
    socket.on("accept-assignment", handleAcceptOrder);
    return () => {
      socket.off("accept-assignment", handleAcceptOrder);
    };
  }, []);

  return (
    <div className="min-h-screen bg-neu-base font-sans overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 sm:py-12 lg:py-20 flex flex-col lg:flex-row gap-6 sm:gap-12 lg:gap-20 sticky-container">
        {/* Left Column: Consistent Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-5/12 lg:sticky lg:top-20 h-fit"
        >
          <Link
            href="/"
            className="neu-button w-fit px-4 py-2 sm:px-6 sm:py-3 rounded-[15px] sm:rounded-[20px] text-[#667eea] font-bold flex items-center gap-2 mb-4 sm:mb-8 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="sm:flex hidden">Back to Shop</span>
          </Link>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-neu-text mb-3 sm:mb-6 leading-[1.1] drop-shadow-[4px_4px_8px_rgba(163,177,198,0.3)]">
            My
            <br />
            <span className="bg-linear-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Orders
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#718096] mb-6 sm:mb-12 leading-relaxed">
            Check the status of your favorite picks and manage your past
            cravings.
          </p>

          {/* Floating Visuals matching your Cart theme */}
          <div className="relative h-64 w-full hidden lg:block">
            <FloatingElement icon="📦" delay={0} top="10%" left="10%" />
            <FloatingElement icon="🚚" delay={1.5} top="40%" right="20%" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-neu-base rounded-full neu-flat flex items-center justify-center text-6xl opacity-40">
              🥗
            </div>
          </div>
        </motion.div>

        {/* Right Column: Orders Feed */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-7/12 flex flex-col gap-8 w-full"
        >
          <div className="grid gap-10">
            <AnimatePresence mode="popLayout">
              {ordersData.length > 0 ? (
                ordersData.map((order, idx) => (
                  <motion.div
                    key={order._id?.toString()}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-neu-base neu-flat rounded-[20px] sm:rounded-[40px] p-4 sm:p-10 relative overflow-hidden group ${
                      !order.isPaid
                        ? "border-2 border-red-400/50"
                        : "border-2 border-green-600/50"
                    }`}
                  >
                    {/* Glassmorphism Blob Effect */}
                    <div
                      className={`absolute -top-10 -right-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob ${
                        !order.isPaid ? "bg-red-400" : "bg-green-200"
                      }`}
                    ></div>

                    <div className="relative z-10">
                      {/* Header: ID & Date */}
                      <div className="flex justify-between items-center mb-3 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-2 sm:p-3 neu-button rounded-xl sm:rounded-[15px] text-[#667eea]">
                            <Package size={16} className="sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest hidden sm:block">
                              Order Reference
                            </p>
                            <h3 className="text-sm sm:text-lg font-black text-neu-text flex items-center gap-1">
                              <span className="text-[#718096] sm:hidden">
                                #
                              </span>
                              <span className="sm:hidden">
                                {order._id?.toString().slice(-6).toUpperCase()}
                              </span>
                              <span className="hidden sm:inline">
                                #{order._id?.toString()}
                              </span>
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-right">
                          <div>
                            <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest hidden sm:block">
                              Ordered On
                            </p>
                            <p className="font-bold text-neu-text text-xs sm:text-base">
                              {order.createdAt
                                ? new Date(order.createdAt).toDateString() ===
                                  new Date().toDateString()
                                  ? new Date(
                                      order.createdAt,
                                    ).toLocaleTimeString("en-GB", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : new Date(
                                      order.createdAt,
                                    ).toLocaleDateString("en-GB")
                                : "N/A"}
                            </p>
                          </div>
                          <div className="p-2 sm:p-3 neu-button rounded-xl sm:rounded-[15px] text-[#718096] hidden sm:flex">
                            <Calendar size={20} />
                          </div>
                        </div>
                      </div>

                      {/* Items Grid View */}
                      {/* Mobile: 1 Row, Desktop: Grid */}
                      <div
                        className={`${expandedOrders.has(order._id?.toString() || "") ? "flex overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0" : "grid grid-cols-4"} gap-2 sm:gap-2 mb-3 sm:mb-8 hide-scrollbar`}
                      >
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className={`flex flex-col items-center justify-between p-1.5 sm:p-3 rounded-[15px] sm:rounded-[20px] neu-pressed relative group hover:bg-[#667eea]/5 transition-colors hide-scrollbar
                            ${!expandedOrders.has(order._id?.toString() || "") && i >= 3 ? "hidden sm:flex" : ""}
                            ${expandedOrders.has(order._id?.toString() || "") ? "min-w-21.5 sm:min-w-0" : ""}`}
                          >
                            <span className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[8px] sm:text-[10px] font-black text-white bg-[#667eea] px-1.5 py-0.5 rounded-full shadow-md z-10">
                              x{item.amount}
                            </span>

                            <div className="relative w-10 h-10 sm:w-16 sm:h-16 rounded-[10px] sm:rounded-[15px] overflow-hidden shadow-inner border-2 border-neu-base mb-1 sm:mb-3 mt-1">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 640px) 40px, 64px"
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>

                            <div className="text-center w-full">
                              <h4 className="text-neu-text font-bold text-[9px] sm:text-xs truncate w-full mb-0 sm:mb-1">
                                {item.name}
                              </h4>
                              <p className="text-[9px] sm:text-[10px] text-[#718096] font-bold">
                                ₹{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 &&
                          !expandedOrders.has(order._id?.toString() || "") && (
                            <button
                              onClick={() =>
                                toggleOrderExpansion(
                                  order._id?.toString() || "",
                                )
                              }
                              className="flex sm:hidden flex-col items-center justify-center p-1.5 rounded-[15px] neu-pressed bg-neu-base/50 aspect-square hover:bg-neu-base cursor-pointer"
                            >
                              <span className="text-xs font-bold text-gray-500">
                                +{order.items.length - 3}
                              </span>
                              <span className="text-[7px] font-bold text-[#667eea] uppercase">
                                View All
                              </span>
                            </button>
                          )}
                      </div>

                      <div className="hidden sm:block h-px w-full bg-linear-to-r from-transparent via-[#d1d9e6] to-transparent mb-8"></div>

                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center bg-transparent p-0 rounded-none sm:rounded-none">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div
                              className={`p-2 sm:p-4 rounded-xl sm:rounded-[20px] neu-button ${order.status === "Delivered" ? "text-green-500" : "text-orange-500"}`}
                            >
                              {order.status === "Delivered" ? (
                                <CheckCircle2
                                  size={16}
                                  className="sm:w-6 sm:h-6"
                                />
                              ) : (
                                <Truck size={16} className="sm:w-6 sm:h-6" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <p className="hidden sm:block text-xs font-bold text-[#718096] uppercase tracking-widest">
                                Current Status
                              </p>
                              <p className="font-black text-neu-text text-xs sm:text-sm uppercase tracking-wider">
                                {order.status}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-10">
                            <div className="text-right">
                              <p className="hidden sm:block text-xs font-bold text-[#718096] uppercase tracking-widest">
                                {/* Price Label logic */}
                                {order.isPaid === false ? (
                                  <span className="text-red-500">To Pay</span>
                                ) : (
                                  <span className="text-green-600">
                                    Total Paid
                                  </span>
                                )}
                              </p>
                              {order.isPaid === false ? (
                                <span className="block text-lg sm:text-3xl font-black text-red-500">
                                  ₹{order.totalAmount}
                                </span>
                              ) : (
                                <span className="block text-lg sm:text-3xl font-black text-green-600">
                                  ₹{order.totalAmount}
                                </span>
                              )}
                            </div>
                            {order.status === "Delivered" ? (
                              <Link
                                href={`/user/orders/${order._id}`}
                                className="neu-button p-2.5 sm:p-6 rounded-[15px] sm:rounded-[25px] text-[#667eea] hover:scale-110 active:scale-95 transition-all"
                              >
                                <ChevronRight
                                  size={18}
                                  className="sm:w-6 sm:h-6"
                                />
                              </Link>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        {order.assignedDeliveryBoy &&
                          order.status !== "Delivered" && (
                            <div className="w-full neu-button px-3 py-2 sm:pl-3 sm:pr-5 sm:py-3 rounded-xl sm:rounded-full flex items-center justify-between gap-3 hover:scale-[1.02] transition-transform cursor-default border border-transparent hover:border-blue-100/50 mt-1 sm:mt-0">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-linear-to-tr from-[#667eea] to-[#764ba2] flex items-center justify-center text-white shadow-[0_4px_10px_rgba(118,75,162,0.3)] shrink-0 relative">
                                  <Bike
                                    size={14}
                                    className="relative z-10 sm:w-4.5 sm:h-4.5"
                                  />
                                  <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-sm"></div>
                                </div>

                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase text-slate-400 sm:hidden">
                                      Driver:
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5 whitespace-nowrap hidden sm:block">
                                      Delivery Partner
                                    </span>
                                  </div>
                                  <span className="text-xs sm:text-sm font-black text-slate-700 truncate">
                                    {(order.assignedDeliveryBoy as any).name}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {order.status === "Out for Delivery" && (
                                  <Link
                                    href={`/user/track-order/${order._id?.toString()}`}
                                    className="hidden sm:flex px-3 py-1.5 rounded-full bg-blue-500 text-white text-[10px] sm:text-xs font-bold shadow-md hover:bg-blue-600 active:scale-95 transition-all items-center gap-1.5"
                                  >
                                    <MapPin
                                      size={12}
                                      className="sm:w-3.5 sm:h-3.5"
                                    />
                                    <span>Track Order</span>
                                  </Link>
                                )}
                                {order.status === "Out for Delivery" && (
                                  <Link
                                    href={`/user/track-order/${order._id}`}
                                    className="flex sm:hidden w-8 h-8 rounded-full bg-blue-500 text-white items-center justify-center shadow-md active:scale-95 transition-all"
                                    title="Track Order"
                                  >
                                    <MapPin size={14} />
                                  </Link>
                                )}
                                <div className="w-px h-6 bg-slate-300/50"></div>
                                <a
                                  href={`tel:${(order.assignedDeliveryBoy as any).mobile}`}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:shadow-emerald-200 active:scale-90 group/phone"
                                  title="Call Driver"
                                >
                                  <Phone
                                    size={14}
                                    className="fill-current group-hover/phone:animate-tada sm:w-4 sm:h-4"
                                  />
                                </a>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center bg-neu-base neu-flat rounded-[50px]"
                >
                  <div className="w-40 h-40 bg-neu-base neu-button rounded-full flex items-center justify-center mb-8 text-7xl">
                    🍽️
                  </div>
                  <h2 className="text-3xl font-black text-neu-text mb-3">
                    No orders found
                  </h2>
                  <p className="text-[#718096] max-w-xs mx-auto">
                    {
                      "Looks like you haven't ordered anything yet. Let's start a delicious journey!"
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const FloatingElement = ({
  icon,
  delay,
  top,
  left,
  right,
  bottom,
}: {
  icon: string;
  delay: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}) => (
  <motion.div
    animate={{ y: [-12, 12, -12] }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    style={{ top, left, right, bottom }}
    className="absolute w-16 h-16 bg-neu-base rounded-[22px] neu-flat flex items-center justify-center text-3xl z-10"
  >
    {icon}
  </motion.div>
);
