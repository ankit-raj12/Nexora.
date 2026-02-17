"use client";
import { motion } from "motion/react";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neu-base relative overflow-hidden py-4 md:py-8 px-4 md:px-8 border-t border-slate-200 shrink-0">
      

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative z-10">
        {/* Brand & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center md:text-left"
        >
          <h2 className="text-lg md:text-2xl font-black">
            <span className="bg-linear-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Nexora
            </span>
          </h2>
          <p className="text-gray-500 font-medium text-[10px] md:text-sm mt-0.5 md:mt-1">
            Lightning fast delivery. Fresh products.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-row gap-4 md:gap-8 items-center justify-center"
        >
          <a
            href="tel:+917654954462"
            className="flex items-center gap-2 text-gray-600 hover:text-[#667eea] transition-colors group"
          >
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full neu-button flex items-center justify-center text-gray-500 group-hover:text-[#667eea]">
              <Phone className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </div>
            <span className="text-xs md:text-sm font-bold opacity-80 group-hover:opacity-100">
              +91 7654954462
            </span>
          </a>

          <a
            href="mailto:heyitsankitraj@gmail.com"
            className="flex items-center gap-2 text-gray-600 hover:text-[#667eea] transition-colors group"
          >
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full neu-button flex items-center justify-center text-gray-500 group-hover:text-[#667eea]">
              <Mail className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </div>
            <span className="text-xs md:text-sm font-bold opacity-80 group-hover:opacity-100">
              heyitsankitraj@gmail.com
            </span>
          </a>
        </motion.div>
      </div>
      
      {/* Copyright */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-center mt-3 pt-3 md:mt-8 md:pt-6 border-t border-slate-200/50"
      >
        <p className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
          © {new Date().getFullYear()} Nexora. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
