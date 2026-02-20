import type { FireCalculatorFormValues } from '@/lib/calculator-schema';

type NumericParam = string | number | null | undefined;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const numericFromParam = (value: NumericParam) => {
  if (value === null || value === undefined) return undefined;
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
};

export const RETIRE_AT_AGE_PRESETS = [35, 40, 45, 50, 55, 60, 65, 70] as const;

export interface SpendScenario {
  key: 'lean' | 'baseline' | 'comfortable';
  label: string;
  monthlySpend: number;
  annualSpend: number;
  nestEgg: number;
  withdrawalRate: number;
}

export const parseAgeParam = (ageParam: NumericParam, fallback = 50) => {
  const parsed = numericFromParam(ageParam);
  if (parsed === undefined) return fallback;
  return clamp(Math.round(parsed), 30, 80);
};

export const calculateNestEggFromSpend = (monthlySpend: number, withdrawalRate = 0.04) => {
  const safeRate = withdrawalRate > 0 ? withdrawalRate : 0.0001;
  const normalizedSpend = Math.max(0, monthlySpend);
  return (normalizedSpend * 12) / safeRate;
};

export const buildSpendScenarios = (
  baseMonthlySpend: number,
  withdrawalRate = 0.04,
): SpendScenario[] => {
  const normalizedSpend = Math.max(500, baseMonthlySpend);
  const levels: { key: SpendScenario['key']; label: string; multiplier: number }[] = [
    { key: 'lean', label: 'Lean FIRE', multiplier: 0.8 },
    { key: 'baseline', label: 'Classic FIRE', multiplier: 1 },
    { key: 'comfortable', label: 'Fat FIRE', multiplier: 1.25 },
  ];

  return levels.map(({ key, label, multiplier }) => {
    const monthlySpend = Math.round(normalizedSpend * multiplier);
    const annualSpend = monthlySpend * 12;
    return {
      key,
      label,
      monthlySpend,
      annualSpend,
      withdrawalRate,
      nestEgg: calculateNestEggFromSpend(monthlySpend, withdrawalRate),
    };
  });
};

export const deriveDefaultInputs = (
  targetAge: number,
  opts?: {
    currentAge?: number;
    desiredMonthlyAllowance?: number;
    monthlySavings?: number;
    startingCapital?: number;
  },
): Partial<FireCalculatorFormValues> => {
  const retirementAge = clamp(Math.round(targetAge), 30, 80);

  // Smarter defaults based on retirement age goal
  // Early FIRE (30-45): Likely started early, high savings, maybe less capital if very young.
  // Standard FIRE (45-55): Peak earning years, building capital.
  // Late FIRE (55+): Closer to traditional age, probably higher capital.

  // Default current age:
  // If target < 40: assume user is 22-25 (just starting or early career)
  // If target 40-50: assume user is 30
  // If target 50+: assume user is 35-40
  // But generally 10-15 years out is a good "planning" gap for the calculator default.
  // The user asked for "good assumptions" for a "generic" number.
  // Let's stick to a gap, but maybe vary savings/capital.

  let defaultCurrentAge = retirementAge - 15;
  if (retirementAge < 40) defaultCurrentAge = 22; // Very aggressive
  if (defaultCurrentAge < 20) defaultCurrentAge = 20;

  const currentAge = clamp(
    Math.round(opts?.currentAge ?? defaultCurrentAge),
    18,
    Math.max(18, retirementAge - 1),
  );

  // Assumptions for "ballpark" numbers:
  // Savings: increases with age usually.
  // Capital: increases with age.

  let defaultMonthlySavings = 1000;
  let defaultStartingCapital = 20000;

  if (currentAge >= 30) {
    defaultMonthlySavings = 1500;
    defaultStartingCapital = 50000;
  }
  if (currentAge >= 40) {
    defaultMonthlySavings = 2000;
    defaultStartingCapital = 100000;
  }
  if (currentAge >= 50) {
    defaultMonthlySavings = 2500;
    defaultStartingCapital = 250000;
  }

  // If aggressive early retirement is the goal (short timeline), they probably save more?
  // Or maybe we just show what it TAKES.
  // The calculator solves forward from inputs.
  // We should provide realistic inputs for someone *trying* to retire at `targetAge`.

  const monthlySavings = clamp(Math.round(opts?.monthlySavings ?? defaultMonthlySavings), 0, 50000);
  const startingCapital = clamp(
    Math.round(opts?.startingCapital ?? defaultStartingCapital),
    0,
    100000000,
  );

  const desiredMonthlyAllowance = Math.max(
    500,
    Math.round(opts?.desiredMonthlyAllowance ?? (retirementAge < 50 ? 4000 : 5000)),
  );

  const lifeExpectancy = clamp(Math.round(retirementAge + 30), retirementAge + 10, 110);

  return {
    currentAge,
    retirementAge,
    desiredMonthlyAllowance,
    monthlySavings,
    startingCapital,
    lifeExpectancy,
  };
};

export const extractNumericSearchParam = (
  value: string | string[] | undefined,
  bounds?: { min?: number; max?: number },
) => {
  const normalized = Array.isArray(value) ? value[0] : value;
  const parsed = numericFromParam(normalized);
  if (parsed === undefined) return undefined;
  if (bounds && (bounds.min !== undefined || bounds.max !== undefined)) {
    const min = bounds.min ?? Number.MIN_SAFE_INTEGER;
    const max = bounds.max ?? Number.MAX_SAFE_INTEGER;
    return clamp(parsed, min, max);
  }
  return parsed;
};

export const extractCalculatorValuesFromSearch = (
  searchParams: Record<string, string | string[] | undefined>,
  targetAge: number,
): Partial<FireCalculatorFormValues> => {
  const desiredMonthlyAllowance =
    extractNumericSearchParam(searchParams.monthlySpend ?? searchParams.monthlyAllowance, {
      min: 0,
    }) ?? undefined;

  const base = deriveDefaultInputs(targetAge, {
    currentAge: extractNumericSearchParam(searchParams.currentAge, { min: 1, max: 100 }),
    desiredMonthlyAllowance,
    monthlySavings: extractNumericSearchParam(searchParams.monthlySavings, { min: 0, max: 50000 }),
    startingCapital: extractNumericSearchParam(searchParams.startingCapital, { min: 0 }),
  });

  return {
    ...base,
    retirementAge:
      extractNumericSearchParam(searchParams.retirementAge, { min: 18, max: 100 }) ?? base.retirementAge,
    cagr: extractNumericSearchParam(searchParams.cagr ?? searchParams.growthRate, {
      min: 0,
      max: 30,
    }),
    inflationRate: extractNumericSearchParam(searchParams.inflationRate, { min: 0, max: 20 }),
    lifeExpectancy:
      extractNumericSearchParam(searchParams.lifeExpectancy, { min: 40, max: 110 }) ??
      base.lifeExpectancy,
    simulationMode:
      searchParams.simulationMode === 'monte-carlo' || searchParams.simulationMode === 'deterministic'
        ? searchParams.simulationMode
        : undefined,
    withdrawalStrategy:
      searchParams.withdrawalStrategy === 'percentage' || searchParams.withdrawalStrategy === 'fixed'
        ? searchParams.withdrawalStrategy
        : undefined,
    withdrawalPercentage: extractNumericSearchParam(searchParams.withdrawalPercentage, {
      min: 0,
      max: 100,
    }),
    volatility: extractNumericSearchParam(searchParams.volatility, { min: 0 }),
    coastFireAge: extractNumericSearchParam(searchParams.coastFireAge, { min: 18, max: 100 }),
    baristaIncome: extractNumericSearchParam(searchParams.baristaIncome, { min: 0 }),
  };
};
