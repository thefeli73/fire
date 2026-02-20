import { describe, expect, it } from 'vitest';

import {
  RETIRE_AT_AGE_PRESETS,
  buildSpendScenarios,
  calculateNestEggFromSpend,
  deriveDefaultInputs,
  extractCalculatorValuesFromSearch,
  parseAgeParam,
} from '../retire-at';

describe('retire-at helpers', () => {
  it('calculates a rule-of-25 style nest egg', () => {
    const result = calculateNestEggFromSpend(4000, 0.04);
    expect(result).toBe(1200000);
  });

  it('builds lean/base/comfortable spend scenarios', () => {
    const scenarios = buildSpendScenarios(4000, 0.04);
    expect(scenarios).toHaveLength(3);

    const baseline = scenarios.find((scenario) => scenario.key === 'baseline');
    expect(baseline?.monthlySpend).toBe(4000);
    expect(baseline?.nestEgg).toBe(1200000);
  });

  it('parses and clamps age params', () => {
    expect(parseAgeParam('90')).toBe(80);
    expect(parseAgeParam('42')).toBe(42);
    expect(parseAgeParam('not-a-number', 55)).toBe(55);
  });

  it('derives calculator defaults for a target age', () => {
    const defaults = deriveDefaultInputs(50);
    expect(defaults.retirementAge).toBe(50);
    expect(defaults.currentAge).toBeLessThan(50);
    expect(defaults.desiredMonthlyAllowance).toBeGreaterThanOrEqual(500);
  });

  it('exposes preset age list for sitemap/static params', () => {
    expect(RETIRE_AT_AGE_PRESETS).toContain(50);
    expect(Array.isArray(RETIRE_AT_AGE_PRESETS)).toBe(true);
  });

  describe('extractCalculatorValuesFromSearch', () => {
    it('parses valid numeric params', () => {
      const searchParams = {
        currentAge: '30',
        retirementAge: '55',
        monthlySpend: '4000',
        monthlySavings: '1500',
        startingCapital: '100000',
      };
      const values = extractCalculatorValuesFromSearch(searchParams, 55);

      expect(values.currentAge).toBe(30);
      expect(values.retirementAge).toBe(55);
      expect(values.desiredMonthlyAllowance).toBe(4000);
      expect(values.monthlySavings).toBe(1500);
      expect(values.startingCapital).toBe(100000);
    });

    it('handles invalid numbers by falling back to defaults', () => {
      const searchParams = {
        currentAge: 'not-a-number',
        monthlySpend: 'invalid',
      };
      // targetAge 55 implies some defaults
      const values = extractCalculatorValuesFromSearch(searchParams, 55);

      // currentAge should default based on logic in deriveDefaultInputs
      // for 55, defaultCurrentAge is around 40
      expect(values.currentAge).toBeGreaterThan(18);
      // desiredMonthlyAllowance has a default logic too
      expect(values.desiredMonthlyAllowance).toBeDefined();
    });

    it('clamps values to safe bounds and business logic', () => {
      const searchParams = {
        currentAge: '150', // max 100, but further constrained by retirement age
        monthlySpend: '-500', // min 0
      };
      const values = extractCalculatorValuesFromSearch(searchParams, 60);

      // Clamped to retirementAge (60) - 1 = 59 by deriveDefaultInputs
      expect(values.currentAge).toBe(59);
      // Clamped to min 500 by deriveDefaultInputs
      expect(values.desiredMonthlyAllowance).toBe(500);
    });

    it('supports array params (takes first)', () => {
      const searchParams = {
        currentAge: ['30', '40'],
      };
      const values = extractCalculatorValuesFromSearch(searchParams, 60);
      expect(values.currentAge).toBe(30);
    });

    it('does not cap monthlySpend URL params at 20000', () => {
      const values = extractCalculatorValuesFromSearch({ monthlySpend: '25000' }, 60);
      expect(values.desiredMonthlyAllowance).toBe(25000);
    });

    it('parses simulation mode', () => {
      expect(
        extractCalculatorValuesFromSearch({ simulationMode: 'monte-carlo' }, 55).simulationMode,
      ).toBe('monte-carlo');

      expect(
        extractCalculatorValuesFromSearch({ simulationMode: 'deterministic' }, 55).simulationMode,
      ).toBe('deterministic');

      expect(
        extractCalculatorValuesFromSearch({ simulationMode: 'invalid-mode' }, 55).simulationMode,
      ).toBeUndefined();
    });
    it('parses extra fields (volatility, withdrawal, barista)', () => {
      const searchParams = {
        volatility: '20',
        withdrawalStrategy: 'percentage',
        withdrawalPercentage: '3.5',
        coastFireAge: '45',
        baristaIncome: '1000',
      };
      const values = extractCalculatorValuesFromSearch(searchParams, 55);

      expect(values.volatility).toBe(20);
      expect(values.withdrawalStrategy).toBe('percentage');
      expect(values.withdrawalPercentage).toBe(3.5);
      expect(values.coastFireAge).toBe(45);
      expect(values.baristaIncome).toBe(1000);
    });
  });
});
