import * as z from 'zod';

export const fireCalculatorFormSchema = z.object({
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
    .min(20, 'Retirement age must be at least 20')
    .max(100, 'Retirement age must be at most 100'),
  coastFireAge: z.coerce
    .number()
    .min(20, 'Coast FIRE age must be at least 20')
    .max(100, 'Coast FIRE age must be at most 100')
    .optional(),
  baristaIncome: z.coerce.number().min(0, 'Barista income must be a non-negative number').optional(),
  simulationMode: z.enum(['deterministic', 'monte-carlo']).default('deterministic'),
  volatility: z.coerce.number().min(0).default(15),
  withdrawalStrategy: z.enum(['fixed', 'percentage']).default('fixed'),
  withdrawalPercentage: z.coerce.number().min(0).max(100).default(4),
});

export type FireCalculatorFormValues = z.infer<typeof fireCalculatorFormSchema>;

export const fireCalculatorDefaultValues: FireCalculatorFormValues = {
  startingCapital: 50000,
  monthlySavings: 1500,
  currentAge: 25,
  cagr: 7,
  desiredMonthlyAllowance: 3000,
  inflationRate: 2.3,
  lifeExpectancy: 84,
  retirementAge: 65,
  coastFireAge: undefined,
  baristaIncome: 0,
  simulationMode: 'deterministic',
  volatility: 15,
  withdrawalStrategy: 'fixed',
  withdrawalPercentage: 4,
};
