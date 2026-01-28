import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Maximize2, FileText, User, MapPin, Calendar, Heart, Eye, Award } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const bioPoints = [
  { icon: <User className="w-4 h-4" />, label: "Имя Фамилия", value: "Обязательно" },
  { icon: <Heart className="w-4 h-4" />, label: "Пол", value: "Мужской / Женский" },
  { icon: <Award className="w-4 h-4" />, label: "Национальность", value: "Например: Русский" },
  { icon: <Calendar className="w-4 h-4" />, label: "Возраст", value: "Числом" },
  { icon: <MapPin className="w-4 h-4" />, label: "Дата и место рождения", value: "ДД.ММ.ГГГГ, Город" },
  { icon: <Info className="w-4 h-4" />, label: "Семья", value: "Список родных" },
  { icon: <MapPin className="w-4 h-4" />, label: "Место текущего проживания", value: "Адрес или район" },
  { icon: <Eye className="w-4 h-4" />, label: "Описание внешности", value: "Рост, глаза, одежда" },
  { icon: <Info className="w-4 h-4" />, label: "Особенности характера", value: "Темперамент, привычки" },
];

const expandedSections = [
  "Детство: (Минимум 1-2 абзаца)",
  "Юность и взрослая жизнь: (Развернутая история)",
  "Настоящее время: (Чем персонаж занят сейчас)",
  "Хобби: (Увлечения и интересы)",
];

export function FormatReference() {
  return (
    <Card className="border-none shadow-none bg-secondary/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <CardTitle className="text-base font-semibold">Принятый формат</CardTitle>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
                <FileText className="w-7 h-7 text-primary" />
                Полная форма биографии
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-8 py-6 max-w-2xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bioPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-secondary/20 rounded-2xl border border-secondary/50 transition-colors hover:bg-secondary/30">
                    <div className="bg-card p-2 rounded-xl shadow-sm text-primary border border-primary/10">
                      {point.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{point.label}</div>
                      <div className="text-sm font-semibold">{point.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-xl text-primary text-center border-b border-primary/10 pb-3">
                  Основные разделы биографии
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {expandedSections.map((section, i) => (
                    <div key={i} className="p-5 bg-secondary/10 rounded-2xl border-2 border-dashed border-primary/10 hover:border-primary/20 transition-all">
                      <p className="font-bold text-foreground text-center">{section}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground pt-4">
                * Каждый из этих пунктов должен быть расписан максимально подробно для успешного прохождения проверки.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p className="text-xs">
          Ваша биография должна строго соответствовать формату для одобрения.
        </p>

        <div className="space-y-2">
          <div className="p-3 bg-card/50 rounded-xl border border-primary/10 shadow-sm">
            {bioPoints.slice(0, 5).map((point, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-secondary/30 last:border-0">
                <span className="text-[10px] font-bold uppercase">{point.label}:</span>
                <span className="text-[10px] text-primary">{point.value}</span>
              </div>
            ))}
            <div className="pt-2 text-[10px] text-center font-bold text-muted-foreground">
              + еще 4 пункта и разделы истории
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant="outline" className="text-[10px] py-0 h-5 bg-background">Без ИИ текста</Badge>
          <Badge variant="outline" className="text-[10px] py-0 h-5 bg-background">Верный формат</Badge>
          <Badge variant="outline" className="text-[10px] py-0 h-5 bg-background">Реализм</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

