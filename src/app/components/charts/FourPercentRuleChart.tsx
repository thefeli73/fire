'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

// Simulation data for 4% rule
const storyData = [
  { year: 0, w3: 100, w4: 100, w5: 100 },
  { year: 1, w3: 105, w4: 104, w5: 103 },
  { year: 2, w3: 90, w4: 88, w5: 86 }, // Crash
  { year: 3, w3: 95, w4: 92, w5: 89 },
  { year: 4, w3: 102, w4: 98, w5: 94 },
  { year: 5, w3: 110, w4: 105, w5: 100 },
  { year: 10, w3: 150, w4: 130, w5: 110 },
  { year: 15, w3: 200, w4: 160, w5: 100 }, // 5% starts dragging
  { year: 20, w3: 280, w4: 200, w5: 80 },
  { year: 25, w3: 380, w4: 250, w5: 40 },
  { year: 30, w3: 500, w4: 300, w5: 0 },
];

const chartConfig = {
  year: {
    label: 'Year',
  },
  w3: {
    label: '3% Withdrawal (Safe)',
    color: 'var(--chart-1)',
  },
  w4: {
    label: '4% Withdrawal (Standard)',
    color: 'var(--chart-2)',
  },
  w5: {
    label: '5% Withdrawal (Risky)',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function FourPercentRuleChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Portfolio Survival Scenarios</CardTitle>
        <CardDescription>
          Impact of initial withdrawal rate on portfolio longevity (Start: $1M)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <AreaChart data={storyData}>
            <defs>
              <linearGradient id="fillW3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-w3)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-w3)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillW4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-w4)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-w4)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillW5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-w5)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-w5)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${String(value)}%`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Year ${String(value)}`}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="w3" type="natural" fill="url(#fillW3)" stroke="var(--color-w3)" />
            <Area dataKey="w4" type="natural" fill="url(#fillW4)" stroke="var(--color-w4)" />
            <Area dataKey="w5" type="natural" fill="url(#fillW5)" stroke="var(--color-w5)" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
