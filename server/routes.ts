import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { z } from "zod";
import { checkBioSchema, generateBioSchema } from "../shared/schema.js";
import { massiveSeeds } from "./massiveSeeds.js";
import { localCheckBio, localGenerateBio } from "./localBio.js";
import OpenAI from "openai";

const openai = process.env.AI_INTEGRATIONS_OPENAI_API_KEY
  ? new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  })
  : null;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  console.log("!!! SERVER READY - VERSION 1st PERSON SEEDS !!!");

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString(), vercel: !!process.env.VERCEL });
  });

  // --- Examples API ---

  app.get(api.examples.random.path, async (req, res) => {
    const example = await storage.getRandomExample();
    if (!example) {
      return res.status(404).json({ message: "Примеры не найдены" });
    }
    res.json(example);
  });

  app.get(api.examples.list.path, async (req, res) => {
    const list = await storage.getExamples();
    res.json(list);
  });

  // --- Biography API ---

  app.post(api.biography.check.path, async (req, res) => {
    try {
      const { content } = checkBioSchema.parse(req.body);

      // --- Step 1: Strict Local Validation ---
      const localResult = localCheckBio(content);
      if (!localResult.valid) {
        return res.json(localResult);
      }

      // --- Step 2: AI Quality Check (only if local passes) ---
      if (!openai) {
        return res.json(localResult);
      }

      const prompt = `
        Ты — Проверяльщик RP биографий.
        Биография УЖЕ прошла техническую проверку формата. Теперь проверь КАЧЕСТВО, РЕАЛИЗМ и ЛОГИКУ.
        
        СТРОГИЕ ПРАВИЛА:
        1. Никаких сверхспособностей.
        2. Никаких имен знаменитостей или администраторов.
        3. Никакой религиозной или националистической пропаганды.
        4. Логическая связь между разделами.
        
        Биография:
        ${content}

        Верни ответ в формате JSON:
        {
          "valid": boolean (false если есть нарушения реализма/логики),
          "errors": ["описание проблемы 1"],
          "feedback": "Общий отзыв о качестве текста..."
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const aiResult = JSON.parse(response.choices[0].message.content || "{}");
      res.json(aiResult);

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Некорректный ввод", field: err.errors[0].path[0] });
      } else {
        console.error("Check Error:", err);
        // Robust fallback to local check if OpenAI fails
        const { content } = req.body;
        const result = localCheckBio(content || "");
        res.json({
          ...result,
          feedback: result.feedback + " (Внимание: Использована локальная проверка из-за ошибки AI)"
        });
      }
    }
  });

  app.post(api.biography.generate.path, async (req, res) => {
    try {
      const params = generateBioSchema.parse(req.body);

      const content = localGenerateBio(params);
      res.json({ content });

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Некорректный ввод", field: err.errors[0].path[0] });
      } else {
        console.error("Generate Error:", err);
        res.status(500).json({ message: "Не удалось создать биографию" });
      }
    }
  });

  // Seed data logic - DISABLED on Vercel to prevent timeouts and crashes
  if (process.env.VERCEL) {
    console.log("[SEED] Running on Vercel, skipping automatic database sync");
    return httpServer;
  }

  try {
    const existing = await storage.getExamples();
    const hasOldExample = existing.some(e =>
      e.title === "Иван Иванов - Пример" ||
      e.title === "Иван Иванов - Обычный рабочий"
    );

    const needsCityUpdate = existing.length > 0 && !existing.some(e => e.content.includes("Екатеринбург"));
    const needsDateUpdate = existing.length > 0 && !existing.some(e => e.content.includes(".2026"));

    if (existing.length < 50 || hasOldExample || needsCityUpdate || needsDateUpdate) {
      console.log(`[SEED] Syncing database. Current: ${existing.length}, Needs City Update: ${needsCityUpdate}, Needs Date Update: ${needsDateUpdate}`);
      await storage.clearExamples();
      console.log("[SEED] Storage cleared. Injecting 50 examples with new cities...");

      for (const example of massiveSeeds) {
        await storage.createExample(example);
      }
      console.log("[SEED] Done!");
    }
  } catch (err) {
    console.error("[SEED] Failed to sync database (continuing anyway):", err);
  }

  return httpServer;
}
