"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessStateProps {
  email: string;
}

export function SuccessState({ email }: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center space-y-6 min-h-[300px]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <CheckCircle2 className="w-20 h-20 text-[var(--color-teal)]" />
      </motion.div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--color-offwhite)]">
          Audit Successfully Initiated
        </h2>
        <p className="text-[var(--color-slate-gray)] max-w-md">
          Your AI Automation Audit is on its way to <span className="text-[var(--color-teal)] font-medium">{email}</span>! Check your inbox in ~30 seconds.
        </p>
      </div>
    </motion.div>
  );
}
