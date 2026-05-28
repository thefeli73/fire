import { describe, expect, it } from 'vitest';

import { getCalculatorNextSteps } from '../calculator-next-steps';

describe('getCalculatorNextSteps', () => {
  it('recommends Monte Carlo and safe withdrawal reading for deterministic results', () => {
    const steps = getCalculatorNextSteps({
      simulationMode: 'deterministic',
      withdrawalStrategy: 'fixed',
      retirementDurationYears: 34,
      successRate: undefined,
      coastFireAge: undefined,
    });

    expect(steps.map((step) => step.href)).toContain('/?simulationMode=monte-carlo&autoCalculate=true');
    expect(steps.map((step) => step.href)).toContain('/learn/safe-withdrawal-rate-4-percent-rule');
  });

  it('recommends the SWR matrix when retirement duration is 40 years or longer', () => {
    const steps = getCalculatorNextSteps({
      simulationMode: 'monte-carlo',
      withdrawalStrategy: 'percentage',
      retirementDurationYears: 50,
      successRate: 82,
      coastFireAge: undefined,
    });

    expect(steps.map((step) => step.href)).toContain('/learn/safe-withdrawal-rate-matrix');
  });

  it('recommends Coast FIRE reading when a coast FIRE age is present', () => {
    const steps = getCalculatorNextSteps({
      simulationMode: 'deterministic',
      withdrawalStrategy: 'fixed',
      retirementDurationYears: 30,
      successRate: undefined,
      coastFireAge: 35,
    });

    expect(steps.map((step) => step.href)).toContain('/learn/coast-fire-vs-lean-fire');
  });

  it('caps recommendations at three cards', () => {
    const steps = getCalculatorNextSteps({
      simulationMode: 'deterministic',
      withdrawalStrategy: 'percentage',
      retirementDurationYears: 55,
      successRate: 72,
      coastFireAge: 35,
    });

    expect(steps).toHaveLength(3);
  });
});
