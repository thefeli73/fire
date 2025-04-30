"use client";

import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface YearlyData {
  age: number;
  year: number;
  balance: number;
  phase: "accumulation" | "retirement";
  monthlyAllowance: number;
  fireNumber: number | null;
}

interface CalculationResult {
  fireNumber: number | null;
  retirementAge: number | null;
  inflationAdjustedAllowance: number | null;
  retirementYears: number | null;
  error?: string;
  yearlyData?: Record<string, YearlyData>;
}

export default function FireCalculatorForm() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const irlYear = new Date().getFullYear();

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
    /*
    PSEUDOCODE
    1. calculate all balances if no retirement.
    2. calculate all required FIRE numbers for each possible year of retirement for the selected strategy.
    2.1 calculate the monthly allowance for each year of retirement for all years, fire number is these but cumulative.
    3. binary search the crossover
    4. calculate new balance for each year of retirement
    5. graph balance, balance if no retirement, fire numbers, allowances
    */
    setResult(null); // Reset previous results

    const startingCapital = values.startingCapital;
    const monthlySavings = values.monthlySavings;
    const age = values.currentAge;
    const annualGrowthRate = 1 + values.cagr / 100;
    const initialMonthlyAllowance = values.desiredMonthlyAllowance;
    const annualInflation = 1 + values.inflationRate / 100;
    const ageOfDeath = values.lifeExpectancy;
    const retirementStrategy = values.retirementStrategy;

    let requiredCapital: number | null = null;
    let retirementAge: number | null = null;
    let finalInflationAdjustedAllowance: number | null = null;

    // Array to store yearly data for the chart with initial value
    const yearlyData: Record<number, YearlyData> = {
      [irlYear]: {
        age: age,
        year: irlYear,
        balance: startingCapital,
        phase: "accumulation",
        monthlyAllowance: initialMonthlyAllowance,
        fireNumber: null,
      },
    };
    // calculate all balances if no retirement
    for (let year = irlYear + 1; year <= irlYear + ageOfDeath - age; year++) {
      const previousYearData = yearlyData[year - 1];
      if (!previousYearData) {
        continue;
      }
      yearlyData[year] = {
        age: age + year - irlYear,
        year: year,
        balance:
          previousYearData.balance * annualGrowthRate + monthlySavings * 12,
        phase: "accumulation",
        monthlyAllowance: previousYearData.monthlyAllowance * annualInflation,
        fireNumber: null,
      };
    }
    // calculate FIRE numbers based on allowances
    for (let year = irlYear + ageOfDeath - age; year >= irlYear; year--) {
      const yearData = yearlyData[year];
      if (!yearData) {
        continue;
      }
      yearData.fireNumber =
        (yearlyData[year + 1]?.fireNumber ?? 0) +
        12 * yearData.monthlyAllowance;
    }

    // calculate new balance and retirement age
    for (let year = irlYear; year <= irlYear + ageOfDeath - age; year++) {
      const yearData = yearlyData[year];
      const previousYearData = yearlyData[year - 1];
      if (!yearData?.fireNumber) {
        continue;
      }
      if (!previousYearData) {
        yearData.monthlyAllowance = 0;
        continue;
      }
      if (yearData.balance > yearData.fireNumber) {
        retirementAge ??= yearData.age;
        requiredCapital ??= yearData.balance;
        finalInflationAdjustedAllowance ??= yearData.monthlyAllowance;
        yearData.phase = "retirement";
        yearData.balance =
          previousYearData.balance * annualGrowthRate -
          yearData.monthlyAllowance * 12;
      } else {
        yearData.monthlyAllowance = 0;
      }
    }

    // --- Calculation Logic based on Strategy ---

    // --- Set Final Result ---
    setResult({
      fireNumber: requiredCapital,
      retirementAge: retirementAge,
      inflationAdjustedAllowance: finalInflationAdjustedAllowance,
      retirementYears: ageOfDeath - retirementAge,
      yearlyData: Object.values(yearlyData),
      error: undefined,
    });
  }

  // Helper function to format currency without specific symbols
  const formatNumber = (value: number | null) => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat("en", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Card className="mb-4">
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
        <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
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
                  <p className="text-3xl font-bold">
                    {formatNumber(result.fireNumber)}
                  </p>
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
                  <p className="text-3xl font-bold">
                    {result.retirementAge ?? "N/A"}
                  </p>
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
                    <p className="text-3xl font-bold">
                      {formatNumber(result.inflationAdjustedAllowance)}
                    </p>
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
                    <p className="text-3xl font-bold">
                      {result.retirementYears}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {result?.yearlyData && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Projection</CardTitle>
            <CardDescription>
              Projected balance growth and FIRE number threshold
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="aspect-auto h-80 w-full"
              config={{
                balance: {
                  label: "Balance",
                  color: "var(--chart-1)",
                },
                fireNumber: {
                  label: "FIRE Number",
                  color: "var(--chart-2)",
                },
                realBalance: {
                  label: "Real Balance",
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
                      return `${(value / 1000000).toPrecision(3)}M`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toPrecision(3)}K`;
                    }
                    return value.toString();
                  }}
                  width={25}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]?.payload) {
                      const data = payload[0]
                        .payload as (typeof result.yearlyData)[0];
                      return (
                        <div className="bg-background border p-2 shadow-sm">
                          <p className="font-medium">{`Year: ${data.year.toString()} (Age: ${data.age.toString()})`}</p>
                          <p className="text-chart-1">{`Balance: ${formatNumber(data.balance)}`}</p>
                          <p className="text-chart-2">{`FIRE number: ${formatNumber(data.fireNumber)}`}</p>
                          <p className="text-chart-4">{`Monthly allowance: ${formatNumber(data.monthlyAllowance)}`}</p>
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
                  <linearGradient
                    id="fillFireNumber"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="fillAllowance"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--chart-4)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-4)"
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
                <Area
                  type="monotone"
                  dataKey="fireNumber"
                  name="fireNumber"
                  stroke="var(--chart-2)"
                  fill="url(#fillFireNumber)"
                  fillOpacity={0.4}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="monthlyAllowance"
                  name="allowance"
                  stroke="var(--chart-4)"
                  fill="url(#fillAllowance)"
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
                      irlYear +
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
    </>
  );
}
