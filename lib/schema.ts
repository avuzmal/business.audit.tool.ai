import { z } from "zod";

export const auditSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().min(1, "Please select an industry"),
  teamSize: z.string().min(1, "Please select team size"),
  mainTasks: z.string().min(20, "Please describe at least 20 characters about your tasks"),
  currentTools: z.array(z.string()).min(1, "Select at least one tool"),
  hoursPerWeek: z.number().min(1).max(100, "Enter a number between 1 and 100"),
  painPoint: z.string().min(10, "Please describe your biggest pain point"),
  email: z.string().email("Invalid email address"),
});

export type AuditFormData = z.infer<typeof auditSchema>;
