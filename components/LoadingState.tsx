"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const loadingTexts = [
  "Analyzing workflow...",
  "Calculating ROI potential...",
  "Generating custom report...",
];

export function LoadingState() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-12 space-y-8 min-h-[300px]"
    >
      <div className="relative w-64 h-2 bg-[var(--color-navy-light)] rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-[var(--color-teal)]"
          initial={{ width: "0%", left: "0%" }}
          animate={{ 
            width: ["0%", "50%", "100%", "50%", "0%"],
            left: ["0%", "25%", "0%", "50%", "100%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      <motion.p
        key={textIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-[var(--color-teal)] text-lg font-medium text-center"
      >
        {loadingTexts[textIndex]}
      </motion.p>
    </motion.div>
  );
}
