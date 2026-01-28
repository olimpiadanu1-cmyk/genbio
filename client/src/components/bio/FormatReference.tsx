import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function FormatReference() {
  return (
    <Card className="h-full border-none shadow-none bg-secondary/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <CardTitle className="text-base font-semibold">Принятый формат</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Ваша биография должна строго соответствовать формату сервера для одобрения.
          Отсутствие разделов приведет к автоматическому отклонению.
        </p>
        
        <div className="space-y-3">
          <div className="p-3 bg-background rounded-md border text-foreground/90 text-xs font-mono">
            <span className="text-primary font-bold">Имя Фамилия:</span> [Имя Фамилия]<br/>
            <span className="text-primary font-bold">Возраст:</span> [Число]<br/>
            <span className="text-primary font-bold">Место рождения:</span> [Город, Страна]<br/>
            <span className="text-primary font-bold">Пол:</span> [М/Ж]<br/>
            <span className="text-primary font-bold">История:</span><br/>
            [Минимум 50 слов об истории вашего персонажа...]
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="bg-background">Без ИИ текста</Badge>
          <Badge variant="outline" className="bg-background">Верный формат</Badge>
          <Badge variant="outline" className="bg-background">Реалистичная история</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
