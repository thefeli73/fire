import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FireCalculatorForm from '../FireCalculatorForm';
import { describe, it, expect, vi, beforeAll } from 'vitest';

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
});

// Mock Recharts ResponsiveContainer
vi.mock('recharts', async () => {
  const originalModule = await vi.importActual('recharts');
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: '500px', height: '300px' }}>{children}</div>
    ),
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
    render(<FireCalculatorForm />);

    expect(screen.getByText('FIRE Calculator')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Starting Capital/i })).toHaveValue(50000);
    expect(screen.getByRole('spinbutton', { name: /Monthly Savings/i })).toHaveValue(1500);
    expect(screen.getByRole('spinbutton', { name: /Current Age/i })).toHaveValue(25);
  });

  it('calculates and displays results when submitted', async () => {
    const user = userEvent.setup();
    render(<FireCalculatorForm />);

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Financial Projection')).toBeInTheDocument();
      expect(screen.getByText('FIRE Number')).toBeInTheDocument();
    });
  });

  it('allows changing inputs', async () => {
    render(<FireCalculatorForm />);

    const savingsInput = screen.getByRole('spinbutton', { name: /Monthly Savings/i });

    fireEvent.change(savingsInput, { target: { value: '2000' } });

    await waitFor(() => {
      expect(savingsInput).toHaveValue(2000);
    });
  });

  it('validates inputs', async () => {
    const user = userEvent.setup();
    render(<FireCalculatorForm />);

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
    render(<FireCalculatorForm />);

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
    render(<FireCalculatorForm />);

    const modeTrigger = screen.getByRole('combobox', { name: /Simulation Mode/i });
    await user.click(modeTrigger);

    const monteCarloOption = await screen.findByRole('option', { name: /Monte Carlo/i });
    await user.click(monteCarloOption);

    await screen.findByText('Financial Projection');
    const bandLegend = await screen.findByTestId('mc-band-legend');

    expect(bandLegend).toHaveTextContent('40th-60th percentile');
  });

  it('handles withdrawal strategy selection', async () => {
    const user = userEvent.setup();
    render(<FireCalculatorForm />);

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
    render(<FireCalculatorForm />);

    await waitFor(() => {
      expect(screen.getByRole('spinbutton', { name: /Monthly Allowance/i })).toHaveValue(25000);
    });

    window.history.pushState({}, '', '/');
  });
});
