import { Banknote, Coins, Flame, Landmark, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BlurThing from '../blur-thing';

const steps = [
  {
    icon: Banknote,
    title: 'Income',
    description: 'Maximize earnings & side hustles',
    color: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/30',
  },
  {
    icon: Wallet,
    title: 'Low Expenses',
    description: 'Frugality & mindful spending',
    color: 'from-rose-400 to-pink-500',
    glow: 'shadow-rose-500/30',
  },
  {
    icon: Coins,
    title: 'Savings Gap',
    description: 'The difference is your fuel',
    color: 'from-sky-400 to-blue-500',
    glow: 'shadow-sky-500/30',
  },
  {
    icon: TrendingUp,
    title: 'Investments',
    description: 'Index funds & compounding',
    color: 'from-violet-400 to-purple-500',
    glow: 'shadow-violet-500/30',
  },
  {
    icon: Landmark,
    title: 'Freedom',
    description: 'Work becomes optional',
    color: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-500/30',
  },
];

export function FireFlowchart() {
  return (
    <Card className="relative w-full overflow-hidden">
      <BlurThing />
      <CardHeader className="relative pb-0 text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <Flame className="h-7 w-7 text-orange-500" />
          The FIRE Engine
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        {/* Connecting line - visible on md+ */}
        <div className="absolute top-10 right-12 left-12 hidden h-0.5 bg-gradient-to-r from-emerald-400 via-purple-400 to-orange-400 opacity-30 md:block" />

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
          {steps.map((step, index) => (
            <div key={step.title} className="group relative flex flex-col items-center">
              {/* Step number badge */}
              <div className="absolute -top-2 -left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white md:-top-1 md:-left-1">
                {index + 1}
              </div>

              {/* Icon container */}
              <div
                className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg ${step.glow} transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}
              >
                <step.icon className="h-9 w-9 text-white" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="mt-4 text-center">
                <h4 className="font-semibold tracking-tight">{step.title}</h4>
                <p className="text-muted-foreground mt-1 max-w-[140px] text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow connector for mobile */}
              {index < steps.length - 1 && (
                <div className="my-2 flex items-center justify-center md:hidden">
                  <svg
                    className="text-muted-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <CardFooter>
          <p className="text-muted-foreground mx-auto mt-8 text-center text-sm">
            Build the gap. Invest the gap. Let time do the rest.
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
