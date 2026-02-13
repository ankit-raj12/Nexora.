"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import GoogleImage from "../../assets/google.png";
import { AlertCircle, Eye, EyeOff, Key, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neu-base font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-neu-base p-10 mx-4 rounded-[30px] neu-flat w-105"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-neu-text tracking-wider">
          LOGIN
        </h1>
        <form className="flex flex-col space-y-6" onSubmit={handleLogin}>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neu-text/50 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-12 pr-6 py-4 rounded-[15px] neu-input text-neu-text placeholder-gray-400 outline-none transition-all focus:text-neu-text"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-neu-text/50 w-5 h-5 text-gray-400" />
              {visible ? (
                <EyeOff
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neu-text/50 w-5 h-5 text-gray-400 cursor-pointer"
                  onClick={() => setVisible((prev) => !prev)}
                />
              ) : (
                <Eye
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neu-text/50 w-5 h-5 text-gray-400 cursor-pointer"
                  onClick={() => setVisible((prev) => !prev)}
                />
              )}

              <input
                type={`${visible ? "text" : "password"}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-6 py-4 rounded-[15px] neu-input text-neu-text placeholder-gray-400 outline-none transition-all focus:text-neu-text"
              />
            </motion.div>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute flex items-center gap-2 text-[12px]"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-500 font-semibold">{error}</p>
              </motion.div>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center text-sm text-gray-500 font-medium"
          >
            {`Don't have an account?`}{" "}
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-600 transition-colors font-bold"
            >
              Register
            </Link>
          </motion.p>

          {(() => {
            const isValidForm = email !== "" && password !== "";

            return (
              <motion.input
                whileHover={isValidForm ? { scale: 1.02 } : ""}
                whileTap={isValidForm ? { scale: 0.98 } : ""}
                type="submit"
                value={`${isLoading ? "Logging in..." : "Login"} `}
                disabled={!isValidForm}
                className={`w-full py-3 rounded-[15px] neu-button text-neu-text  tracking-widest mt-2 font-bold ${isValidForm ? "cursor-pointer" : "cursor-not-allowed"}`}
              />
            );
          })()}
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center my-6"
        >
          <div className="h-px bg-gray-300 w-full rounded-full shadow-[0_1px_0_#fff]"></div>
          <span className="text-gray-400 mx-4 text-xs font-bold uppercase tracking-wider">
            Or
          </span>
          <div className="h-px bg-gray-300 w-full rounded-full shadow-[0_1px_0_#fff]"></div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-[15px] neu-button text-neu-text flex items-center justify-center space-x-3 cursor-pointer"
          onClick={() => {
            signIn("google", {
              callbackUrl: "/",
            });
          }}
        >
          <Image
            className="w-5 h-5 opacity-80"
            src={GoogleImage}
            alt="Google"
          />
          <span className="font-semibold">Sign in with Google</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
