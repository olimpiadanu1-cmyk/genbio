import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/theme-provider";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full w-10 h-10 transition-all hover:bg-primary/10 hover:text-primary overflow-hidden border-none focus-visible:ring-offset-0"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: 15, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -15, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2, ease: "backOut" }}
                    className="flex items-center justify-center w-full h-full"
                >
                    {theme === "light" ? (
                        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
                    ) : (
                        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
                    )}
                </motion.div>
            </AnimatePresence>
            <span className="sr-only">Переключить тему</span>
        </Button>
    );
}
