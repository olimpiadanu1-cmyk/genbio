import { useRandomExample } from "@/hooks/use-examples";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCcw, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function ExampleViewer() {
  const { data, refetch, isFetching, isError } = useRandomExample();

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-center">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Learn from Examples</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          See how approved biographies are structured. These examples follow all server rules and formatting guidelines.
        </p>
        
        <Button 
          size="lg" 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="min-w-[200px]"
        >
          {isFetching ? (
            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="mr-2 h-4 w-4" />
          )}
          {data ? "Load Another" : "Show Random Example"}
        </Button>
      </div>

      <div className="min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isFetching ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full space-y-4 text-left"
            >
              <Skeleton className="h-8 w-1/3 mx-auto" />
              <Skeleton className="h-[300px] w-full rounded-xl" />
            </motion.div>
          ) : data ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full text-left"
            >
              <Card className="border-t-4 border-t-primary shadow-xl bg-white/80 backdrop-blur">
                <CardContent className="p-8 md:p-12">
                  <div className="flex justify-center mb-6">
                    <Quote className="w-12 h-12 text-primary/10 rotate-180" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-center mb-8 text-slate-800 font-serif">
                    {data.title}
                  </h3>
                  
                  <div className="prose prose-slate max-w-none font-serif leading-relaxed text-slate-600">
                    {data.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : isError ? (
            <div className="text-destructive">Failed to load example. Please try again.</div>
          ) : (
            <div className="text-muted-foreground italic">Click the button above to view an example</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
