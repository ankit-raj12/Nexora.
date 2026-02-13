/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getSocket } from "@/lib/socket";
import { MessageInterface } from "@/models/message.model";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type PropsType = { orderId: string; userId: string };

export default function DeliveryChat({ orderId, userId }: PropsType) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageInterface[] | []>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { userData } = useSelector((state: RootState) => state.user);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

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
          body: JSON.stringify({ orderId }),
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (orderId) fetchMessages();
  }, [orderId]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);

    const handleMessage = (message: any) => {
      if (message.orderId === orderId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("send-message", handleMessage);
    return () => {
      socket.off("send-message", handleMessage);
    };
  }, [orderId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setIsTyping(true);
    const socket = getSocket();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const messagePayload = {
      orderId,
      text: newMessage,
      senderId: userId,
      time,
    };

    socket.emit("send-message", messagePayload);
    setNewMessage("");
    setTimeout(() => setIsTyping(false), 500);
  };

  const generateSuggestion = async () => {
    if (isLoadingAI) return;
    setIsLoadingAI(true);
    const lastMessage = messages
      .filter((m) => m.senderId.toString() !== userId.toString())
      .at(-1);

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
        const suggests = data.candidates[0].content.parts[0].text.split(",");
        setAISuggestions(suggests);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const hasSuggestions = aiSuggestions.length > 0 || isLoadingAI;

  return (
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
              Chat with Rider
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
          className={`${hasSuggestions ? "mt-4" : "mt-3"} flex items-center justify-center gap-1.5 neu-button px-3 py-2 rounded-xl ${isLoadingAI ? "opacity-50 cursor-not-allowed" : ""}`}
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
            const isMyMessage = msg.senderId?.toString() === userId?.toString();
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
  );
}
