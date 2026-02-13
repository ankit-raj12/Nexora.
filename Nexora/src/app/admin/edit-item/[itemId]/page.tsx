"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Save,
  ArrowLeft,
  Upload,
  Loader2,
  Tag,
  Scale,
  Layers,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  "Fruits & Vegetables",
  "Dairy, Bread & Eggs",
  "Snacks & Munchies",
  "Cold Drinks & Juices",
  "Ice Cream & Sweets",
  "Instant & Frozen Food",
  "Tea, Coffee & Breakfast",
  "Bakery & Biscuits",
  "Meat, Fish & Seafood",
  "Bath & Body",
  "Cleaning Essentials",
  "Baby Care",
  "Health & Wellness",
  "Pet Supplies",
  "Stationery & Office",
];

const units = ["kg", "g", "liter", "ml", "piece", "pack"];

export default function EditItem() {
  const [frontendImage, setFrontendImage] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { itemId } = useParams();
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    const getItem = async () => {
      try {
        const response = await fetch(
          `/api/admin/get-single-item/${itemId?.toString()}`,
        );
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setCategory(data.category);
          setPrice(data.price);
          setAmount(data.amount);
          setUnit(data.unit);
          setFrontendImage(data.image);
        } else {
          toast.error("Failed to load item details");
        }
      } catch (error) {
        console.error("Failed to fetch item:", error);
        toast.error("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) getItem();
  }, [itemId]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("itemId", itemId as string);
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price.toString());
      formData.append("amount", amount.toString());
      formData.append("unit", unit);

      if (backendImage) {
        formData.append("image", backendImage);
      } else if (frontendImage) {
        formData.append("existingImage", frontendImage);
      }

      const response = await fetch("/api/admin/edit-item", {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        router.push("/admin/listings");
      } else {
        console.error("Error in updating");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#e0e5ec] shadow-[10px_10px_20px_#babecc,-10px_-10px_20px_#ffffff] flex items-center justify-center">
            <Loader2 className="text-slate-400 w-10 h-10 animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-slate-300 opacity-20 animate-ping"></div>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-slate-700 font-sans selection:bg-slate-300">
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/40 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-slate-400/20 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-3 py-4 md:px-6 md:py-8 lg:p-10"
      >
        {/* Top Navigation Bar */}
        <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10">
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:scale-95 transition-all duration-300 active:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]"
            >
              <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" strokeWidth={2.5} />
            </button>
            <div>
              <div className="flex items-center gap-2 md:gap-3">
                <h1 className="text-xl md:text-4xl font-black text-slate-700 tracking-tight">
                  Edit Item
                </h1>
                <span className="px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg bg-slate-200/50 text-[10px] md:text-xs font-bold text-slate-500 border border-slate-300/50">
                  ID: {itemId?.toString().slice(0, 6)}
                </span>
              </div>
              <p className="text-slate-500 font-medium mt-0.5 text-xs md:text-base">
                {"Refine your product's details"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="hidden md:flex px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-red-500 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="hidden md:flex px-6 py-3 rounded-xl text-neu-text text-[#e0e5ec] font-bold shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] hover:scale-[101%] active:scale-95 transition-all items-center gap-2 disabled:opacity-70 disabled:scale-100 text-sm md:text-base cursor-pointer hover:text-blue-500"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 md:w-5 md:h-5" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </motion.div>

        <form className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10">
          {/* LEFT SIDE - The "Card" Preview & Media */}
          <motion.div className="lg:col-span-5 flex flex-col gap-5 order-1 lg:order-1">
            {/* Image Card */}
            <div className="relative group">
              <div className="aspect-4/3 w-full rounded-xl md:rounded-4xl bg-[#e0e5ec] neu-inset p-5 md:p-6 flex items-center justify-center overflow-hidden transition-all duration-500">
                {frontendImage ? (
                  <motion.div
                    layoutId="product-image"
                    className="relative w-full h-full"
                  >
                    <Image
                      src={frontendImage}
                      alt="Product"
                      fill
                      className="object-cover rounded-3xl  drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                  </motion.div>
                ) : (
                  <ShoppingBag className="w-20 h-20 md:w-32 md:h-32 text-slate-300/50" />
                )}

                {/* Floating Stats */}
                <div className="absolute top-3 left-3 md:top-6 md:left-6 flex gap-2">
                  {category && (
                    <span className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-[#e0e5ec]/80 backdrop-blur-md shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] md:shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] text-[9px] md:text-xs font-bold text-slate-600 border border-white/20">
                      {category}
                    </span>
                  )}
                </div>
              </div>

              {/* Upload Overlay Button */}
              <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 z-20">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-blue-500 text-white shadow-[3px_3px_6px_rgba(59,130,246,0.3)] hover:bg-blue-600 hover:scale-110 transition-all flex items-center justify-center">
                    <Upload
                      className="w-4 h-4 md:w-7 md:h-7"
                      strokeWidth={2.5}
                    />
                  </div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - Inputs */}
          <motion.div className="lg:col-span-7 space-y-5 order-2 lg:order-2">
            {/* General Section */}
            <div className="bg-[#e0e5ec] p-4 md:p-8 rounded-xl md:rounded-4xl neu-flat">
              <h3 className="text-base md:text-xl font-bold text-slate-700 mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
                <Layers className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
                Core Details
              </h3>

              <div className="space-y-4 md:space-y-5">
                {/* Name Field */}
                <div className="group">
                  <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 md:ml-3 mb-1 block group-focus-within:text-blue-500 transition-colors">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fresh Organic Apples"
                    className="w-full bg-[#e0e5ec] px-3 py-2.5 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-sm md:text-lg font-bold text-slate-700 neu-inset transition-all placeholder:text-slate-300 border-2 border-transparent focus:border-blue-500/10"
                  />
                </div>

                {/* Category Field */}
                <div className="group relative">
                  <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 md:ml-3 mb-1 block group-focus-within:text-blue-500 transition-colors">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#e0e5ec] px-3 py-2.5 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-sm md:text-lg font-bold text-slate-700 neu-inset focus:outline-hidden appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <Tag className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 md:w-5 md:h-5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory Section */}
            <div className="bg-[#e0e5ec] p-4 md:p-8 rounded-xl md:rounded-4xl neu-flat">
              <h3 className="text-base md:text-xl font-bold text-slate-700 mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
                <Scale className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
                Inventory & Value
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {/* Price */}
                <div className="group">
                  <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 md:ml-3 mb-1 block group-focus-within:text-green-500 transition-colors">
                    Price (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 md:w-5 md:h-5 group-focus-within:text-green-500 transition-colors" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#e0e5ec] pl-8 pr-3 py-2.5 md:pl-14 md:pr-6 md:py-4 rounded-lg md:rounded-2xl text-base md:text-xl font-black text-slate-700 neu-input focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Unit Config */}
                <div className="group">
                  <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 md:ml-3 mb-1 block">
                    Quantity Unit
                  </label>
                  <div className="flex gap-2.5 md:gap-3">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1"
                      className="w-1/2 bg-[#e0e5ec] px-2 py-2.5 md:px-4 md:py-4 rounded-lg md:rounded-2xl text-center text-base md:text-xl font-bold text-slate-700 neu-input focus:outline-hidden"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-1/2 bg-[#e0e5ec] px-1 md:px-4 py-2.5 md:py-4 rounded-lg md:rounded-2xl text-center text-xs md:text-base font-bold text-slate-700 neu-button cursor-pointer  appearance-none outline-0"
                    >
                      {units.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:hidden pt-2">
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-neu-base text-neu-text font-bold shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Update Product
              </button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
