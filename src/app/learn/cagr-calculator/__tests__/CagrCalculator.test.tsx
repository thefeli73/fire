import { createElement, type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) =>
    createElement(
      'a',
      { href: typeof href === 'string' ? href : (href?.pathname ?? String(href)), ...props },
      children,
    ),
}));

vi.mock('next/script', () => ({
  default: () => null,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => createElement('button', props, children),
}));

vi.mock('@/app/components/AuthorBio', () => ({
  AuthorBio: (props: any) => createElement('div', props, 'AuthorBio'),
}));

vi.mock('@/app/components/FaqSection', () => ({
  FaqSection: (props: any) => createElement('div', props, 'FaqSection'),
}));

vi.mock('recharts', async () => {
  const originalModule = await vi.importActual<any>('recharts');

  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => children,
  };
});

import CagrCalculatorPage from '../page';

describe('CAGR calculator page', () => {
  it('renders dedicated growth projection calculator shell', () => {
    render((<CagrCalculatorPage />) as unknown as ReactNode);

    expect(screen.getByRole('heading', { name: /CAGR Calculator Online/i })).toBeInTheDocument();
    expect(screen.getByText(/growth projection/i)).toBeInTheDocument();
    expect(screen.getByText(/dedicated calculator/i)).toBeInTheDocument();
  });

  it('renders calculator inputs, results, and chart marker', () => {
    render((<CagrCalculatorPage />) as unknown as ReactNode);

    expect(screen.getByRole('spinbutton', { name: /Initial deposit/i })).toHaveValue(40000);
    expect(screen.getByRole('spinbutton', { name: /Monthly savings/i })).toHaveValue(1000);
    expect(screen.getByRole('spinbutton', { name: /Years/i })).toHaveValue(20);
    expect(screen.getByRole('spinbutton', { name: /CAGR/i })).toHaveValue(7);

    expect(screen.getAllByText(/Final balance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Total contributions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Total interest/i).length).toBeGreaterThan(0);

    expect(screen.getByTestId('cagr-stacked-bar-chart')).toBeInTheDocument();
  });

  it('updates projection when monthly savings changes', async () => {
    const user = userEvent.setup();
    render((<CagrCalculatorPage />) as unknown as ReactNode);

    const monthlySavingsInput = screen.getByRole('spinbutton', { name: /Monthly savings/i });
    const contributionsBefore = screen.getAllByText(/Total contributions/i)[0]?.textContent;
    const finalBalanceBefore = screen.getAllByText(/Final balance/i)[0]?.textContent;

    await user.clear(monthlySavingsInput);
    await user.type(monthlySavingsInput, '2000');

    await waitFor(() => {
      expect(monthlySavingsInput).toHaveValue(2000);
      expect(screen.getAllByText(/Total contributions/i)[0]?.textContent).not.toBe(contributionsBefore);
      expect(screen.getAllByText(/Final balance/i)[0]?.textContent).not.toBe(finalBalanceBefore);
    });
  });
});
