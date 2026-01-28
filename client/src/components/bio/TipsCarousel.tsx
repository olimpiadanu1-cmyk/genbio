import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tips = [
    "Пишите реалистично. Избегайте «супергеройства». Недостатки делают персонажей интересными, а игру — захватывающей.",
    "Соблюдайте правила пунктуации и орфографии. Качественный текст повышает шансы на одобрение.",
    "Продумайте мотивацию персонажа. Почему он совершает те или иные поступки?",
    "Описывайте не только внешность, но и черты характера. Это поможет другим игрокам лучше понять вашего героя.",
    "Избегайте использования имен знаменитостей или администраторов сервера.",
    "Описывайте детство и юность подробно. Эти периоды формируют личность персонажа.",
    "Не забывайте про хобби. Это добавляет глубины вашему персонажу.",
    "Следите за логикой повествования. Возраст должен соответствовать дате рождения.",
    "Используйте формат ДД.ММ.ГГГГ для дат рождения.",
    "Пишите биографию от первого лица для большего погружения."
];

export function TipsCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-muted p-6 mt-6 rounded-xl border border-border min-h-[160px] flex flex-col">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Полезный совет
            </h3>
            <div className="relative overflow-hidden flex-1 flex items-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="text-sm text-muted-foreground leading-relaxed"
                    >
                        {tips[index]}
                    </motion.p>
                </AnimatePresence>
            </div>
            <div className="flex gap-1.5 mt-4 justify-start">
                {tips.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
