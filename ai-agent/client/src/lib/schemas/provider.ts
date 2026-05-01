import { z } from "zod";

export const apiFormatSchema = z.enum(["openai", "anthropic", "openai-compatible"]);

export const providerFormSchema = z.object({
  name: z.string().min(1, "Provider name is required"),
  apiKey: z.string().min(1, "API key is required"),
  baseUrl: z.string().min(1, "Base URL is required").refine(
    (v) => { try { new URL(v); return true; } catch { return false; } },
    "Must be a valid URL",
  ),
  model: z.string().optional(),
  apiFormat: apiFormatSchema,
  websiteUrl: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  icon: z.string().optional(),
  iconColor: z.string().optional(),
});

export type ProviderFormValues = z.infer<typeof providerFormSchema>;
