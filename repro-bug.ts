import { localCheckBio, localGenerateBio } from "./server/localBio";

const params = {
    nickname: "Ivan_Ivanov",
    age: 25,
    server: "Red",
    job: "Водитель",
    familyMembers: 3,
    hasCriminalRecord: false,
    pov: "first" as const
};

// We want to find a case where childhood starts with "Детство"
// Let's brute force or just manually craft a content that fails
const content = `RolePlay биография гражданина Иван Иванов

Имя Фамилия: Иван Иванов
Пол: Мужской
Национальность: Русский
Возраст: 25
Дата и место рождения: 15.06.2001, г. Red
Семья: 3 человек (Родители и близкие родственники)
Место текущего проживания: г. Red
Описание внешности: Рост 180 см
Особенности характера: Спокойный

Детство:
Детство в городе Red было для меня временем открытий.

Юность и взрослая жизнь:
После школы я поступил в колледж.

Настоящее время:
Сейчас я живу в Red.

Хобби:
Рыбалка.`;

const result = localCheckBio(content);
console.log("Validation Result:", JSON.stringify(result, null, 2));

if (!result.valid && result.errors.some(e => e.includes("Детство"))) {
    console.log("BUG REPRODUCED: 'Детство' section failed validation even though it has content.");
} else {
    console.log("Bug not reproduced or different error.");
}
