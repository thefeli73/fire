import { ArrowRight, Banknote, Coins, Landmark, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FireFlowchart() {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 text-center">
        <CardTitle>The FIRE Engine</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:items-start">
          
          {/* Step 1: Income */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
              <Banknote className="h-8 w-8" />
            </div>
            <span className="font-bold">Income</span>
            <p className="w-32 text-center text-xs text-muted-foreground">Maximize earnings & side hustles</p>
          </div>

          <ArrowRight className="hidden h-8 w-8 text-muted-foreground md:block rotate-90 md:rotate-0" />

          {/* Step 2: Expenses */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
              <Wallet className="h-8 w-8" />
            </div>
            <span className="font-bold">Low Expenses</span>
            <p className="w-32 text-center text-xs text-muted-foreground">Frugality & mindful spending</p>
          </div>

          <ArrowRight className="hidden h-8 w-8 text-muted-foreground md:block rotate-90 md:rotate-0" />

          {/* Step 3: Savings Gap */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              <Coins className="h-8 w-8" />
            </div>
            <span className="font-bold">Savings Gap</span>
            <p className="w-32 text-center text-xs text-muted-foreground">The difference is your fuel</p>
          </div>

          <ArrowRight className="hidden h-8 w-8 text-muted-foreground md:block rotate-90 md:rotate-0" />

          {/* Step 4: Investments */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
              <TrendingUp className="h-8 w-8" />
            </div>
            <span className="font-bold">Investments</span>
            <p className="w-32 text-center text-xs text-muted-foreground">Index funds & compounding</p>
          </div>

           <ArrowRight className="hidden h-8 w-8 text-muted-foreground md:block rotate-90 md:rotate-0" />

          {/* Step 5: Freedom */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
              <Landmark className="h-8 w-8" />
            </div>
            <span className="font-bold">Freedom</span>
            <p className="w-32 text-center text-xs text-muted-foreground">Work becomes optional</p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

