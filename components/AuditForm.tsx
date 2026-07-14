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
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface AuditFormProps {
  onSubmitStart: () => void;
  onSubmitSuccess: (email: string) => void;
  onSubmitError: () => void;
}

export function AuditForm({ onSubmitStart, onSubmitSuccess, onSubmitError }: AuditFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
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
  const toolsToShow = INDUSTRY_TOOLS[selectedIndustry] || INDUSTRY_TOOLS["Other"];

  const nextStep = async () => {
    let fieldsToValidate: (keyof AuditFormData)[] = [];
    if (step === 1) fieldsToValidate = ["businessName", "industry", "teamSize"];
    if (step === 2) fieldsToValidate = ["mainTasks", "currentTools", "hoursPerWeek"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const processForm = async (data: AuditFormData) => {
    onSubmitStart();
    try {
      // Artificial delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Webhook failed");
        }
      } else {
        // Fallback for development if no webhook is provided
        console.log("No webhook provided, simulating success", data);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      onSubmitSuccess(data.email);
    } catch (error) {
      console.error("Submission error:", error);
      onSubmitError();
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-[var(--color-slate-gray)]">Step {step} of {totalSteps}</span>
          <span className="text-sm font-medium text-[var(--color-teal)]">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-[var(--color-navy-deep)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--color-teal)] to-blue-400 shadow-[0_0_10px_rgba(20,184,166,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(processForm)} className="space-y-6">
        {/* Anti-spam honeypot */}
        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <Label htmlFor="businessName" className="text-[var(--color-offwhite)] font-semibold tracking-wide">Business Name</Label>
                <Input 
                  id="businessName" 
                  placeholder="e.g. Acme Corp" 
                  className="bg-white/5 border-white/10 focus:ring-2 focus:ring-[var(--color-teal)]/50 text-white placeholder:text-white/30 h-12 text-lg transition-all"
                  {...register("businessName")} 
                />
                {errors.businessName && <p className="text-red-400 text-sm">{errors.businessName.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="industry" className="text-[var(--color-offwhite)] font-semibold tracking-wide">Industry</Label>
                <Select 
                  id="industry" 
                  className="bg-white/5 border-white/10 focus:ring-2 focus:ring-[var(--color-teal)]/50 text-white h-12 text-lg transition-all"
                  {...register("industry")}
                >
                  <option value="">Select an industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </Select>
                {errors.industry && <p className="text-red-400 text-sm">{errors.industry.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="teamSize" className="text-[var(--color-offwhite)] font-semibold tracking-wide">Team Size</Label>
                <Select 
                  id="teamSize" 
                  className="bg-white/5 border-white/10 focus:ring-2 focus:ring-[var(--color-teal)]/50 text-white h-12 text-lg transition-all"
                  {...register("teamSize")}
                >
                  <option value="">Select team size</option>
                  {TEAM_SIZES.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </Select>
                {errors.teamSize && <p className="text-red-400 text-sm">{errors.teamSize.message}</p>}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <Label htmlFor="mainTasks" className="text-[var(--color-offwhite)] font-semibold tracking-wide">Main Repetitive Tasks</Label>
                <Textarea 
                  id="mainTasks" 
                  placeholder="Describe tasks that take up a lot of time (e.g., manual data entry, emailing clients, generating reports...)" 
                  className="bg-white/5 border-white/10 focus:ring-2 focus:ring-[var(--color-teal)]/50 text-white placeholder:text-white/30 min-h-[120px] text-lg transition-all resize-none"
                  {...register("mainTasks")} 
                />
                {errors.mainTasks && <p className="text-red-400 text-sm">{errors.mainTasks.message}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-[var(--color-offwhite)] font-semibold tracking-wide">Current Tools Used</Label>
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
                            className="flex items-center space-x-3 p-4 rounded-xl border border-white/10 hover:border-[var(--color-teal)]/50 cursor-pointer transition-colors bg-white/5 backdrop-blur-sm shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.15)]"
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
                            <span className="text-base text-[var(--color-offwhite)] font-medium">{tool}</span>
                          </motion.label>
                        ))}
                      </>
                    )}
                  />
                </div>
                {errors.currentTools && <p className="text-red-400 text-sm">{errors.currentTools.message}</p>}
              </div>

              <div className="space-y-4 pt-2">
                <Label htmlFor="hoursPerWeek" className="text-[var(--color-offwhite)] font-semibold tracking-wide">Estimated Hours Spent on Repetitive Tasks (per week)</Label>
                <div className="flex items-center space-x-6 bg-white/5 p-6 rounded-xl border border-white/10 shadow-inner">
                  <Input 
                    type="range" 
                    min="1" 
                    max="100" 
                    className="flex-1 accent-[var(--color-teal)] bg-white/20 h-2 rounded-lg appearance-none cursor-pointer"
                    {...register("hoursPerWeek", { valueAsNumber: true })} 
                  />
                  <span className="w-16 text-center font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-teal)] to-blue-400 drop-shadow-sm">{watch("hoursPerWeek")}h</span>
                </div>
                {errors.hoursPerWeek && <p className="text-red-400 text-sm">{errors.hoursPerWeek.message}</p>}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <Label htmlFor="painPoint" className="text-[var(--color-offwhite)] font-semibold tracking-wide">Biggest Pain Point</Label>
                <Textarea 
                  id="painPoint" 
                  placeholder="What is the #1 bottleneck in your current workflow?" 
                  className="bg-white/5 border-white/10 focus:ring-2 focus:ring-[var(--color-teal)]/50 text-white placeholder:text-white/30 min-h-[100px] text-lg transition-all resize-none"
                  {...register("painPoint")} 
                />
                {errors.painPoint && <p className="text-red-400 text-sm">{errors.painPoint.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[var(--color-offwhite)] font-semibold tracking-wide">Where should we send your report?</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@company.com" 
                  className="bg-white/5 border-white/10 focus:ring-2 focus:ring-[var(--color-teal)]/50 text-white placeholder:text-white/30 h-12 text-lg transition-all"
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
                      onCheckedChange={(checked) => field.onChange(checked)}
                      className="mt-1"
                    />
                  )}
                />
                <Label htmlFor="contentOptIn" className="text-sm text-[var(--color-slate-gray)] leading-relaxed font-normal cursor-pointer hover:text-white transition-colors">
                  <span className="text-[var(--color-teal)] mr-1">🔒 Privacy first:</span> We never share your data. But if we hit a massive ROI for your business, would you be open to us sharing an anonymized version of your audit as a case study?
                </Label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between pt-8 mt-8 border-t border-white/10">
          {step > 1 ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="button" variant="outline" onClick={prevStep} className="bg-transparent border-white/20 text-white hover:bg-white/10 h-12 px-8 rounded-xl font-semibold tracking-wide transition-all">
                Back
              </Button>
            </motion.div>
          ) : (
            <div></div>
          )}
          
          {step < totalSteps ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-[var(--color-teal)] to-blue-500 hover:from-[var(--color-teal-glow)] hover:to-blue-400 text-[#020617] h-12 px-8 rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all border-none">
                Next Step
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="bg-gradient-to-r from-[var(--color-teal)] to-blue-500 hover:from-[var(--color-teal-glow)] hover:to-blue-400 text-[#020617] h-12 px-8 rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all border-none">
                Get My Free Audit
              </Button>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
}
