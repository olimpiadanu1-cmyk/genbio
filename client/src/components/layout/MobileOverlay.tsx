import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

export function MobileOverlay() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="lg:hidden fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/30 backdrop-blur-2xl pointer-events-none select-none"
                >
                    {/* Decorative Emojis */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 10, -10, 0],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute top-[20%] left-[15%] text-4xl blur-[1px]"
                    >
                        ✨
                    </motion.div>
                    <motion.div
                        animate={{
                            y: [0, 15, 0],
                            rotate: [0, -15, 15, 0],
                            opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[25%] right-[10%] text-5xl blur-[2px]"
                    >
                        📜
                    </motion.div>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
                        className="absolute top-[40%] right-[20%] text-3xl blur-[1px]"
                    >
                        💫
                    </motion.div>

                    <div className="text-center space-y-8 px-6">
                        <motion.div variants={itemVariants} className="relative inline-block">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 animate-pulse" />
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="bg-card/40 p-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center"
                            >
                                <ChevronDown className="w-12 h-12 text-primary" />
                            </motion.div>

                            {/* Floating indicator for 'down' */}
                            <motion.div
                                animate={{ y: [0, 5, 0], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-2xl"
                            >
                                👇
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="flex items-center justify-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                <h2 className="text-2xl font-black italic tracking-wider text-foreground uppercase drop-shadow-md">
                                    Листайте вниз
                                </h2>
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            </div>

                            <p className="text-muted-foreground/80 font-medium max-w-[250px] mx-auto text-sm leading-relaxed">
                                Погрузитесь в мир историй персонажей прямо сейчас 🎭
                            </p>

                            <div className="h-1.5 w-24 bg-muted/30 mx-auto rounded-full mt-6 overflow-hidden relative">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                    className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom subtle text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-10 text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground"
                    >
                        Rage Russia Assistant
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
