'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import BlurThing from '../blur-thing';

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
  age: {
    label: 'Age',
  },
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
      {/* Decorative background elements */}
      <BlurThing />
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
              tickFormatter={(value: number) => {
                if (value < 1000) {
                  return `$${String(value)}`;
                }
                if (value < 1000000) {
                  return `$${String(value / 1000)}k`;
                }
                if (value < 1000000000) {
                  return `$${String(value / 1000000)}M`;
                }
                return `$${String(value / 1000000000)}B`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" labelKey="age" />}
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
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            Simulation assumes 7% returns. Standard: Save $10k/yr (age 25-65). Coast: Save $30k/yr (age
            25-35), then $0.
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
