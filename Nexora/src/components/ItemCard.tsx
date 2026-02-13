"use client";
import { ItemInterface } from "@/models/item.model";
import { motion } from "motion/react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cart.slice";

export default function ItemCard({ item }: { item: ItemInterface }) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((c) => c._id == item._id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group relative bg-neu-base neu-flat rounded-[20px] md:rounded-[30px] p-3 md:p-4 flex flex-col gap-3 md:gap-4 overflow-hidden h-full"
    >
      {/* Image Area with Inner Shadow */}
      <div className="relative w-full aspect-4/3 rounded-[15px] md:rounded-[20px] bg-neu-base neu-in-shadow flex items-center justify-center p-3 md:p-6 overflow-hidden">
        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover drop-shadow-xl rounded-lg"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        {/* Floating Category Tag */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-neu-base neu-flat text-[8px] md:text-[10px] font-bold text-gray-500 tracking-wider">
          {item.category}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-1 md:gap-2 grow">
        <div className="flex justify-between items-start">
          <h3
            className="font-bold text-sm md:text-lg text-neu-text line-clamp-2 leading-tight"
            title={item.name}
          >
            {item.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <span className="bg-neu-base neu-in-shadow px-2 py-1 rounded-lg text-[10px] md:text-xs">
            {item.amount} {item.unit}
          </span>
        </div>
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between mt-1 md:mt-2 pt-2 border-t border-gray-200/40">
        <div className="text-lg md:text-2xl font-black text-neu-text flex items-center gap-0.5">
          <span className="text-xs md:text-sm font-bold text-[#667eea] transform -translate-y-0.5 md:-translate-y-1">
            ₹
          </span>
          {item.price}
        </div>

        {!cartItem ? (
          <button
            className="neu-button h-8 w-8 md:h-10 md:w-auto md:px-4 rounded-xl flex items-center justify-center gap-2 text-neu-text hover:text-[#667eea] transition-all active:scale-95 group/btn cursor-pointer"
            onClick={() => dispatch(addToCart({ ...item, amount: 1 }))}
          >
            <div className="relative w-4 h-4 md:w-5 md:h-5">
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 absolute inset-0 transition-opacity duration-300 md:group-hover/btn:opacity-0" />
              <Plus className="w-4 h-4 md:w-5 md:h-5 absolute inset-0 opacity-0 transition-opacity duration-300 md:group-hover/btn:opacity-100 hidden md:block" />
            </div>
            <span className="hidden md:inline font-bold text-sm">Add</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center bg-neu-base neu-in-shadow rounded-xl p-1 h-8 md:h-10 gap-1"
          >
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => dispatch(decreaseQuantity(item._id))}
              className="neu-button h-6 w-6 md:h-8 md:w-8 rounded-lg flex items-center justify-center text-neu-text hover:text-red-500 transition-colors cursor-pointer"
            >
              <Minus className="w-3 h-3 md:w-4 md:h-4 font-bold stroke-3" />
            </motion.button>
            <motion.span
              key={cartItem.amount}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-5 md:w-8 text-center font-black text-sm md:text-base text-neu-text tabular-nums select-none"
            >
              {cartItem.amount}
            </motion.span>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => dispatch(increaseQuantity(item._id))}
              className="neu-button h-6 w-6 md:h-8 md:w-8 rounded-lg flex items-center justify-center text-neu-text hover:text-[#667eea] transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4 font-bold stroke-3" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
