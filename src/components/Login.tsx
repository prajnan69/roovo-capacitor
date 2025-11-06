"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/services/api";
import { Spinner } from "./ui/shadcn-io/spinner";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  title?: string;
  subtitle?: string;
  redirectPath?: string;
}

const slideVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 },
};

export default function Login({
  isOpen,
  onClose,
  onLoginSuccess,
  title,
  subtitle,
  redirectPath,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 350); // Match animation duration
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      onLoginSuccess();
      if (redirectPath) setIsRedirecting(true);
      else handleClose();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRedirecting && redirectPath) {
      window.location.href = redirectPath;
    }
  }, [isRedirecting, redirectPath]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-white text-neutral-900 flex flex-col"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-end p-4">
            <button
              onClick={handleClose}
              className="text-neutral-500 text-2xl hover:text-neutral-800 transition"
            >
              &times;
            </button>
          </div>

          {/* Content */}
          {isRedirecting ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <Spinner size={48} />
              <h2 className="text-xl font-bold mt-6">Redirecting...</h2>
              <p className="mt-2 text-neutral-500">Please wait a moment.</p>
            </div>
          ) : (
            <form
              className="flex-1 flex flex-col justify-center px-6 space-y-6"
              onSubmit={handleLogin}
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex justify-center">
                  <img src="/logo.png" alt="Logo" className="h-12" />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-2">
                <h2 className="text-2xl font-semibold text-neutral-900">
                  {subtitle || "Welcome back"}
                </h2>
                <p className="text-neutral-500 mt-1">Sign in to continue</p>
              </motion.div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-medium text-neutral-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-100 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <label className="block text-sm font-medium text-neutral-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-100 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.96 }}
                className="w-full mt-4 bg-indigo-500 text-white font-semibold py-3 rounded-2xl active:bg-indigo-600 transition-all disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Continue"}
              </motion.button>
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
