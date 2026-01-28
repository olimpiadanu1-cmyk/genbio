import { examples, type Example, type InsertExample } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getExamples(): Promise<Example[]>;
  getRandomExample(): Promise<Example | undefined>;
  createExample(example: InsertExample): Promise<Example>;
}

export class DatabaseStorage implements IStorage {
  async getExamples(): Promise<Example[]> {
    return await db.select().from(examples);
  }

  async getRandomExample(): Promise<Example | undefined> {
    const result = await db
      .select()
      .from(examples)
      .orderBy(sql`RANDOM()`)
      .limit(1);
    return result[0];
  }

  async createExample(insertExample: InsertExample): Promise<Example> {
    const [example] = await db
      .insert(examples)
      .values(insertExample)
      .returning();
    return example;
  }
}

export const storage = new DatabaseStorage();
