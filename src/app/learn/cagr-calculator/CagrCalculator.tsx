'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import BlurThing from '@/app/components/blur-thing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CagrInputKey = 'initialDeposit' | 'monthlySavings' | 'years' | 'cagr';

const depositColor = 'oklch(0.6394 0.1512 52.53)';
const savingsColor = 'oklch(0.7327 0.1212 208.73)';
const interestColor = 'oklch(0.5393 0.2492 313.27)';
const depositInterestColor = `color-mix(in oklch, ${depositColor} 50%, ${interestColor} 50%)`;
const savingsInterestColor = `color-mix(in oklch, ${savingsColor} 50%, ${interestColor} 50%)`;

interface CagrInputs {
  initialDeposit: number;
  monthlySavings: number;
  years: number;
  cagr: number;
}

interface CagrChartPoint {
  year: number;
  initialDeposit: number;
  savings: number;
  depositInterest: number;
  savingsInterest: number;
  balance: number;
}

const defaultInputs: CagrInputs = {
  initialDeposit: 40000,
  monthlySavings: 1000,
  years: 20,
  cagr: 7,
};

const inputConfig: Array<{
  key: CagrInputKey;
  label: string;
  min: number;
  max?: number;
  step: number;
  color: string;
}> = [
  { key: 'initialDeposit', label: 'Initial deposit', min: 0, step: 1000, color: depositColor },
  { key: 'monthlySavings', label: 'Monthly savings', min: 0, step: 100, color: savingsColor },
  { key: 'years', label: 'Years', min: 1, max: 60, step: 1, color: interestColor },
  { key: 'cagr', label: 'CAGR', min: -20, max: 40, step: 0.1, color: interestColor },
];

const chartConfig = {
  initialDeposit: {
    label: 'Initial deposit',
    color: depositColor,
  },
  savings: {
    label: 'Savings',
    color: savingsColor,
  },
  depositInterest: {
    label: 'Deposit interest',
    color: depositInterestColor,
  },
  savingsInterest: {
    label: 'Savings interest',
    color: savingsInterestColor,
  },
} satisfies ChartConfig;

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const formatShortNumber = (value: number) => {
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000) {
    return `${formatNumber(value / 1_000_000)}M`;
  }

  if (absolute >= 1_000) {
    return `${formatNumber(value / 1_000)}k`;
  }

  return formatNumber(value);
};

const formatTooltipName = (name: NameType) => {
  const key = String(name) as keyof typeof chartConfig;
  return chartConfig[key]?.label ?? String(name);
};

const getTooltipColor = (name: NameType) => {
  const key = String(name) as keyof typeof chartConfig;
  return chartConfig[key]?.color;
};

const formatTooltipValue = (value: ValueType) => {
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === 'number' ? formatNumber(item) : item)).join(' - ');
  }

  return typeof value === 'number' ? formatNumber(value) : value;
};

const formatTooltipYear = (year: number) => (year === 0 ? 'Now' : `Year ${String(year)}`);

const clampInput = (key: CagrInputKey, value: number) => {
  const config = inputConfig.find((item) => item.key === key);
  const min = config?.min ?? 0;
  const max = config?.max;
  const fallback = defaultInputs[key];

  if (!Number.isFinite(value)) {
    return fallback;
  }

  const rounded = key === 'years' ? Math.round(value) : value;
  return Math.min(Math.max(rounded, min), max ?? rounded);
};

const calculateProjection = ({ initialDeposit, monthlySavings, years, cagr }: CagrInputs) => {
  const monthlyRate = Math.pow(1 + cagr / 100, 1 / 12) - 1;
  const projection: CagrChartPoint[] = [
    {
      year: 0,
      initialDeposit,
      savings: 0,
      depositInterest: 0,
      savingsInterest: 0,
      balance: initialDeposit,
    },
  ];

  let depositBalance = initialDeposit;
  let savingsBalance = 0;
  let savingsPrincipal = 0;

  for (let year = 1; year <= years; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      depositBalance *= 1 + monthlyRate;
      savingsPrincipal += monthlySavings;
      savingsBalance = (savingsBalance + monthlySavings) * (1 + monthlyRate);
    }

    projection.push({
      year,
      initialDeposit,
      savings: savingsPrincipal,
      depositInterest: Math.max(depositBalance - initialDeposit, 0),
      savingsInterest: Math.max(savingsBalance - savingsPrincipal, 0),
      balance: depositBalance + savingsBalance,
    });
  }

  return projection;
};

const sampleProjection = (projection: CagrChartPoint[]) => {
  const maxBars = 12;

  if (projection.length <= maxBars) {
    return projection;
  }

  const lastYear = projection.at(-1)?.year ?? 0;
  const step = Math.ceil(lastYear / (maxBars - 1));
  return projection.filter(
    (point) => point.year === 0 || point.year === lastYear || point.year % step === 0,
  );
};

export function CagrCalculator() {
  const [inputs, setInputs] = useState<CagrInputs>(defaultInputs);

  const projection = useMemo(() => calculateProjection(inputs), [inputs]);
  const chartData = useMemo(() => sampleProjection(projection), [projection]);
  const lastPoint = projection.at(-1) ?? projection[0];
  const totalContributions = inputs.initialDeposit + inputs.monthlySavings * 12 * inputs.years;
  const totalInterest = lastPoint.balance - totalContributions;

  const updateInput = (key: CagrInputKey, nextValue: string) => {
    setInputs((current) => ({
      ...current,
      [key]: clampInput(key, Number(nextValue)),
    }));
  };

  return (
    <Card className="border-primary/15 bg-background/90 shadow-primary/10 relative mb-6 rounded-none border shadow-lg backdrop-blur sm:rounded-xl">
      <BlurThing />
      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl">CAGR Projection</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Dedicated calculator for compound annual growth rate. Adjust deposits, savings, time, and CAGR
          to see how contributions and interest stack over time.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {inputConfig.map((input) => (
                <div key={input.key} className="space-y-2">
                  <Label htmlFor={`cagr-${input.key}`}>{input.label}</Label>
                  <Input
                    id={`cagr-${input.key}`}
                    type="number"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={inputs[input.key]}
                    style={{ borderColor: input.color }}
                    onChange={(event) => {
                      updateInput(input.key, event.target.value);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="border-primary/15 bg-background/80 flex flex-col justify-center rounded-xl border p-4">
                <span className="text-muted-foreground text-xs font-medium">
                  Final balance<span className="sr-only">: {formatNumber(lastPoint.balance)}</span>
                </span>
                <span className="text-2xl font-bold" aria-hidden="true">
                  {formatNumber(lastPoint.balance)}
                </span>
              </div>
              <div className="border-primary/15 bg-background/80 flex flex-col justify-center rounded-xl border p-4">
                <span className="text-muted-foreground text-xs font-medium">
                  Total contributions
                  <span className="sr-only">: {formatNumber(totalContributions)}</span>
                </span>
                <span className="text-2xl font-bold" aria-hidden="true">
                  {formatNumber(totalContributions)}
                </span>
              </div>
              <div className="border-primary/15 bg-background/80 flex flex-col justify-center rounded-xl border p-4">
                <span className="text-muted-foreground text-xs font-medium">
                  Total interest<span className="sr-only">: {formatNumber(totalInterest)}</span>
                </span>
                <span className="text-2xl font-bold" aria-hidden="true">
                  {formatNumber(totalInterest)}
                </span>
              </div>
            </div>
          </div>

          <div className="min-h-[320px] lg:flex lg:h-full">
            <div
              data-testid="cagr-stacked-bar-chart"
              className="h-[320px] lg:h-full lg:flex-1 lg:self-stretch"
            >
              <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value: number) => (value === 0 ? 'Now' : `Y${String(value)}`)}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatShortNumber}
                    width={52}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        indicator="line"
                        className="w-[220px]"
                        formatter={(value, name, item, index) => (
                          <>
                            {index === 0 && (
                              <div className="mb-1.5 flex basis-full items-center border-b pb-1.5 text-xs font-medium">
                                {formatTooltipYear((item.payload as CagrChartPoint).year)}
                              </div>
                            )}
                            <span
                              className="w-1 shrink-0 self-stretch rounded-[2px]"
                              style={{ backgroundColor: getTooltipColor(name) }}
                              aria-hidden="true"
                            />
                            <span className="text-muted-foreground">{formatTooltipName(name)}</span>
                            <span className="text-foreground ml-auto font-mono font-medium tabular-nums">
                              {formatTooltipValue(value)}
                            </span>
                            {index === 3 && (
                              <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                                Total
                                <span className="text-foreground ml-auto font-mono font-medium tabular-nums">
                                  {formatNumber((item.payload as CagrChartPoint).balance)}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="initialDeposit"
                    stackId="balance"
                    fill="var(--color-initialDeposit)"
                    radius={[0, 0, 5, 5]}
                  />
                  <Bar dataKey="depositInterest" stackId="balance" fill="var(--color-depositInterest)" />
                  <Bar dataKey="savings" stackId="balance" fill="var(--color-savings)" />
                  <Bar
                    dataKey="savingsInterest"
                    stackId="balance"
                    fill="var(--color-savingsInterest)"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
