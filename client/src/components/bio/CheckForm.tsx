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
import { CheckCircle2, XCircle, Loader2, ArrowRight, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

  const closeDialog = () => setResult(null);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Вставьте биографию</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Textarea
                      placeholder="Имя Фамилия: Иван Иванов..."
                      className="min-h-[300px] font-mono text-sm leading-relaxed resize-none bg-background focus:ring-2 focus:ring-primary/20 transition-all border-muted-foreground/20"
                      {...field}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground pointer-events-none bg-background/80 px-2 py-1 rounded">
                      {field.value.length} симв.
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full min-h-[3rem] h-auto py-3 px-6 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all whitespace-normal lg:whitespace-nowrap"
            disabled={checkMutation.isPending}
          >
            {checkMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Проверка формата...
              </>
            ) : (
              <>
                Проверить биографию
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <Dialog open={!!result} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md border-none p-0 overflow-hidden bg-transparent shadow-none">
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <Card className={`relative border-none shadow-2xl overflow-hidden ${result.valid ? 'bg-background' : 'bg-background'}`}>
                  {/* Decorative Header Gradient */}
                  <div className={`h-2 w-full ${result.valid ? 'bg-green-500' : 'bg-destructive'}`} />

                  <CardContent className="p-6 sm:p-8 pt-8 sm:pt-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                      {result.valid ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="p-4 rounded-full bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 ring-8 ring-green-50/50 dark:ring-green-500/5"
                        >
                          <CheckCircle2 className="w-12 h-12" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="p-4 rounded-full bg-red-50 text-destructive dark:bg-red-500/10 dark:text-red-400 ring-8 ring-red-50/50 dark:ring-red-500/5"
                        >
                          <XCircle className="w-12 h-12" />
                        </motion.div>
                      )}

                      <div className="space-y-2 w-full">
                        <DialogTitle className={`text-2xl sm:text-3xl font-bold tracking-tight ${result.valid ? 'text-green-600 dark:text-green-400' : 'text-destructive dark:text-red-400'}`}>
                          {result.valid ? "Биография одобрена" : "Требуются исправления"}
                        </DialogTitle>

                        <DialogDescription className="text-base text-muted-foreground max-w-xs mx-auto">
                          {result.feedback || (result.valid ? "Ваша биография отлично составлена и соответствует всем правилам." : "Пожалуйста, устраните замечания ниже.")}
                        </DialogDescription>
                      </div>

                      {result.valid && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="w-full p-4 rounded-xl bg-green-50/50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10"
                        >
                          <p className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center justify-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Остался последний шаг!
                          </p>
                          <p className="text-xs mt-1 text-green-700/80 dark:text-green-400/80">
                            Теперь её можно подать в тему на одобрение.
                          </p>
                        </motion.div>
                      )}

                      {!result.valid && result.errors.length > 0 && (
                        <div className="w-full space-y-3 mt-2">
                          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-left max-h-[200px] overflow-y-auto custom-scrollbar">
                            <ul className="space-y-3">
                              {result.errors.map((err, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + i * 0.1 }}
                                  className="flex items-start gap-3 group"
                                >
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0 group-hover:scale-125 transition-transform" />
                                  <span className="text-sm text-foreground/90 leading-relaxed font-medium">{err}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={closeDialog}
                        className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        variant={result.valid ? "default" : "secondary"}
                      >
                        Принято
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
