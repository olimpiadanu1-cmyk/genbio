import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CheckForm } from "@/components/bio/CheckForm";
import { GenerateForm } from "@/components/bio/GenerateForm";
import { ExampleViewer } from "@/components/bio/ExampleViewer";
import { FormatReference } from "@/components/bio/FormatReference";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, PenTool, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("check");

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Hero Section */}
        <section className="mb-12 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Roleplay Biography <span className="text-primary">Assistant</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Validate your character's backstory, generate new ideas, or browse approved examples. 
              The ultimate tool for serious roleplayers.
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
                <TabsList className="grid w-full max-w-md grid-cols-3 h-12 p-1 bg-slate-200/50 backdrop-blur rounded-xl">
                  <TabsTrigger 
                    value="check"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Check
                  </TabsTrigger>
                  <TabsTrigger 
                    value="generate"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Generate
                  </TabsTrigger>
                  <TabsTrigger 
                    value="examples"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Examples
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative">
                <TabsContent value="check" className="animate-in mt-0">
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
                    <CheckForm />
                  </div>
                </TabsContent>
                
                <TabsContent value="generate" className="animate-in mt-0">
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
                    <GenerateForm />
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="animate-in mt-0">
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
              
              {/* Additional Help Card */}
              <div className="bg-primary/5 rounded-xl p-6 mt-6 border border-primary/10">
                <h3 className="font-semibold text-primary mb-2">Pro Tip</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your story realistic. Avoid being a "superhero". Flaws make characters interesting and roleplay engaging.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t text-center text-sm text-slate-400 bg-white">
        <p>&copy; {new Date().getFullYear()} BioValidator. Built for the community.</p>
      </footer>
    </div>
  );
}
