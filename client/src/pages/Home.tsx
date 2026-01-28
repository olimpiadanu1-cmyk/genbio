import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CheckForm } from "@/components/bio/CheckForm";
import { GenerateForm } from "@/components/bio/GenerateForm";
import { ExampleViewer } from "@/components/bio/ExampleViewer";
import { FormatReference } from "@/components/bio/FormatReference";
import { TipsCarousel } from "@/components/bio/TipsCarousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, PenTool, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("check");

  return (
    <div className="min-h-screen bg-background/50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Hero Section */}
        <section className="mb-12 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Помощник по <span className="text-primary">RP биографиям</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Проверяйте историю вашего персонажа, создавайте новые идеи или просматривайте одобренные примеры.
            </p>
          </motion.div>
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Tabs - Takes up 8 columns on large screens */}
          <div className="lg:col-span-8">
            <Tabs
              defaultValue="check"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3 h-12 p-1 bg-muted backdrop-blur rounded-xl border border-border">
                  <TabsTrigger
                    value="check"
                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Проверка
                  </TabsTrigger>
                  <TabsTrigger
                    value="generate"
                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Генерация
                  </TabsTrigger>
                  <TabsTrigger
                    value="examples"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Примеры
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative">
                <TabsContent value="check" className="fade-in-up mt-0">
                  <div className="bg-card rounded-2xl p-6 md:p-8 shadow-xl border border-border">
                    <CheckForm />
                  </div>
                </TabsContent>

                <TabsContent value="generate" className="fade-in-up mt-0">
                  <div className="bg-card rounded-2xl p-6 md:p-8 shadow-xl border border-border">
                    <GenerateForm />
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="fade-in-up mt-0">
                  <ExampleViewer />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Sidebar - Takes up 4 columns on large screens, hidden on tabs other than 'check' */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FormatReference />

              <TipsCarousel />
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t text-center text-sm text-muted-foreground bg-card/10">
        <p>&copy; {new Date().getFullYear()} RAGE RUSSIA.</p>
      </footer>
    </div>
  );
}
