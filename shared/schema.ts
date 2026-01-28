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
  nickname: z.string().min(1, "Никнейм обязателен"),
  server: z.string().min(1, "Сервер/Город обязателен"),
  familyMembers: z.number().min(0, "Количество членов семьи должно быть 0 или больше"),
  job: z.string().min(1, "Работа обязательна"),
  age: z.number().min(1, "Возраст должен быть указан"),
  hasCriminalRecord: z.boolean(),
  pov: z.enum(["first", "third"]).default("third"),
});

export type GenerateBioRequest = z.infer<typeof generateBioSchema>;

export const checkBioSchema = z.object({
  content: z.string().min(50, "Биография слишком короткая"),
});

export type CheckBioRequest = z.infer<typeof checkBioSchema>;

export const checkBioResponseSchema = z.object({
  valid: z.boolean(),
  errors: z.array(z.string()),
  feedback: z.string().optional(),
});

export type CheckBioResponse = z.infer<typeof checkBioResponseSchema>;
