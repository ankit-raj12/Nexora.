"use client";
import HeroSection from "./HeroSection";
import { ItemInterface } from "@/models/item.model";
import ItemCard from "./ItemCard";
import CategorySection from "./CategorySection";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";

const UserDashboard = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [items, setItems] = useState<ItemInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/get-items");
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = searchQuery
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <>
      <div className="min-h-screen bg-neu-base font-sans overflow-x-hidden pt-30 sm:pt-40 px-4 md:px-10">
        {/* Show Hero & Category sections only when NOT searching */}
        <AnimatePresence mode="wait">
          {!searchQuery && (
            <motion.div
              key="hero-category"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection />
              <CategorySection />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results Header */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-black text-neu-text mb-2">
              Search Results for &quot;{searchQuery}&quot;
            </h2>
            <p className="text-gray-500 font-medium">
              Found {filteredItems.length} item(s)
            </p>
          </motion.div>
        )}

        {/* Items Grid */}
        <section id="items-section" className="scroll-mt-32">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-3 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-3/4 rounded-2xl bg-neu-base neu-flat animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-3 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item: ItemInterface) => (
                <motion.div
                  key={item._id.toString()}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="pb-10"
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
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-neu-base neu-flat flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-neu-text mb-2">
              No Items Found
            </h3>
            <p className="text-gray-500 font-medium">
              We couldn&apos;t find any items matching &quot;{searchQuery}
              &quot;
            </p>
          </motion.div>
        )}
        </section>
      </div>
    </>
  );
};

export default UserDashboard;
