"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { DeliveryAssignmentInterface } from "@/models/deliveryAssignment.model";
import { RootState } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  Navigation,
  Package,
  Target,
  XCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import DeliveryTrackingPage from "./DeliveryTrackingPage";
import { UserInterface } from "@/models/user.model";
import Footer from "./Footer";

export interface LocationType {
  latitude: number;
  longitude: number;
}

export interface OrderInterface {
  _id?: string;
  user: UserInterface;
  items: [
    {
      item: string;
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
  assignedDeliveryBoy?: UserInterface;
  assignment?: string | null;
  isPaid: boolean;
  status: "Recieved" | "Preparing" | "Out for Delivery" | "Delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

export default function DeliveryBoyHome({
  todayOrderData,
}: {
  todayOrderData: { todayEarning: number; todayOrders: number };
}) {
  const [assignments, setAssignments] = useState<DeliveryAssignmentInterface[]>(
    [],
  );
  const user = useSelector((state: RootState) => state.user.userData);
  const [activeOrder, setActiveOrder] = useState<OrderInterface | null>(null);
  const [userLocation, setuserLocation] = useState<LocationType | null>(null);
  const [todayTotalEarning] = useState(todayOrderData.todayEarning);
  const [ordersCount] = useState(todayOrderData.todayOrders);

  useEffect(() => {
    const socket = getSocket();
    if (user && user._id) socket.emit("identity", user._id);
  }, [user]);

  useEffect(() => {
    const getAssignments = async () => {
      try {
        const result = await fetch("/api/delivery/get-assignments", {
          method: "GET",
        }).then((res) => res.json());
        if (Array.isArray(result)) setAssignments(result);
      } catch (error) {
        console.log(error);
      }
    };
    getAssignments();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on("new-assignment", ({ deliveryAssignment }) => {
      setAssignments((prev) => [deliveryAssignment, ...prev]);
    });
    return () => {
      socket.off("new-assignment");
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on("reject-assignment", (assignment) => {
      setAssignments((prev) =>
        prev.filter(
          (assign) => assign._id.toString() != assignment._id.toString(),
        ),
      );
    });
    return () => {
      socket.off("reject-assignment");
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const handleAcceptAssignment = (order: OrderInterface) => {

      setAssignments((prev) =>
        prev.filter((assign) => {
          const assignOrderId = (assign.order as unknown as OrderInterface)?._id || assign.order;
          return assignOrderId?.toString() !== order._id?.toString();
        })
      );

      if (user && order.assignedDeliveryBoy?._id === user._id) {
        setActiveOrder(order);
        setuserLocation({
          latitude: order.address.latitude as unknown as number,
          longitude: order.address.longitude as unknown as number,
        });
      }
    };

    socket.on("accept-assignment", handleAcceptAssignment);
    return () => {
      socket.off("accept-assignment", handleAcceptAssignment);
    };
  }, [user]);

  const handleAccept = async (id: string) => {
    try {
      const response = await fetch(
        `/api/delivery/assignment/${id}/accept-assignment`,
        {
          method: "POST",
        },
      );
      if (response.ok) {
        await response.json();
        setAssignments((prev) =>
          prev.filter((assignment) => assignment._id.toString() !== id),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/delivery/assignment/${id}/reject-assignment`, {
        method: "POST",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getCurrentOrder = async () => {
      const result = await fetch("/api/delivery/current-orders", {
        method: "GET",
      });
      if (result.ok) {
        const data = await result.json();
        setActiveOrder(data);
        setuserLocation({
          latitude: data.address.latitude as number,
          longitude: data.address.longitude as number,
        });
      }
    };
    getCurrentOrder();
  }, []);

  if (!activeOrder && assignments.length === 0) {
    return (
      <div className="min-h-screen bg-neu-base flex flex-col relative font-sans overflow-hidden selection:bg-[#667eea] selection:text-white">
        {/* Top Bar with User Info & Status */}
        <div className="px-6 py-6 md:px-8 md:py-8 flex justify-between items-center z-20 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full neu-button flex items-center justify-center overflow-hidden border-2 border-[#e0e5ec]">
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-lg">
                {user?.name?.[0] || "D"}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-700 text-sm md:text-base leading-none mb-1.5">
                Hi, {user?.name?.split(" ")[0] || "Driver"}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Online
                </span>
              </div>
            </div>
          </div>
          <div>
            <button className="neu-button w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#667eea] transition-all active:scale-95">
              <Target size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Main Reactor Display - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center relative mt-10 z-10 p-4">
          {/* The Reactor Ring */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Expanding Radar Rings Animation */}
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.6, scale: 0.8, borderWidth: "1px" }}
                animate={{
                  opacity: 0,
                  scale: 1.6,
                  borderWidth: "0px",
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.8,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border border-[#667eea] z-0"
              />
            ))}

            {/* Main Center Plate - Neumorphic extruded */}
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-full neu-flat flex flex-col items-center justify-center relative z-10 ">
              {/* Spinning decorative ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-dashed border-slate-300 opacity-30 pointer-events-none"
              />

              {/* Inner Dial - Neumorphic inset */}
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-neu-base neu-inset flex flex-col items-center justify-center relative overflow-hidden">
                {/* Crosshairs */}
                <div className="absolute top-4 bottom-4 w-px bg-linear-to-b from-transparent via-slate-300/30 to-transparent"></div>
                <div className="absolute left-4 right-4 h-px bg-linear-to-r from-transparent via-slate-300/30 to-transparent"></div>

                {/* Content */}
                <div className="text-center relative z-20 flex flex-col items-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">
                    Earnings
                  </p>
                  <div className="flex items-start justify-center text-slate-700 leading-none mb-4">
                    <span className="text-lg font-bold mt-1 opacity-50 mr-0.5">
                      ₹
                    </span>
                    <span className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-sm">
                      {todayTotalEarning}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[#667eea] bg-[#667eea]/5 py-1.5 px-4 rounded-full border border-[#667eea]/10 shadow-[0_2px_8px_rgba(102,126,234,0.1)]">
                    <Package size={14} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {ordersCount} Delivered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  } else if (
    activeOrder &&
    activeOrder?.status !== "Delivered" &&
    userLocation
  ) {
    return (
      <DeliveryTrackingPage
        activeOrder={activeOrder}
        userLocation={userLocation}
        setActiveOrder={setActiveOrder}
      />
    );
  } else {
    return (
      <div className="min-h-screen w-full bg-neu-base text-neu-text font-sans selection:bg-blue-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 lg:py-20">
          {/* Header Section */}
          <div className="mb-12 flex mt-20 flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-slate-700 tracking-tight mb-2"
              >
                Delivery <span className="text-[#667eea]">Assignments</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 font-bold uppercase tracking-widest text-xs md:text-sm"
              >
                Manage your incoming delivery requests
              </motion.p>
            </div>
          </div>

          {/* Assignments Grid */}
          <AnimatePresence mode="popLayout">
            {assignments.length === 0 && !activeOrder ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-20 neu-flat rounded-[40px] text-slate-400 gap-6"
              >
                <div className="w-24 h-24 neu-button rounded-full flex items-center justify-center text-slate-300">
                  <Navigation size={40} />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black uppercase tracking-widest mb-2">
                    No Active Assignments
                  </h3>
                  <p className="font-bold opacity-60">
                    Wait for new orders to be broadcasted to your location.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {assignments.map((assign, idx) => {
                  const order = assign.order as unknown as OrderInterface;
                  return (
                    <motion.div
                      layout
                      key={assign._id.toString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.1 }}
                      className="neu-flat rounded-[30px] p-6 flex flex-col relative group overflow-hidden border border-transparent hover:border-slate-200/50 transition-colors"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-[#667eea] group-hover:text-blue-600 transition-colors shadow-none">
                            <Package size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-slate-700 text-lg">
                                #
                                {order?._id?.toString().slice(-6).toUpperCase()}
                              </h3>
                              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {assign.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                              <Clock size={12} />{" "}
                              {new Date(assign.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="neu-button w-10 h-10 rounded-full flex items-center justify-center text-slate-400">
                          <IndianRupee size={16} />
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="space-y-4 mb-8">
                        {/* Address */}
                        <div className="neu-input p-4 rounded-2xl flex gap-3 items-start">
                          <MapPin
                            className="shrink-0 text-red-400 mt-0.5"
                            size={18}
                          />
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                              Delivery Location
                            </p>
                            <p className="text-sm font-bold text-slate-600 leading-snug">
                              {order?.address?.fullAddress ||
                                "Address details unavailable"}
                            </p>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="flex justify-between items-center px-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              Total Amount
                            </span>
                            <span className="text-xl font-black text-slate-700">
                              ₹{order?.totalAmount}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              Payment
                            </span>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-lg mt-1 ${order?.paymentMethod === "COD" ? "Online" : "bg-green-100 text-green-600"}`}
                            >
                              {order?.paymentMethod || "Online"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-4 pt-6 border-t border-slate-200/50">
                        <button
                          onClick={() => handleReject(assign._id.toString())}
                          className="flex-1 py-3 neu-button rounded-xl text-slate-500 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
                        >
                          <XCircle size={18} /> Reject
                        </button>
                        <button
                          onClick={() => handleAccept(assign._id.toString())}
                          className="flex-1 py-3 neu-button bg-[#667eea]/10 text-[#667eea] rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#667eea] hover:text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-indigo-200"
                        >
                          <CheckCircle2 size={18} /> Accept
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
        <Footer />
      </div>
    );
  }
}
