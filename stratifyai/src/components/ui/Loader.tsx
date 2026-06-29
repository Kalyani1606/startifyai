"use client";

import { motion } from "framer-motion";

interface LoaderProps {
  text?: string;
  subtext?: string;
}

export default function Loader({
  text = "Analyzing...",
  subtext = "Our AI product manager agent is processing your request",
}: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative w-24 h-24 mb-6">
        {/* Pulsing glow background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-violet-600/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer orbital ring */}
        <motion.div
          className="absolute inset-0 border-2 border-dashed border-violet-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Mid rotating ring */}
        <motion.div
          className="absolute inset-2 border-2 border-t-pink-500 border-r-transparent border-b-violet-500 border-l-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Center glowing core */}
        <motion.div
          className="absolute inset-6 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          animate={{
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.h3
        className="text-lg font-medium text-white tracking-wide"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.h3>

      <p className="text-sm text-gray-400 mt-2 max-w-xs">{subtext}</p>
    </div>
  );
}
