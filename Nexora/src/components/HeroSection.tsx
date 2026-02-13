"use client";
import { motion } from "motion/react";

const HeroSection = () => {
  const scrollToItems = () => {
    const itemsSection = document.getElementById("items-section");
    if (itemsSection) {
      itemsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full mb-6 md:mb-10">
      <section className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-[32px] sm:text-[48px] lg:text-[72px] font-black text-neu-text mb-4 md:mb-7.5 leading-[1.1] drop-shadow-[4px_4px_8px_rgba(163,177,198,0.3)]">
            Lightning Fast
            <br />
            <span className="bg-linear-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Grocery
            </span>
            <br />
            Delivery
          </h1>
          <p className="text-sm sm:text-base md:text-[20px] text-[#718096] mb-6 md:mb-10 leading-relaxed">
            Get fresh groceries, snacks, and daily essentials delivered to your
            doorstep in just 10 minutes. Experience the future of shopping.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-5 mb-6 md:mb-12.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToItems}
              className="neu-button px-6 py-3 md:px-10 md:py-4.5 rounded-[20px] text-sm md:text-[18px] text-neu-text cursor-pointer"
            >
              Explore Menu
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-6.25">
            {[
              { label: "Fruits", value: "🍇" },
              { label: "Notebooks", value: "📓" },
              { label: "Drinks", value: "🍺" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="neu-flat p-3 md:p-7.5 rounded-2xl md:rounded-[25px] text-center"
              >
                <div className="text-2xl md:text-[36px] font-black text-[#667eea] mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-[14px] font-semibold text-[#718096]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hero Visual */}
        <div className="relative h-150 hidden lg:block">
          {/* Floating Cards */}
          <FloatingCard icon="🥬" delay={0} top="20px" right="50px" />
          <FloatingCard icon="🥤" delay={1} bottom="80px" left="0" />
          <FloatingCard icon="🍎" delay={2} top="180px" left="20px" />

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-87.5 bg-neu-base p-10 rounded-[40px] shadow-[20px_20px_40px_rgba(209,213,219,0.5),-20px_-20px_40px_#ffffff]"
          >
            <div className="w-full h-62.5 bg-neu-base rounded-[30px] mb-6.25 flex items-center justify-center text-[100px] shadow-[inset_10px_10px_20px_#d1d5db,inset_-10px_-10px_20px_#ffffff]">
              🛒
            </div>
            <div className="text-[24px] font-extrabold text-[#2d3748] mb-2.5">
              Fresh Groceries
            </div>
            <div className="text-[16px] text-[#718096]">
              Delivered in 10 minutes
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;

const FloatingCard = ({
  icon,
  delay,
  top,
  right,
  bottom,
  left,
}: {
  icon: string;
  delay: number;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}) => {
  return (
    <motion.div
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      style={{ top, right, bottom, left }}
      className="absolute w-25 h-25 bg-neu-base rounded-[25px] flex items-center justify-center text-[50px] neu-flat z-10"
    >
      {icon}
    </motion.div>
  );
};
