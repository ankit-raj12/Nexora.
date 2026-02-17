"use client";
import { ItemInterface } from "@/models/item.model";
import { Pen, Trash2, Search, Plus, Package, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Listings() {
  const [items, setItems] = useState<ItemInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getItems = async () => {
      try {
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
    getItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => {
      const matchesSearch =
        item.name
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase()) ||
        item.category
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase());

      return matchesSearch;
    });
  }, [items, searchQuery]);

  const handleDelete = async (itemId: string) => {
    try {
      const response = await fetch("/api/admin/delete-item", {
        method: "POST",
        body: JSON.stringify(itemId),
      });
      if (response.ok) {
        setItems((prev) =>
          prev.filter((item) => item._id.toString() !== itemId),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] flex items-center justify-center animate-bounce">
            <Package className="text-blue-500 w-8 h-8" />
          </div>
          <p className="text-slate-500 font-bold tracking-wider animate-pulse">
            Loading Inventory...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e0e5ec] p-3 md:p-8 font-sans text-slate-700">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-12">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="neu-button mb-4 md:mb-6 p-2 md:p-3 rounded-full text-slate-400 hover:text-[#667eea] transition-colors flex items-center justify-center"
        >
          <ArrowLeft size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
        </motion.button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-slate-700 mb-2 drop-shadow-sm">
              All Listings
            </h1>
            <p className="text-slate-500 font-medium max-w-md text-xs md:text-base">
              Manage your product catalog, track inventory, and update details
              efficiently.
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/add-item")}
            className="group flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 bg-[#e0e5ec] rounded-xl md:rounded-2xl  neu-button transition-all duration-300 font-bold text-sm md:text-base text-blue-600"
          >
            <div className="bg-blue-100 p-1 md:p-1.5 rounded-lg transition-colors">
              <Plus size={16} className="text-blue-600 md:w-5 md:h-5" />
            </div>
            Add Product
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full lg:w-96 group"
          >
            <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 md:pl-14 pr-10 md:pr-12 py-3 md:py-4 rounded-xl md:rounded-2xl bg-[#e0e5ec] neu-input focus:outline-hidden text-slate-600 font-bold placeholder:text-slate-400 text-xs md:text-base transition-all"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 md:right-5 flex items-center text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={16} className="md:w-4.5" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto">
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 md:py-24"
          >
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#babecc,inset_-5px_-5px_10px_#ffffff] md:shadow-[inset_10px_10px_20px_#babecc,inset_-10px_-10px_20px_#ffffff] flex items-center justify-center mb-4 md:mb-6">
              <Package size={40} className="text-slate-300 md:w-16 md:h-16" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-400 uppercase tracking-widest">
              No Items Found
            </h3>
            <p className="text-xs md:text-base text-slate-400 mt-2 font-medium">
              {"We couldn't find any items matching your criteria."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 pb-20"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id.toString()}
                  layout
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-[#e0e5ec] rounded-2xl md:rounded-[2.5rem] p-3 md:p-5 shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] md:shadow-[10px_10px_20px_#babecc,-10px_-10px_20px_#ffffff] transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
                >
                  {/* Category Tag */}
                  <div className="absolute top-3 right-3 md:top-6 md:right-6 z-10 w-full flex justify-end">
                    <span className="text-[8px] md:text-[10px] font-black tracking-widest uppercase text-slate-400/80 bg-[#e0e5ec]/80 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl shadow-[1px_1px_2px_#babecc,-1px_-1px_2px_#ffffff] md:shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] truncate max-w-[50%]">
                      {item.category}
                    </span>
                  </div>

                  {/* Image Container - Neumorphic Inset */}
                  <div className="w-full aspect-square mb-3 md:mb-6 rounded-xl md:rounded-4xl bg-[#e0e5ec] p-4 md:p-8 flex items-center justify-center relative group-hover:scale-[1.02] transition-transform duration-500 shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] md:shadow-[inset_6px_6px_12px_#babecc,inset_-6px_-6px_12px_#ffffff]">
                    <motion.div className="relative w-full h-full filter drop-shadow-md md:drop-shadow-xl group-hover:drop-shadow-lg md:group-hover:drop-shadow-2xl transition-all duration-500">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>
                  </div>

                  <div className="w-full flex-1 flex flex-col justify-between">
                    <div className="mb-1 md:mb-2 text-left w-full px-1 md:px-2">
                      <h3
                        className="text-sm md:text-xl font-bold text-slate-700 mb-0.5 md:mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors"
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs md:text-sm font-bold text-slate-400 flex items-center gap-1">
                        {item.amount}
                        <span className="text-[10px] md:text-xs font-medium uppercase opacity-70">
                          {item.unit}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full mt-2 md:mt-4 bg-[#e0e5ec] rounded-xl md:rounded-2xl p-1.5 md:p-2 shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] md:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff]">
                      <div className="pl-1.5 md:pl-3">
                        <p className="text-sm md:text-lg font-black text-slate-700">
                          ₹{item.price}
                        </p>
                      </div>

                      <div className="flex gap-1 md:gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#e0e5ec] neu-button flex items-center justify-center text-blue-500 hover:text-blue-600 transition-all"
                          title="Edit Item"
                          onClick={() =>
                            router.push(
                              `/admin/edit-item/${item._id.toString()}`,
                            )
                          }
                        >
                          <Pen
                            size={14}
                            className="md:w-4.5 md:h-4.5"
                            strokeWidth={2.5}
                          />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#e0e5ec] neu-button flex items-center justify-center text-red-400 hover:text-red-500 transition-all"
                          title="Delete Item"
                          onClick={() => setItemToDelete(item._id.toString())}
                        >
                          <Trash2
                            size={14}
                            className="md:w-4.5 md:h-4.5"
                            strokeWidth={2.5}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={() => setItemToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e0e5ec] p-6 md:p-8 rounded-4xl shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] max-w-sm w-full relative overflow-hidden"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] flex items-center justify-center text-red-500 mb-2">
                  <Trash2 size={32} />
                </div>

                <h3 className="text-xl md:text-2xl font-black text-slate-700">
                  Delete Item?
                </h3>
                <p className="text-slate-500 font-medium text-sm">
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </p>

                <div className="flex gap-4 w-full mt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setItemToDelete(null)}
                    className="flex-1 py-3 rounded-2xl bg-[#e0e5ec] text-slate-500 font-bold neu-button hover:text-slate-700 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (itemToDelete) {
                        handleDelete(itemToDelete);
                        setItemToDelete(null);
                      }
                    }}
                    className="flex-1 py-3 rounded-2xl bg-[#e0e5ec] text-red-500 font-bold  hover:text-red-600 neu-button transition-all"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
