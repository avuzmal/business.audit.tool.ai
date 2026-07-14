"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { auditSchema, type AuditFormData } from "@/lib/schema";
import { INDUSTRY_TOOLS, INDUSTRIES, TEAM_SIZES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingBag, Megaphone, Briefcase, Layers, Users } from "lucide-react";

interface AuditFormProps {
  onSubmitStart: () => void;
  onSubmitSuccess: (email: string) => void;
  onSubmitError: () => void;
}

const getIndustryIcon = (industry: string) => {
  switch (industry) {
    case "E-commerce": return <ShoppingBag className="w-6 h-6 mb-2" />;
    case "Marketing Agency": return <Megaphone className="w-6 h-6 mb-2" />;
    case "Consulting": return <Briefcase className="w-6 h-6 mb-2" />;
    default: return <Layers className="w-6 h-6 mb-2" />;
  }
};

export function AuditForm({ onSubmitStart, onSubmitSuccess, onSubmitError }: AuditFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
    mode: "onChange",
    defaultValues: {
      currentTools: [],
      hoursPerWeek: 10,
    },
  });

  const selectedIndustry = watch("industry");
  const selectedTeamSize = watch("teamSize");
  const toolsToShow = INDUSTRY_TOOLS[selectedIndustry] || INDUSTRY_TOOLS["Other"];

  const nextStep = async () => {
    let fieldsToValidate: (keyof AuditFormData)[] = [];
    if (step === 1) fieldsToValidate = ["businessName", "industry", "teamSize"];
    if (step === 2) fieldsToValidate = ["mainTasks", "currentTools", "hoursPerWeek"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const processForm = async (data: AuditFormData) => {
    onSubmitStart();
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Webhook failed");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      onSubmitSuccess(data.email);
    } catch (error) {
      console.error("Submission error:", error);
      onSubmitError();
    }
  };

  const slideVariants: import("framer-motion").Variants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 50 : -50,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -50 : 50,
      transition: { ease: "easeInOut", duration: 0.2 }
    })
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold tracking-wider uppercase text-slate-400">Step {step} of {totalSteps}</span>
          <span className="text-sm font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 to-blue-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(processForm)} className="relative overflow-hidden">
        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="space-y-3">
                  <Label htmlFor="businessName" className="text-slate-200 font-semibold tracking-wide text-sm uppercase">Business Name</Label>
                  <Input 
                    id="businessName" 
                    placeholder="e.g. Acme Corp" 
                    className="bg-slate-900/50 border-white/10 focus:ring-2 focus:ring-teal-500/50 text-white placeholder:text-slate-500 h-14 text-lg transition-all rounded-xl shadow-inner"
                    {...register("businessName")} 
                  />
                  {errors.businessName && <p className="text-red-400 text-sm mt-1">{errors.businessName.message}</p>}
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-200 font-semibold tracking-wide text-sm uppercase">Select Your Industry</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {INDUSTRIES.map((ind) => (
                      <motion.div
                        key={ind}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setValue("industry", ind, { shouldValidate: true })}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 
                          ${selectedIndustry === ind 
                            ? "bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.2)]" 
                            : "bg-slate-800/50 border-white/5 text-slate-400 hover:border-teal-500/30 hover:bg-slate-800"
                          }`}
                      >
                        {getIndustryIcon(ind)}
                        <span className="font-semibold text-sm">{ind}</span>
                      </motion.div>
                    ))}
                  </div>
                  {errors.industry && <p className="text-red-400 text-sm">{errors.industry.message}</p>}
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-200 font-semibold tracking-wide text-sm uppercase">Team Size</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {TEAM_SIZES.map((size) => (
                      <motion.div
                        key={size}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setValue("teamSize", size, { shouldValidate: true })}
                        className={`cursor-pointer py-3 rounded-xl border transition-all flex items-center justify-center text-center
                          ${selectedTeamSize === size 
                            ? "bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                            : "bg-slate-800/50 border-white/5 text-slate-400 hover:border-blue-500/30 hover:bg-slate-800"
                          }`}
                      >
                        <span className="font-bold">{size}</span>
                      </motion.div>
                    ))}
                  </div>
                  {errors.teamSize && <p className="text-red-400 text-sm">{errors.teamSize.message}</p>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="space-y-3">
                  <Label htmlFor="mainTasks" className="text-slate-200 font-semibold tracking-wide text-sm uppercase">Main Repetitive Tasks</Label>
                  <Textarea 
                    id="mainTasks" 
                    placeholder="Describe tasks that take up a lot of time (e.g., manual data entry, emailing clients, generating reports...)" 
                    className="bg-slate-900/50 border-white/10 focus:ring-2 focus:ring-teal-500/50 text-white placeholder:text-slate-500 min-h-[120px] text-lg transition-all resize-none rounded-xl p-4 shadow-inner"
                    {...register("mainTasks")} 
                  />
                  {errors.mainTasks && <p className="text-red-400 text-sm">{errors.mainTasks.message}</p>}
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-200 font-semibold tracking-wide text-sm uppercase">Current Tools Used</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Controller
                      name="currentTools"
                      control={control}
                      render={({ field }) => (
                        <>
                          {toolsToShow.map((tool) => (
                            <motion.label 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              key={tool} 
                              className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-colors shadow-sm
                                ${field.value?.includes(tool)
                                  ? "border-teal-400 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                                  : "border-white/5 bg-slate-800/50 hover:border-teal-500/30 hover:bg-slate-800"
                                }`}
                            >
                              <Checkbox
                                checked={field.value?.includes(tool) || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  field.onChange(
                                    checked
                                      ? [...(field.value || []), tool]
                                      : (field.value || []).filter((t) => t !== tool)
                                  );
                                }}
                              />
                              <span className="text-base text-slate-200 font-medium">{tool}</span>
                            </motion.label>
                          ))}
                        </>
                      )}
                    />
                  </div>
                  {errors.currentTools && <p className="text-red-400 text-sm">{errors.currentTools.message}</p>}
                </div>

                <div className="space-y-4 pt-4">
                  <Label htmlFor="hoursPerWeek" className="text-slate-200 font-semibold tracking-wide text-sm uppercase">Estimated Hours Wasted Weekly</Label>
                  <div className="flex items-center space-x-6 bg-slate-800/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                    <Input 
                      type="range" 
                      min="1" 
                      max="100" 
                      className="flex-1 accent-teal-400 bg-slate-700 h-3 rounded-lg appearance-none cursor-pointer"
                      {...register("hoursPerWeek", { valueAsNumber: true })} 
                    />
                    <span className="w-20 text-right font-black text-3xl text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-blue-500 drop-shadow-md">
                      {watch("hoursPerWeek")}h
                    </span>
                  </div>
                  {errors.hoursPerWeek && <p className="text-red-400 text-sm">{errors.hoursPerWeek.message}</p>}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="space-y-3">
                  <Label htmlFor="painPoint" className="text-slate-200 font-semibold tracking-wide text-sm uppercase">Biggest Pain Point</Label>
                  <Textarea 
                    id="painPoint" 
                    placeholder="What is the #1 bottleneck in your current workflow?" 
                    className="bg-slate-900/50 border-white/10 focus:ring-2 focus:ring-teal-500/50 text-white placeholder:text-slate-500 min-h-[140px] text-lg transition-all resize-none rounded-xl p-4 shadow-inner"
                    {...register("painPoint")} 
                  />
                  {errors.painPoint && <p className="text-red-400 text-sm">{errors.painPoint.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-slate-200 font-semibold tracking-wide text-sm uppercase">Where should we send your report?</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="founder@company.com" 
                    className="bg-slate-900/50 border-white/10 focus:ring-2 focus:ring-teal-500/50 text-white placeholder:text-slate-500 h-14 text-lg transition-all rounded-xl shadow-inner"
                    {...register("email")} 
                  />
                  {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
                </div>

                <div className="flex items-start space-x-4 pt-6 mt-4 border-t border-white/10">
                  <Controller
                    name="contentOptIn"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="contentOptIn"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="mt-1 flex-shrink-0"
                      />
                    )}
                  />
                  <Label htmlFor="contentOptIn" className="text-sm text-slate-400 leading-relaxed font-normal cursor-pointer hover:text-slate-200 transition-colors">
                    <span className="text-teal-400 mr-1 font-semibold">🔒 Privacy first:</span> We never share your data. But if we hit a massive ROI for your business, would you be open to us sharing an anonymized version of your audit as a case study?
                  </Label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between pt-8 mt-6 border-t border-white/10 relative z-20">
          {step > 1 ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="button" variant="outline" onClick={prevStep} className="bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white h-14 px-8 rounded-xl font-semibold tracking-wide transition-all shadow-sm">
                Go Back
              </Button>
            </motion.div>
          ) : (
            <div></div>
          )}
          
          {step < totalSteps ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 h-14 px-10 rounded-xl font-bold tracking-wide shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all border-none text-lg">
                Continue
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 h-14 px-10 rounded-xl font-black tracking-wide shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all border-none text-lg">
                Reveal My ROI
              </Button>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
}
