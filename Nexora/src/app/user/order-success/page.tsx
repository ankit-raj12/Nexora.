/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { Check, Loader2, Receipt, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Link from "next/link";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const hasOrdered = sessionStorage.getItem("order_success");

    if (!hasOrdered) {
      router.replace("/");
    } else {
      setIsAuthorized(true);
      setTimeout(() => {
        sessionStorage.removeItem("order_success");
        setIsAuthorized(false);
        router.replace("/user/my-order");
      }, 2000);
    }
  }, [router, isAuthorized]);

  if (!isAuthorized) {
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
  }

  return (
    <div className="min-h-screen bg-neu-base pt-32 pb-24 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="neu-flat rounded-[50px] p-8 md:p-12 max-w-xl w-full text-center relative overflow-hidden flex flex-col items-center"
      >
        {/* Success Icon Container */}
        <div className="w-32 h-32 rounded-full neu-pressed flex items-center justify-center mb-8 relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="w-20 h-20 bg-[#667eea] rounded-full flex items-center justify-center shadow-lg shadow-[#667eea]/40 z-10"
          >
            <Check className="text-white" size={40} strokeWidth={4} />
          </motion.div>

          {/* Animated Circles */}
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-20 h-20 rounded-full border-2 border-[#667eea]"
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-black text-neu-text mb-4"
        >
          Order Successful!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 font-medium text-lg mb-10 max-w-sm mx-auto"
        >
          Your order has been placed successfully. You can track your delivery
          in the orders section.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
        >
          <Link href="/user/order" className="w-full">
            <button className="neu-button w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-gray-600 font-bold hover:text-[#667eea] transition-colors group">
              <Receipt
                className="group-hover:scale-110 transition-transform"
                size={20}
              />
              View Order
            </button>
          </Link>

          <Link href="/" className="w-full">
            <button className="neu-button w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[#667eea] font-black group">
              <ShoppingBag
                className="group-hover:scale-110 transition-transform"
                size={20}
              />
              Continue Shopping
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
