import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import FireCalculatorForm from '../FireCalculatorForm';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

const { plausibleMock } = vi.hoisted(() => ({
  plausibleMock: vi.fn(),
}));

vi.mock('next-plausible', () => ({
  usePlausible: () => plausibleMock,
}));

// Mocking ResizeObserver
class ResizeObserver {
  observe() {
    /* noop */
  }
  unobserve() {
    /* noop */
  }
  disconnect() {
    /* noop */
  }
}
global.ResizeObserver = ResizeObserver;

// Fix for Radix UI pointer capture error in JSDOM
beforeAll(() => {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.setPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  Object.defineProperty(window.navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
    configurable: true,
  });
});

beforeEach(() => {
  plausibleMock.mockReset();
  window.history.pushState({}, '', '/');
});

// Mock Recharts ResponsiveContainer
vi.mock('recharts', async () => {
  const originalModule = await vi.importActual('recharts');
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => children,
  };
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));

describe('FireCalculatorForm', () => {
  it('renders the form with default values', () => {
    render((<FireCalculatorForm />) as unknown as ReactNode);

    expect(screen.getByText('FIRE Calculator')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Starting Capital/i })).toHaveValue(50000);
    expect(screen.getByRole('spinbutton', { name: /Monthly Savings/i })).toHaveValue(1500);
    expect(screen.getByRole('spinbutton', { name: /Current Age/i })).toHaveValue(25);
  });

  it('keeps core inputs and withdrawal setup visible by default', () => {
    render((<FireCalculatorForm />) as unknown as ReactNode);

    expect(screen.getByRole('spinbutton', { name: /Current Age/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Starting Capital/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Monthly Savings/i })).toBeInTheDocument();
    expect(screen.getByText(/Retirement Age:/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Withdrawal Strategy/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Monthly Allowance/i })).toBeInTheDocument();
    const withdrawalStrategyItem = screen
      .getByRole('combobox', { name: /Withdrawal Strategy/i })
      .closest('[data-slot="form-item"]');
    expect(withdrawalStrategyItem?.parentElement).toHaveClass('grid');
    expect(withdrawalStrategyItem?.parentElement).toHaveClass('md:grid-cols-2');
    expect(
      screen.getByText(
        /Calculate your path to financial independence and retirement\. Assumes 7% growth, 2\.3% inflation, age 84 life expectancy\./i,
      ),
    ).toBeInTheDocument();
  });

  it('hides advanced assumptions, FIRE variants, and simulation controls until expanded', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    const advancedOptionsToggle = screen.getByRole('button', { name: /Advanced options/i });
    expect(advancedOptionsToggle).toHaveClass('text-muted-foreground');
    expect(screen.getByTestId('advanced-options-caret')).not.toHaveClass('rotate-180');
    expect(
      screen.queryByRole('spinbutton', { name: /Expected Annual Growth Rate/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('spinbutton', { name: /Life Expectancy/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /Simulation Mode/i })).not.toBeInTheDocument();

    await user.click(advancedOptionsToggle);

    expect(screen.getByRole('button', { name: /Advanced options/i })).toBeInTheDocument();
    expect(screen.getAllByText('Advanced options')).toHaveLength(1);
    expect(
      screen.queryByText(/Fine-tune assumptions, FIRE variants, and simulation behavior/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Hide advanced options/i })).not.toBeInTheDocument();
    expect(screen.getByTestId('advanced-options-caret')).toHaveClass('rotate-180');
    expect(await screen.findByRole('spinbutton', { name: /Expected Annual Growth Rate/i })).toHaveValue(
      7,
    );
    expect(screen.getByRole('spinbutton', { name: /Annual Inflation Rate/i })).toHaveValue(2.3);
    expect(screen.getByRole('spinbutton', { name: /Life Expectancy/i })).toHaveValue(84);
    expect(screen.getByRole('spinbutton', { name: /Coast FIRE/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Barista FIRE/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Simulation Mode/i })).toBeInTheDocument();

    const advancedControls = Array.from(
      document.querySelectorAll('#advanced-calculator-options input, #advanced-calculator-options [role="combobox"]'),
    );
    expect(advancedControls.at(-1)).toBe(screen.getByRole('spinbutton', { name: /Life Expectancy/i }));
  });

  it('calculates and displays results when submitted', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Financial Projection')).toBeInTheDocument();
      expect(screen.getByText(/Balance and allowance by year\./i)).toBeInTheDocument();
      expect(screen.getByText('FIRE Number')).toBeInTheDocument();
      expect(screen.getAllByText(/Monthly allowance/i).length).toBeGreaterThan(0);
      expect(screen.queryByText(new RegExp(['U', 'S', 'D'].join(''), 'i'))).not.toBeInTheDocument();
    });
  });

  it('auto calculates on mount when autoCalculate is enabled', async () => {
    render((<FireCalculatorForm autoCalculate />) as unknown as ReactNode);

    expect(await screen.findByText('Financial Projection')).toBeInTheDocument();
    expect(await screen.findByText('FIRE Number')).toBeInTheDocument();
  });

  it('emits calculate analytics on manual submit', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(plausibleMock).toHaveBeenCalledWith(
        'calculator_calculate',
        expect.objectContaining({
          props: expect.objectContaining({
            simulation_mode: expect.any(String),
            withdrawal_strategy: expect.any(String),
            source_path: expect.any(String),
            calculation_trigger: 'manual',
          }),
        }),
      );
    });
  });

  it('emits save/share analytics after sharing results', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    await user.click(screen.getByRole('button', { name: /Calculate/i }));
    await screen.findByText('Financial Projection');

    const shareButton = screen.getByRole('button', {
      name: /Save \/ Share Results|Results Link Copied!/i,
    });

    await user.click(shareButton);

    expect(plausibleMock).toHaveBeenCalledWith('calculator_save_share', expect.anything());
  });

  it('allows changing inputs', async () => {
    render((<FireCalculatorForm />) as unknown as ReactNode);

    const savingsInput = screen.getByRole('spinbutton', { name: /Monthly Savings/i });

    fireEvent.change(savingsInput, { target: { value: '2000' } });

    await waitFor(() => {
      expect(savingsInput).toHaveValue(2000);
    });
  });

  it('validates inputs', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    const ageInput = screen.getByRole('spinbutton', { name: /Current Age/i });
    // Use fireEvent to set invalid value directly
    fireEvent.change(ageInput, { target: { value: '-5' } });

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    await user.click(calculateButton);

    // Look for error message text
    expect(await screen.findByText(/Age must be at least 1/i)).toBeInTheDocument();
  });

  it('toggles Monte Carlo simulation mode', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    await user.click(screen.getByRole('button', { name: /Advanced options/i }));

    // Select Trigger
    const modeTrigger = screen.getByRole('combobox', { name: /Simulation Mode/i });
    await user.click(modeTrigger);

    // Select Monte Carlo from dropdown
    const monteCarloOption = await screen.findByRole('option', { name: /Monte Carlo/i });
    await user.click(monteCarloOption);

    // Verify Volatility input appears
    expect(await screen.findByRole('spinbutton', { name: /Market Volatility/i })).toBeInTheDocument();
  });

  it('shows Monte Carlo percentile bounds on the chart', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    await user.click(screen.getByRole('button', { name: /Advanced options/i }));

    const modeTrigger = screen.getByRole('combobox', { name: /Simulation Mode/i });
    await user.click(modeTrigger);

    const monteCarloOption = await screen.findByRole('option', { name: /Monte Carlo/i });
    await user.click(monteCarloOption);
    await user.click(screen.getByRole('button', { name: /Calculate/i }));

    const cardDescription = await screen.findByText(/Balance and allowance by year\./i);

    expect(cardDescription).toHaveTextContent(
      'Shaded band shows 40th–60th percentile across 2000 simulations.',
    );
  });

  it('handles withdrawal strategy selection', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    expect(screen.getByRole('spinbutton', { name: /Monthly Allowance/i })).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton', { name: /Withdrawal Percentage/i })).not.toBeInTheDocument();

    const strategyTrigger = screen.getByRole('combobox', { name: /Withdrawal Strategy/i });
    await user.click(strategyTrigger);

    const percentageOption = await screen.findByRole('option', { name: /Percentage of Portfolio/i });
    await user.click(percentageOption);

    expect(screen.queryByRole('spinbutton', { name: /Monthly Allowance/i })).not.toBeInTheDocument();
    expect(await screen.findByRole('spinbutton', { name: /Withdrawal Percentage/i })).toHaveValue(3.5);
  });

  it('calculates percentage-of-portfolio withdrawals minus barista income', async () => {
    render(
      (
        <FireCalculatorForm
          autoCalculate
          initialValues={{
            startingCapital: 100000,
            monthlySavings: 0,
            currentAge: 64,
            cagr: 0,
            desiredMonthlyAllowance: 3000,
            inflationRate: 0,
            lifeExpectancy: 66,
            retirementAge: 65,
            coastFireAge: 65,
            baristaIncome: 100,
            simulationMode: 'deterministic',
            volatility: 0,
            withdrawalStrategy: 'percentage',
            withdrawalPercentage: 4,
          }}
        />
      ) as unknown as ReactNode,
    );

    await screen.findByText('Financial Projection');

    expect(screen.getByText('97,200')).toBeInTheDocument();
  });

  it('hydrates monthly allowance from monthlySpend URL param without capping at 20000', async () => {
    window.history.pushState({}, '', '/?monthlySpend=25000');
    render((<FireCalculatorForm />) as unknown as ReactNode);

    await waitFor(() => {
      expect(screen.getByRole('spinbutton', { name: /Monthly Allowance/i })).toHaveValue(25000);
    });

    window.history.pushState({}, '', '/');
  });
});
