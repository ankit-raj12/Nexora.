"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/Nexora.png";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface UserInterface {
  _id?: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}


const Nav = ({
  user,
  currentPage,
}: {
  user: UserInterface;
  currentPage: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  const profileDropDown = useRef<HTMLDivElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const { cartData } = useSelector((state: RootState) => state.cart);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (pathname === "/") {
      if (value.trim()) {
        router.push(`/?search=${encodeURIComponent(value)}`);
      } else {
        router.push("/");
      }
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setsearchOpen(false);
    if (pathname === "/") {
      router.push("/");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }

      if (
        searchOpen &&
        searchFormRef.current &&
        !searchFormRef.current.contains(e.target as Node)
      ) {
        setsearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [searchOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav
          className="w-full max-w-7xl bg-neu-base neu-flat rounded-[30px] h-16 md:h-24 px-6 md:px-8 flex items-center justify-between transition-all duration-300 relative"
          style={{ zIndex: 100 }}
        >
          {/* Logo Section */}
          {!searchOpen && (
            <Link href="/" className="shrink-0 group">
              <div className="relative w-22 md:w-32 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={logo}
                  alt="Xpressa"
                  className="w-full h-auto object-contain drop-shadow-md"
                />
              </div>
            </Link>
          )}

          {/* Desktop Search Bar - Only for Users */}
          {user.role === "user" &&
            !searchOpen &&
            currentPage !== "categories" && (
              <form 
                className="hidden md:flex items-center flex-1 max-w-xl mx-8 relative"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative w-full group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#667eea] transition-colors duration-300">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="What are you craving?"
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-[20px] neu-input bg-transparent text-neu-text placeholder-gray-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-[#667eea]/10"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            )}

          {/* Mobile Search Form (Full Width) */}
          {searchOpen ? (
            <form
              ref={searchFormRef}
              className="flex w-full items-center gap-2 md:gap-4 animate-in fade-in zoom-in duration-300"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative w-full">
                <Search className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 text-[#667eea] w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 md:pl-14 pr-4 py-2.5 md:py-4 rounded-xl md:rounded-[20px] neu-input text-sm md:text-lg text-neu-text placeholder-gray-400 outline-none"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={handleClearSearch}
                className="neu-button w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </form>
          ) : (
            /* Actions Section */
            <div className="flex items-center gap-4 md:gap-6">
              {/* Mobile Search Toggle */}
              {user.role === "user" && currentPage !== "categories" &&(
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setsearchOpen(true);
                  }}
                  className="md:hidden neu-button w-10 h-10 rounded-full flex items-center justify-center text-neu-text hover:text-[#667eea] transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* User Cart */}
              {user.role === "user" && (
                <Link
                  href="/user/cart"
                  className="neu-button relative w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-neu-text hover:text-[#667eea] transition-colors group"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  <span
                    className={`absolute top-0 right-0 md:top-1 md:right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-[10px] md:text-xs min-w-5 h-5 md:h-6 flex items-center justify-center rounded-full font-bold shadow-md transform transition-transform duration-300 origin-bottom-left group-hover:scale-110 ${
                      cartData.length > 0 ? "scale-100" : "scale-0"
                    }`}
                  >
                    {cartData.length ? cartData.length : "0"}
                  </span>
                </Link>
              )}

              {/* Admin Actions (Desktop) */}
              {user.role === "admin" && (
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href="/admin/add-item"
                    className="neu-button h-12 px-6 rounded-[18px] flex items-center gap-2 text-sm font-bold text-neu-text hover:text-[#667eea] transition-all hover:scale-105 active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Item</span>
                  </Link>

                  <Link
                    href="/admin/listings"
                    className="neu-button h-12 w-12 rounded-[18px] flex items-center justify-center text-neu-text hover:text-[#667eea] transition-all hover:scale-105 active:scale-95"
                    title="View Listings"
                  >
                    <Boxes className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/admin/manage-orders"
                    className="neu-button h-12 w-12 rounded-[18px] flex items-center justify-center text-neu-text hover:text-[#667eea] transition-all hover:scale-105 active:scale-95"
                    title="Manage Orders"
                  >
                    <ClipboardList className="w-5 h-5" />
                  </Link>
                </div>
              )}

              {/* Profile Dropdown (Desktop Only) */}
              <div className="relative hidden md:block" ref={profileDropDown}>
                <button
                  className="neu-button w-12 h-12 rounded-full p-1 flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-transform"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6 text-neu-text" />
                  )}
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-16 right-0 w-72 bg-neu-base neu-flat rounded-[25px] p-5 flex flex-col gap-4 z-100 origin-top-right border border-white/20"
                    >
                      <div className="flex items-center gap-4 pb-4 border-b border-gray-200/50">
                        <div className="w-12 h-12 rounded-full neu-button flex items-center justify-center overflow-hidden shrink-0 relative">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-neu-text" />
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-bold text-neu-text truncate">
                            {user.name}
                          </span>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {user.role === "user" && (
                          <Link
                            href="/user/my-order"
                            className="neu-button group w-full p-3 rounded-[15px] flex items-center gap-3 text-sm font-bold text-neu-text hover:text-[#667eea] transition-all"
                            onClick={() => setOpen(false)}
                          >
                            <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            My Orders
                          </Link>
                        )}

                        <button
                          className="neu-button group w-full p-3 rounded-[15px] flex items-center gap-3 text-sm font-bold text-neu-text hover:text-red-500 transition-all"
                          onClick={() => {
                            setOpen(false);
                            signOut({ callbackUrl: "/login" });
                          }}
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Hamburger Menu (Everyone) */}
              <button
                className="md:hidden neu-button w-10 h-10 rounded-full flex items-center justify-center text-neu-text hover:text-[#667eea] transition-colors"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-90 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 right-0 w-[65%] max-w-xs bg-neu-base z-100 md:hidden shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col p-5"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-black text-neu-text">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="neu-button w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 p-2.5 neu-flat rounded-[15px]">
                <div className="w-10 h-10 rounded-full neu-button flex items-center justify-center overflow-hidden shrink-0 border-2 border-transparent relative">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-neu-text" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neu-text">
                    {user.name}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {user.role === "user" && (
                  <Link
                    href="/user/my-order"
                    onClick={() => setMenuOpen(false)}
                    className="neu-button p-2.5 rounded-[15px] flex items-center gap-3 font-bold text-sm text-neu-text hover:text-[#667eea] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full neu-flat flex items-center justify-center text-[#667eea]">
                      <Package className="w-4 h-4" />
                    </div>
                    My Orders
                  </Link>
                )}
                {user.role === "admin" && (
                  <>
                    <Link
                      href="/admin/add-item"
                      onClick={() => setMenuOpen(false)}
                      className="neu-button p-2.5 rounded-[15px] flex items-center gap-3 font-bold text-sm text-neu-text hover:text-[#667eea] transition-all"
                    >
                      <div className="w-8 h-8 rounded-full neu-flat flex items-center justify-center text-[#667eea]">
                        <PlusCircle className="w-4 h-4" />
                      </div>
                      Add Item
                    </Link>
                    <Link
                      href="/admin/listings"
                      onClick={() => setMenuOpen(false)}
                      className="neu-button p-2.5 rounded-[15px] flex items-center gap-3 font-bold text-sm text-neu-text hover:text-[#667eea] transition-all"
                    >
                      <div className="w-8 h-8 rounded-full neu-flat flex items-center justify-center text-[#667eea]">
                        <Boxes className="w-4 h-4" />
                      </div>
                      View Listings
                    </Link>
                    <Link
                      href="/admin/manage-orders"
                      onClick={() => setMenuOpen(false)}
                      className="neu-button p-2.5 rounded-[15px] flex items-center gap-3 font-bold text-sm text-neu-text hover:text-[#667eea] transition-all"
                    >
                      <div className="w-8 h-8 rounded-full neu-flat flex items-center justify-center text-[#667eea]">
                        <ClipboardList className="w-4 h-4" />
                      </div>
                      Manage Orders
                    </Link>
                  </>
                )}

                <div className="h-px bg-gray-300 w-full my-1"></div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="neu-button p-2.5 rounded-[15px] flex items-center gap-3 font-bold text-sm text-neu-text hover:text-red-500 transition-all"
                >
                  <div className="w-8 h-8 rounded-full neu-flat flex items-center justify-center text-red-500">
                    <LogOut className="w-4 h-4" />
                  </div>
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
