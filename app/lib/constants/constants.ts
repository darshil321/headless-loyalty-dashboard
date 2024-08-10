import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive"]),
  rules: z.array(z.string()).min(1, "At least one rule must be selected"),
});

export type TierFormData = z.infer<typeof formSchema>;

export const ruleOptions = [
  { value: "rule1", label: "Rule 1" },
  { value: "rule2", label: "Rule 2" },
  { value: "rule3", label: "Rule 3" },
];
