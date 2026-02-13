/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ItemInterface } from "@/models/item.model";
import { RootState } from "@/redux/store";
import {
  ArrowLeft,
  CircleDollarSignIcon,
  CreditCard,
  Home,
  Loader2,
  LocateFixed,
  MapPinCheckIcon,
  Phone,
  ShoppingBag,
  Truck,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const CheckoutMap = dynamic(() => import("./CheckoutMap"), { ssr: false });

export default function CheckOutPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData, deliveryFee, subTotal, totalAmount } = useSelector(
    (state: RootState) => state.cart,
  );

  useEffect(() => {
    if (userData) {
      setName(userData?.name || "");
      setPhone(userData?.mobile || "");
    }
  }, [userData]);

  // Get initial location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setLocationError(null);
        },
        (err) => {
          console.error("Error getting location:", err);
          // Set default location (India - New Delhi) if geolocation fails
          setPosition([28.6139, 77.2090]);
          
          if (err.code === 1) {
            setLocationError("Location permission denied. Using default location. You can search or enter address manually.");
          } else if (err.code === 2) {
            setLocationError("Location unavailable. Using default location.");
          } else {
            setLocationError("HTTPS required for location on mobile. Using default location or search for your area.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      // Fallback if geolocation not supported
      setPosition([28.6139, 77.2090]);
      setLocationError("Geolocation not supported. Please search for your location.");
    }
  }, []);

  const handleSearchQuery = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!searchAddress) return;
    try {
      const { OpenStreetMapProvider } = await import("leaflet-geosearch");
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchAddress });
      if (results && results.length > 0) {
        setPosition([results[0].y, results[0].x]);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleAddressFound = (result: any) => {
    // Only auto-fill if user hasn't manually edited the fields
    if (!isManualEdit && result && result.address) {
      setCity(
        result.address.city ||
          result.address.town ||
          result.address.village ||
          "",
      );
      setState(result.address.state || "");
      setPincode(result.address.postcode || "");
      setAddress(result.display_name || "");
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setIsManualEdit(false); // Re-enable auto-fill when using map
          setLocationError(null);
        },
        (err) => {
          console.error("Error getting location:", err);
          if (err.code === 1) {
            setLocationError("Please enable location permission in your browser settings.");
          } else {
            setLocationError("Unable to get location. Please search or enter manually.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  };

  const handleCODOrder = async () => {
    setIsLoading(true);
    try {
      if (!position) return null;
      const orderObject = {
        userId: userData?._id,
        items: cartData.map((item) => ({
          item: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          unit: item.unit,
          amount: item.amount,
        })),
        address: {
          name: userData?.name,
          city,
          state,
          pincode,
          fullAddress: address,
          mobile: phone,
          latitude: position[0],
          longitude: position[1],
        },
        totalAmount,
        paymentMethod,
      };

      const result = await fetch("/api/user/order", {
        method: "POST",
        body: JSON.stringify(orderObject),
      }).then((res) => {
        if (res.status === 201) {
          sessionStorage.setItem("order_success", "true");
          router.push("/user/order-success");
        } else {
          router.push("/user/order-fail");
        }

        return res.json();
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleOnlineOrder = async () => {
    setIsLoading(true);
    try {
      if (!position) return null;
      const orderObject = {
        userId: userData?._id,
        items: cartData.map((item) => ({
          item: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          unit: item.unit,
          amount: item.amount,
        })),
        address: {
          name: userData?.name,
          city,
          state,
          pincode,
          fullAddress: address,
          mobile: phone,
          latitude: position[0],
          longitude: position[1],
        },
        totalAmount,
        paymentMethod,
      };

      const result = await fetch("/api/user/payment", {
        method: "POST",
        body: JSON.stringify(orderObject),
      }).then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem("order_success", "true");
          router.push("/user/order-success");
        } else {
          router.push("/user/order-fail");
        }

        return res.json();
      });
      window.location.href = result.url;
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  if (cartData.length < 1) {
    return (
      <div className="min-h-screen bg-neu-base flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="neu-flat rounded-[30px] sm:rounded-[40px] p-6 sm:p-12 flex flex-col items-center text-center max-w-md w-full relative overflow-hidden"
        >
          {/* Decorative Background Blob */}
          <div className="absolute -top-20 -right-20 h-48 w-48 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl"></div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full neu-flat flex items-center justify-center mb-6 text-[#667eea] shadow-inner">
            <ShoppingBag size={32} className="sm:w-10 sm:h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-neu-text mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8 font-medium leading-relaxed text-sm sm:text-base">
            {
              "Looks like you haven't added any delicious items to your cart yet."
            }
          </p>

          <Link
            href="/"
            className="neu-button px-6 py-3 sm:px-8 sm:py-4 rounded-[15px] sm:rounded-[20px] text-[#667eea] font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all group text-sm sm:text-base"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform sm:w-5 sm:h-5"
            />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neu-base font-sans overflow-x-hidden pt-6 pb-20 px-4 sm:px-6 lg:px-10 flex justify-center sticky-container">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-start">
        {/* Left Column: Visuals & Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col sticky top-24"
        >
          <div className="mb-8 flex gap-4">
            <Link
              href="/user/cart"
              className="neu-button px-8 py-4 rounded-[20px] text-[#667eea] font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={20} />
              Back to Menu
            </Link>
          </div>

          <h1 className="text-[56px] lg:text-[72px] font-black text-neu-text mb-6 leading-[1.1] drop-shadow-[4px_4px_8px_rgba(163,177,198,0.3)]">
            Complete
            <br />
            <span className="bg-linear-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Your Order
            </span>
          </h1>

          <div className="mt-8 pr-8">
            <h3 className="text-2xl font-bold text-neu-text mb-6">
              Your Bag ({cartData.length} items)
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {cartData.map((item: ItemInterface, index: number) => (
                <div
                  key={index}
                  className="neu-flat group relative p-3 rounded-2xl flex items-center gap-3 transition-all hover:scale-[1.02]"
                >
                  <div className="w-14 h-14 relative rounded-xl overflow-hidden shadow-sm shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-neu-text text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Qty: {item.amount} × ₹{item.price}
                    </p>
                  </div>
                  <div className="font-black text-[#667eea] text-sm">
                    ₹{Number(item.price) * item.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Checkout Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-6">
            <Link
              href="/"
              className="neu-button w-fit px-4 py-2 rounded-xl text-[#667eea] font-bold flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>

          <div className="bg-neu-base neu-flat rounded-[30px] sm:rounded-[40px] p-5 sm:p-10 relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-white/40 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>

            <form className="relative z-10 flex flex-col gap-6 sm:gap-10">
              {/* Section 1: Personal Details */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-black text-neu-text flex items-center gap-2 sm:gap-3">
                  <UserCircle className="text-[#667eea] w-6 h-6 sm:w-8 sm:h-8" />
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative group">
                    <UserCircle className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-5 h-5 sm:w-6 sm:h-6 group-focus-within:text-[#667eea] transition-colors" />
                    <input
                      type="text"
                      className="neu-input w-full pl-10 sm:pl-12 pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-all text-sm sm:text-base"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-5 h-5 sm:w-6 sm:h-6 group-focus-within:text-[#667eea] transition-colors" />
                    <input
                      type="text"
                      className="neu-input w-full pl-10 sm:pl-12 pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-all text-sm sm:text-base"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-black text-neu-text flex items-center gap-2 sm:gap-3">
                  <MapPinCheckIcon className="text-[#667eea] w-6 h-6 sm:w-8 sm:h-8" />
                  Delivery Address
                </h3>

                {/* Location Error Alert */}
                {locationError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-linear-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-3 sm:p-4 rounded-xl flex gap-3 items-start"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPinCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-amber-800 font-semibold leading-relaxed">
                        {locationError}
                      </p>
                      <p className="text-xs text-amber-700 mt-1 font-medium">
                        💡 Tip: Use the search bar or enter your address manually below.
                      </p>
                    </div>
                    <button
                      onClick={() => setLocationError(null)}
                      className="text-amber-600 hover:text-amber-800 transition-colors shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                )}

                {/* Map Search */}
                <div className="relative flex gap-2 sm:gap-3">
                  <div className="relative flex-1 group">
                    <MapPinCheckIcon className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-5 h-5 sm:w-6 sm:h-6 group-focus-within:text-[#667eea] transition-colors" />
                    <input
                      type="text"
                      className="neu-input w-full pl-10 sm:pl-12 pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base"
                      placeholder="Search city, area..."
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchQuery(e as any);
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSearchQuery}
                    className="neu-button px-4 sm:px-6 rounded-xl sm:rounded-2xl text-[#667eea] hover:text-[#764ba2] text-sm sm:text-base"
                  >
                    Search
                  </button>
                </div>

                {/* Map Container */}
                <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.5)] border-2 border-gray-300">
                  {position && (
                    <CheckoutMap
                      position={position}
                      setPosition={setPosition}
                      handleAddressFound={handleAddressFound}
                    />
                  )}
                  <button
                    type="button"
                    className="absolute bottom-4 right-4 z-400 bg-white p-2 sm:p-3 rounded-xl shadow-lg hover:scale-110 transition-transform text-[#667eea] cursor-pointer"
                    onClick={getCurrentLocation}
                    title="Get Current Location"
                  >
                    <LocateFixed size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Detailed Address Fields */}
                <div className="relative">
                  {isManualEdit && (
                    <button
                      type="button"
                      onClick={() => setIsManualEdit(false)}
                      className="absolute -top-8 right-0 text-xs text-[#667eea] hover:underline font-semibold z-10"
                    >
                      Use Map Location
                    </button>
                  )}
                  <div className="relative group">
                    <Home className="absolute top-3 sm:top-4 left-4 text-gray-400 w-5 h-5 sm:w-6 sm:h-6 group-focus-within:text-[#667eea] transition-colors" />
                    <textarea
                      className="neu-input w-full pl-10 sm:pl-12 pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium min-h-20 sm:min-h-25 resize-y text-sm sm:text-base"
                      placeholder="Full Address (House No, Street, Landmark)"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setIsManualEdit(true);
                      }}
                      onFocus={() => setIsManualEdit(true)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      className="neu-input w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium"
                      placeholder="City"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setIsManualEdit(true);
                      }}
                      onFocus={() => setIsManualEdit(true)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      className="neu-input w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium"
                      placeholder="State"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setIsManualEdit(true);
                      }}
                      onFocus={() => setIsManualEdit(true)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      className="neu-input w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium"
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value);
                        setIsManualEdit(true);
                      }}
                      onFocus={() => setIsManualEdit(true)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Value Summary & Payment */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-black text-neu-text flex items-center gap-2 sm:gap-3">
                  <CreditCard className="text-[#667eea] w-6 h-6 sm:w-8 sm:h-8" />
                  Payment
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 ${
                      paymentMethod === "COD"
                        ? "shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] text-[#667eea]"
                        : "neu-flat text-gray-500 hover:text-[#667eea] cursor-pointer"
                    }`}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <Truck size={24} className="sm:w-8 sm:h-8" />
                    <span className="font-bold text-xs sm:text-base text-center">
                      Cash On Delivery
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 ${
                      paymentMethod === "Online"
                        ? "shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] text-[#667eea]"
                        : "neu-flat text-gray-500 hover:text-[#667eea] cursor-pointer"
                    }`}
                    onClick={() => setPaymentMethod("Online")}
                  >
                    <CreditCard size={24} className="sm:w-8 sm:h-8" />
                    <span className="font-bold text-xs sm:text-base text-center">
                      Online Payment
                    </span>
                  </button>
                </div>

                <div className="bg-neu-base shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-gray-500 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{subTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm sm:text-base">
                    <span>Delivery Fee</span>
                    <span className="font-bold">₹{deliveryFee}</span>
                  </div>
                  <div className="h-px bg-gray-300 my-1 sm:my-2" />
                  <div className="flex justify-between text-lg sm:text-xl font-black text-neu-text">
                    <span>Total</span>
                    <span className="text-[#667eea]">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <AnimatePresence>
                {address && city && state && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    type="button"
                    className="w-full py-3 sm:py-5 rounded-[20px] sm:rounded-[25px] neu-button text-lg sm:text-xl font-black text-[#667eea] flex items-center justify-center gap-2 sm:gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    onClick={() => {
                      if (paymentMethod === "COD") {
                        handleCODOrder();
                      } else {
                        handleOnlineOrder();
                      }
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <CircleDollarSignIcon
                          size={20}
                          className="sm:w-6 sm:h-6"
                        />
                        {paymentMethod === "Online"
                          ? `Pay ₹${totalAmount}`
                          : "Place Order"}
                      </>
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
}
