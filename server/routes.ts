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

      const prompt = `
        Ты — Проверяльщик RP биографий.
        Проанализируй следующую биографию на соответствие этим СТРОГИМ правилам:
        1. Заголовок должен быть точно: "RolePlay биография гражданина [Имя] [Фамилия]"
        2. Должны присутствовать поля: Имя Фамилия, Пол, Национальность, Возраст, Дата и место рождения, Семья, Место текущего проживания, Описание внешности, Особенности характера.
        3. Требуются подробные разделы: Детство, Юность и взрослая жизнь, Настоящее время, Хобби.
        4. Дата рождения должна быть в формате ДД.ММ.ГГГГ.
        5. Возраст должен соответствовать году рождения.
        6. Никаких сверхспособностей.
        7. Никаких имен знаменитостей или администраторов.
        8. Написано от первого лица.
        9. Никакой религиозной или националистической пропаганды.
        
        Биография для проверки:
        ${content}

        Верни ответ в формате JSON:
        {
          "valid": boolean,
          "errors": ["ошибка 1", "ошибка 2"],
          "feedback": "Общий отзыв..."
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
        res.status(400).json({ message: "Некорректный ввод", field: err.errors[0].path[0] });
      } else {
        console.error("Check Error:", err);
        res.status(500).json({ message: "Не удалось проверить биографию" });
      }
    }
  });

  app.post(api.biography.generate.path, async (req, res) => {
    try {
      const params = generateBioSchema.parse(req.body);

      const prompt = `
        Напиши RolePlay биографию для персонажа сервера GTA V RP.
        Используй эти детали:
        - Никнейм: ${params.nickname}
        - Сервер/Город: ${params.server}
        - Количество членов семьи: ${params.familyMembers}
        - Работа: ${params.job}
        - Возраст: ${params.age}
        - Судимость: ${params.hasCriminalRecord ? "Да" : "Нет"}

        Обязательный формат:
        RolePlay биография гражданина ${params.nickname.replace("_", " ")}

        Имя Фамилия: ${params.nickname.replace("_", " ")}
        Пол: Мужской
        Национальность: Русский
        Возраст: ${params.age}
        Дата и место рождения: [Рассчитай исходя из возраста], г. ${params.server}
        Семья: [Опиши, основываясь на количестве членов семьи]
        Место текущего проживания: г. ${params.server}
        Описание внешности: [Креативное описание]
        Особенности характера: [Креативное описание]

        Детство:
        [Напиши 1-2 абзаца]

        Юность и взрослая жизнь:
        [Напиши 1-2 абзаца, упомяни работу и статус судимости]

        Настоящее время:
        [Напиши 1 абзац]

        Хобби:
        [Список хобби]

        Текст должен быть на русском языке. Будь креативным, но реалистичным.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
      });

      res.json({ content: response.choices[0].message.content || "" });

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Некорректный ввод", field: err.errors[0].path[0] });
      } else {
        console.error("Generate Error:", err);
        res.status(500).json({ message: "Не удалось создать биографию" });
      }
    }
  });

  // Seed data if empty
  const existing = await storage.getExamples();
  if (existing.length === 0) {
    const seedBio = "RolePlay биография гражданина Иван Иванов\n\nИмя Фамилия: Иван Иванов\nПол: Мужской\nНациональность: Русский\nВозраст: 25\nДата и место рождения: 01.01.1999, г. Арзамас\nСемья: Отец, Мать, Сестра\nМесто текущего проживания: г. Арзамас, ул. Ленина, д. 5\nОписание внешности: Рост 180 см, спортивное телосложение, голубые глаза, русые волосы.\nОсобенности характера: Добрый, отзывчивый, целеустремленный.\n\nДетство:\nИван родился в обычной семье в городе Арзамас. Его отец работал на заводе, а мать была учительницей. С детства Иван увлекался спортом и часто играл в футбол во дворе. В школе он учился хорошо, особенно ему нравилась история.\n\nЮность и взрослая жизнь:\nПосле окончания школы Иван поступил в университет на юридический факультет. Учеба давалась ему легко. В свободное время он подрабатывал курьером, чтобы помогать родителям. После получения диплома он устроился работать в местную администрацию.\n\nНастоящее время:\nСейчас Иван работает юристом в крупной компании. Он купил свою квартиру и машину. В выходные он любит выезжать на природу с друзьями.\n\nХобби:\nФутбол, чтение книг, рыбалка.";

    await storage.createExample({
      title: "Иван Иванов - Пример",
      content: seedBio
    });
  }

  return httpServer;
}
