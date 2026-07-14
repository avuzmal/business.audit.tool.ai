"use client";

import { useState } from "react";
import { AuditForm } from "@/components/AuditForm";
import { LoadingState } from "@/components/LoadingState";
import { SuccessState } from "@/components/SuccessState";
import { motion } from "framer-motion";

export default function Home() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [userEmail, setUserEmail] = useState("");

  const handleStart = () => {
    setFormState("loading");
  };

  const handleSuccess = (email: string) => {
    setUserEmail(email);
    setFormState("success");
  };

  const handleError = () => {
    setFormState("error");
  };

  return (
    <main className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden selection:bg-[var(--color-teal)] selection:text-[var(--color-navy-deep)]">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header / Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <div className="inline-block mb-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-[var(--color-teal)] tracking-wide shadow-[0_0_15px_rgba(20,184,166,0.1)]">
            AI-Powered Workflow Analysis
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Discover Where Your Business is <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-teal)] to-blue-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              Losing Hours
            </span>.
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-slate-gray)] max-w-2xl mx-auto font-light leading-relaxed">
            Get a Free AI Automation Audit in 60 Seconds. We&apos;ll analyze your workflow and calculate your exact ROI potential.
          </p>
        </motion.div>

        {/* Dynamic Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Glass Form Container */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden">
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-3xl"></div>
            
            <div className="relative z-10">
              {formState === "idle" || formState === "error" ? (
                <>
                  {formState === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-center backdrop-blur-sm"
                    >
                      Something went wrong. Please try again or email us directly.
                    </motion.div>
                  )}
                  <AuditForm 
                    onSubmitStart={handleStart} 
                    onSubmitSuccess={handleSuccess} 
                    onSubmitError={handleError} 
                  />
                </>
              ) : formState === "loading" ? (
                <LoadingState />
              ) : (
                <SuccessState email={userEmail} />
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
