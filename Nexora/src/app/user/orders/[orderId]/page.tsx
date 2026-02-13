"use client";
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  ShieldCheck,
  Download,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { UserInterface } from "@/models/user.model";

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
  assignment?: {
    _id: string;
    order: string;
    brodcastedTo: string[] | null;
    assignedTo: string | null;
    status: "Brodcasted" | "Assigned" | "Completed";
    acceptedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };
  isPaid: boolean;
  status: "Recieved" | "Preparing" | "Out for Delivery" | "Delivered";
  deliveryOTP: string | null;
  deliveryOTPVerification: boolean;
  deliverdAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// {
//     "address": {
//         "name": "Ankit Raj",
//         "city": "Kolkata",
//         "state": "West Bengal",
//         "pincode": "700100",
//         "fullAddress": "Kolkata, Kolkata Metropolitan Area, Kolkata, West Bengal, 700100, India",
//         "mobile": "7654954462",
//         "latitude": "22.526185737385475",
//         "longitude": "88.41628879121473"
//     },
//     "_id": "6981f115be5bd967e32b6ab6",
//     "user": "6981883210dc716332484590",
//     "items": [
//         {
//             "item": "6978f5d69d9d982218e6853d",
//             "name": "Vooki Handwash",
//             "price": "549",
//             "unit": "piece",
//             "image": "https://res.cloudinary.com/itsankitraj/image/upload/v1769534934/ae4cwo1cjo8vrwy8q4r3.webp",
//             "amount": 1,
//             "_id": "6981f115be5bd967e32b6ab7"
//         }
//     ],
//     "isPaid": true,
//     "status": "Delivered",
//     "paymentMethod": "COD",
//     "totalAmount": 549,
//     "deliveryOTP": "2996",
//     "deliveryOTPVerification": true,
//     "createdAt": "2026-02-03T12:59:01.823Z",
//     "updatedAt": "2026-02-03T13:00:13.713Z",
//     "__v": 0,
//     "assignment": "6981f11dbe5bd967e32b6ae9",
//     "assignedDeliveryBoy": null,
//     "deliverdAt": "2026-02-03T13:00:13.713Z"
// }

export default function DeliveredOrderDetail() {
  const { orderId } = useParams();
  const [deliveredOrder, setDeliveredOrder] = useState<OrderInterface>();
  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "GET",
        });
        if (response.ok) {
          const result = await response.json();
          setDeliveredOrder(result);
        } 
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-neu-base font-sans p-3 sm:p-6 pb-20 overflow-x-hidden">
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        {/* --- NAVIGATION HEADER --- */}
        <div className="flex justify-between items-center">
          <Link
            href="/user/my-order"
            className="neu-button p-2.5 rounded-xl text-[#667eea] hover:scale-105 transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="neu-inset px-3 py-2 rounded-xl border border-green-500/20">
            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              Order Completed
            </span>
          </div>
        </div>

        {/* --- HERO: CELEBRATORY BANNER --- */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="neu-flat rounded-3xl p-6 text-center relative overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-16 h-16 bg-neu-base neu-button rounded-full mx-auto mb-4 flex items-center justify-center text-green-500"
          >
            <CheckCircle2 size={32} />
          </motion.div>
          <h1 className="text-2xl font-black text-neu-text tracking-tight mb-1">
            Enjoy your meal!
          </h1>
          <p className="text-xs font-bold text-slate-500">
            Delivered successfully at{" "}
            {deliveredOrder?.deliverdAt
              ? new Date(deliveredOrder.deliverdAt).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )
              : "Loading..."}
          </p>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* --- LEFT: MAIN LOGS --- */}
          <div className="lg:col-span-2 space-y-5">
            {/* Inventory Card */}
            <motion.section
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="neu-flat rounded-3xl p-5"
            >
              <h3 className="text-sm font-black mb-5 flex items-center gap-2">
                <Package size={16} className="text-[#667eea]" /> Verified
                Inventory
              </h3>

              <div className="space-y-3">
                {deliveredOrder?.items.map((item, i) => (
                  <div
                    key={i}
                    className="neu-inset p-3 rounded-xl flex items-center gap-3 group"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-inner border border-neu-base shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="grow">
                      <h4 className="font-bold text-slate-700 text-xs">
                        {item.name}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.unit} • Qty: {item.amount}
                      </p>
                    </div>
                    <p className="font-extrabold text-neu-text text-xs">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary Bar */}
              <div className="mt-5 pt-5 border-t border-slate-200 border-dashed flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    Payment: {deliveredOrder?.paymentMethod}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] font-black text-green-600">
                    <ShieldCheck size={12} /> VERIFIED
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Total
                  </p>
                  <h2 className="text-2xl font-black text-neu-text tracking-tight leading-none">
                    ₹{deliveredOrder?.totalAmount}
                  </h2>
                </div>
              </div>
            </motion.section>
          </div>

          {/* --- RIGHT: LOGISTICS & METADATA --- */}
          <div className="space-y-5">
            {/* Delivered To */}
            <motion.section
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="neu-flat rounded-3xl p-5"
            >
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Delivered To
              </p>
              <div className="neu-inset p-4 rounded-xl">
                <h4 className="font-bold text-slate-800 text-xs mb-1">
                  {deliveredOrder?.address.name}
                </h4>
                <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">
                  {deliveredOrder?.address.fullAddress},{" "}
                  {deliveredOrder?.address.city}
                </p>
              </div>
            </motion.section>


            {/* Final Actions */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="neu-flat rounded-3xl p-5 space-y-3"
            >
              <div className="flex justify-between items-center text-[10px] font-bold px-1">
                <span className="text-slate-400 uppercase">Order ID</span>
                <span className="text-slate-700 font-mono">
                  #{deliveredOrder?._id!.toString().slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold px-1">
                <span className="text-slate-400 uppercase">Time Taken</span>
                <span className="text-slate-700">
                  {deliveredOrder?.assignment?.acceptedAt &&
                  deliveredOrder?.deliverdAt
                    ? `${Math.floor(
                        (new Date(deliveredOrder.deliverdAt).getTime() -
                          new Date(
                            deliveredOrder.assignment.acceptedAt,
                          ).getTime()) /
                          60000,
                      )} Mins`
                    : "Calculating..."}
                </span>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
