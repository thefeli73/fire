"use client";

import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

// Schema for form validation
const formSchema = z.object({
  startingCapital: z.coerce
    .number()
    .min(0, "Starting capital must be a non-negative number"),
  monthlySavings: z.coerce
    .number()
    .min(0, "Monthly savings must be a non-negative number"),
  currentAge: z.coerce.number().min(18, "Age must be at least 18"),
  cagr: z.coerce.number().min(0, "Growth rate must be a non-negative number"),
  desiredMonthlyAllowance: z.coerce
    .number()
    .min(0, "Monthly allowance must be a non-negative number"),
  inflationRate: z.coerce
    .number()
    .min(0, "Inflation rate must be a non-negative number"),
  lifeExpectancy: z.coerce
    .number()
    .min(50, "Life expectancy must be at least 50"),
});

// Type for form values
type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  fireNumber: number | null;
  retirementAge: number | null;
  inflationAdjustedAllowance: number | null;
  retirementYears: number | null;
  error?: string;
}

export default function FireCalculatorForm() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startingCapital: 50000,
      monthlySavings: 1500,
      currentAge: 25,
      cagr: 7,
      desiredMonthlyAllowance: 2000,
      inflationRate: 2,
      lifeExpectancy: 90,
    },
  });

  function onSubmit(values: FormValues) {
    setResult(null); // Reset previous results

    const startingCapital = values.startingCapital;
    const monthlySavings = values.monthlySavings;
    const currentAge = values.currentAge;
    const annualGrowthRate = values.cagr / 100;
    const initialMonthlyAllowance = values.desiredMonthlyAllowance;
    const annualInflation = values.inflationRate / 100;
    const lifeExpectancy = values.lifeExpectancy;

    const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1 / 12) - 1;
    const monthlyInflationRate = Math.pow(1 + annualInflation, 1 / 12) - 1;
    const maxIterations = 1000; // Safety limit for iterations

    // Binary search for the required retirement capital
    let low = initialMonthlyAllowance * 12; // Minimum: one year of expenses
    let high = initialMonthlyAllowance * 12 * 100; // Maximum: hundred years of expenses
    let requiredCapital = 0;
    let retirementAge = 0;
    let finalInflationAdjustedAllowance = 0;

    // First, find when retirement is possible with accumulation phase
    let canRetire = false;
    let currentCapital = startingCapital;
    let age = currentAge;
    let monthlyAllowance = initialMonthlyAllowance;
    let iterations = 0;

    // Accumulation phase simulation
    while (age < lifeExpectancy && iterations < maxIterations) {
      // Simulate one year of saving and growth
      for (let month = 0; month < 12; month++) {
        currentCapital += monthlySavings;
        currentCapital *= 1 + monthlyGrowthRate;
        // Update allowance for inflation
        monthlyAllowance *= 1 + monthlyInflationRate;
      }
      age++;
      iterations++;

      // Check each possible retirement capital target through binary search
      const mid = (low + high) / 2;
      if (high - low < 1) {
        // Binary search converged
        requiredCapital = mid;
        break;
      }

      // Test if this retirement capital is sufficient
      let testCapital = mid;
      let testAge = age;
      let testAllowance = monthlyAllowance;
      let isSufficient = true;

      // Simulate retirement phase with this capital
      while (testAge < lifeExpectancy) {
        for (let month = 0; month < 12; month++) {
          // Withdraw inflation-adjusted allowance
          testCapital -= testAllowance;
          // Grow remaining capital
          testCapital *= 1 + monthlyGrowthRate;
          // Adjust allowance for inflation
          testAllowance *= 1 + monthlyInflationRate;
        }
        testAge++;

        // Check if we've depleted capital before life expectancy
        if (testCapital <= 0) {
          isSufficient = false;
          break;
        }
      }

      if (isSufficient) {
        high = mid; // This capital or less might be enough
        if (currentCapital >= mid) {
          // We can retire now with this capital
          canRetire = true;
          retirementAge = age;
          requiredCapital = mid;
          finalInflationAdjustedAllowance = monthlyAllowance;
          break;
        }
      } else {
        low = mid; // We need more capital
      }
    }

    // If we didn't find retirement possible in the loop
    if (!canRetire && iterations < maxIterations) {
      // Continue accumulation phase until we reach sufficient capital
      while (age < lifeExpectancy && iterations < maxIterations) {
        // Simulate one year
        for (let month = 0; month < 12; month++) {
          currentCapital += monthlySavings;
          currentCapital *= 1 + monthlyGrowthRate;
          monthlyAllowance *= 1 + monthlyInflationRate;
        }
        age++;
        iterations++;

        // Test with current capital
        let testCapital = currentCapital;
        let testAge = age;
        let testAllowance = monthlyAllowance;
        let isSufficient = true;

        // Simulate retirement with current capital
        while (testAge < lifeExpectancy) {
          for (let month = 0; month < 12; month++) {
            testCapital -= testAllowance;
            testCapital *= 1 + monthlyGrowthRate;
            testAllowance *= 1 + monthlyInflationRate;
          }
          testAge++;

          if (testCapital <= 0) {
            isSufficient = false;
            break;
          }
        }

        if (isSufficient) {
          canRetire = true;
          retirementAge = age;
          requiredCapital = currentCapital;
          finalInflationAdjustedAllowance = monthlyAllowance;
          break;
        }
      }
    }

    if (canRetire) {
      setResult({
        fireNumber: requiredCapital,
        retirementAge: retirementAge,
        inflationAdjustedAllowance: finalInflationAdjustedAllowance,
        retirementYears: lifeExpectancy - retirementAge,
        error: undefined,
      });
    } else {
      setResult({
        fireNumber: null,
        retirementAge: null,
        inflationAdjustedAllowance: null,
        retirementYears: null,
        error:
          iterations >= maxIterations
            ? "Calculation exceeded maximum iterations."
            : "Cannot reach FIRE goal before life expectancy with current parameters.",
      });
    }
  }

  // Helper function to format currency
  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat("en", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full max-w-3xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">FIRE Calculator</CardTitle>
          <CardDescription>
            Calculate your path to financial independence and retirement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startingCapital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Capital</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 10000"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlySavings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Savings</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 500"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 30"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cagr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Annual Growth Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 7"
                          type="number"
                          step="0.1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desiredMonthlyAllowance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Desired Monthly Allowance (Today&apos;s Value)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 2000"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inflationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Inflation Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 2"
                          type="number"
                          step="0.1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lifeExpectancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Life Expectancy (Age)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 90"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Calculate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <p className="text-destructive">{result.error}</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>FIRE Number (Required Capital)</Label>
                  <p className="text-2xl font-bold">
                    {formatCurrency(result.fireNumber)}
                  </p>
                </div>
                <div>
                  <Label>Estimated Retirement Age</Label>
                  <p className="text-2xl font-bold">
                    {result.retirementAge ?? "N/A"}
                  </p>
                </div>
                {result.inflationAdjustedAllowance && (
                  <div>
                    <Label>
                      Monthly Allowance at Retirement (Inflation Adjusted)
                    </Label>
                    <p className="text-2xl font-bold">
                      {formatCurrency(result.inflationAdjustedAllowance)}
                    </p>
                  </div>
                )}
                {result.retirementYears && (
                  <div>
                    <Label>Retirement Duration (Years)</Label>
                    <p className="text-2xl font-bold">
                      {result.retirementYears}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
