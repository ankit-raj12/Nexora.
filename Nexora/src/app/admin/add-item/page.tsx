"use client";
import { AlertCircle, ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

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

const AddItmes = () => {
  const units = ["kg", "g", "liter", "ml", "piece", "pack"];
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [frontendImage, setFrontendImage] = useState<string | null>();
  const [backendImage, setBackendImage] = useState<File | null>();
  const [error, setError] = useState("");
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("unit", unit);
      formData.append("amount", amount);
      if (backendImage) formData.append("image", backendImage);
      const response = await fetch("/api/admin/add-item", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/admin/listings");
        setName("");
        setPrice("");
        setAmount("");
        setCategory("");
        setFrontendImage("");
        setUnit("");
      } else {
        const result = await response.json();
        setError(result.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neu-base font-sans overflow-x-hidden pt-4 pb-16 md:pt-20 md:pb-20 px-3 md:px-6 lg:px-10 flex justify-center sticky-container">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">
        {/* Left Column: Visuals & Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col sticky top-0"
        >
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => router.back()}
              className="neu-button px-8 py-4 rounded-[20px] text-[#667eea] font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
          </div>

          <h1 className="text-[56px] lg:text-[72px] font-black text-neu-text mb-6 leading-[1.1] drop-shadow-[4px_4px_8px_rgba(163,177,198,0.3)]">
            Grow Your
            <br />
            <span className="bg-linear-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Inventory
            </span>
          </h1>
          <p className="text-[20px] text-[#718096] mb-12 leading-[1.6] max-w-md">
            Seamlessly add new products to your catalog. Keep your store fresh
            and your customers happy.
          </p>

          <div className="relative h-96 w-full">
            <FloatingCard icon="🥬" delay={0} top="0" right="20%" />
            <FloatingCard icon="🍞" delay={1} top="30%" left="10%" />
            <FloatingCard icon="🥩" delay={2} bottom="10%" right="30%" />

            {/* Decorative Central Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neu-base rounded-full neu-flat flex items-center justify-center text-8xl text-neu-text opacity-50">
              📦
            </div>
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full relative"
        >
          {/* Mobile Header (visible only on small screens) */}
          <div className="lg:hidden mb-2 md:mb-8 text-center bg-neu-base pb-2 sticky top-0 z-20">
            <div className="flex justify-between items-center mb-2 md:mb-6">
              <button
                onClick={() => router.back()}
                className="neu-button p-2 md:p-3 rounded-full text-[#667eea]"
              >
                <ArrowLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <h2 className="text-xl md:text-2xl font-black text-neu-text">
                Add Item
              </h2>
              <div className="w-10"></div> {/* Spacer */}
            </div>
            <p className="text-sm md:text-base text-[#718096]">
              Expand your menu with fresh items
            </p>
          </div>

          <div className="bg-neu-base neu-flat rounded-[20px] md:rounded-[40px] p-4 md:p-8 relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <form
              className="flex flex-col gap-4 md:gap-8 relative z-10"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-bold text-[#718096] uppercase tracking-wider ml-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alphonso Mangoes"
                  className="neu-input w-full px-3 py-2 md:px-6 md:py-4 rounded-[15px] md:rounded-[20px] text-sm md:text-lg text-neu-text placeholder-gray-400 focus:text-[#667eea] transition-all focus:ring-2 focus:ring-[#667eea]/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#718096] uppercase tracking-wider ml-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      className="neu-input w-full px-3 py-2 md:px-6 md:py-4 rounded-[15px] md:rounded-[20px] text-sm md:text-lg text-neu-text appearance-none cursor-pointer focus:text-[#667eea]"
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Select...
                      </option>
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-[#718096]">
                      ▼
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#718096] uppercase tracking-wider ml-2">
                    Unit
                  </label>
                  <div className="relative">
                    <select
                      className="neu-input w-full px-4 py-3 md:px-6 md:py-4 rounded-[15px] md:rounded-[20px] text-base md:text-lg text-neu-text appearance-none cursor-pointer focus:text-[#667eea]"
                      name="unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Select...
                      </option>
                      {units.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-[#718096]">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#718096] uppercase tracking-wider ml-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    className="neu-input w-full px-4 py-3 md:px-6 md:py-4 rounded-[15px] md:rounded-[20px] text-base md:text-lg text-neu-text placeholder-gray-400 focus:text-[#667eea]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-[#718096] uppercase tracking-wider ml-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 199"
                    className="neu-input w-full px-4 py-3 md:px-6 md:py-4 rounded-[15px] md:rounded-[20px] text-base md:text-lg text-neu-text placeholder-gray-400 focus:text-[#667eea]"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs md:text-sm font-bold text-[#718096] uppercase tracking-wider ml-2 block mb-3">
                  Product Image
                </label>
                <div className="neu-input p-3 md:p-4 rounded-[20px] md:rounded-[30px] flex items-center justify-between gap-3 md:gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="image"
                      className="cursor-pointer flex items-center gap-2 md:gap-3 text-[#718096] hover:text-[#667eea] transition-colors"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-neu-base rounded-full neu-button flex items-center justify-center text-[#667eea]">
                        <Upload size={20} className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <span className="font-semibold text-sm md:text-base">
                        {frontendImage ? "Change Image" : "Upload File"}
                      </span>
                    </label>
                  </div>

                  {frontendImage && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-[15px] md:rounded-[20px] overflow-hidden border-2 border-[#e0e5ec] shadow-inner"
                    >
                      <Image
                        src={frontendImage}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </motion.div>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="mt-6 mx-1"
                    >
                      <div className="relative overflow-hidden bg-neu-base p-3 md:p-4 rounded-[20px] neu-inset border-l-4 border-red-400 flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4 relative z-10">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#e0e5ec] neu-button flex items-center justify-center text-red-500 shrink-0">
                            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 stroke-2" />
                          </div>
                          <div>
                            <h4 className="text-red-500 font-bold text-[10px] md:text-xs uppercase tracking-wider mb-0.5">
                              Submission Failed
                            </h4>
                            <p className="text-slate-600 font-bold text-xs md:text-sm leading-tight pr-4 md:pr-8">
                              {error}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setError("")}
                          className="neu-button w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <X
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                            strokeWidth={3}
                          />
                        </button>

                        <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-red-500/5 to-transparent pointer-events-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {frontendImage && (
                  <motion.button
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`neu-button w-full py-3 md:py-5 rounded-[15px] md:rounded-[20px] text-lg md:text-xl font-bold flex items-center justify-center gap-2 md:gap-3 overflow-hidden ${
                      loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#667eea]"
                    }`}
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Adding to Store...</span>
                      </>
                    ) : (
                      "Create Item"
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddItmes;

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
      animate={{ y: [-15, 15, -15] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      style={{ top, right, bottom, left }}
      className="absolute w-20 h-20 bg-neu-base rounded-[25px] flex items-center justify-center text-[40px] neu-flat z-10"
    >
      {icon}
    </motion.div>
  );
};
