'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { extractNumericSearchParam } from '@/lib/retire-at';
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
import { Calculator, Info, Share2, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import BlurThing from './blur-thing';
import Link from 'next/link';

import type { FireCalculatorFormValues } from '@/lib/calculator-schema';
import { fireCalculatorDefaultValues, fireCalculatorFormSchema } from '@/lib/calculator-schema';

// Helper component for info tooltips next to form labels
function InfoTooltip({ content }: Readonly<{ content: string }>) {
  return (
    <Tooltip>
      <TooltipTrigger type="button" className="ml-1 inline-flex align-middle">
        <Info className="text-muted-foreground hover:text-foreground h-3.5 w-3.5 transition-colors" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

const formSchema = fireCalculatorFormSchema;
type FormValues = FireCalculatorFormValues;

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

export default function FireCalculatorForm({
  initialValues,
  autoCalculate = false,
}: {
  initialValues?: Partial<FireCalculatorFormValues>;
  autoCalculate?: boolean;
}) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const irlYear = new Date().getFullYear();
  const [copied, setCopied] = useState(false);

  // Initialize form with default values
  const form = useForm<z.input<typeof formSchema>, undefined, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ?? fireCalculatorDefaultValues,
  });

  // Hydrate from URL search params
  const searchParams = useSearchParams();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (hasHydrated) return;
    if (searchParams.size === 0) {
      setHasHydrated(true);
      return;
    }

    const newValues: Partial<FormValues> = {};
    const getParam = (key: string) => searchParams.get(key) ?? undefined;
    const getNum = (key: string, bounds: { min?: number; max?: number } = {}) =>
      extractNumericSearchParam(getParam(key), bounds);

    const startingCapital = getNum('startingCapital', { min: 0 });
    if (startingCapital !== undefined) newValues.startingCapital = startingCapital;

    const monthlySavings = getNum('monthlySavings', { min: 0, max: 50000 });
    if (monthlySavings !== undefined) newValues.monthlySavings = monthlySavings;

    const currentAge = getNum('currentAge', { min: 1, max: 100 });
    if (currentAge !== undefined) newValues.currentAge = currentAge;

    const cagr = getNum('cagr') ?? getNum('growthRate', { min: 0, max: 30 });
    if (cagr !== undefined) newValues.cagr = cagr;

    const desiredMonthlyAllowance =
      getNum('monthlySpend', { min: 0, max: 20000 }) ??
      getNum('monthlyAllowance', { min: 0, max: 20000 });
    if (desiredMonthlyAllowance !== undefined)
      newValues.desiredMonthlyAllowance = desiredMonthlyAllowance;

    const inflationRate = getNum('inflationRate', { min: 0, max: 20 });
    if (inflationRate !== undefined) newValues.inflationRate = inflationRate;

    const lifeExpectancy = getNum('lifeExpectancy', { min: 40, max: 110 });
    if (lifeExpectancy !== undefined) newValues.lifeExpectancy = lifeExpectancy;

    const retirementAge = getNum('retirementAge', { min: 18, max: 100 });
    if (retirementAge !== undefined) newValues.retirementAge = retirementAge;

    const coastFireAge = getNum('coastFireAge', { min: 18, max: 100 });
    if (coastFireAge !== undefined) newValues.coastFireAge = coastFireAge;

    const baristaIncome = getNum('baristaIncome', { min: 0 });
    if (baristaIncome !== undefined) newValues.baristaIncome = baristaIncome;

    const volatility = getNum('volatility', { min: 0 });
    if (volatility !== undefined) newValues.volatility = volatility;

    const withdrawalPercentage = getNum('withdrawalPercentage', { min: 0, max: 100 });
    if (withdrawalPercentage !== undefined) newValues.withdrawalPercentage = withdrawalPercentage;

    const simMode = searchParams.get('simulationMode');
    if (simMode === 'deterministic' || simMode === 'monte-carlo') {
      newValues.simulationMode = simMode;
    }

    const wStrategy = searchParams.get('withdrawalStrategy');
    if (wStrategy === 'fixed' || wStrategy === 'percentage') {
      newValues.withdrawalStrategy = wStrategy;
    }

    if (Object.keys(newValues).length > 0) {
      // We merge with current values (which are defaults initially)
      const merged = { ...form.getValues(), ...newValues };
      form.reset(merged);
      // Trigger calculation
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      form.handleSubmit(onSubmit)();
    }
    setHasHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hasHydrated]); // form is stable, but adding it causes no harm, excluding for cleaner hook deps

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

    if (retirementIndex === -1) {
      setResult({
        fireNumber: null,
        yearlyData: yearlyData,
        error: 'Could not calculate retirement data',
      });
    } else {
      // Set the result
      setResult({
        fireNumber: retirementData.balance,
        yearlyData: yearlyData,
        successRate:
          simulationMode === 'monte-carlo' ? (successCount / numSimulations) * 100 : undefined,
      });
    }
  }

  // Use effect for auto-calculation
  useEffect(() => {
    if (autoCalculate && !result) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      form.handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCalculate]);

  const handleShare = () => {
    const values = form.getValues() as FireCalculatorFormValues;
    const params = new URLSearchParams();

    params.set('startingCapital', String(values.startingCapital));
    params.set('monthlySavings', String(values.monthlySavings));
    params.set('currentAge', String(values.currentAge));
    params.set('cagr', String(values.cagr));
    params.set('monthlySpend', String(values.desiredMonthlyAllowance));
    params.set('inflationRate', String(values.inflationRate));
    params.set('lifeExpectancy', String(values.lifeExpectancy));
    params.set('retirementAge', String(values.retirementAge));
    params.set('coastFireAge', String(values.coastFireAge));
    params.set('baristaIncome', String(values.baristaIncome));
    params.set('simulationMode', values.simulationMode);
    params.set('volatility', String(values.volatility));
    params.set('withdrawalStrategy', values.withdrawalStrategy);
    params.set('withdrawalPercentage', String(values.withdrawalPercentage));

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 4000);
    });
  };

  return (
    <>
      <Card className="border-primary/15 bg-background/90 shadow-primary/10 mb-6 border shadow-lg backdrop-blur">
        <BlurThing />
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
                      <FormLabel>
                        Starting Capital
                        <InfoTooltip content="Your current invested savings or nest egg. This is the amount you have already saved and invested." />
                      </FormLabel>
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
                      <FormLabel>
                        Monthly Savings
                        <InfoTooltip content="The amount you invest each month. This is added to your portfolio during the accumulation phase." />
                      </FormLabel>
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
                      <FormLabel>
                        Current Age
                        <InfoTooltip content="Your age today. This is used to calculate the timeline to retirement and beyond." />
                      </FormLabel>
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
                      <FormLabel>
                        Life Expectancy (Age)
                        <InfoTooltip content="Your estimated age of death for planning purposes. This determines how long your money needs to last." />
                      </FormLabel>
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
                      <FormLabel>
                        Expected Annual Growth Rate (%)
                        <InfoTooltip content="Average yearly investment return (CAGR). The VTI has historically returned ~7%." />
                      </FormLabel>
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
                      <FormLabel>
                        Annual Inflation Rate (%)
                        <InfoTooltip content="Expected yearly price increase. Historical average is ~2-3%. This adjusts your spending needs over time." />
                      </FormLabel>
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
                      <FormLabel>
                        Monthly Allowance (Today&apos;s Value)
                        <InfoTooltip content="Your monthly spending needs in retirement, expressed in today's dollars. This will be adjusted for inflation each year." />
                      </FormLabel>
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
                      <FormLabel>
                        Retirement Age: {field.value as number}
                        <InfoTooltip content="The age when you stop working and start withdrawing from your portfolio to cover living expenses." />
                      </FormLabel>
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
                      <FormLabel>
                        <Button variant="link" size={'sm'} asChild>
                          <Link href="/learn/what-is-fire#types-of-fire">Coast FIRE</Link>
                        </Button>{' '}
                        Age (Optional):
                        <InfoTooltip content="The age when you stop making new contributions but keep working to cover current expenses. Your existing investments compound until retirement." />
                      </FormLabel>
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
                      <FormLabel>
                        <Button variant="link" size={'sm'} asChild>
                          <Link href="/learn/what-is-fire#types-of-fire">Barista FIRE</Link>
                        </Button>{' '}
                        Monthly Income
                        <InfoTooltip content="Part-time income during retirement (e.g., from a low-stress job). This reduces the amount you need to withdraw from your portfolio." />
                      </FormLabel>
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
                      <FormLabel>
                        Simulation Mode
                        <InfoTooltip content="Deterministic uses fixed yearly returns. Monte Carlo simulates market randomness with 500 runs to show probability ranges." />
                      </FormLabel>
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
                        <FormLabel>
                          Market Volatility (Std Dev %)
                          <InfoTooltip content="Standard deviation of annual returns. 15% is typical for stocks. Higher values mean more unpredictable year-to-year swings." />
                        </FormLabel>
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
                      <FormLabel>
                        Withdrawal Strategy
                        <InfoTooltip content="Fixed inflation-adjusted maintains your purchasing power yearly. Percentage of portfolio adjusts spending based on current balance." />
                      </FormLabel>
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
                        <FormLabel>
                          Withdrawal Percentage (%)
                          <InfoTooltip content="Annual withdrawal rate as percentage of current portfolio. 4% is the classic 'safe' rate from the Trinity Study." />
                        </FormLabel>
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
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
              {result && (
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  <Button
                    onClick={handleShare}
                    variant="default"
                    size={'lg'}
                    className="w-full gap-2 md:w-auto"
                    type="button"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    {copied ? 'Sharable Link Copied!' : 'Share Calculation'}
                  </Button>
                </div>
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
            </>
          )}
        </div>
      )}
    </>
  );
}
