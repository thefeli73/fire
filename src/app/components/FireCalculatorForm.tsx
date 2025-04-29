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
  swr: z.coerce.number().min(0.1, "Withdrawal rate must be at least 0.1%"),
});

// Type for form values
type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  fireNumber: number | null;
  retirementAge: number | null;
  error?: string;
}

export default function FireCalculatorForm() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startingCapital: 10000,
      monthlySavings: 500,
      currentAge: 30,
      cagr: 7,
      desiredMonthlyAllowance: 2000,
      swr: 4,
    },
  });

  function onSubmit(values: FormValues) {
    setResult(null); // Reset previous results

    const sc = values.startingCapital;
    const ms = values.monthlySavings;
    const ca = values.currentAge;
    const annualRate = values.cagr / 100;
    const monthlyAllowance = values.desiredMonthlyAllowance;
    const safeWithdrawalRate = values.swr / 100;

    // Calculate FIRE number (the amount needed for retirement)
    const fireNumber = (monthlyAllowance * 12) / safeWithdrawalRate;

    let currentCapital = sc;
    let age = ca;
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    const maxYears = 100; // Set a limit to prevent infinite loops

    if (currentCapital >= fireNumber) {
      setResult({ fireNumber, retirementAge: age });
      return;
    }

    for (let year = 0; year < maxYears; year++) {
      const capitalAtYearStart = currentCapital;
      for (let month = 0; month < 12; month++) {
        currentCapital += ms;
        currentCapital *= 1 + monthlyRate;
      }
      age++;

      if (currentCapital >= fireNumber) {
        setResult({ fireNumber, retirementAge: age });
        return;
      }
      // Prevent infinite loop if savings don't outpace growth required
      if (currentCapital <= capitalAtYearStart && ms <= 0) {
        setResult({
          fireNumber: null,
          retirementAge: null,
          error: "Cannot reach FIRE goal with current savings and growth rate.",
        });
        return;
      }
    }

    // If loop finishes without reaching FIRE number
    setResult({
      fireNumber: null,
      retirementAge: null,
      error: `Could not reach FIRE goal within ${maxYears.toString()} years.`,
    });
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
                        Desired Monthly Allowance in Retirement
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
                  name="swr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Safe Withdrawal Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 4"
                          type="number"
                          step="0.1"
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
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
