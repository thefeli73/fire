'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

// Simulation
// Standard: Start 25, Retire 65. Save $10k/yr.
// Coast: Start 25, Save $30k/yr until 35. Then $0.
// Return: 7%
const generateData = () => {
  const data = [];
  let standardBal = 0;
  let coastBal = 0;
  const rate = 1.07;

  for (let age = 25; age <= 65; age++) {
    data.push({
      age,
      Standard: Math.round(standardBal),
      Coast: Math.round(coastBal),
    });

    // Standard: consistent
    standardBal = (standardBal + 10000) * rate;

    // Coast: heavy early, then stop
    if (age < 35) {
      coastBal = (coastBal + 30000) * rate;
    } else {
      coastBal = coastBal * rate;
    }
  }
  return data;
};

const data = generateData();

const chartConfig = {
  Standard: {
    label: 'Standard Path',
    color: 'var(--chart-4)',
  },
  Coast: {
    label: 'Coast FIRE',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function CoastFireChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Coast FIRE vs. Standard Path</CardTitle>
        <CardDescription>
          Comparing heavy early savings (Coast) vs. consistent saving (Standard)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="age" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => `$${String(value / 1000)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Age ${String(value)}`}
                  indicator="line"
                />
              }
            />
            <Line
              dataKey="Standard"
              type="natural"
              stroke="var(--color-Standard)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="Coast"
              type="natural"
              stroke="var(--color-Coast)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
