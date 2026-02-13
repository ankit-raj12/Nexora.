"use client";

import { ArrowRight, Bike, User, UserCog } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
function EditRoleMobile() {
  const [role, setRole] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);
  const [mobile, setMobile] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const handleEdit = async () => {
    try {
      await fetch("/api/user/edit-role", {
        method: "POST",
        body: JSON.stringify({ role: selectedRole, mobile }),
      }).then((res) => res.json());
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const result = await fetch("/api/check-for-admin", {
          method: "POST",
        }).then((res) => res.json());
        if (result.existAdmin) {
          setRole((prev) => prev.filter((r) => r.id !== "admin"));
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkForAdmin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neu-base font-sans p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-neu-base p-10 rounded-[30px] neu-flat w-full max-w-3xl flex flex-col items-center"
      >
        <h1 className="text-3xl font-bold mb-10 text-center text-neu-text tracking-wider">
          SELECT YOUR ROLE
        </h1>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 w-full mb-10 place-items-center">
          {role.map((roleItem) => {
            const Icon = roleItem.icon;
            const isSelected = selectedRole == roleItem.id;
            return (
              <motion.div
                whileTap={{ scale: 0.95 }}
                key={roleItem.id}
                className={`flex flex-col items-center justify-center w-full md:w-48 h-40 rounded-[20px] cursor-pointer transition-all duration-300
                  ${
                    isSelected
                      ? "shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] text-blue-500"
                      : "neu-flat text-neu-text hover:text-blue-500"
                  }`}
                onClick={() => setSelectedRole(roleItem.id)}
              >
                <Icon className="w-10 h-10 mb-3" />
                <span className="font-semibold tracking-wide">
                  {roleItem.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: selectedRole ? 1 : 0,
            height: selectedRole ? "auto" : 0,
          }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col space-y-2 mb-8">
              <label
                htmlFor="mobile"
                className="ml-4 text-sm font-semibold text-neu-text"
              >
                Enter your mobile number
              </label>
              <div className="relative">
                <input
                  id="mobile"
                  type="tel"
                  placeholder="eg. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-6 py-4 rounded-[15px] neu-input text-neu-text placeholder-gray-400 outline-none transition-all focus:text-neu-text"
                />
              </div>
            </div>

            <motion.button
              whileHover={
                selectedRole && mobile.length >= 10 ? { scale: 1.02 } : ""
              }
              whileTap={
                selectedRole && mobile.length >= 10 ? { scale: 0.98 } : ""
              }
              disabled={!selectedRole || mobile.length < 10}
              className={`w-full py-4 rounded-[15px] neu-button tracking-widest font-bold flex items-center justify-center gap-2
                ${
                  selectedRole && mobile.length >= 10
                    ? "cursor-pointer text-black"
                    : "cursor-not-allowed text-gray-400"
                }`}
              onClick={handleEdit}
            >
              Start Journey
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default EditRoleMobile;
