"use client";

import { useState, useEffect } from "react";
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

export default function CoastFireCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentPortfolio, setCurrentPortfolio] = useState(50000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(7);

  // Calculate years until retirement
  const yearsUntilRetirement = retirementAge - currentAge;

  // Calculate target FIRE number (25x annual expenses)
  const targetFireNumber = annualExpenses * 25;

  // Calculate Coast FIRE number (present value of future FIRE number)
  const coastFireNumber =
    yearsUntilRetirement > 0
      ? targetFireNumber /
        Math.pow(1 + expectedReturn / 100, yearsUntilRetirement)
      : targetFireNumber;

  // Check if already at Coast FIRE
  const isCoastFire = currentPortfolio >= coastFireNumber;

  // Calculate what portfolio will grow to by retirement
  const projectedPortfolioAtRetirement =
    currentPortfolio * Math.pow(1 + expectedReturn / 100, yearsUntilRetirement);

  // Calculate gap to Coast FIRE
  const gapToCoastFire = Math.max(coastFireNumber - currentPortfolio, 0);

  // Calculate monthly savings needed to reach Coast FIRE in different timeframes
  const calculateMonthlySavings = (years: number) => {
    if (years <= 0 || isCoastFire) return 0;
    const monthlyReturn = expectedReturn / 100 / 12;
    const months = years * 12;
    return (
      (gapToCoastFire * monthlyReturn) /
      (Math.pow(1 + monthlyReturn, months) - 1)
    );
  };

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
          <CardTitle>Your Coast FIRE Inputs</CardTitle>
          <CardDescription>
            Enter your details to calculate when you can stop saving for
            retirement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="current-age">Current Age</Label>
                <span className="text-sm font-medium">{currentAge}</span>
              </div>
              <Slider
                id="current-age"
                min={20}
                max={60}
                step={1}
                value={[currentAge]}
                onValueChange={(value) => setCurrentAge(value[0] ?? 30)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="retirement-age">Target Retirement Age</Label>
                <span className="text-sm font-medium">{retirementAge}</span>
              </div>
              <Slider
                id="retirement-age"
                min={40}
                max={80}
                step={1}
                value={[retirementAge]}
                onValueChange={(value) => setRetirementAge(value[0] ?? 65)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-portfolio">Current Portfolio Value</Label>
              <Input
                id="current-portfolio"
                type="number"
                value={currentPortfolio}
                onChange={(e) => setCurrentPortfolio(Number(e.target.value))}
                min={0}
                step={1000}
              />
              <p className="text-muted-foreground text-sm">
                Your current retirement savings
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual-expenses">
                Annual Expenses in Retirement
              </Label>
              <Input
                id="annual-expenses"
                type="number"
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                min={0}
                step={1000}
              />
              <p className="text-muted-foreground text-sm">
                Yearly spending (in today's dollars)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="expected-return">Expected Annual Return</Label>
              <span className="text-sm font-medium">{expectedReturn}%</span>
            </div>
            <Slider
              id="expected-return"
              min={4}
              max={10}
              step={0.5}
              value={[expectedReturn]}
              onValueChange={(value) => setExpectedReturn(value[0] ?? 7)}
              className="w-full"
            />
            <p className="text-muted-foreground text-sm">
              Average annual investment return before inflation
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Coast FIRE Number</CardTitle>
            <CardDescription>
              Amount needed today to coast to retirement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary text-4xl font-bold">
              {formatCurrency(coastFireNumber)}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Grows to {formatCurrency(targetFireNumber)} in{" "}
              {yearsUntilRetirement} years
            </p>
            {isCoastFire ? (
              <div className="mt-4 rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
                <p className="text-sm text-green-900 dark:text-green-100">
                  🎉 Congratulations! You've reached Coast FIRE!
                </p>
              </div>
            ) : (
              <div className="bg-foreground/5 mt-4 rounded-lg p-3">
                <p className="text-sm font-medium">Progress to Coast FIRE</p>
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((currentPortfolio / coastFireNumber) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {Math.round((currentPortfolio / coastFireNumber) * 100)}%
                  complete
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Portfolio at Retirement</CardTitle>
            <CardDescription>
              What your current savings will grow to
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary text-4xl font-bold">
              {formatCurrency(projectedPortfolioAtRetirement)}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              {projectedPortfolioAtRetirement >= targetFireNumber
                ? `${Math.round((projectedPortfolioAtRetirement / targetFireNumber) * 100)}% of target`
                : `${formatCurrency(targetFireNumber - projectedPortfolioAtRetirement)} short`}
            </p>
            {projectedPortfolioAtRetirement >= targetFireNumber && (
              <div className="mt-4 rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 You'll exceed your FIRE target by{" "}
                  {formatCurrency(
                    projectedPortfolioAtRetirement - targetFireNumber,
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Savings Scenarios */}
      {!isCoastFire && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Savings to Reach Coast FIRE</CardTitle>
            <CardDescription>
              How much to save monthly to hit Coast FIRE in different timeframes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-foreground/5 rounded-lg p-4 text-center">
                <p className="text-muted-foreground text-sm">In 5 Years</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(calculateMonthlySavings(5))}
                </p>
                <p className="text-muted-foreground text-xs">per month</p>
              </div>
              <div className="bg-foreground/5 rounded-lg p-4 text-center">
                <p className="text-muted-foreground text-sm">In 10 Years</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(calculateMonthlySavings(10))}
                </p>
                <p className="text-muted-foreground text-xs">per month</p>
              </div>
              <div className="bg-foreground/5 rounded-lg p-4 text-center">
                <p className="text-muted-foreground text-sm">In 15 Years</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(calculateMonthlySavings(15))}
                </p>
                <p className="text-muted-foreground text-xs">per month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Coast FIRE Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">
                Years to Retirement
              </p>
              <p className="text-2xl font-bold">{yearsUntilRetirement}</p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">
                Target FIRE Number
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(targetFireNumber)}
              </p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Gap to Coast FIRE</p>
              <p className="text-2xl font-bold">
                {formatCurrency(gapToCoastFire)}
              </p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Growth Multiple</p>
              <p className="text-2xl font-bold">
                {Math.pow(
                  1 + expectedReturn / 100,
                  yearsUntilRetirement,
                ).toFixed(1)}
                ×
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Notes */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>🎯 Coast FIRE Strategy:</strong> Once you hit your Coast
              FIRE number, you can stop saving for retirement entirely. Work
              only to cover current expenses while your investments grow to your
              full FIRE target.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/20">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>⚡ Power of Time:</strong> Starting early is crucial. A
              25-year-old needs only{" "}
              {formatCurrency(targetFireNumber / Math.pow(1.07, 40))}
              to coast to a {formatCurrency(targetFireNumber)} retirement at 65
              (assuming 7% returns).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
