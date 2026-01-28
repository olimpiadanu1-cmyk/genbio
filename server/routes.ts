import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { checkBioSchema, generateBioSchema } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Examples API ---

  app.get(api.examples.random.path, async (req, res) => {
    const example = await storage.getRandomExample();
    if (!example) {
      return res.status(404).json({ message: "No examples found" });
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

      const prompt = `
        You are a RolePlay Biography Checker.
        Analyze the following biography against these STRICT rules:
        1. Title must be exactly: "RolePlay биография гражданина [Firstname] [Lastname]"
        2. Must contain fields: Name, Gender, Nationality, Age, Date/Place of Birth, Family, Residence, Appearance, Character.
        3. Detailed sections required: Childhood, Youth & Adult Life, Present Time, Hobby.
        4. Date of birth must be DD.MM.YYYY format.
        5. Age must match birth year.
        6. No supernatural abilities.
        7. No famous people or admin names.
        8. Written in first person.
        9. No religious/nationalist propaganda.
        
        Biography to check:
        ${content}

        Return JSON format:
        {
          "valid": boolean,
          "errors": ["error 1", "error 2"],
          "feedback": "General feedback..."
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", field: err.errors[0].path[0] });
      } else {
        console.error("Check Error:", err);
        res.status(500).json({ message: "Failed to check biography" });
      }
    }
  });

  app.post(api.biography.generate.path, async (req, res) => {
    try {
      const params = generateBioSchema.parse(req.body);

      const prompt = `
        Write a RolePlay Biography for a GTA V RP server character.
        Use these details:
        - Nickname: ${params.nickname}
        - Server/City: ${params.server}
        - Family Members: ${params.familyMembers}
        - Job: ${params.job}
        - Age: ${params.age}
        - Criminal Record: ${params.hasCriminalRecord ? "Yes" : "No"}

        Strict Format Required:
        RolePlay биография гражданина ${params.nickname.replace("_", " ")}

        Имя Фамилия: ${params.nickname.replace("_", " ")}
        Пол: Мужской
        Национальность: Русский
        Возраст: ${params.age}
        Дата и место рождения: [Calculate from age], г. ${params.server}
        Семья: [Describe based on members count]
        Место текущего проживания: г. ${params.server}
        Описание внешности: [Creative description]
        Особенности характера: [Creative description]

        Детство:
        [Write 1-2 paragraphs]

        Юность и взрослая жизнь:
        [Write 1-2 paragraphs, mention job and criminal status]

        Настоящее время:
        [Write 1 paragraph]

        Хобби:
        [List hobbies]

        The text must be in Russian. Be creative but realistic.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
      });

      res.json({ content: response.choices[0].message.content || "" });

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", field: err.errors[0].path[0] });
      } else {
        console.error("Generate Error:", err);
        res.status(500).json({ message: "Failed to generate biography" });
      }
    }
  });

  // Seed data if empty
  const existing = await storage.getExamples();
  if (existing.length === 0) {
    const seedBio = `RolePlay биография гражданина Иван Иванов

Имя Фамилия: Иван Иванов
Пол: Мужской
Национальность: Русский
Возраст: 25
Дата и место рождения: 01.01.1999, г. Арзамас
Семья: Отец, Мать, Сестра
Место текущего проживания: г. Арзамас, ул. Ленина, д. 5
Описание внешности: Рост 180 см, спортивное телосложение, голубые глаза, русые волосы.
Особенности характера: Добрый, отзывчивый, целеустремленный.

Детство:
Иван родился в обычной семье в городе Арзамас. Его отец работал на заводе, а мать была учительницей. С детства Иван увлекался спортом и часто играл в футбол во дворе. В школе он учился хорошо, особенно ему нравилась история.

Юность и взрослая жизнь:
После окончания школы Иван поступил в университет на юридический факультет. Учеба давалась ему легко. В свободное время он подрабатывал курьером, чтобы помогать родителям. После получения диплома он устроился работать в местную администрацию.

Настоящее время:
Сейчас Иван работает юристом в крупной компании. Он купил свою квартиру и машину. В выходные он любит выезжать на природу с друзьями.

Хобби:
Футбол, чтение книг, рыбалка.`;

    await storage.createExample({
      title: "Иван Иванов - Пример",
      content: seedBio
    });
  }

  return httpServer;
}
