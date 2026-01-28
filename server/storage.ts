import { examples, type Example, type InsertExample } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getExamples(): Promise<Example[]>;
  getRandomExample(): Promise<Example | undefined>;
  createExample(example: InsertExample): Promise<Example>;
  clearExamples(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getExamples(): Promise<Example[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(examples);
  }

  async getRandomExample(): Promise<Example | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db
      .select()
      .from(examples)
      .orderBy(sql`RANDOM()`)
      .limit(1);
    return result[0];
  }

  async createExample(insertExample: InsertExample): Promise<Example> {
    if (!db) throw new Error("Database not connected");
    const [example] = await db
      .insert(examples)
      .values(insertExample)
      .returning();
    return example;
  }

  async clearExamples(): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db.delete(examples);
  }
}

export class MemStorage implements IStorage {
  private examples: Map<number, Example>;
  private currentId: number;

  constructor() {
    this.examples = new Map();
    this.currentId = 1;
  }

  async getExamples(): Promise<Example[]> {
    return Array.from(this.examples.values());
  }

  async getRandomExample(): Promise<Example | undefined> {
    const list = Array.from(this.examples.values());
    if (list.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * list.length);
    console.log(`[MemStorage] Found ${list.length} examples, picking index: ${randomIndex}`);
    return list[randomIndex];
  }

  async createExample(insertExample: InsertExample): Promise<Example> {
    const id = this.currentId++;
    const example: Example = { ...insertExample, id };
    this.examples.set(id, example);
    return example;
  }

  async clearExamples(): Promise<void> {
    this.examples.clear();
    this.currentId = 1;
  }
}

class FallbackStorage implements IStorage {
  private instance: IStorage;

  constructor() {
    this.instance = db ? new DatabaseStorage() : new MemStorage();
  }

  private async tryHandleError(e: any) {
    if (this.instance instanceof DatabaseStorage) {
      console.error("Database connection failed, falling back to MemStorage:", e.message);
      this.instance = new MemStorage();
      return true;
    }
    return false;
  }

  async getExamples(): Promise<Example[]> {
    try {
      return await this.instance.getExamples();
    } catch (e: any) {
      if (await this.tryHandleError(e)) {
        return await this.instance.getExamples();
      }
      throw e;
    }
  }

  async getRandomExample(): Promise<Example | undefined> {
    try {
      return await this.instance.getRandomExample();
    } catch (e: any) {
      if (await this.tryHandleError(e)) {
        return await this.instance.getRandomExample();
      }
      throw e;
    }
  }

  async createExample(insertExample: InsertExample): Promise<Example> {
    try {
      return await this.instance.createExample(insertExample);
    } catch (e: any) {
      if (await this.tryHandleError(e)) {
        return await this.instance.createExample(insertExample);
      }
      throw e;
    }
  }

  async clearExamples(): Promise<void> {
    try {
      return await this.instance.clearExamples();
    } catch (e: any) {
      if (await this.tryHandleError(e)) {
        return await this.instance.clearExamples();
      }
      throw e;
    }
  }
}

export const storage = new FallbackStorage();
