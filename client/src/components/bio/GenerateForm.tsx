import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateBioSchema, type GenerateBioRequest } from "@shared/schema";
import { useGenerateBiography } from "@/hooks/use-biography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function GenerateForm() {
  const { toast } = useToast();
  const generateMutation = useGenerateBiography();
  const [copied, setCopied] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");

  const form = useForm<GenerateBioRequest>({
    resolver: zodResolver(generateBioSchema),
    defaultValues: {
      nickname: "",
      server: "",
      familyMembers: 2,
      job: "",
      age: 25,
      hasCriminalRecord: false,
    },
  });

  const onSubmit = (data: GenerateBioRequest) => {
    generateMutation.mutate(data, {
      onSuccess: (res) => {
        setGeneratedContent(res.content);
        toast({
          title: "Биография создана",
          description: "Теперь вы можете скопировать и отредактировать вашу новую биографию.",
        });
      },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Скопировано в буфер обмена",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Создать персонажа</h2>
          <p className="text-muted-foreground">Заполните детали, чтобы создать уникальную историю.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя персонажа</FormLabel>
                    <FormControl>
                      <Input placeholder="Например, Тони Старк" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Возраст ({field.value})</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={18} 
                        max={90} 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="server"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Город/Сервер</FormLabel>
                  <FormControl>
                    <Input placeholder="Например, Арзамас" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Профессия</FormLabel>
                  <FormControl>
                    <Input placeholder="Например, Механик" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="familyMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Размер семьи ({field.value})</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>Влияет на сложность предыстории</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasCriminalRecord"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Судимость</FormLabel>
                    <FormDescription>
                      Включить прошлые проблемы с законом
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 shadow-lg shadow-primary/25"
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Создание истории...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Создать биографию
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Результат</h2>
        <Card className="h-[600px] flex flex-col bg-slate-50 border-2 border-slate-100 overflow-hidden relative">
          <div className="flex-1 flex flex-col overflow-hidden">
            {generatedContent ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="shadow-sm"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Скопировано" : "Копировать"}
                  </Button>
                </div>
                <CardContent className="flex-1 p-6 overflow-y-auto font-serif text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {generatedContent}
                </CardContent>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Готов к созданию</h3>
                <p className="max-w-xs text-sm">Заполните форму слева, чтобы создать уникальную RP биографию для вашего персонажа.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
