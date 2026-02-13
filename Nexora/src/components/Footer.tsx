"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  ShoppingBag,
  Heart,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Package,
  Shield,
  Truck,
} from "lucide-react";

export default function Footer() {
  const { userData } = useSelector((state: RootState) => state.user);

  // Role-specific quick links
  const getQuickLinks = () => {
    if (!userData) {
      return [
        { label: "Login", href: "/login" },
        { label: "Register", href: "/register" },
      ];
    }

    switch (userData.role) {
      case "user":
        return [
          { label: "My Orders", href: "/user/my-order" },
          { label: "Cart", href: "/user/cart" },
        ];
      case "deliveryBoy":
        return [
          { label: "Dashboard", href: "/" },
          { label: "Orders", href: "/" },
        ];
      case "admin":
        return [
          { label: "Dashboard", href: "/" },
          { label: "Manage", href: "/admin/manage-orders" },
        ];
      default:
        return [];
    }
  };

  const quickLinks = getQuickLinks();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-neu-base relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-16"
      >
        {/* Main Content - Single Row on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-12 mb-5 md:mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center md:text-left"
          >
            <h2 className="text-2xl md:text-4xl font-black mb-2 md:mb-3">
              <span className="bg-linear-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Nexora
              </span>
            </h2>
            <p className="text-gray-600 font-medium text-xs md:text-sm mb-3 md:mb-4 max-w-xs mx-auto md:mx-0">
              Lightning fast delivery. Fresh products, happy customers.
            </p>

            {/* Contact */}
            <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <motion.a
                href="tel:+911234567890"
                whileHover={{ x: 3 }}
                className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-[#667eea] transition-colors"
              >
                <Phone size={12} className="md:w-3.5 md:h-3.5" />
                <span className="font-semibold">+91 7654954462</span>
              </motion.a>
              <motion.a
                href="mailto:heyitsankitraj@gmail.com"
                whileHover={{ x: 3 }}
                className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-[#667eea] transition-colors"
              >
                <Mail size={12} className="md:w-3.5 md:h-3.5" />
                <span className="font-semibold">heyitsankitraj@gmail.com</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h3 className="text-base md:text-lg font-black text-neu-text mb-3 md:mb-4 flex items-center justify-center gap-2">
              {userData?.role === "user" && <ShoppingBag size={16} className="text-[#667eea] md:w-4.5 md:h-4.5" />}
              {userData?.role === "deliveryBoy" && <Truck size={16} className="text-[#667eea] md:w-4.5 md:h-4.5" />}
              {userData?.role === "admin" && <Shield size={16} className="text-[#667eea] md:w-4.5 md:h-4.5" />}
              {!userData && <Package size={16} className="text-[#667eea] md:w-4.5 md:h-4.5" />}
              Quick Links
            </h3>
            <div className="flex flex-wrap justify-center gap-2.5 md:gap-4">
              {quickLinks.map((link, index) => (
                <motion.div key={index} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={link.href}
                    className="neu-button px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-[#667eea] hover:text-[#764ba2] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              </motion.div>
            </div>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center md:text-right"
          >
            <h3 className="text-base md:text-lg font-black text-neu-text mb-3 md:mb-4">Stay Connected</h3>
            
            {/* Social Icons */}
            <div className="flex justify-center md:justify-end gap-2.5 md:gap-3 mb-0">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="neu-flat p-2 md:p-3 rounded-lg md:rounded-xl text-gray-600 hover:text-[#667eea] transition-colors cursor-pointer"
                  aria-label={social.label}
                >
                  <social.icon size={16} className="md:w-4.5 md:h-4.5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-300/30 pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4"
        >
          <p className="text-[10px] md:text-sm text-gray-600 font-semibold text-center md:text-left">
            © {new Date().getFullYear()} Nexora. Made with{" "}
            <Heart size={12} className="inline text-red-500 fill-current animate-pulse" /> in India
          </p>
        </motion.div>
      </motion.div>

    </footer>
  );
}
