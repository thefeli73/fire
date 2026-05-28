export interface CalculatorNextStepContext {
  simulationMode: 'deterministic' | 'monte-carlo';
  withdrawalStrategy: 'fixed' | 'percentage';
  retirementDurationYears: number;
  successRate?: number;
  coastFireAge?: number;
}

export interface CalculatorNextStep {
  id: 'monte-carlo' | 'safe-withdrawal' | 'swr-matrix' | 'coast-fire';
  title: string;
  description: string;
  href: string;
  cta: string;
}

const stepCatalog = {
  monteCarlo: {
    id: 'monte-carlo',
    title: 'Stress-test market risk',
    description: 'Run the same plan with randomized returns to see how volatility changes the outcome.',
    href: '/?simulationMode=monte-carlo&autoCalculate=true',
    cta: 'Try Monte Carlo',
  },
  safeWithdrawal: {
    id: 'safe-withdrawal',
    title: 'Check withdrawal-rate risk',
    description: 'Learn when the 4% rule works, when it strains, and how lower rates add margin.',
    href: '/learn/safe-withdrawal-rate-4-percent-rule',
    cta: 'Read the 4% guide',
  },
  swrMatrix: {
    id: 'swr-matrix',
    title: 'Compare long retirement horizons',
    description: 'See modeled success rates for 30-, 40-, 50-, and 60-year retirements.',
    href: '/learn/safe-withdrawal-rate-matrix',
    cta: 'Open the SWR matrix',
  },
  coastFire: {
    id: 'coast-fire',
    title: 'Explore Coast FIRE',
    description: 'See how front-loaded saving can let compounding carry more of the plan later.',
    href: '/learn/coast-fire-vs-lean-fire',
    cta: 'Compare FIRE paths',
  },
} satisfies Record<string, CalculatorNextStep>;

export function getCalculatorNextSteps(context: CalculatorNextStepContext): CalculatorNextStep[] {
  const steps: CalculatorNextStep[] = [];

  if (context.simulationMode === 'deterministic') {
    steps.push(stepCatalog.monteCarlo);
  }

  if (context.retirementDurationYears >= 40) {
    steps.push(stepCatalog.swrMatrix);
  }

  if (context.withdrawalStrategy === 'percentage' || (context.successRate !== undefined && context.successRate < 85)) {
    steps.push(stepCatalog.safeWithdrawal);
  }

  if (context.coastFireAge !== undefined && context.coastFireAge > 0) {
    steps.push(stepCatalog.coastFire);
  }

  if (!steps.some((step) => step.id === 'safe-withdrawal')) {
    steps.push(stepCatalog.safeWithdrawal);
  }

  return Array.from(new Map(steps.map((step) => [step.id, step])).values()).slice(0, 3);
}
