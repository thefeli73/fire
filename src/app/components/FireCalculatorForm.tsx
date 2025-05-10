"use client";

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
  type TooltipProps,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import assert from "assert";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// Schema for form validation
const formSchema = z.object({
  startingCapital: z.coerce.number(),
  monthlySavings: z.coerce
    .number()
    .min(0, "Monthly savings must be a non-negative number"),
  currentAge: z.coerce
    .number()
    .min(1, "Age must be at least 1")
    .max(100, "No point in starting this late"),
  cagr: z.coerce.number().min(0, "Growth rate must be a non-negative number"),
  desiredMonthlyAllowance: z.coerce
    .number()
    .min(0, "Monthly allowance must be a non-negative number"),
  inflationRate: z.coerce
    .number()
    .min(0, "Inflation rate must be a non-negative number"),
  lifeExpectancy: z.coerce
    .number()
    .min(40, "Be a bit more optimistic buddy :(")
    .max(100, "You should be more realistic..."),
  retirementAge: z.coerce
    .number()
    .min(18, "Retirement age must be at least 18")
    .max(100, "Retirement age must be at most 100"),
});

// Type for form values
type FormValues = z.infer<typeof formSchema>;

interface YearlyData {
  age: number;
  year: number;
  balance: number;
  untouchedBalance: number;
  phase: "accumulation" | "retirement";
  monthlyAllowance: number;
  untouchedMonthlyAllowance: number;
}

interface CalculationResult {
  fireNumber: number | null;
  fireNumber4percent: number | null;
  retirementAge4percent: number | null;
  yearlyData: YearlyData[];
  error?: string;
}

// Helper function to format currency without specific symbols
const formatNumber = (value: number | null) => {
  if (!value) return "N/A";
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper function to render tooltip for chart
const tooltipRenderer = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload?.[0]?.payload) {
    const data = payload[0].payload as YearlyData;
    return (
      <div className="bg-background border p-2 shadow-sm">
        <p className="font-medium">{`Year: ${data.year.toString()} (Age: ${data.age.toString()})`}</p>
        <p className="text-orange-500">{`Balance: ${formatNumber(data.balance)}`}</p>
        <p className="text-red-600">{`Monthly allowance: ${formatNumber(data.monthlyAllowance)}`}</p>
        <p>{`Phase: ${data.phase === "accumulation" ? "Accumulation" : "Retirement"}`}</p>
      </div>
    );
  }
  return null;
};

export default function FireCalculatorForm() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const irlYear = new Date().getFullYear();
  const [showing4percent, setShowing4percent] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startingCapital: 50000,
      monthlySavings: 1500,
      currentAge: 25,
      cagr: 7,
      desiredMonthlyAllowance: 3000,
      inflationRate: 2.3,
      lifeExpectancy: 84,
      retirementAge: 55,
    },
  });

  function onSubmit(values: FormValues) {
    setResult(null); // Reset previous results

    const startingCapital = values.startingCapital;
    const monthlySavings = values.monthlySavings;
    const age = values.currentAge;
    const annualGrowthRate = 1 + values.cagr / 100;
    const initialMonthlyAllowance = values.desiredMonthlyAllowance;
    const annualInflation = 1 + values.inflationRate / 100;
    const ageOfDeath = values.lifeExpectancy;
    const retirementAge = values.retirementAge;

    // Array to store yearly data for the chart
    const yearlyData: YearlyData[] = [];

    // Initial year data
    yearlyData.push({
      age: age,
      year: irlYear,
      balance: startingCapital,
      untouchedBalance: startingCapital,
      phase: "accumulation",
      monthlyAllowance: 0,
      untouchedMonthlyAllowance: initialMonthlyAllowance,
    });

    // Calculate accumulation phase (before retirement)
    for (let year = irlYear + 1; year <= irlYear + (ageOfDeath - age); year++) {
      const currentAge = age + (year - irlYear);
      const previousYearData = yearlyData[yearlyData.length - 1];
      const inflatedAllowance =
        initialMonthlyAllowance * Math.pow(annualInflation, year - irlYear);

      const isRetirementYear = currentAge >= retirementAge;
      const phase = isRetirementYear ? "retirement" : "accumulation";

      assert(!!previousYearData);
      // Calculate balance based on phase
      let newBalance;
      if (phase === "accumulation") {
        // During accumulation: grow previous balance + add savings
        newBalance =
          previousYearData.balance * annualGrowthRate + monthlySavings * 12;
      } else {
        // During retirement: grow previous balance - withdraw allowance
        newBalance =
          previousYearData.balance * annualGrowthRate - inflatedAllowance * 12;
      }
      const untouchedBalance =
        previousYearData.untouchedBalance * annualGrowthRate +
        monthlySavings * 12;
      const allowance = phase === "retirement" ? inflatedAllowance : 0;
      yearlyData.push({
        age: currentAge,
        year: year,
        balance: newBalance,
        untouchedBalance: untouchedBalance,
        phase: phase,
        monthlyAllowance: allowance,
        untouchedMonthlyAllowance: inflatedAllowance,
      });
    }

    // Calculate FIRE number at retirement
    const retirementYear = irlYear + (retirementAge - age);
    const retirementIndex = yearlyData.findIndex(
      (data) => data.year === retirementYear,
    );
    const retirementData = yearlyData[retirementIndex];

    const [fireNumber4percent, retirementAge4percent] = (() => {
      for (const yearData of yearlyData) {
        if (
          yearData.untouchedBalance >
          (yearData.untouchedMonthlyAllowance * 12) / 0.04
        ) {
          return [yearData.untouchedBalance, yearData.age];
        }
      }
      return [0, 0];
    })();

    if (retirementIndex === -1 || !retirementData) {
      setResult({
        fireNumber: null,
        fireNumber4percent: null,
        retirementAge4percent: null,
        error: "Could not calculate retirement data",
        yearlyData: yearlyData,
      });
    } else {
      // Set the result
      setResult({
        fireNumber: retirementData.balance,
        fireNumber4percent: fireNumber4percent,
        retirementAge4percent: retirementAge4percent,
        yearlyData: yearlyData,
      });
    }
  }

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
                          onChange={(value) => {
                            field.onChange(value);
                            void form.handleSubmit(onSubmit)();
                          }}
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
                          onChange={(value) => {
                            field.onChange(value);
                            void form.handleSubmit(onSubmit)();
                          }}
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
                          onChange={(value) => {
                            field.onChange(value);
                            void form.handleSubmit(onSubmit)();
                          }}
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
                          onChange={(value) => {
                            field.onChange(value);
                            void form.handleSubmit(onSubmit)();
                          }}
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
                          onChange={(value) => {
                            field.onChange(value);
                            void form.handleSubmit(onSubmit)();
                          }}
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
                          onChange={(value) => {
                            field.onChange(value);
                            void form.handleSubmit(onSubmit)();
                          }}
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
                          onChange={(value) => {
                            field.onChange(value);
                            void form.handleSubmit(onSubmit)();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Retirement Age Slider */}
                <FormField
                  control={form.control}
                  name="retirementAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retirement Age: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          name="retirementAge"
                          value={[field.value]}
                          min={25}
                          max={75}
                          step={1}
                          onValueChange={(value: number[]) => {
                            field.onChange(value[0]);
                            void form.handleSubmit(onSubmit)();
                          }}
                          className="py-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!result && (
                <Button type="submit" className="w-full">
                  Calculate
                </Button>
              )}
              {result?.yearlyData && (
                <Card className="rounded-md shadow-none">
                  <CardHeader>
                    <CardTitle>Financial Projection</CardTitle>
                    <CardDescription>
                      Projected balance growth with your selected retirement age
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <ChartContainer
                      className="aspect-auto h-80 w-full"
                      config={{}}
                    >
                      <AreaChart
                        data={result.yearlyData}
                        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
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
                        {/* Right Y axis */}
                        <YAxis
                          yAxisId={"right"}
                          orientation="right"
                          tickFormatter={(value: number) => {
                            if (value >= 1000000) {
                              return `${(value / 1000000).toPrecision(3)}M`;
                            } else if (value >= 1000) {
                              return `${(value / 1000).toPrecision(3)}K`;
                            } else if (value <= -1000000) {
                              return `${(value / 1000000).toPrecision(3)}M`;
                            } else if (value <= -1000) {
                              return `${(value / 1000).toPrecision(3)}K`;
                            }
                            return value.toString();
                          }}
                          width={30}
                          stroke="var(--color-orange-500)"
                          tick={{}}
                        />
                        {/* Left Y axis */}
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          tickFormatter={(value: number) => {
                            if (value >= 1000000) {
                              return `${(value / 1000000).toPrecision(3)}M`;
                            } else if (value >= 1000) {
                              return `${(value / 1000).toPrecision(3)}K`;
                            }
                            return value.toString();
                          }}
                          width={30}
                          stroke="var(--color-red-600)"
                        />
                        <ChartTooltip content={tooltipRenderer} />
                        <defs>
                          <linearGradient
                            id="fillBalance"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-orange-500)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-orange-500)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="balance"
                          name="balance"
                          stroke="var(--color-orange-500)"
                          fill="url(#fillBalance)"
                          fillOpacity={0.9}
                          activeDot={{ r: 6 }}
                          yAxisId={"right"}
                          stackId={"a"}
                        />
                        <Area
                          type="step"
                          dataKey="monthlyAllowance"
                          name="allowance"
                          stroke="var(--color-red-600)"
                          fill="none"
                          activeDot={{ r: 6 }}
                          yAxisId="left"
                        />
                        {result.fireNumber && (
                          <ReferenceLine
                            y={result.fireNumber}
                            stroke="var(--primary)"
                            strokeWidth={2}
                            strokeDasharray="2 1"
                            label={{
                              value: "FIRE Number",
                              position: "insideBottomRight",
                            }}
                            yAxisId={"right"}
                          />
                        )}
                        {result.fireNumber4percent && showing4percent && (
                          <ReferenceLine
                            y={result.fireNumber4percent}
                            stroke="var(--secondary)"
                            strokeWidth={1}
                            strokeDasharray="1 1"
                            label={{
                              value: "4%-Rule FIRE Number",
                              position: "insideBottomLeft",
                            }}
                            yAxisId={"right"}
                          />
                        )}
                        <ReferenceLine
                          x={
                            irlYear +
                            (form.getValues("retirementAge") -
                              form.getValues("currentAge"))
                          }
                          stroke="var(--primary)"
                          strokeWidth={2}
                          label={{
                            value: "Retirement",
                            position: "insideTopRight",
                          }}
                          yAxisId={"left"}
                        />
                        {result.retirementAge4percent && showing4percent && (
                          <ReferenceLine
                            x={
                              irlYear +
                              (result.retirementAge4percent -
                                form.getValues("currentAge"))
                            }
                            stroke="var(--secondary)"
                            strokeWidth={1}
                            label={{
                              value: "4%-Rule Retirement",
                              position: "insideBottomLeft",
                            }}
                            yAxisId={"left"}
                          />
                        )}
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
              {result && (
                <Button
                  onClick={() => setShowing4percent(!showing4percent)}
                  variant={showing4percent ? "secondary" : "default"}
                  size={"sm"}
                >
                  {showing4percent ? "Hide" : "Show"} 4%-Rule
                </Button>
              )}
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
                    Capital at retirement
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
                  <CardTitle>Retirement Duration</CardTitle>
                  <CardDescription className="text-xs">
                    Years to enjoy your financial independence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {form.getValues("lifeExpectancy") -
                      form.getValues("retirementAge")}
                  </p>
                </CardContent>
              </Card>
              {showing4percent && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>4%-Rule FIRE Number</CardTitle>
                      <CardDescription className="text-xs">
                        Capital needed for 4% of it to be greater than your
                        yearly allowance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {formatNumber(result.fireNumber4percent)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>4%-Rule Retirement Duration</CardTitle>
                      <CardDescription className="text-xs">
                        Years to enjoy your financial independence if you follow
                        the 4% rule
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {form.getValues("lifeExpectancy") -
                          (result.retirementAge4percent ?? 0)}
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
