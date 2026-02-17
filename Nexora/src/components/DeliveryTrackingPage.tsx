/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocationType, OrderInterface } from "./DeliveryBoyHome";
import { Phone, Send, Bike, BoxIcon, PhoneCall, Sparkles, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getSocket } from "@/lib/socket";
import dynamic from "next/dynamic";
import { MessageInterface } from "@/models/message.model";
import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const LiveMapTrack = dynamic(() => import("../components/LiveMapTrack"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="neu-button p-2 rounded-full mb-2">
        <BoxIcon className="animate-spin text-purple-300" size={35} />
      </div>
      <span className="text-gray-500 font-semibold">Loading Map...</span>
    </div>
  ),
});

export default function DeliveryTrackingPage({
  activeOrder,
  setActiveOrder,
}: {
  activeOrder: OrderInterface;
  userLocation: LocationType;
  setActiveOrder: (order: OrderInterface | null) => void;
}) {
  const { userData } = useSelector((state: RootState) => state.user);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<LocationType>({
    latitude: 0,
    longitude: 0,
  });
  const [userLocation, setUserLocation] = useState<LocationType>({
    latitude: 0,
    longitude: 0,
  });
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageInterface[] | []>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [OTP, setOTP] = useState("");
  const [OTPError, setOTPError] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [sendingOTP, setIsSendingOTP] = useState<boolean>(false);
  const [verifyingOTP, setIsVerifyingOTP] = useState<boolean>(false);
  const [IsOTPSent, setIsOTPSent] = useState<boolean>(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/chat/get-messages", {
          method: "POST",
          body: JSON.stringify({ orderId: activeOrder._id }),
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (activeOrder._id) fetchMessages();
  }, [activeOrder._id]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", activeOrder._id);

    const handleMessage = (message: any) => {
      if (message.orderId === activeOrder._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("send-message", handleMessage);
    return () => {
      socket.off("send-message", handleMessage);
    };
  }, [activeOrder._id]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setIsTyping(true);
    const socket = getSocket();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const messagePayload = {
      orderId: activeOrder._id,
      text: newMessage,
      senderId: userData?._id,
      time,
    };

    socket.emit("send-message", messagePayload);
    setNewMessage("");
    setTimeout(() => setIsTyping(false), 500);
  };

  useEffect(() => {
    const socket = getSocket();

    if (!userData?._id) return;
    if (!navigator.geolocation) return;
    socket.emit("identity", userData?._id);
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        socket.emit("update-location", {
          userId: userData?._id,
          latitude,
          longitude,
        });
        setDeliveryBoyLocation({ latitude, longitude });
        setUserLocation({
          latitude: Number(activeOrder.address.latitude),
          longitude: Number(activeOrder.address.longitude),
        });
      },
      (error) => console.log("Getting geoLocation Error ", error),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [
    userData?._id,
    activeOrder.address.latitude,
    activeOrder.address.longitude,
  ]);

  const generateSuggestion = async () => {
    if (isLoadingAI) return;

    const lastMessage = messages
      .filter((m) => m.senderId.toString() !== userData?._id!.toString())
      .at(-1);

    setIsLoadingAI(true);
    try {
      const response = await fetch("/api/chat/ai-suggestions", {
        method: "POST",
        body: JSON.stringify({
          message: lastMessage?.text,
          role: userData?.role,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const suggests =
          data?.candidates[0]?.content?.parts[0]?.text.split(",");
        setAISuggestions(suggests);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const hasSuggestions = aiSuggestions.length > 0 || isLoadingAI;

  const sendOTP = async () => {
    try {
      setIsSendingOTP(true);
      const response = await fetch("/api/delivery/otp/send", {
        method: "POST",
        body: JSON.stringify({ orderId: activeOrder._id }),
      });
      if (response.ok) {
        setIsOTPSent(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setIsVerifyingOTP(true);
      const response = await fetch("/api/delivery/otp/verify", {
        method: "POST",
        body: JSON.stringify({ orderId: activeOrder._id, OTP }),
      });
      if (response.ok) {
        setActiveOrder(null);
      } else {
        if (response.status === 400) {
          const result = await response.json();
          setOTPError(result.message);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] font-sans text-slate-700">
      {/* Main Container */}
      <div className="max-w-350 mx-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8 mt-25">
          {/* Map Section */}
          <div className="bg-[#e0e5ec] rounded-3xl md:rounded-[30px] p-5 md:p-7.5    shadow-[12px_12px_24px_rgba(163,177,198,0.6),-12px_-12px_24px_rgba(255,255,255,0.5)]">
            <div className="flex justify-between items-center mb-4 md:mb-5">
              <h2 className="text-lg md:text-2xl font-extrabold text-[#2d3748]">
                Live Tracking
              </h2>
              <button className="px-4 py-2 md:px-6 md:py-3 bg-[#e0e5ec] rounded-xl md:rounded-[15px] text-xs md:text-sm font-bold text-[#667eea] shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] transition-all flex items-center gap-2">
                <span>📍</span>{" "}
                <span className="hidden sm:inline">Navigate</span>
              </button>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-62.5 md:h-112.5 bg-[#e0e5ec] rounded-2xl md:rounded-[20px] shadow-[inset_8px_8px_16px_rgba(163,177,198,0.5),inset_-8px_-8px_16px_rgba(255,255,255,0.9)] relative overflow-hidden flex items-center justify-center">
              <LiveMapTrack
                userLocation={userLocation}
                deliveryBoyLocation={deliveryBoyLocation}
              />
            </div>
          </div>

          {/* Order Info Section - Separate Card below Map */}
          <div className="bg-[#e0e5ec] rounded-2xl md:rounded-[20px] p-5 md:p-6.25 shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)] mt-0">
            <div className="flex justify-between items-center mb-4 md:mb-5">
              <span className="text-base md:text-lg font-bold text-[#2d3748]">
                Order #{activeOrder._id!.toString().slice(-6).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between gap-3 md:gap-4 p-3 md:p-4 bg-[#e0e5ec] rounded-xl md:rounded-[15px] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] mb-4 md:mb-5">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12.5 md:h-12.5 bg-[#e0e5ec] rounded-full flex items-center justify-center text-xl md:text-2xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)] shrink-0 overflow-hidden relative">
                  {userData?.image ? (
                    <Image
                      src={userData?.image}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm md:text-base font-bold text-[#2d3748] truncate">
                    {activeOrder.user?.name || "Tracking..."}
                  </h4>
                  <p className="text-[10px] md:text-[13px] text-[#718096] flex items-center gap-1">
                    <PhoneCall size={10} className="md:w-3 md:h-3" /> Phone:{" "}
                    {activeOrder.user?.mobile}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${(activeOrder.assignedDeliveryBoy as any)?.mobile}`}
                className="w-10 h-10 md:w-12 md:h-12 bg-[#e0e5ec] rounded-full flex items-center justify-center text-[#10b981] shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] transition-all hover:scale-105"
                title="Call Driver"
              >
                <Phone size={18} className="md:w-5 md:h-5" />
              </a>
            </div>

            <div className="space-y-0 divide-y divide-[#a3b1c6]/30">
              {activeOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 md:py-3"
                >
                  <span className="text-xs md:text-sm font-semibold text-[#4a5568] truncate pr-4">
                    {item.name}
                  </span>
                  <span className="text-[10px] md:text-[13px] text-[#718096] shrink-0 font-bold">
                    x{item.amount}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 mt-1">
                <span className="text-sm md:text-base font-bold text-[#2d3748]">
                  Total Amount
                </span>
                <span className="text-base md:text-lg font-extrabold text-[#667eea]">
                  ₹{activeOrder.totalAmount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6 md:gap-8 lg:mt-25">
          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, height: hasSuggestions ? 600 : 500 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-[#e0e5ec] rounded-[30px] md:rounded-[40px] shadow-[10px_10px_20px_rgba(163,177,198,0.7),-10px_-10px_20px_rgba(255,255,255,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="px-5 py-4 md:px-6 md:py-5 border-b border-[#cbd5e0]/30"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl chat-icon-neu flex items-center justify-center text-[#667eea] mb-2"
                >
                  <MessageCircle size={18} className="md:w-5 md:h-5" />
                </motion.div>
                <div>
                  <h3 className="font-black text-xs md:text-sm text-[#2d3748] uppercase tracking-tight">
                    Chat with User
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-gray-500 font-semibold flex items-center gap-1.5 mt-0.5">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-green-400 rounded-full"
                    />
                    Active now
                  </p>
                </div>
              </div>

              {/* AI Suggestions Section */}
              {hasSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3"
                >
                  {isLoadingAI ? (
                    // Loading State
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 px-3 py-2 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] rounded-xl"
                    >
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                            className="w-1.5 h-1.5 bg-[#667eea] rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] md:text-xs text-[#667eea] font-bold">
                        AI is thinking...
                      </span>
                    </motion.div>
                  ) : (
                    // Suggestions
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence mode="popLayout">
                        {aiSuggestions.map((text, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              delay: idx * 0.05,
                              type: "spring",
                              stiffness: 300,
                            }}
                            onClick={() => {
                              setNewMessage(text);
                              setAISuggestions([]);
                            }}
                            className="neu-button px-3 py-1.5 rounded-xl text-[10px] md:text-xs text-[#2d3748] font-bold"
                          >
                            {text}
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

              {/* AI Button */}
              <motion.button
                onClick={generateSuggestion}
                disabled={isLoadingAI}
                whileHover={{ scale: isLoadingAI ? 1 : 1.02 }}
                whileTap={{ scale: isLoadingAI ? 1 : 0.98 }}
                className={`${hasSuggestions ? "mt-2" : "mt-3"} flex items-center justify-center gap-1.5 neu-button px-3 py-2 rounded-xl ${isLoadingAI ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <motion.div
                  animate={isLoadingAI ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={14} className="text-[#667eea]" />
                </motion.div>
                <span className="text-[10px] md:text-xs font-bold text-[#2d3748]">
                  {isLoadingAI ? "Generating..." : "AI Suggestions"}
                </span>
              </motion.button>
            </motion.div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 custom-scroll">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => {
                  const isMyMessage =
                    msg.senderId?.toString() === userData?._id?.toString();
                  return (
                    <motion.div
                      key={`${idx}`}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        scale: 0.9,
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: idx * 0.03,
                      }}
                      className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-3 md:mb-4`}
                    >
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className={`max-w-[80%] p-3 md:p-3.5 rounded-2xl md:rounded-[20px] relative
                    ${
                      isMyMessage
                        ? "chat-bubble-sent text-[#667eea] font-bold rounded-tr-sm"
                        : "chat-bubble-received text-[#2d3748] font-medium rounded-tl-sm"
                    }`}
                      >
                        <p className="text-xs md:text-sm leading-relaxed">
                          {msg.text}
                        </p>

                        <div className="flex items-center justify-end gap-1">
                          <span
                            className={`text-[9px] md:text-[10px] font-semibold
                      ${isMyMessage ? "text-[#667eea]/60" : "text-gray-400"}`}
                          >
                            {msg.time}
                          </span>
                          {isMyMessage && (
                            <motion.svg
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              className="w-3 h-3 text-[#667eea]/60"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start mb-3 md:mb-4"
                  >
                    <div className="chat-bubble-received px-4 py-3 rounded-2xl rounded-tl-sm">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut",
                            }}
                            className="w-2 h-2 bg-[#667eea] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="p-4 md:p-5 border-t border-[#cbd5e0]/30"
            >
              <form>
                <div className="relative flex items-center gap-2 md:gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="chat-input flex-1 h-11 md:h-12 rounded-xl md:rounded-2xl px-4 md:px-5 text-xs md:text-sm text-[#2d3748] placeholder-gray-400 font-medium"
                  />

                  <motion.button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    whileHover={{ scale: newMessage.trim() ? 1.05 : 1 }}
                    whileTap={{ scale: newMessage.trim() ? 0.95 : 1 }}
                    className={`chat-send-btn w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-[#667eea] transition-all
              ${!newMessage.trim() ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <motion.div
                      animate={
                        newMessage.trim()
                          ? {
                              rotate: [0, -5, 5, 0],
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut",
                      }}
                    >
                      <Send size={18} className="md:w-5 md:h-5" />
                    </motion.div>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <div className="bg-[#e0e5ec] rounded-3xl md:rounded-[30px] p-5 md:p-6.25 shadow-[12px_12px_24px_rgba(163,177,198,0.6),-12px_-12px_24px_rgba(255,255,255,0.5)]">
            {IsOTPSent ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-5 items-center w-full"
                >
                  <div className="relative w-full flex justify-center">
                    <input
                      className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                      value={OTP}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        if (val.length <= 4) setOTP(val);
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      autoComplete="one-time-code"
                    />
                    <div className="flex gap-3 md:gap-4">
                      {[0, 1, 2, 3].map((idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`w-12 h-14 md:w-14 md:h-16 rounded-xl bg-[#e0e5ec] flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-200 border-2
                            ${
                              OTP.length === idx
                                ? "border-[#667eea]/40 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]"
                                : "border-transparent shadow-[inset_5px_5px_10px_rgba(163,177,198,0.4),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]"
                            }
                            ${OTP[idx] ? "text-[#2d3748]" : "text-transparent"}
                          `}
                        >
                          {OTP[idx] || (
                            <div
                              className={`w-2 h-2 rounded-full ${OTP.length === idx ? "bg-[#667eea] animate-pulse" : "bg-gray-300"}`}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full">
                    {OTPError && (
                       <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 text-xs md:text-sm font-bold text-red-500 flex items-center justify-center gap-2 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] px-4 py-2.5 rounded-xl border border-red-200/50"
                      >
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{OTPError}</span>
                      </motion.div>
                    )}
                    <button
                      className={`w-full py-3 md:py-4 bg-[#e0e5ec] rounded-xl md:rounded-2xl text-[#667eea] font-black text-sm md:text-base uppercase tracking-wider shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${verifyingOTP ? "cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={verifyingOTP}
                      onClick={verifyOTP}
                    >
                      <span>
                        {verifyingOTP ? "Verifying OTP..." : "Verify OTP"}
                      </span>
                      <Sparkles size={18} />
                    </button>
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="flex flex-col gap-3 md:gap-4">
                <button
                  className={`w-full p-3 md:p-4 bg-[#e0e5ec] rounded-2xl md:rounded-[18px] text-sm md:text-base font-bold text-[#10b981] shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)] active:shadow-[inset_5px_5px_10px_rgba(163,177,198,0.5),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] ${sendingOTP ? "cursor-not-allowed" : "cursor-pointer"} `}
                  onClick={sendOTP}
                  disabled={sendingOTP}
                >
                  <Bike size={18} className="md:w-5 md:h-5" />
                  {sendingOTP ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
