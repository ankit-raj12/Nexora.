/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronRight,
  MapPin,
  CreditCard,
  Printer,
  Package,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowLeftFromLine,
  Bike,
  Phone,
  PhoneCall,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderInterface } from "@/models/order.model";
import Link from "next/link";
import Image from "next/image";
import { UserInterface } from "@/models/user.model";
import { getSocket } from "@/lib/socket";

type OrderStatus = "Recieved" | "Preparing" | "Out for Delivery" | "Delivered";

import { Toaster, toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-order", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });
    return () => socket.off("new-order");
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const handleAcceptOrder = (assignment: OrderInterface) => {
      setOrders((prev) =>
        prev.map((order) => (order._id == assignment._id ? assignment : order)),
      );
    };
    socket.on("accept-assignment", handleAcceptOrder);
    return () => {
      socket.off("accept-assignment", handleAcceptOrder);
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on("order-delivered", ({ orderStatus, orderId }) => {
      if (orderStatus === "Delivered")
        setOrders((prev) =>
          prev.map((o) =>
            o._id?.toString() === orderId
              ? { ...o, status: orderStatus, isPaid: true }
              : o,
          ),
        );
    });
  }, [selectedOrderId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/get-orders", { method: "GET" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
        if (!selectedOrderId && data.length > 0 && window.innerWidth >= 1024) {
          setSelectedOrderId(data[0]._id.toString());
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const selectedOrder: OrderInterface | undefined = useMemo(
    () => orders.find((o) => o._id?.toString() === selectedOrderId),
    [orders, selectedOrderId],
  );

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!selectedOrderId) return;
    setIsUpdating(true);

    const previousOrders = [...orders];

    try {
      setOrders((prev) =>
        prev.map((o) =>
          o._id?.toString() === selectedOrderId
            ? { ...o, status: newStatus }
            : o,
        ),
      );

      const res = await fetch("/api/admin/update-order-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrderId, status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }

    } catch (error: any) {
      console.log("Update failed", error);

      setOrders(previousOrders);
      toast.error(
        error.message || "Failed to update status. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-neu-base flex items-center justify-center text-neu-text">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full neu-flat flex items-center justify-center">
            <Package className="animate-spin text-slate-400" />
          </div>
          <p className="font-bold tracking-widest uppercase text-sm">
            Loading Orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neu-base text-neu-text flex flex-col font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <Toaster position="top-center" richColors />
      <header className="px-3 md:px-8 pt-4 pb-2 md:pt-6 md:pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href={"/"}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full neu-button flex items-center justify-center text-slate-500 hover:text-blue-600"
          >
            <ArrowLeftFromLine size={18} className="w-4 h-4 md:w-4.5 md:h-4.5" />
          </Link>
          <div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-black text-slate-700 tracking-tight">
              Manage Orders
            </h1>
            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">
              Admin Dashboard
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex grow flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 px-3 md:px-4 lg:px-8 pb-4 md:pb-8 overflow-hidden relative">
        {/* --- LEFT PANEL: Order Stream --- */}
        <aside
          className={`
            w-full lg:w-1/3 xl:w-1/4 flex-col h-full bg-neu-base
            ${selectedOrderId && isMobile ? "hidden" : "flex"}
          `}
        >
          <div className="neu-flat rounded-[20px] md:rounded-[30px] flex flex-col h-full overflow-hidden">
            {/* Filter Header */}
            <div className="p-4 md:p-6 border-b border-white/50 flex justify-between items-center shrink-0">
              <h2 className="font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-400">
                Stream ({filteredOrders.length})
              </h2>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as OrderStatus)
                  }
                  className="neu-input px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase cursor-pointer appearance-none pr-6 md:pr-8 text-blue-600 focus:text-blue-700"
                >
                  <option value="All">All Status</option>
                  <option value="Recieved">Recieved</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none rotate-90" />
              </div>
            </div>

            {/* List */}
            <div className="grow overflow-y-auto p-4 custom-scroll space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-50">
                  <Package size={48} className="mb-4 text-slate-300" />
                  <p className="text-sm font-bold">No orders found</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order?._id?.toString()}
                    onClick={() =>
                      setSelectedOrderId(order?._id?.toString() || null)
                    }
                    className={`p-4 md:p-5 rounded-[15px] md:rounded-[20px] flex items-center justify-between group cursor-pointer transition-all duration-200 border-l-4 relative overflow-hidden ${
                      selectedOrderId === order._id?.toString()
                        ? "neu-active border-blue-500"
                        : "neu-button border-transparent hover:border-slate-300"
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${order.status === "Delivered" ? "bg-green-500" : "bg-blue-500"}`}
                        ></span>
                        <p
                          className={`font-mono text-[10px] font-bold tracking-wider ${selectedOrderId === order._id?.toString() ? "text-blue-600" : "text-slate-400"}`}
                        >
                          #{order._id?.toString().slice(-6)}
                        </p>
                      </div>
                      <h3 className="font-bold text-slate-700 text-xs md:text-sm mb-0.5 md:mb-1 leading-tight">
                        {/* Note: Ensure user object is populated */}
                        {(order.user as UserInterface)?.name || "New User"}
                      </h3>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                        {order.items.length} Items • ₹{order.totalAmount}
                      </p>
                    </div>
                    {/* Status Icon */}
                    <div className="text-slate-300 group-hover:text-blue-400 transition-colors">
                      {order.status === "Delivered" ? (
                        <CheckCircle size={18} className="w-4.5 h-4.5 md:w-5 md:h-5" />
                      ) : (
                        <Clock size={18} className="w-4.5 h-4.5 md:w-5 md:h-5" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* --- RIGHT PANEL: Inspector Deck --- */}
        <main
          className={`
            w-full lg:w-2/3 xl:w-3/4 h-full
            ${!selectedOrderId && isMobile ? "hidden" : "block"}
          `}
        >
          {selectedOrder ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedOrder._id?.toString()}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="neu-flat rounded-[30px] lg:rounded-[40px] h-full p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden"
              >
                {/* Mobile Back Button */}
                <div className="lg:hidden mb-4 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="w-8 h-8 md:w-10 md:h-10 neu-button rounded-full flex items-center justify-center text-slate-500 active:scale-95 transition-transform"
                  >
                    <ArrowLeft size={18} className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Back to Stream
                  </span>
                </div>

                {/* Detail Header */}
                <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4 md:gap-6 mb-4 md:mb-6 lg:mb-8 shrink-0 relative z-10">
                  <div className="flex gap-4 lg:gap-6 items-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 neu-button rounded-[15px] md:rounded-[20px] lg:rounded-3xl flex items-center justify-center text-xl md:text-2xl lg:text-3xl text-slate-600 shrink-0">
                      🍔
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800 tracking-tighter mb-1 line-clamp-1 break-all">
                        {(selectedOrder.user as UserInterface)?.name || "Guest"}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                        <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-md bg-slate-200/50 text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                          {selectedOrder.status}
                        </span>
                        <p className="font-mono text-slate-400 text-[9px] md:text-[10px] lg:text-xs font-bold tracking-tight break-all">
                          ID: {selectedOrder._id?.toString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.status !== "Delivered" ? (
                    <div className="flex flex-col items-start xl:items-end gap-1.5 md:gap-2 w-full xl:w-auto">
                      <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 lg:ml-0">
                        Update Status
                      </label>
                      <div className="flex p-1 neu-input rounded-xl w-full xl:w-auto overflow-x-auto">
                        {(
                          [
                            "Recieved",
                            "Preparing",
                            "Out for Delivery",
                          ] as OrderStatus[]
                        ).map((s) => (
                          <button
                            key={s}
                            disabled={isUpdating}
                            onClick={() => handleStatusUpdate(s)}
                            className={`px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase transition-all whitespace-nowrap flex-1 xl:flex-none ${
                              selectedOrder.status === s
                                ? "neu-active text-blue-600"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            {s === "Out for Delivery" ? "Shipped" : s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* Scrollable Content */}
                <div className="grow grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 overflow-y-auto custom-scroll pr-2 relative z-10 pb-4 mt-2 md:mt-3">
                  {/* Items List (Wide) */}
                  <div className="col-span-1 xl:col-span-2 space-y-4">
                    <div className="neu-input rounded-[20px] md:rounded-3xl p-4 lg:p-6">
                      <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mb-3 md:mb-4 lg:mb-6">
                        Order Items
                      </h3>
                      <div className="space-y-3 md:space-y-4">
                        {selectedOrder.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-white/30 transition-colors border-b border-transparent hover:border-slate-200"
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-200 overflow-hidden shadow-inner relative shrink-0">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    fill
                                    alt={item.name}
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-slate-300" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-700 text-xs md:text-sm truncate">
                                  {item.name}
                                </p>
                                <p className="text-[10px] md:text-xs text-slate-400 font-mono">
                                  Qty: {item.amount}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-slate-700 text-sm md:text-base">
                                ₹{Number(item.price) * item.amount}
                              </p>
                              <p className="text-[9px] md:text-[10px] text-slate-400">
                                ₹{item.price} ea
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-300/40 flex justify-between items-end">
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">
                          Total Amount
                        </p>
                        <p className="text-xl md:text-2xl font-black text-slate-800">
                          ₹{selectedOrder.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Column (Narrow) */}
                  <div className="col-span-1 flex flex-col gap-4 md:gap-6">
                    {/* Delivery Partner Card */}
                    {selectedOrder.assignedDeliveryBoy && (
                      <div className="neu-button rounded-[20px] md:rounded-3xl p-4 md:p-6 flex flex-col gap-3 md:gap-4 relative overflow-hidden">
                        <div className="flex items-center gap-2 md:gap-3 text-slate-500">
                          <Bike size={18} className="w-4 h-4 md:w-4.5 md:h-4.5" />
                          <h4 className="font-black text-[10px] md:text-xs uppercase tracking-widest">
                            Delivery Partner
                          </h4>
                        </div>

                        <div className="flex items-center justify-between gap-3 md:gap-4">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-700 text-base md:text-lg truncate">
                              {(selectedOrder.assignedDeliveryBoy as any).name}
                            </p>
                            <a
                              href={`tel:${(selectedOrder.assignedDeliveryBoy as any).mobile}`}
                              className="mt-1 flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors"
                            >
                              <Phone size={14} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              {
                                (selectedOrder.assignedDeliveryBoy as any)
                                  .mobile
                              }
                            </a>
                          </div>
                          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl neu-flat flex items-center justify-center text-slate-500 shrink-0">
                            <a
                              href={`tel:${(selectedOrder.assignedDeliveryBoy as any).mobile}`}
                            >
                              <PhoneCall
                                size={18}
                                className="w-4 h-4 md:w-5 md:h-5 hover:text-blue-500 sm:text-neu-text text-blue-500"
                              />{" "}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    <div className="neu-button rounded-[20px] md:rounded-3xl p-4 md:p-6 flex flex-col gap-3 md:gap-4 cursor-default text-left">
                      <div className="flex items-center gap-2 md:gap-3 text-blue-500">
                        <MapPin size={18} className="w-4 h-4 md:w-4.5 md:h-4.5" />
                        <h4 className="font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-500">
                          Delivery Address
                        </h4>
                      </div>
                      <div className="pl-1 text-wrap wrap-break-word">
                        <p className="font-bold text-slate-700 text-xs md:text-sm mb-1">
                          {selectedOrder.address.name}
                        </p>
                        <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                          {selectedOrder.address.fullAddress}
                          <br />
                          {selectedOrder.address.city},{" "}
                          {selectedOrder.address.pincode}
                        </p>
                        <p className="text-[10px] md:text-xs font-mono text-slate-400 mt-2">
                          Phone: {selectedOrder.address.mobile}
                        </p>
                      </div>
                      {/* Map placeholder */}
                    </div>

                    {/* Payment */}
                    <div className="neu-button rounded-[20px] md:rounded-3xl p-4 md:p-6 flex flex-col gap-3 md:gap-4 cursor-default text-left">
                      <div className="flex items-center gap-2 md:gap-3 text-green-600">
                        <CreditCard size={18} className="w-4 h-4 md:w-4.5 md:h-4.5" />
                        <h4 className="font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-500">
                          Payment Info
                        </h4>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] md:text-xs font-bold text-slate-500">
                            Method
                          </span>
                          <span className="text-[10px] md:text-xs font-black text-slate-700">
                            {selectedOrder.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] md:text-xs font-bold text-slate-500">
                            Status
                          </span>
                          <span
                            className={`text-[9px] md:text-[10px] uppercase font-bold px-2 py-1 rounded-md ${selectedOrder.isPaid ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"}`}
                          >
                            {selectedOrder.paymentMethod === "COD"
                              ? selectedOrder.isPaid
                                ? "Paid(COD)"
                                : "Pending (COD)"
                              : "Paid"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-full h-full neu-flat rounded-[40px] flex flex-col items-center justify-center text-slate-400 py-15">
              <Package size={64} className="mb-4 opacity-50" />
              <h2 className="text-xl font-black uppercase tracking-widest opacity-50">
                No Order Selected
              </h2>
              <p className="text-sm font-bold opacity-40">
                Select an order from the stream to inspect
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
