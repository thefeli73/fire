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

  it('calculates and displays results when submitted', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Financial Projection')).toBeInTheDocument();
      expect(screen.getByText('FIRE Number')).toBeInTheDocument();
      expect(screen.getByText(/Projection year|Years from today/i)).toBeInTheDocument();
      expect(screen.getByText(/Monthly allowance.*USD/i)).toBeInTheDocument();
      expect(screen.getByText(/Portfolio balance.*USD/i)).toBeInTheDocument();
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

    const modeTrigger = screen.getByRole('combobox', { name: /Simulation Mode/i });
    await user.click(modeTrigger);

    const monteCarloOption = await screen.findByRole('option', { name: /Monte Carlo/i });
    await user.click(monteCarloOption);
    await user.click(screen.getByRole('button', { name: /Calculate/i }));

    await screen.findByText('Financial Projection');
    const bandLegend = await screen.findByTestId('mc-band-legend');

    expect(bandLegend).toHaveTextContent('40th-60th percentile');
  });

  it('handles withdrawal strategy selection', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    const strategyTrigger = screen.getByRole('combobox', { name: /Withdrawal Strategy/i });
    await user.click(strategyTrigger);

    const percentageOption = await screen.findByRole('option', { name: /Percentage of Portfolio/i });
    await user.click(percentageOption);

    expect(
      await screen.findByRole('spinbutton', { name: /Withdrawal Percentage/i }),
    ).toBeInTheDocument();
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
