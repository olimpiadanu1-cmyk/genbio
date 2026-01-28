import { FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight uppercase">RAGE RUSSIA</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Помощник по RP биографиям</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
