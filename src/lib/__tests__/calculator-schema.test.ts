import { describe, expect, it } from 'vitest';
import { fireCalculatorDefaultValues, fireCalculatorFormSchema } from '../calculator-schema';

describe('calculator schema defaults', () => {
  it('defaults withdrawal percentage to 3.5', () => {
    expect(fireCalculatorDefaultValues.withdrawalPercentage).toBe(3.5);
    expect(
      fireCalculatorFormSchema.parse({
        ...fireCalculatorDefaultValues,
        withdrawalPercentage: undefined,
      }).withdrawalPercentage,
    ).toBe(3.5);
  });
});
