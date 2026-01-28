import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkBioSchema, type CheckBioRequest } from "@shared/schema";
import { useCheckBiography } from "@/hooks/use-biography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CheckForm() {
  const [result, setResult] = useState<{ valid: boolean; errors: string[]; feedback?: string } | null>(null);
  const checkMutation = useCheckBiography();

  const form = useForm<CheckBioRequest>({
    resolver: zodResolver(checkBioSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: CheckBioRequest) => {
    checkMutation.mutate(data, {
      onSuccess: (data) => {
        setResult(data);
      },
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Paste Biography</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Textarea 
                      placeholder="Name: John Doe..." 
                      className="min-h-[300px] font-mono text-sm leading-relaxed resize-none bg-background focus:ring-2 focus:ring-primary/20 transition-all border-muted-foreground/20" 
                      {...field} 
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground pointer-events-none bg-background/80 px-2 py-1 rounded">
                      {field.value.length} chars
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            disabled={checkMutation.isPending}
          >
            {checkMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Validating Format...
              </>
            ) : (
              <>
                Check Biography
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-l-4 ${result.valid ? 'border-l-green-500 bg-green-50/50' : 'border-l-destructive bg-red-50/50'}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {result.valid ? (
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-red-100 text-destructive">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-2">
                    <h3 className={`font-bold text-lg ${result.valid ? 'text-green-800' : 'text-destructive'}`}>
                      {result.valid ? "Biography Approved" : "Changes Required"}
                    </h3>
                    
                    <p className="text-sm text-foreground/80">
                      {result.feedback || (result.valid ? "Your biography follows the correct format and length requirements." : "Please fix the issues below before submitting.")}
                    </p>

                    {!result.valid && result.errors.length > 0 && (
                      <div className="mt-4 p-4 rounded-lg bg-white/50 border border-red-100">
                        <ul className="space-y-2">
                          {result.errors.map((err, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                              {err}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
