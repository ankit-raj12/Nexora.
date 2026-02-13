"use client";

import {
  Apple,
  Egg,
  Cookie,
  CupSoda,
  IceCream,
  Zap,
  Coffee,
  Croissant,
  Fish,
  Bath,
  Sparkles,
  Baby,
  HeartPulse,
  Dog,
  Pencil,
  ShoppingBag,
  Leaf,
  UtensilsCrossed,
  Home,
} from "lucide-react";
import { motion } from "motion/react"; 
import { useRouter } from "next/navigation";

const CategorySection = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconMap: Record<string, any> = {
    Apple,
    Egg,
    Cookie,
    CupSoda,
    IceCream,
    Zap,
    Coffee,
    Croissant,
    Fish,
    Bath,
    Sparkles,
    Baby,
    HeartPulse,
    Dog,
    Pencil,
  };
  const router = useRouter();

  const categoryGroups = [
    {
      title: "Fresh & Daily",
      icon: Leaf,
      description: "Farm fresh essentials delivered daily",
      color: "text-emerald-600",
      items: [
        { id: 1, name: "Fruits & Vegetables", icon: "Apple", color: "text-green-500" },
        { id: 2, name: "Dairy, Bread & Eggs", icon: "Egg", color: "text-yellow-500" },
        { id: 8, name: "Bakery & Biscuits", icon: "Croissant", color: "text-amber-600" },
        { id: 9, name: "Meat, Fish & Seafood", icon: "Fish", color: "text-red-500" },
      ],
    },
    {
      title: "Pantry & Treats",
      icon: UtensilsCrossed,
      description: "Snacks, drinks and instant cravings",
      color: "text-orange-500",
      items: [
        { id: 3, name: "Snacks & Munchies", icon: "Cookie", color: "text-orange-400" },
        { id: 4, name: "Cold Drinks & Juices", icon: "CupSoda", color: "text-blue-400" },
        { id: 5, name: "Ice Cream & Sweets", icon: "IceCream", color: "text-pink-400" },
        { id: 7, name: "Tea, Coffee & Breakfast", icon: "Coffee", color: "text-amber-700" },
        { id: 6, name: "Instant & Frozen Food", icon: "Zap", color: "text-purple-500" },
      ],
    },
    {
      title: "Home & Lifestyle",
      icon: Home,
      description: "Everything for your home and care",
      color: "text-blue-600",
      items: [
        { id: 11, name: "Cleaning Essentials", icon: "Sparkles", color: "text-teal-500" },
        { id: 10, name: "Bath & Body", icon: "Bath", color: "text-cyan-500" },
        { id: 12, name: "Baby Care", icon: "Baby", color: "text-indigo-400" },
        { id: 13, name: "Health & Wellness", icon: "HeartPulse", color: "text-rose-500" },
        { id: 14, name: "Pet Supplies", icon: "Dog", color: "text-orange-600" },
        { id: 15, name: "Stationery & Office", icon: "Pencil", color: "text-slate-500" },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const groupVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        duration: 0.8,
        bounce: 0.3,
      },
    },
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-neu-base neu-button flex items-center justify-center text-[#667eea]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-neu-text tracking-tight">
            Marketplace
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Explore our curated sections
          </p>
        </div>
      </div>

      {/* Control Panel Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {categoryGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <motion.div
              key={group.title}
              variants={groupVariants}
              className="flex flex-col h-full"
            >
              {/* Group Header */}
              <div className="flex items-center gap-3 mb-4 px-2">
                <GroupIcon className={`w-5 h-5 ${group.color}`} />
                <h3 className="text-lg font-bold text-neu-text">
                  {group.title}
                </h3>
              </div>

              {/* Group Container (Neumorphic Inset Panel) */}
              <div className="bg-neu-base rounded-[30px] p-2 grow border border-white/40 shadow-[inset_6px_6px_12px_rgba(163,177,198,0.3),inset_-6px_-6px_12px_rgba(255,255,255,0.8)]">
                  <div className="h-full w-full rounded-3xl p-4 flex flex-col gap-3">
                     
                     {/* Items Grid within Group */}
                     <div className="grid grid-cols-2 gap-3">
                        {group.items.map((item) => {
                           const IconComponent = iconMap[item.icon];
                           const isWide = group.items.length % 2 !== 0 && item.id === group.items[group.items.length-1].id;
                           
                           return (
                              <motion.div
                                 key={item.id}
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.96 }}
                                 className={`
                                    ${isWide ? 'col-span-2' : 'col-span-1'}
                                    neu-button rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer
                                    hover:text-[#667eea] transition-colors group relative overflow-hidden min-h-25 
                                 `}
                                onClick={() => router.push(`/user/categories/${item.name}`)}
                              >
                                

                                 <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center 
                                    bg-neu-base shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]
                                 `}>
                                    {IconComponent && (
                                       <IconComponent 
                                          className={`w-5 h-5 ${item.color}`} 
                                          strokeWidth={2.5}
                                       />
                                    )}
                                 </div>
                                 <span className="text-xs font-bold text-center text-neu-text z-10">
                                    {item.name}
                                 </span>
                              </motion.div>
                           )
                        })}
                     </div>
                  </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default CategorySection;
