"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function FourPercentRuleCalculator() {
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  // Calculate FIRE number based on withdrawal rate
  const fireNumber = Math.round(annualExpenses / (withdrawalRate / 100));

  // Calculate safe withdrawal amount from portfolio
  const safeWithdrawal = Math.round(portfolioValue * (withdrawalRate / 100));

  // Calculate years to FIRE if saving
  const monthlySavings = 2000; // Default for demo
  const growthRate = 0.07; // 7% annual growth
  const yearsToFire =
    portfolioValue < fireNumber
      ? Math.log(
          (fireNumber + (monthlySavings * 12) / growthRate) /
            (portfolioValue + (monthlySavings * 12) / growthRate),
        ) / Math.log(1 + growthRate)
      : 0;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Calculate Your FIRE Number</CardTitle>
          <CardDescription>
            Enter your annual expenses and current portfolio value to see your
            path to financial independence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="annual-expenses">Annual Expenses</Label>
              <Input
                id="annual-expenses"
                type="number"
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                min={0}
                step={1000}
              />
              <p className="text-muted-foreground text-sm">
                Your yearly spending in retirement
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-value">Current Portfolio Value</Label>
              <Input
                id="portfolio-value"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
                min={0}
                step={10000}
              />
              <p className="text-muted-foreground text-sm">
                Your current invested assets
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="withdrawal-rate">Withdrawal Rate</Label>
              <span className="text-sm font-medium">{withdrawalRate}%</span>
            </div>
            <Slider
              id="withdrawal-rate"
              min={3}
              max={5}
              step={0.1}
              value={[withdrawalRate]}
              onValueChange={(value) => setWithdrawalRate(value[0] ?? 4)}
              className="w-full"
            />
            <p className="text-muted-foreground text-sm">
              The classic 4% rule suggests 4%, but adjust based on your risk
              tolerance
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your FIRE Number</CardTitle>
            <CardDescription>
              Portfolio needed for {withdrawalRate}% withdrawal rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary text-4xl font-bold">
              {formatCurrency(fireNumber)}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              This is {Math.round(fireNumber / annualExpenses)}× your annual
              expenses
            </p>
            {portfolioValue > 0 && portfolioValue < fireNumber && (
              <div className="bg-foreground/5 mt-4 rounded-lg p-3">
                <p className="text-sm font-medium">Progress to FIRE</p>
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((portfolioValue / fireNumber) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {Math.round((portfolioValue / fireNumber) * 100)}% complete
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Safe Annual Withdrawal</CardTitle>
            <CardDescription>From your current portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary text-4xl font-bold">
              {formatCurrency(safeWithdrawal)}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Monthly: {formatCurrency(safeWithdrawal / 12)}
            </p>
            {safeWithdrawal > 0 && safeWithdrawal < annualExpenses && (
              <div className="mt-4 rounded-lg bg-orange-100 p-3 dark:bg-orange-900/20">
                <p className="text-sm text-orange-900 dark:text-orange-100">
                  ⚠️ Your safe withdrawal ({formatCurrency(safeWithdrawal)}) is
                  less than your annual expenses (
                  {formatCurrency(annualExpenses)})
                </p>
              </div>
            )}
            {safeWithdrawal >= annualExpenses && (
              <div className="mt-4 rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
                <p className="text-sm text-green-900 dark:text-green-100">
                  ✓ Congratulations! You've reached FIRE
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Gap to FIRE</p>
              <p className="text-2xl font-bold">
                {formatCurrency(Math.max(fireNumber - portfolioValue, 0))}
              </p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Monthly Target</p>
              <p className="text-2xl font-bold">
                {formatCurrency(annualExpenses / 12)}
              </p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">25× Rule Result</p>
              <p className="text-2xl font-bold">
                {formatCurrency(annualExpenses * 25)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Note */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <p className="text-sm">
            <strong>💡 Pro Tip:</strong> The 4% rule is based on a 30-year
            retirement. For early retirees planning 40-50+ years, consider using
            3.5% or even 3% for added safety. Remember to account for taxes,
            healthcare costs, and inflation in your planning.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
