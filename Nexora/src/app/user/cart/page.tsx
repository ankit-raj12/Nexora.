"use client";
import {
  decreaseQuantity,
  deleteItem,
  increaseQuantity,
} from "@/redux/cart.slice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  CreditCard,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function CartPage() {
  const { cartData, deliveryFee, subTotal, totalAmount } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neu-base font-sans overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12 lg:py-20 flex flex-col lg:flex-row gap-8 lg:gap-20 sticky-container">
        {/* Left Column: Visuals & Header */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-5/12 lg:sticky lg:top-20 h-fit"
        >
          <button
            onClick={() => router.back()}
            className="neu-button w-fit px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-[20px] text-[#667eea] font-bold flex items-center gap-2 mb-4 sm:mb-8 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base sm:flex hidden">
              Back
            </span>
            <span className="sm:hidden flex">Back</span>
          </button>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-neu-text mb-3 sm:mb-6 leading-[1.1] drop-shadow-[4px_4px_8px_rgba(163,177,198,0.3)]">
            Your
            <br />
            <span className="bg-linear-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Kitchen
            </span>
          </h1>

          <p className="text-sm sm:text-xl text-[#718096] mb-6 sm:mb-12 leading-relaxed">
            Review your delicious picks before we bring them to your doorstep.
          </p>

          <div className="relative h-64 w-full hidden lg:block">
            <FloatingElement icon="🛒" delay={0} top="10%" left="10%" />
            <FloatingElement icon="🥗" delay={1.5} top="40%" right="20%" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-neu-base rounded-full neu-flat flex items-center justify-center text-6xl opacity-40">
              🧾
            </div>
          </div>
        </motion.div>

        {/* Right Column: Cart List & Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-7/12 flex flex-col gap-6 sm:gap-8 w-full"
        >
          {/* Cart Items List */}
          <div className="bg-neu-base neu-flat rounded-[25px] sm:rounded-[40px] p-5 sm:p-10 min-h-50 sm:min-h-100 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>

            <h2 className="text-xl sm:text-2xl font-black text-neu-text mb-5 sm:mb-8 relative z-10 flex items-center gap-3">
              <ShoppingBag className="text-[#667eea] w-5 h-5 sm:w-6 sm:h-6" />
              Cart Items{" "}
              <span className="text-base sm:text-lg font-bold text-gray-400">
                ({cartData.length})
              </span>
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 relative z-10">
              <AnimatePresence mode="popLayout">
                {cartData.length > 0 ? (
                  cartData.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item._id.toString()}
                      className="bg-neu-base neu-button p-3 sm:p-4 rounded-[20px] sm:rounded-[30px] flex flex-row items-center gap-3 sm:gap-6 group hover:shadow-inner transition-shadow justify-start"
                    >
                      <div className="relative w-16 h-16 sm:w-24 sm:h-24 shrink-0 rounded-[15px] sm:rounded-[20px] overflow-hidden bg-white/50">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="grow flex flex-col sm:block min-w-0">
                        <h3 className="text-sm sm:text-xl font-bold text-neu-text mb-0.5 sm:mb-1 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-start gap-2 mb-1 sm:mb-2">
                          <span className="text-[10px] sm:text-xs font-bold text-[#718096] bg-neu-base neu-flat px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                            {item.unit}
                          </span>
                        </div>
                        <p className="text-base sm:text-2xl font-black text-[#667eea]">
                          ₹{Number(item.price) * item.amount}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <div className="flex items-center justify-between gap-3 sm:gap-4 bg-neu-base neu-flat rounded-xl sm:rounded-[20px] p-1 sm:p-2">
                          <button
                            onClick={() => dispatch(increaseQuantity(item._id))}
                            className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-[15px] neu-button flex items-center justify-center text-[#718096] hover:text-[#667eea] transition-colors"
                          >
                            <Plus size={14} className="sm:hidden" />
                            <Plus size={16} className="hidden sm:block" />
                          </button>
                          <span className="w-fullmx-1 sm:w-8 text-center font-bold text-neu-text text-xs sm:text-lg order-2">
                            {item.amount}
                          </span>
                          <button
                            onClick={() => dispatch(decreaseQuantity(item._id))}
                            className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-[15px] neu-button flex items-center justify-center text-[#718096] hover:text-[#667eea] transition-colors order-3 sm:order-1"
                          >
                            <Minus size={14} className="sm:hidden" />
                            <Minus size={16} className="hidden sm:block" />
                          </button>
                        </div>

                        <button
                          onClick={() => dispatch(deleteItem(item._id))}
                          className="w-8 h-8 sm:w-12 sm:h-12 rounded-[10px] sm:rounded-[20px] neu-button text-red-300 hover:text-red-500 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={14} className="sm:hidden" />
                          <Trash2 size={20} className="hidden sm:block" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-2 flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-32 h-32 bg-neu-base neu-button rounded-full flex items-center justify-center mb-6 text-6xl text-gray-300">
                      🥦
                    </div>
                    <p className="text-2xl font-bold text-neu-text mb-2">
                      Your cart feels light
                    </p>
                    <p className="text-[#718096]">
                      Time to load it up with some goodness!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Summary Section */}
          {cartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-neu-base neu-flat rounded-[25px] sm:rounded-[40px] p-5 sm:p-10 relative overflow-hidden"
            >
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-black text-neu-text mb-5 sm:mb-8">
                  Order Summary
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-8">
                  <div className="flex justify-between items-center text-sm sm:text-lg text-[#718096]">
                    <span>Subtotal</span>
                    <span className="font-bold text-neu-text">₹{subTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-lg text-[#718096]">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="sm:w-4.5 sm:h-4.5" /> Delivery
                    </div>
                    <span className="font-bold text-neu-text">
                      ₹{deliveryFee}
                    </span>
                  </div>
                  <div className="h-px w-full bg-linear-to-r from-transparent via-[#d1d9e6] to-transparent my-3 sm:my-4"></div>
                  <div className="flex justify-between items-center text-xl sm:text-3xl font-black text-neu-text">
                    <span>Total</span>
                    <span className="text-[#667eea]">₹{totalAmount}</span>
                  </div>
                </div>

                <Link
                  href={"/user/checkout"}
                  className="w-full py-3 sm:py-5 rounded-[20px] sm:rounded-[25px] neu-button text-base sm:text-xl font-bold text-[#667eea] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <CreditCard size={20} className="sm:w-6 sm:h-6" />
                  Proceed to Checkout
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

const FloatingElement = ({
  icon,
  delay,
  top,
  left,
  right,
  bottom,
}: {
  icon: string;
  delay: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}) => (
  <motion.div
    animate={{ y: [-10, 10, -10] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    style={{ top, left, right, bottom }}
    className="absolute w-16 h-16 bg-neu-base rounded-[20px] neu-flat flex items-center justify-center text-3xl z-10"
  >
    {icon}
  </motion.div>
);
