"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverGlow?: boolean;
  glowColor?: "instagram" | "linkedin" | "shorts" | "default";
}

export default function GlassCard({
  children,
  className = "",
  onClick,
  hoverGlow = true,
  glowColor = "default",
}: GlassCardProps) {
  const glowClasses = {
    instagram: "hover:border-instagram-pink/30 hover:shadow-[0_0_25px_rgba(217,70,239,0.15)]",
    linkedin: "hover:border-linkedin-blue/30 hover:shadow-[0_0_25px_rgba(14,165,233,0.15)]",
    shorts: "hover:border-shorts-red/30 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]",
    default: "hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]",
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        glass-effect rounded-2xl p-6 transition-all duration-300
        ${onClick ? "cursor-pointer" : ""}
        ${hoverGlow ? glowClasses[glowColor] : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
