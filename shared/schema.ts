import { pgTable, text, serial, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const examples = pgTable("examples", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

export const insertExampleSchema = createInsertSchema(examples).omit({ id: true });

export type Example = typeof examples.$inferSelect;
export type InsertExample = z.infer<typeof insertExampleSchema>;

// Types for Biography Generation
export const generateBioSchema = z.object({
  nickname: z.string().min(1, "Nickname is required"),
  server: z.string().min(1, "Server/City is required"),
  familyMembers: z.number().min(0, "Family members must be 0 or more"),
  job: z.string().min(1, "Job is required"),
  age: z.number().min(1, "Age must be valid"),
  hasCriminalRecord: z.boolean(),
});

export type GenerateBioRequest = z.infer<typeof generateBioSchema>;

export const checkBioSchema = z.object({
  content: z.string().min(50, "Biography is too short"),
});

export type CheckBioRequest = z.infer<typeof checkBioSchema>;

export const checkBioResponseSchema = z.object({
  valid: z.boolean(),
  errors: z.array(z.string()),
  feedback: z.string().optional(),
});

export type CheckBioResponse = z.infer<typeof checkBioResponseSchema>;
