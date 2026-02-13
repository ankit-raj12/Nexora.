"use client";

import ItemCard from "@/components/ItemCard";
import Nav from "@/components/Nav";
import useGetMe from "@/hooks/useGetMe";
import { ItemInterface } from "@/models/item.model";
import { RootState } from "@/redux/store";
import { ArrowLeft, PackageX, Search, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";

export default function Categories() {
  const { category } = useParams();
  const router = useRouter();
  const [items, setItems] = useState<ItemInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch User Data for Navbar
  useGetMe();
  const { userData } = useSelector((state: RootState) => state.user);

  const categoryName = decodeURIComponent(
    Array.isArray(category) ? category[0] : category || "",
  );

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/get-category/${category}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.log("Failed to fetch items");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      getItems();
    }
  }, [category]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {userData && <Nav user={userData} currentPage={"categories"} />}
      <div className="min-h-screen bg-neu-base overflow-x-hidden selection:bg-[#667eea] selection:text-white">
        {/* Ambient Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[10%] w-150 h-150 rounded-full bg-linear-to-br from-white/40 to-transparent blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] -left-[10%] w-125 h-125 rounded-full bg-linear-to-tr from-[#667eea]/10 to-transparent blur-[100px]"
          />
        </div>

        {/* Main Content */}
        <main className="relative z-10 pt-24 md:pt-35 px-3 md:px-6 max-w-6xl mx-auto space-y-6">
          {/* Hero Header Section */}
          <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="neu-button w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-neu-text hover:text-[#667eea] transition-all active:scale-95 group"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
                </button>

                <div className="px-3 py-1 rounded-full bg-neu-base neu-in-shadow text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                  Category
                </div>
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-neu-text tracking-tight uppercase relative select-none">
                <span className="relative z-10">{categoryName}</span>
                <span className="absolute left-1 top-1 text-transparent bg-clip-text bg-linear-to-br from-white/50 to-transparent -z-10 blur-[1px]">
                  {categoryName}
                </span>
                <Sparkles className="inline-block w-5 h-5 md:w-7 md:h-7 text-[#667eea] ml-2 animate-pulse relative -top-2 md:-top-3" />
              </h1>
            </motion.div>

            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              {/* Search Input */}
              <div className="relative group w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 md:h-10 pl-10 pr-4 rounded-xl neu-input text-neu-text text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#667eea]/20 transition-all font-medium"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#667eea] transition-colors" />
              </div>
            </motion.div>
          </section>

          {/* Dynamic Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "circOut" }}
            className="h-0.5 w-full bg-linear-to-r from-transparent via-[#667eea]/30 to-transparent rounded-full opacity-50"
          />

          {/* Items Grid */}
          <section className="min-h-[50vh]">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-3/4 rounded-2xl bg-neu-base neu-flat animate-pulse"
                  />
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
              >
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      layout
                      key={item._id.toString()}
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                      className="h-full"
                    >
                      <ItemCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 md:py-16 text-gray-400 gap-4"
              >
                <div className="p-8 rounded-full bg-neu-base neu-flat group">
                  <PackageX className="w-12 h-12 md:w-16 md:h-16 opacity-30 group-hover:scale-110 group-hover:text-red-400 transition-all duration-500" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg md:text-xl font-black text-neu-text/70 uppercase tracking-wider">
                    No Items Found
                  </h3>
                  <p className="text-xs md:text-sm font-medium tracking-wide">
                    Try adjusting your search or check another category
                  </p>
                </div>
              </motion.div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
