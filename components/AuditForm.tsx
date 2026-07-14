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
    <div className="w-full max-w-2xl mx-auto p-8 bg-[var(--color-navy-light)] rounded-2xl shadow-2xl border border-[var(--color-slate-gray)]/30">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-[var(--color-slate-gray)]">Step {step} of {totalSteps}</span>
          <span className="text-sm font-medium text-[var(--color-teal)]">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-[var(--color-navy-deep)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-teal)]"
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
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="e.g. Acme Corp" {...register("businessName")} />
                {errors.businessName && <p className="text-red-400 text-sm">{errors.businessName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select id="industry" {...register("industry")}>
                  <option value="">Select an industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </Select>
                {errors.industry && <p className="text-red-400 text-sm">{errors.industry.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Select id="teamSize" {...register("teamSize")}>
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
              <div className="space-y-2">
                <Label htmlFor="mainTasks">Main Repetitive Tasks</Label>
                <Textarea 
                  id="mainTasks" 
                  placeholder="Describe tasks that take up a lot of time (e.g., manual data entry, emailing clients, generating reports...)" 
                  {...register("mainTasks")} 
                />
                {errors.mainTasks && <p className="text-red-400 text-sm">{errors.mainTasks.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Current Tools Used</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Controller
                    name="currentTools"
                    control={control}
                    render={({ field }) => (
                      <>
                        {toolsToShow.map((tool) => (
                          <label key={tool} className="flex items-center space-x-3 p-3 rounded-md border border-[var(--color-slate-gray)]/50 hover:border-[var(--color-teal)]/50 cursor-pointer transition-colors bg-[var(--color-navy-deep)]/50">
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
                            <span className="text-sm text-[var(--color-offwhite)] font-medium">{tool}</span>
                          </label>
                        ))}
                      </>
                    )}
                  />
                </div>
                {errors.currentTools && <p className="text-red-400 text-sm">{errors.currentTools.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hoursPerWeek">Estimated Hours Spent on Repetitive Tasks (per week)</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="range" 
                    min="1" 
                    max="100" 
                    className="flex-1 accent-[var(--color-teal)] bg-[var(--color-slate-gray)] h-2 rounded-lg appearance-none cursor-pointer"
                    {...register("hoursPerWeek", { valueAsNumber: true })} 
                  />
                  <span className="w-12 text-center font-bold text-lg text-[var(--color-teal)]">{watch("hoursPerWeek")}h</span>
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
              <div className="space-y-2">
                <Label htmlFor="painPoint">Biggest Pain Point</Label>
                <Textarea 
                  id="painPoint" 
                  placeholder="What is the #1 bottleneck in your current workflow?" 
                  {...register("painPoint")} 
                />
                {errors.painPoint && <p className="text-red-400 text-sm">{errors.painPoint.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Where should we send your report?</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@company.com" 
                  {...register("email")} 
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
              </div>

              <div className="flex items-start space-x-3 pt-4 border-t border-[var(--color-slate-gray)]/30">
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
                <Label htmlFor="contentOptIn" className="text-xs text-[var(--color-slate-gray)] leading-relaxed font-normal cursor-pointer">
                  🔒 Privacy first: We never share your data. But if we hit a massive ROI for your business, would you be open to us sharing an anonymized version of your audit as a case study?
                </Label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between pt-6 mt-8 border-t border-[var(--color-slate-gray)]/30">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < totalSteps ? (
            <Button type="button" onClick={nextStep}>
              Next Step
            </Button>
          ) : (
            <Button type="submit">
              Get My Free Audit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
