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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FireByAgeCalculator() {
  const [currentAge, setCurrentAge] = useState(25);
  const [targetRetirementAge, setTargetRetirementAge] = useState(40);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [currentIncome, setCurrentIncome] = useState(75000);

  // Calculate years to retirement
  const yearsToRetirement = targetRetirementAge - currentAge;

  // Determine withdrawal rate based on retirement age
  const getWithdrawalRate = (age: number) => {
    if (age <= 35) return 3;
    if (age <= 40) return 3.5;
    if (age <= 45) return 3.75;
    if (age <= 50) return 4;
    return 4.25;
  };

  const withdrawalRate = getWithdrawalRate(targetRetirementAge);
  const fireMultiplier = 100 / withdrawalRate;

  // Calculate FIRE number
  const fireNumber = annualExpenses * fireMultiplier;

  // Calculate future value of current savings
  const futureValueOfCurrentSavings =
    currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);

  // Calculate gap
  const gap = fireNumber - futureValueOfCurrentSavings;

  // Calculate required monthly savings
  const calculateMonthlySavings = () => {
    if (yearsToRetirement <= 0 || gap <= 0) return 0;
    const monthlyReturn = expectedReturn / 100 / 12;
    const months = yearsToRetirement * 12;
    return (gap * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1);
  };

  const requiredMonthlySavings = calculateMonthlySavings();
  const requiredAnnualSavings = requiredMonthlySavings * 12;
  const savingsRate = (requiredAnnualSavings / currentIncome) * 100;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Age-specific recommendations
  const getRecommendations = () => {
    if (targetRetirementAge <= 35) {
      return {
        difficulty: "Extremely Challenging",
        color: "text-red-600",
        tips: [
          "Requires 60-80% savings rate",
          "Focus on maximizing income",
          "Consider geographic arbitrage",
          "Live extremely frugally",
        ],
      };
    } else if (targetRetirementAge <= 40) {
      return {
        difficulty: "Very Challenging",
        color: "text-orange-600",
        tips: [
          "Requires 50-60% savings rate",
          "Maximize career growth",
          "House hack or minimize housing",
          "Avoid lifestyle inflation",
        ],
      };
    } else if (targetRetirementAge <= 45) {
      return {
        difficulty: "Challenging",
        color: "text-yellow-600",
        tips: [
          "Requires 40-50% savings rate",
          "Build multiple income streams",
          "Consider Coast FIRE strategy",
          "Plan for healthcare costs",
        ],
      };
    } else if (targetRetirementAge <= 50) {
      return {
        difficulty: "Moderate",
        color: "text-blue-600",
        tips: [
          "Requires 30-40% savings rate",
          "Use tax-advantaged accounts",
          "Consider part-time work",
          "Plan Roth conversions",
        ],
      };
    } else {
      return {
        difficulty: "Achievable",
        color: "text-green-600",
        tips: [
          "Requires 25-35% savings rate",
          "Maximize 401(k) contributions",
          "Use Rule of 55 if applicable",
          "Bridge to Social Security",
        ],
      };
    }
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your FIRE by Age Inputs</CardTitle>
          <CardDescription>
            Enter your details to see what it takes to retire at your target age
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
                max={55}
                step={1}
                value={[currentAge]}
                onValueChange={(value) => setCurrentAge(value[0] ?? 25)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-age">Target Retirement Age</Label>
              <Select
                value={targetRetirementAge.toString()}
                onValueChange={(value) => setTargetRetirementAge(Number(value))}
              >
                <SelectTrigger id="target-age">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Retire at 30</SelectItem>
                  <SelectItem value="35">Retire at 35</SelectItem>
                  <SelectItem value="40">Retire at 40</SelectItem>
                  <SelectItem value="45">Retire at 45</SelectItem>
                  <SelectItem value="50">Retire at 50</SelectItem>
                  <SelectItem value="55">Retire at 55</SelectItem>
                  <SelectItem value="60">Retire at 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-savings">
                Current Retirement Savings
              </Label>
              <Input
                id="current-savings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                min={0}
                step={1000}
              />
              <p className="text-muted-foreground text-sm">
                Total invested for retirement
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-income">Current Annual Income</Label>
              <Input
                id="current-income"
                type="number"
                value={currentIncome}
                onChange={(e) => setCurrentIncome(Number(e.target.value))}
                min={0}
                step={1000}
              />
              <p className="text-muted-foreground text-sm">
                Pre-tax annual income
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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
                Yearly spending needs
              </p>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your FIRE Number</CardTitle>
            <CardDescription>
              Target for retiring at {targetRetirementAge}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary text-4xl font-bold">
              {formatCurrency(fireNumber)}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              {fireMultiplier.toFixed(1)}× annual expenses ({withdrawalRate}%
              withdrawal rate)
            </p>
            <div className="bg-foreground/5 mt-4 rounded-lg p-3">
              <p className="text-sm font-medium">Years to Retirement</p>
              <p className="text-2xl font-bold">{yearsToRetirement}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Required Monthly Savings</CardTitle>
            <CardDescription>To reach your FIRE goal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary text-4xl font-bold">
              {formatCurrency(requiredMonthlySavings)}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              {formatCurrency(requiredAnnualSavings)}/year
            </p>
            <div className="bg-foreground/5 mt-4 rounded-lg p-3">
              <p className="text-sm font-medium">Savings Rate Required</p>
              <p className="text-2xl font-bold">
                {Math.min(savingsRate, 100).toFixed(0)}%
              </p>
              {savingsRate > 100 && (
                <p className="mt-1 text-xs text-red-600">
                  ⚠️ Exceeds current income
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>
            Difficulty Assessment: Retiring at {targetRetirementAge}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-lg font-medium">Difficulty Level:</p>
            <p className={`text-3xl font-bold ${recommendations.color}`}>
              {recommendations.difficulty}
            </p>
          </div>

          <div>
            <p className="mb-3 text-lg font-medium">Key Success Factors:</p>
            <ul className="ml-6 list-disc space-y-2">
              {recommendations.tips.map((tip, idx) => (
                <li key={idx} className="text-lg">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Your Path to FIRE at {targetRetirementAge}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">
                Current Savings Growth
              </p>
              <p className="text-xl font-bold">
                {formatCurrency(futureValueOfCurrentSavings)}
              </p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Additional Needed</p>
              <p className="text-xl font-bold">
                {formatCurrency(Math.max(gap, 0))}
              </p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">
                Total Contributions
              </p>
              <p className="text-xl font-bold">
                {formatCurrency(requiredAnnualSavings * yearsToRetirement)}
              </p>
            </div>
            <div className="bg-foreground/5 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Investment Growth</p>
              <p className="text-xl font-bold">
                {formatCurrency(
                  fireNumber -
                    currentSavings -
                    requiredAnnualSavings * yearsToRetirement,
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      {savingsRate > 50 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>⚡ High Savings Rate Required:</strong> Achieving a{" "}
              {savingsRate.toFixed(0)}% savings rate is challenging. Consider
              increasing income through side hustles, reducing major expenses
              like housing/transportation, or adjusting your target retirement
              age to {targetRetirementAge + 5} for a more manageable{" "}
              {(
                ((requiredAnnualSavings * yearsToRetirement) /
                  ((targetRetirementAge + 5 - currentAge) * currentIncome)) *
                100
              ).toFixed(0)}
              % savings rate.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
