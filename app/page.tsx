"use client";

import { useState } from "react";
import { AuditForm } from "@/components/AuditForm";
import { LoadingState } from "@/components/LoadingState";
import { SuccessState } from "@/components/SuccessState";

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
    <main className="min-h-screen bg-[var(--color-navy-deep)] text-[var(--color-offwhite)] py-12 px-4 sm:px-6 lg:px-8 selection:bg-[var(--color-teal)] selection:text-[var(--color-navy-deep)]">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header / Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Discover Where Your Business is <span className="text-[var(--color-teal)]">Losing Hours</span>.
          </h1>
          <p className="text-xl text-[var(--color-slate-gray)] max-w-2xl mx-auto">
            Get a Free AI Automation Audit in 60 Seconds. We&apos;ll analyze your workflow and calculate your exact ROI potential.
          </p>
        </div>

        {/* Dynamic Content Area */}
        <div className="mt-8">
          {formState === "idle" || formState === "error" ? (
            <>
              {formState === "error" && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-center">
                  Something went wrong. Please try again or email us directly.
                </div>
              )}
              <AuditForm 
                onSubmitStart={handleStart} 
                onSubmitSuccess={handleSuccess} 
                onSubmitError={handleError} 
              />
            </>
          ) : formState === "loading" ? (
            <div className="bg-[var(--color-navy-light)] rounded-2xl shadow-2xl border border-[var(--color-slate-gray)]/30">
              <LoadingState />
            </div>
          ) : (
            <div className="bg-[var(--color-navy-light)] rounded-2xl shadow-2xl border border-[var(--color-slate-gray)]/30 border-t-[var(--color-teal)] border-t-4">
              <SuccessState email={userEmail} />
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
