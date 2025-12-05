'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  type TooltipProps,
} from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Calculator, Percent } from 'lucide-react';

// Schema for form validation
const formSchema = z.object({
  startingCapital: z.coerce.number(),
  monthlySavings: z.coerce.number().min(0, 'Monthly savings must be a non-negative number'),
  currentAge: z.coerce
    .number()
    .min(1, 'Age must be at least 1')
    .max(100, 'No point in starting this late'),
  cagr: z.coerce.number().min(0, 'Growth rate must be a non-negative number'),
  desiredMonthlyAllowance: z.coerce.number().min(0, 'Monthly allowance must be a non-negative number'),
  inflationRate: z.coerce.number().min(0, 'Inflation rate must be a non-negative number'),
  lifeExpectancy: z.coerce
    .number()
    .min(40, 'Be a bit more optimistic buddy :(')
    .max(100, 'You should be more realistic...'),
  retirementAge: z.coerce
    .number()
    .min(18, 'Retirement age must be at least 18')
    .max(100, 'Retirement age must be at most 100'),
  coastFireAge: z.coerce
    .number()
    .min(18, 'Coast FIRE age must be at least 18')
    .max(100, 'Coast FIRE age must be at most 100')
    .optional(),
  baristaIncome: z.coerce.number().min(0, 'Barista income must be a non-negative number').optional(),
  simulationMode: z.enum(['deterministic', 'monte-carlo']).default('deterministic'),
  volatility: z.coerce.number().min(0).default(15),
  withdrawalStrategy: z.enum(['fixed', 'percentage']).default('fixed'),
  withdrawalPercentage: z.coerce.number().min(0).max(100).default(4),
});

// Type for form values
type FormValues = z.infer<typeof formSchema>;

interface YearlyData {
  age: number;
  year: number;
  balance: number;
  untouchedBalance: number;
  phase: 'accumulation' | 'retirement';
  monthlyAllowance: number;
  untouchedMonthlyAllowance: number;
  // Monte Carlo percentiles
  balanceP10?: number;
  balanceP50?: number;
  balanceP90?: number;
}

interface CalculationResult {
  fireNumber: number | null;
  fireNumber4percent: number | null;
  retirementAge4percent: number | null;
  yearlyData: YearlyData[];
  error?: string;
  successRate?: number; // For Monte Carlo
}

// Box-Muller transform for normal distribution
function randomNormal(mean: number, stdDev: number): number {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

// Helper function to format currency without specific symbols
const formatNumber = (value: number | null) => {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper function to render tooltip for chart
const tooltipRenderer = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload?.[0]?.payload) {
    const data = payload[0].payload as YearlyData;
    return (
      <div className="bg-background border p-2 shadow-sm">
        <p className="font-medium">{`Year: ${data.year.toString()} (Age: ${data.age.toString()})`}</p>
        {data.balanceP50 !== undefined ? (
          <>
            <p className="text-orange-500">{`Median Balance: ${formatNumber(data.balanceP50)}`}</p>
            <p className="text-xs text-orange-300">{`10th %: ${formatNumber(data.balanceP10 ?? 0)}`}</p>
            <p className="text-xs text-orange-300">{`90th %: ${formatNumber(data.balanceP90 ?? 0)}`}</p>
          </>
        ) : (
          <p className="text-orange-500">{`Balance: ${formatNumber(data.balance)}`}</p>
        )}
        <p className="text-red-600">{`Monthly allowance: ${formatNumber(data.monthlyAllowance)}`}</p>
        <p>{`Phase: ${data.phase === 'accumulation' ? 'Accumulation' : 'Retirement'}`}</p>
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
  const form = useForm<z.input<typeof formSchema>, undefined, FormValues>({
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
      coastFireAge: undefined,
      baristaIncome: 0,
      simulationMode: 'deterministic',
      volatility: 15,
    },
  });

  function onSubmit(values: FormValues) {
    setResult(null); // Reset previous results

    const startingCapital = values.startingCapital;
    const monthlySavings = values.monthlySavings;
    const age = values.currentAge;
    const cagr = values.cagr;
    const initialMonthlyAllowance = values.desiredMonthlyAllowance;
    const annualInflation = 1 + values.inflationRate / 100;
    const ageOfDeath = values.lifeExpectancy;
    const retirementAge = values.retirementAge;
    const coastFireAge = values.coastFireAge ?? retirementAge;
    const initialBaristaIncome = values.baristaIncome ?? 0;
    const simulationMode = values.simulationMode;
    const volatility = values.volatility;

    const numSimulations = simulationMode === 'monte-carlo' ? 500 : 1;
    const simulationResults: number[][] = []; // [yearIndex][simulationIndex] -> balance

    // Prepare simulation runs
    for (let sim = 0; sim < numSimulations; sim++) {
      let currentBalance = startingCapital;
      const runBalances: number[] = [];

      for (let year = irlYear + 1; year <= irlYear + (ageOfDeath - age); year++) {
        const currentAge = age + (year - irlYear);

        // Determine growth rate for this year
        let annualGrowthRate: number;
        if (simulationMode === 'monte-carlo') {
          // Random walk
          const randomReturn = randomNormal(cagr, volatility) / 100;
          annualGrowthRate = 1 + randomReturn;
        } else {
          // Deterministic
          annualGrowthRate = 1 + cagr / 100;
        }

        const inflatedAllowance = initialMonthlyAllowance * Math.pow(annualInflation, year - irlYear);
        const inflatedBaristaIncome = initialBaristaIncome * Math.pow(annualInflation, year - irlYear);

        const isRetirementYear = currentAge >= retirementAge;
        const phase = isRetirementYear ? 'retirement' : 'accumulation';
        const isContributing = currentAge < coastFireAge;

        let newBalance;
        if (phase === 'accumulation') {
          newBalance = currentBalance * annualGrowthRate + (isContributing ? monthlySavings * 12 : 0);
        } else {
          const netAnnualWithdrawal = (inflatedAllowance - inflatedBaristaIncome) * 12;
          newBalance = currentBalance * annualGrowthRate - netAnnualWithdrawal;
        }
        // Prevent negative balance from recovering (once you're broke, you're broke)
        // Although debt is possible, for FIRE calc usually 0 is the floor.
        // But strictly speaking, if you have income, you might recover?
        // Let's allow negative for calculation but maybe clamp for success rate?
        // Standard practice: if balance < 0, it stays < 0 or goes deeper.
        // Let's just let the math run.

        runBalances.push(newBalance);
        currentBalance = newBalance;
      }
      simulationResults.push(runBalances);
    }

    // Aggregate results
    const yearlyData: YearlyData[] = [];
    let successCount = 0;

    // Initial year
    yearlyData.push({
      age: age,
      year: irlYear,
      balance: startingCapital,
      untouchedBalance: startingCapital,
      phase: 'accumulation',
      monthlyAllowance: 0,
      untouchedMonthlyAllowance: initialMonthlyAllowance,
      balanceP10: startingCapital,
      balanceP50: startingCapital,
      balanceP90: startingCapital,
    });

    const numYears = ageOfDeath - age;
    for (let i = 0; i < numYears; i++) {
      const year = irlYear + 1 + i;
      const currentAge = age + 1 + i;

      // Collect all balances for this year across simulations
      const balancesForYear = simulationResults.map((run) => run[i]);

      // Sort to find percentiles
      balancesForYear.sort((a, b) => a - b);

      const p10 = balancesForYear[Math.floor(numSimulations * 0.1)];
      const p50 = balancesForYear[Math.floor(numSimulations * 0.5)];
      const p90 = balancesForYear[Math.floor(numSimulations * 0.9)];

      // Calculate other metrics (using deterministic logic for "untouched" etc for simplicity, or p50)
      // We need to reconstruct the "standard" fields for compatibility with the chart
      // Let's use p50 (Median) as the "main" line
      const inflatedAllowance = initialMonthlyAllowance * Math.pow(annualInflation, year - irlYear);
      const isRetirementYear = currentAge >= retirementAge;
      const phase = isRetirementYear ? 'retirement' : 'accumulation';

      // Reconstruct untouched balance for deterministic mode (for 4% rule)
      let untouchedBalance = 0;
      if (simulationMode === 'deterministic') {
        // We can just use the single run we have
        // In deterministic mode, there's only 1 simulation, so balancesForYear[0] is it.
        // But wait, `simulationResults` stores the *actual* balance (with withdrawals).
        // We need a separate tracker for "untouched" (never withdrawing) if we want accurate 4% rule.
        // Let's just re-calculate it simply here since it's deterministic.
        const prevUntouched = yearlyData[yearlyData.length - 1].untouchedBalance;
        const growth = 1 + cagr / 100;
        untouchedBalance = prevUntouched * growth + monthlySavings * 12;
      }

      yearlyData.push({
        age: currentAge,
        year: year,
        balance: p50, // Use Median for the main line
        untouchedBalance: untouchedBalance,
        phase: phase,
        monthlyAllowance: phase === 'retirement' ? inflatedAllowance : 0,
        untouchedMonthlyAllowance: inflatedAllowance,
        balanceP10: p10,
        balanceP50: p50,
        balanceP90: p90,
      });
    }

    // Calculate Success Rate (only for Monte Carlo)
    if (simulationMode === 'monte-carlo') {
      const finalBalances = simulationResults.map((run) => run[run.length - 1]);
      successCount = finalBalances.filter((b) => b > 0).length;
    }

    // Calculate FIRE number (using Median/Deterministic run)
    const retirementYear = irlYear + (retirementAge - age);
    const retirementIndex = yearlyData.findIndex((data) => data.year === retirementYear);
    const retirementData = yearlyData[retirementIndex];

    const [fireNumber4percent, retirementAge4percent] = (() => {
      // Re-enable 4% rule for deterministic mode or use p50 for MC
      // For MC, "untouchedBalance" isn't tracked per run in aggregate, but we can use balanceP50 roughly
      // or just disable it as it's a different philosophy.
      // For now, let's calculate it based on the main "balance" field (which is p50 in MC)
      for (const yearData of yearlyData) {
        // Note: This is imperfect for MC because 'balance' includes withdrawals in retirement
        // whereas 4% rule check usually looks at "if I retired now with this balance".
        // The original code had `untouchedBalance` which grew without withdrawals.
        // Since we removed `untouchedBalance` calculation in the aggregate loop, let's skip 4% for MC for now.

        if (
          simulationMode === 'deterministic' &&
          yearData.untouchedBalance &&
          yearData.untouchedBalance > (yearData.untouchedMonthlyAllowance * 12) / 0.04
        ) {
          return [yearData.untouchedBalance, yearData.age];
        }
      }
      return [null, null];
    })();

    if (retirementIndex === -1) {
      setResult({
        fireNumber: null,
        fireNumber4percent: null,
        retirementAge4percent: null,
        error: 'Could not calculate retirement data',
        yearlyData: yearlyData,
      });
    } else {
      // Set the result
      setResult({
        fireNumber: retirementData.balance,
        fireNumber4percent: fireNumber4percent,
        retirementAge4percent: retirementAge4percent,
        yearlyData: yearlyData,
        successRate:
          simulationMode === 'monte-carlo' ? (successCount / numSimulations) * 100 : undefined,
      });
    }
  }

  return (
    <>
      <Card className="border-primary/15 bg-background/90 shadow-primary/10 mb-6 border shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">FIRE Calculator</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Calculate your path to financial independence and retirement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-8"
            >
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
                          value={field.value as number | string | undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
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
                          value={field.value as number | string | undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
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
                          value={field.value as number | string | undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
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
                          value={field.value as number | string | undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
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
                          value={field.value as number | string | undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
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
                          value={field.value as number | string | undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
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
                      <FormLabel>Desired Monthly Allowance (Today&apos;s Value)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 2000"
                          type="number"
                          value={field.value as number | string | undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
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
                      <FormLabel>Retirement Age: {field.value as number}</FormLabel>
                      <FormControl>
                        <Slider
                          name="retirementAge"
                          value={[field.value as number]}
                          min={25}
                          max={75}
                          step={1}
                          onValueChange={(value: number[]) => {
                            field.onChange(value[0]);
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          className="py-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coastFireAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coast FIRE Age (Optional) - Stop contributing at age:</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 45 (defaults to Retirement Age)"
                          type="number"
                          value={field.value as number | string | undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="baristaIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barista FIRE Income (Monthly during Retirement)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 1000"
                          type="number"
                          value={field.value as number | string | undefined}
                          onChange={(e) => {
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            form.handleSubmit(onSubmit)();
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="simulationMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Simulation Mode</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          // eslint-disable-next-line @typescript-eslint/no-floating-promises
                          form.handleSubmit(onSubmit)();
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select simulation mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="deterministic">Deterministic (Linear)</SelectItem>
                          <SelectItem value="monte-carlo">Monte Carlo (Probabilistic)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('simulationMode') === 'monte-carlo' && (
                  <FormField
                    control={form.control}
                    name="volatility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Volatility (Std Dev %)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 15"
                            type="number"
                            value={field.value as number | string | undefined}
                            onChange={(e) => {
                              field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                              // eslint-disable-next-line @typescript-eslint/no-floating-promises
                              form.handleSubmit(onSubmit)();
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="withdrawalStrategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Withdrawal Strategy</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          // eslint-disable-next-line @typescript-eslint/no-floating-promises
                          form.handleSubmit(onSubmit)();
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select withdrawal strategy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Inflation-Adjusted</SelectItem>
                          <SelectItem value="percentage">Percentage of Portfolio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('withdrawalStrategy') === 'percentage' && (
                  <FormField
                    control={form.control}
                    name="withdrawalPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Withdrawal Percentage (%)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 4.0"
                            type="number"
                            step="0.1"
                            value={field.value as number | string | undefined}
                            onChange={(e) => {
                              field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                              // eslint-disable-next-line @typescript-eslint/no-floating-promises
                              form.handleSubmit(onSubmit)();
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {!result && (
                <Button type="submit" className="mx-auto w-full max-w-md justify-center" size="lg">
                  <Calculator className="h-4 w-4" />
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
                    <ChartContainer className="aspect-auto h-80 w-full" config={{}}>
                      <AreaChart
                        data={result.yearlyData}
                        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="year"
                          label={{
                            value: 'Year',
                            position: 'insideBottom',
                            offset: -10,
                          }}
                        />
                        {/* Right Y axis */}
                        <YAxis
                          yAxisId={'right'}
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
                          <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-orange-500)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-orange-500)" stopOpacity={0.1} />
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
                          yAxisId={'right'}
                          stackId={'a'}
                        />
                        {form.getValues('simulationMode') === 'monte-carlo' && (
                          <>
                            <Area
                              type="monotone"
                              dataKey="balanceP10"
                              stroke="none"
                              fill="var(--color-orange-500)"
                              fillOpacity={0.1}
                              yAxisId={'right'}
                              connectNulls
                            />
                            <Area
                              type="monotone"
                              dataKey="balanceP90"
                              stroke="none"
                              fill="var(--color-orange-500)"
                              fillOpacity={0.1}
                              yAxisId={'right'}
                              connectNulls
                            />
                          </>
                        )}
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
                              value: 'FIRE Number',
                              position: 'insideBottomRight',
                            }}
                            yAxisId={'right'}
                          />
                        )}
                        {result.fireNumber4percent && showing4percent && (
                          <ReferenceLine
                            y={result.fireNumber4percent}
                            stroke="var(--secondary)"
                            strokeWidth={1}
                            strokeDasharray="1 1"
                            label={{
                              value: '4%-Rule FIRE Number',
                              position: 'insideBottomLeft',
                            }}
                            yAxisId={'right'}
                          />
                        )}
                        <ReferenceLine
                          x={
                            irlYear +
                            (Number(form.getValues('retirementAge')) -
                              Number(form.getValues('currentAge')))
                          }
                          stroke="var(--primary)"
                          strokeWidth={2}
                          label={{
                            value: 'Retirement',
                            position: 'insideTopRight',
                          }}
                          yAxisId={'left'}
                        />
                        {result.retirementAge4percent && showing4percent && (
                          <ReferenceLine
                            x={
                              irlYear +
                              (result.retirementAge4percent - Number(form.getValues('currentAge')))
                            }
                            stroke="var(--secondary)"
                            strokeWidth={1}
                            label={{
                              value: '4%-Rule Retirement',
                              position: 'insideBottomLeft',
                            }}
                            yAxisId={'left'}
                          />
                        )}
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
              {result && (
                <Button
                  onClick={() => {
                    setShowing4percent(!showing4percent);
                  }}
                  variant={showing4percent ? 'secondary' : 'default'}
                  size={'sm'}
                  className="mt-2 gap-2 self-start"
                >
                  <Percent className="h-4 w-4" />
                  {showing4percent ? 'Hide' : 'Show'} 4%-Rule
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
                  <CardDescription className="text-xs">Capital at retirement</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatNumber(result.fireNumber)}</p>
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
                    {Number(form.getValues('lifeExpectancy')) - Number(form.getValues('retirementAge'))}
                  </p>
                </CardContent>
              </Card>
              {showing4percent && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>4%-Rule FIRE Number</CardTitle>
                      <CardDescription className="text-xs">
                        Capital needed for 4% of it to be greater than your yearly allowance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{formatNumber(result.fireNumber4percent)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>4%-Rule Retirement Duration</CardTitle>
                      <CardDescription className="text-xs">
                        Years to enjoy your financial independence if you follow the 4% rule
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {Number(form.getValues('lifeExpectancy')) - (result.retirementAge4percent ?? 0)}
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
