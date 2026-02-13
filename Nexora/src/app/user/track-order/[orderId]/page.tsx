"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { ChevronLeft, Phone, User, MapPin, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { LocationType } from "@/components/DeliveryBoyHome";
import { RootState } from "@/redux/store";
import { UserInterface } from "@/models/user.model";
import { getSocket } from "@/lib/socket";
import DeliveryChat from "@/components/DeliveryChat";

// Dynamic import for Map to avoid SSR issues
const LiveMapTrack = dynamic(() => import("@/components/LiveMapTrack"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#e0e5ec] rounded-[40px]">
      <div className="animate-pulse text-[#667eea] font-bold text-xs md:text-base">
        Loading...
      </div>
    </div>
  ),
});

type OrderStatus = "Recieved" | "Preparing" | "Out for Delivery" | "Delivered";

interface OrderInterface {
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
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function TrackOrder() {
  const router = useRouter();
  const { orderId } = useParams();
  const { userData } = useSelector((state: RootState) => state.user);

  const [order, setOrder] = useState<OrderInterface>();
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<LocationType>({
    latitude: 0,
    longitude: 0,
  });
  const [userLocation, setUserLocation] = useState<LocationType>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await fetch(
          `/api/user/get-orders/${orderId?.toString()}`,
          {
            method: "GET",
          },
        );
        if (response.ok) {
          const order = await response.json();
          setOrder(order);
          if (order.address) {
            setUserLocation({
              latitude: Number(order.address.latitude),
              longitude: Number(order.address.longitude),
            });
          }
          if (order.assignedDeliveryBoy?.location?.coordinates) {
            setDeliveryBoyLocation({
              latitude: order.assignedDeliveryBoy.location.coordinates[1],
              longitude: order.assignedDeliveryBoy.location.coordinates[0],
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (orderId) {
      getOrder();
    }
  }, [orderId, userData?._id]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("update-delivery-location", ({ userId, location }) => {
      if (userId.toString() === order?.assignedDeliveryBoy?._id?.toString())
        setDeliveryBoyLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        });
    });
    return () => {
      socket.off("update-delivery-location");
    };
  }, [order?.assignedDeliveryBoy?._id]);

  useEffect(() => {
    const socket = getSocket();
    const handleDeliveryUpdate = ({
      orderStatus,
    }: {
      orderStatus: OrderStatus;
    }) => {
      setOrder((prev) => (prev ? { ...prev, status: orderStatus } : prev));
    };

    socket.on("order-delivered", handleDeliveryUpdate);

    return () => {
      socket.off("order-delivered", handleDeliveryUpdate);
    };
  }, []);

  useEffect(() => {
    if (order?.status === "Delivered") {
      router.push(`/user/orders/${orderId}`);
    }
  }, [order?.status, router, orderId]);

  if (order?.status === "Delivered")
    return (
      <div className="min-h-screen bg-neu-base flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 rounded-full neu-flat"
        >
          <Loader2 className="animate-spin text-[#667eea]" size={40} />
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-[#4a5568] font-sans p-4 md:p-10 overflow-x-hidden">
      <div className="max-w-300 mx-auto flex flex-col gap-6 md:gap-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 md:w-12.5 md:h-12.5 rounded-xl md:rounded-[15px] bg-[#e0e5ec] shadow-[5px_5px_10px_rgba(163,177,198,0.7),-5px_-5px_10px_rgba(255,255,255,0.8)] flex items-center justify-center text-[#667eea] transition-all active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.7),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]"
          >
            <ChevronLeft size={20} strokeWidth={3} className="md:w-6 md:h-6" />
          </button>

          <div className="px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-[15px] bg-[#e0e5ec] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.7),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] text-[10px] sm:text-xs font-black uppercase tracking-[1px] md:tracking-[2px] text-[#4a5568]">
            TRACKING{" "}
            <span className="text-[#667eea]">
              #{orderId?.toString().slice(-6).toUpperCase() || "..."}
            </span>
          </div>
        </nav>

        {/* Title Group */}
        <div className="text-center mb-0 md:mb-2">
          <h1 className="text-2xl md:text-5xl font-bold uppercase tracking-tighter text-[#4a5568] font-[Space_Grotesk]">
            Map <span className="text-[#667eea]">Terminal</span>
          </h1>
        </div>

        {/* Map Wrapper */}
        <div className="w-full h-87.5 md:h-112.5 rounded-[30px] md:rounded-12.5 bg-[#e0e5ec] shadow-[8px_8px_16px_rgba(163,177,198,0.7),-8px_-8px_16px_rgba(255,255,255,0.8)] p-4 md:p-5 relative overflow-hidden">
          {/* Inner Inset Container for Map */}
          <div className="w-full h-full rounded-[25px] md:rounded-[40px] overflow-hidden bg-[#e0e5ec] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.7),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] relative z-0">
            <LiveMapTrack
              userLocation={
                userLocation.latitude
                  ? userLocation
                  : { latitude: 28.6139, longitude: 77.209 }
              }
              deliveryBoyLocation={
                deliveryBoyLocation.latitude
                  ? deliveryBoyLocation
                  : { latitude: 28.6239, longitude: 77.219 }
              }
            />
          </div>
        </div>

        {/* Info Cards (Wings) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Driver Card */}
          <div className="bg-[#e0e5ec] shadow-[8px_8px_16px_rgba(163,177,198,0.7),-8px_-8px_16px_rgba(255,255,255,0.8)] p-5 md:p-6 rounded-[25px] md:rounded-[35px] flex items-center gap-4 md:gap-5 justify-between">
            <div className="w-12.5 h-12.5 md:w-15 md:h-15 rounded-[15px] md:rounded-[20px] bg-[#e0e5ec] shadow-[inset_5px_5px_10px_rgba(163,177,198,0.7),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] flex items-center justify-center text-[#4a5568]">
              <User size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#2d3748] text-base md:text-lg">
                {order?.assignedDeliveryBoy?.name || "Order Unassigned"}
              </h4>
              <p className="text-[10px] md:text-xs font-semibold text-[#a0aec0]">
                Phone: {order?.assignedDeliveryBoy?.mobile || "..."}
              </p>
            </div>

            <a
              href={`tel:${order?.assignedDeliveryBoy?.mobile}`}
              className="w-10 h-10 md:w-12.5 md:h-12.5 rounded-xl md:rounded-[15px] bg-[#e0e5ec] shadow-[5px_5px_10px_rgba(163,177,198,0.7),-5px_-5px_10px_rgba(255,255,255,0.8)] flex items-center justify-center text-[#48bb78] transition-all active:shadow-[inset_3px_3px_6px_rgba(163,177,198,0.7),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]"
            >
              <Phone size={18} className="md:w-5 md:h-5" />
            </a>
          </div>

          {/* Location Card */}
          <div className="bg-[#e0e5ec] shadow-[8px_8px_16px_rgba(163,177,198,0.7),-8px_-8px_16px_rgba(255,255,255,0.8)] p-5 md:p-6 rounded-[25px] md:rounded-[35px] flex items-center gap-4 md:gap-5">
            <div className="w-12.5 h-12.5 md:w-15 md:h-15 rounded-[15px] md:rounded-[20px] bg-[#e0e5ec] shadow-[inset_5px_5px_10px_rgba(163,177,198,0.7),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] flex items-center justify-center text-[#f6ad55]">
              <MapPin size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#2d3748] text-base md:text-lg">
                Delivery Status
              </h4>
              <p className="text-[10px] md:text-xs font-semibold text-[#a0aec0]">
                {order?.status || "Processing..."}
              </p>
            </div>
          </div>
        </div>

        {/* Items & Chat Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-0 md:mt-2">
          {/* Item Summary */}
          <div className="bg-[#e0e5ec] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.7),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] p-6 md:p-8 rounded-[30px] md:rounded-[40px]">
            <h3 className="font-black text-[10px] md:text-xs text-[#4a5568] uppercase mb-4 md:mb-5 tracking-widest">
              Item Summary
            </h3>
            <div className="flex flex-col gap-3 md:gap-4">
              {order?.items?.map((item, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between font-bold text-xs md:text-sm text-[#2d3748]"
                >
                  <span>
                    {item.name} x{item.amount}
                  </span>
                  <span className="text-[#667eea]">
                    ₹{Number(item.price) * item.amount}
                  </span>
                </div>
              )) || <p className="text-xs text-gray-500">Loading items...</p>}
              <div className="mt-2 pt-3 border-t border-[#cbd5e0]/50 flex justify-between font-black text-sm md:text-base text-[#2d3748]">
                <span>Total Amount</span>
                <span className="text-[#667eea] text-base md:text-lg">
                  ₹{order?.totalAmount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Chat Section - UPDATED */}
          <DeliveryChat
            orderId={orderId?.toString() as string}
            userId={userData?._id?.toString() as string}
          />
        </div>
      </div>
    </div>
  );
}
