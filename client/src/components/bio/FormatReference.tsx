import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function FormatReference() {
  return (
    <Card className="h-full border-none shadow-none bg-secondary/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <CardTitle className="text-base font-semibold">Accepted Format</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Your biography must follow the strict server format to be approved.
          Missing sections will result in automatic rejection.
        </p>
        
        <div className="space-y-3">
          <div className="p-3 bg-background rounded-md border text-foreground/90 text-xs font-mono">
            <span className="text-primary font-bold">Name:</span> [Firstname Lastname]<br/>
            <span className="text-primary font-bold">Age:</span> [Number]<br/>
            <span className="text-primary font-bold">Place of Birth:</span> [City, Country]<br/>
            <span className="text-primary font-bold">Sex:</span> [M/F]<br/>
            <span className="text-primary font-bold">Story:</span><br/>
            [Minimum 50 words about your character's history...]
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="bg-background">No AI text</Badge>
          <Badge variant="outline" className="bg-background">Valid format</Badge>
          <Badge variant="outline" className="bg-background">Realistic backstory</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
