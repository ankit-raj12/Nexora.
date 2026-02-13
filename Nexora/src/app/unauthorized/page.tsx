
"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { ShieldAlert, Home } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-neu-base flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="neu-flat p-10 rounded-[30px] max-w-md w-full text-center flex flex-col items-center"
      >
        <motion.div 
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="w-24 h-24 mb-6 text-red-500 rounded-full flex items-center justify-center shadow-[inset_6px_6px_12px_rgba(163,177,198,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] bg-neu-base"
        >
            <ShieldAlert size={40} className="drop-shadow-sm" />
        </motion.div>
        
        <h1 className="text-3xl font-black text-neu-text mb-4 tracking-tight">
          Access Denied
        </h1>
        
        <p className="text-[#718096] mb-8 leading-relaxed">
          {"You don't have permission to access this page. Please contact your administrator if you believe this is a mistake."}
        </p>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neu-button px-8 py-4 rounded-[15px] flex items-center gap-2 text-[#667eea] font-bold cursor-pointer"
          >
            <Home size={20} />
            Return Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

export default Unauthorized