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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  retirementStrategy: z.enum(["Depletion", "Maintenance", "4% Rule"]),
});

// Type for form values
type FormValues = z.infer<typeof formSchema>;

interface CalculationResult {
  fireNumber: number | null;
  retirementAge: number | null;
  inflationAdjustedAllowance: number | null;
  retirementYears: number | null;
  error?: string;
  yearlyData?: Array<{
    age: number;
    year: number;
    balance: number;
    phase: "accumulation" | "retirement";
  }>;
}

export default function FireCalculatorForm() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const currentYear = new Date().getFullYear();

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
      lifeExpectancy: 84,
      retirementStrategy: "Depletion",
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
    const retirementStrategy = values.retirementStrategy;

    const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1 / 12) - 1;
    const monthlyInflationRate = Math.pow(1 + annualInflation, 1 / 12) - 1;
    const maxIterations = 100; // Adjusted max iterations for age limit

    let requiredCapital: number | null = null;
    let retirementAge: number | null = null;
    let finalInflationAdjustedAllowance: number | null = null;
    let canRetire = false;
    let errorMessage: string | undefined = undefined;

    // Array to store yearly data for the chart
    const yearlyData: CalculationResult["yearlyData"] = [];
    yearlyData.push({
      age: currentAge,
      year: currentYear,
      balance: startingCapital,
      phase: "accumulation",
    });

    let currentCapital = startingCapital;
    let age = currentAge;
    let monthlyAllowance = initialMonthlyAllowance;

    // --- Calculation Logic based on Strategy ---

    if (retirementStrategy === "4% Rule") {
      // --- 4% Rule Calculation ---
      requiredCapital = (initialMonthlyAllowance * 12) / 0.04;

      // Simulate accumulation until the 4% rule target is met
      while (age < lifeExpectancy) {
        if (currentCapital >= requiredCapital) {
          canRetire = true;
          retirementAge = age;
          finalInflationAdjustedAllowance = monthlyAllowance;
          break; // Found retirement age
        }

        // Simulate one year of saving and growth
        for (let month = 0; month < 12; month++) {
          currentCapital += monthlySavings;
          currentCapital *= 1 + monthlyGrowthRate;
          monthlyAllowance *= 1 + monthlyInflationRate; // Keep track of inflation-adjusted allowance
        }
        age++;

        yearlyData.push({
          age: age,
          year: currentYear + (age - currentAge),
          balance: Math.round(currentCapital),
          phase: "accumulation",
        });

        if (age >= lifeExpectancy) break; // Stop if life expectancy is reached
      }

      if (!canRetire) {
        errorMessage =
          "Cannot reach FIRE goal (4% Rule) before life expectancy.";
        requiredCapital = null; // Cannot retire, so no specific FIRE number applies this way
      } else if (retirementAge !== null) {
        // Simulate retirement phase for chart data (using 4% withdrawal adjusted for inflation)
        let simulationCapital = currentCapital;
        let simulationAge = retirementAge;

        // Mark retirement phase in existing data
        yearlyData.forEach((data) => {
          if (data.age >= retirementAge!) {
            data.phase = "retirement";
          }
        });

        while (simulationAge < lifeExpectancy) {
          let yearlyWithdrawal = requiredCapital * 0.04; // Initial 4%
          // Adjust for inflation annually from retirement start
          yearlyWithdrawal *= Math.pow(
            1 + annualInflation,
            simulationAge - retirementAge,
          );
          const monthlyWithdrawal = yearlyWithdrawal / 12;

          for (let month = 0; month < 12; month++) {
            simulationCapital -=
              monthlyWithdrawal * Math.pow(1 + monthlyInflationRate, month); // Approximate intra-year inflation on withdrawal
            simulationCapital *= 1 + monthlyGrowthRate;
          }
          simulationAge++;

          yearlyData.push({
            age: simulationAge,
            year: currentYear + (simulationAge - currentAge),
            balance: Math.round(simulationCapital),
            phase: "retirement",
          });
        }
      }
    } else {
      // --- Depletion and Maintenance Calculation (Simulation-based) ---
      let iterations = 0;

      while (age < lifeExpectancy && iterations < maxIterations) {
        // Simulate one year of saving and growth
        for (let month = 0; month < 12; month++) {
          currentCapital += monthlySavings;
          currentCapital *= 1 + monthlyGrowthRate;
          monthlyAllowance *= 1 + monthlyInflationRate;
        }
        age++;
        iterations++;

        yearlyData.push({
          age: age,
          year: currentYear + (age - currentAge),
          balance: Math.round(currentCapital),
          phase: "accumulation",
        });

        // --- Check if retirement is possible at this age ---
        let testCapital = currentCapital;
        let testAge = age;
        let testAllowance = monthlyAllowance;
        let isSufficient = true;

        // Simulate retirement phase to check sufficiency
        while (testAge < lifeExpectancy) {
          const yearlyStartCapital = testCapital;

          for (let month = 0; month < 12; month++) {
            const withdrawal = testAllowance;
            testCapital -= withdrawal;
            const growth = testCapital * monthlyGrowthRate;
            testCapital += growth; // Apply growth *after* withdrawal for the month
            testAllowance *= 1 + monthlyInflationRate; // Inflate allowance for next month
          }
          testAge++;

          if (testCapital <= 0) {
            // Depleted capital before life expectancy
            isSufficient = false;
            break;
          }

          if (retirementStrategy === "Maintenance") {
            // Maintenance check: Withdrawal should not exceed growth for the year
            // Use average capital for a slightly more stable check? Or end-of-year growth vs start-of-year withdrawal?
            // Let's check if end-of-year capital is less than start-of-year capital
            if (testCapital < yearlyStartCapital) {
              isSufficient = false;
              break; // Capital decreased, maintenance failed
            }
            // Alternative check: yearlyWithdrawal > yearlyGrowth
            // if (yearlyWithdrawal > yearlyGrowth) {
            //     isSufficient = false;
            //     break; // Withdrawals exceed growth, maintenance failed
            // }
          }
        } // End retirement simulation check

        if (isSufficient) {
          canRetire = true;
          retirementAge = age;
          requiredCapital = currentCapital; // The capital needed at this point
          finalInflationAdjustedAllowance = monthlyAllowance; // Allowance level at retirement
          break; // Found retirement age
        }
      } // End accumulation simulation loop

      if (!canRetire) {
        errorMessage = `Cannot reach FIRE goal (${retirementStrategy}) before life expectancy or within ${maxIterations} years.`;
        requiredCapital = null;
      } else if (retirementAge !== null) {
        // Simulate the actual retirement phase for chart data if retirement is possible
        let simulationCapital = requiredCapital!;
        let simulationAge = retirementAge;
        let simulationAllowance = finalInflationAdjustedAllowance!;

        // Mark retirement phase in existing data
        yearlyData.forEach((data) => {
          if (data.age >= retirementAge!) {
            data.phase = "retirement";
          }
        });

        // Simulate remaining years until life expectancy
        while (simulationAge < lifeExpectancy) {
          for (let month = 0; month < 12; month++) {
            simulationCapital -= simulationAllowance;
            simulationCapital *= 1 + monthlyGrowthRate;
            simulationAllowance *= 1 + monthlyInflationRate;
          }
          simulationAge++;

          // Ensure capital doesn't go below zero for chart visibility in Depletion
          const displayBalance =
            retirementStrategy === "Depletion"
              ? Math.max(0, simulationCapital)
              : simulationCapital;

          yearlyData.push({
            age: simulationAge,
            year: currentYear + (simulationAge - currentAge),
            balance: Math.round(displayBalance),
            phase: "retirement",
          });
        }
      }
    } // End Depletion/Maintenance logic

    // --- Set Final Result ---
    if (
      canRetire &&
      retirementAge !== null &&
      requiredCapital !== null &&
      finalInflationAdjustedAllowance !== null
    ) {
      // Ensure yearlyData covers up to lifeExpectancy if retirement happens early
      const lastDataYear =
        yearlyData[yearlyData.length - 1]?.year ?? currentYear;
      const expectedEndYear = currentYear + (lifeExpectancy - currentAge);
      if (lastDataYear < expectedEndYear) {
        // Need to continue simulation purely for charting if the main calc stopped early
        // (This might already be covered by the post-retirement simulation loops added above)
        console.warn(
          "Chart data might not extend fully to life expectancy in some scenarios.",
        );
      }

      setResult({
        fireNumber: requiredCapital,
        retirementAge: retirementAge,
        inflationAdjustedAllowance: finalInflationAdjustedAllowance,
        retirementYears: lifeExpectancy - retirementAge,
        yearlyData: yearlyData,
        error: undefined,
      });
    } else {
      setResult({
        fireNumber: null,
        retirementAge: null,
        inflationAdjustedAllowance: null,
        retirementYears: null,
        yearlyData: yearlyData, // Show accumulation data even if goal not reached
        error:
          errorMessage ?? "Calculation failed to find a retirement scenario.",
      });
    }
  }

  // Helper function to format currency without specific symbols
  const formatNumber = (value: number | null) => {
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
                <FormField
                  control={form.control}
                  name="retirementStrategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retirement Strategy</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a retirement strategy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Depletion">Depletion</SelectItem>
                          <SelectItem value="Maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="4% Rule">4% Rule</SelectItem>
                        </SelectContent>
                      </Select>
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
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {result.error ? (
            <Card className="col-span-full">
              <CardContent className="pt-6">
                <p className="text-destructive">{result.error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>FIRE Number</CardTitle>
                  <CardDescription className="text-xs">
                    Required capital at retirement using{" "}
                    {form.getValues().retirementStrategy}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">
                      {formatNumber(result.fireNumber)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Retirement Age</CardTitle>
                  <CardDescription className="text-xs">
                    Estimated age when you can retire
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">
                      {result.retirementAge ?? "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {result.inflationAdjustedAllowance && (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Allowance</CardTitle>
                    <CardDescription className="text-xs">
                      At retirement (inflation adjusted)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold">
                        {formatNumber(result.inflationAdjustedAllowance)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.retirementYears && (
                <Card>
                  <CardHeader>
                    <CardTitle>Retirement Duration</CardTitle>
                    <CardDescription className="text-xs">
                      Years in retirement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold">
                        {result.retirementYears}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {result?.yearlyData && result.yearlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Projection</CardTitle>
            <CardDescription>
              Projected balance growth and FIRE number threshold
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-80"
              config={{
                balance: {
                  label: "Balance",
                  color: "var(--chart-1)",
                },
                fireNumber: {
                  label: "FIRE Number",
                  color: "var(--chart-3)",
                },
              }}
            >
              <AreaChart
                data={result.yearlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{
                    value: "Year",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  tickFormatter={(value: number) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}K`;
                    }
                    return value.toString();
                  }}
                  width={80}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]?.payload) {
                      const data = payload[0]
                        .payload as (typeof result.yearlyData)[0];
                      return (
                        <div className="bg-background border p-2 shadow-sm">
                          <p className="font-medium">{`Year: ${data.year.toString()} (Age: ${data.age.toString()})`}</p>
                          <p className="text-primary">{`Balance: ${formatNumber(data.balance)}`}</p>
                          {result.fireNumber !== null && (
                            <p className="text-destructive">{`Target FIRE Number: ${formatNumber(result.fireNumber)}`}</p>
                          )}
                          <p>{`Phase: ${data.phase === "accumulation" ? "Accumulation" : "Retirement"}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <defs>
                  <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="balance"
                  name="balance"
                  stroke="var(--chart-1)"
                  fill="url(#fillBalance)"
                  fillOpacity={0.4}
                  activeDot={{ r: 6 }}
                />
                {result.fireNumber && (
                  <ReferenceLine
                    y={result.fireNumber}
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{
                      value: "FIRE Number",
                      position: "insideBottomRight",
                    }}
                  />
                )}
                {result.retirementAge && (
                  <ReferenceLine
                    x={
                      currentYear +
                      (result.retirementAge - form.getValues().currentAge)
                    }
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    label={{
                      value: "Retirement",
                      position: "insideTopRight",
                    }}
                  />
                )}
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
