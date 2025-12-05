import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function AuthorBio() {
  return (
    <Card className="mt-12 bg-muted/50">
      <CardContent className="flex items-center gap-4 p-6">
        <Avatar className="h-16 w-16 border-2 border-background">
          <AvatarImage src="/images/author-profile.jpg" alt="Author" />
          <AvatarFallback>IF</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">Written by The InvestingFIRE Team</p>
          <p className="text-sm text-muted-foreground">
            We are a group of financial data enthusiasts and early retirees dedicated to building the most accurate FIRE tools on the web. Our goal is to replace guesswork with math.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

