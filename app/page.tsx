"use client";

import { useState } from "react";
import { AuditForm } from "@/components/AuditForm";
import { LoadingState } from "@/components/LoadingState";
import { SuccessState } from "@/components/SuccessState";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

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
    <main className="min-h-screen bg-[#020617] text-slate-50 selection:bg-teal-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-600/15 rounded-full mix-blend-screen blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full mix-blend-screen blur-[120px] animate-blob" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full mix-blend-screen blur-[120px] animate-blob" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10 lg:grid lg:grid-cols-12 min-h-screen">
        
        {/* Left Side: Hero & Branding (Sticky on Desktop) */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-24 lg:sticky lg:top-0 lg:h-screen">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 max-w-2xl"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-teal-400 tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.15)]">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Workflow Analysis</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Discover Where <br/>Your Business is <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 drop-shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                Losing Hours
              </span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed">
              Get a custom AI Automation Audit in 60 seconds. We&apos;ll analyze your exact workflow and calculate your true ROI potential.
            </p>

            <div className="hidden lg:flex items-center space-x-4 pt-8 text-slate-500">
              <span className="text-sm uppercase tracking-widest font-semibold">Start the audit</span>
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive Wizard */}
        <div className="lg:col-span-7 xl:col-span-6 p-4 sm:p-8 lg:p-12 xl:p-16 flex items-center justify-center min-h-screen">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl relative"
          >
            {/* Ultra Premium Glass Form Container */}
            <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
              
              <div className="relative z-10">
                {formState === "idle" || formState === "error" ? (
                  <>
                    {formState === "error" && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
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

      </div>
    </main>
  );
}
