import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="my-16 grid gap-6 md:grid-cols-3">
      <Card className="bg-card border-none shadow-md">
        <CardHeader className="pb-2">
          <Quote className="h-8 w-8 text-primary/20" />
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg italic text-muted-foreground">
            &quot;I always struggled with the math behind early retirement. This calculator made it click instantly. Seeing the graph change in real-time is a game changer.&quot;
          </p>
          <p className="font-semibold">- Sarah J., Software Engineer</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-none shadow-md">
        <CardHeader className="pb-2">
          <Quote className="h-8 w-8 text-primary/20" />
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg italic text-muted-foreground">
            &quot;Most FIRE calculators are too simple. I love that I can toggle Monte Carlo simulations to see if my plan survives a market crash. Highly recommended.&quot;
          </p>
          <p className="font-semibold">- Mike T., Financial Analyst</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-none shadow-md">
        <CardHeader className="pb-2">
          <Quote className="h-8 w-8 text-primary/20" />
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg italic text-muted-foreground">
            &quot;The inflation adjustment feature is crucial. It showed me I needed to save a bit more to be truly safe, but now I sleep better knowing the real numbers.&quot;
          </p>
          <p className="font-semibold">- Emily R., Teacher (Coast FIRE)</p>
        </CardContent>
      </Card>
    </section>
  );
}
