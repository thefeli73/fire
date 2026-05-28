import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import FireCalculatorForm from '../FireCalculatorForm';

vi.mock('next-plausible', () => ({
  usePlausible: () => vi.fn(),
}));

vi.mock('recharts', async () => {
  const originalModule = await vi.importActual('recharts');
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => children,
  };
});

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));

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

beforeAll(() => {
  global.ResizeObserver = ResizeObserver;
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.setPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('FireCalculatorForm card layout', () => {
  it('removes calculator card rounding on mobile only', () => {
    render((<FireCalculatorForm />) as unknown as ReactNode);

    const calculatorCard = screen.getByText('FIRE Calculator').closest('[data-slot="card"]');

    expect(calculatorCard).toHaveClass('rounded-none');
    expect(calculatorCard).toHaveClass('sm:rounded-xl');
  });

  it('lets the projection graph card breathe outside mobile padding only', async () => {
    render((<FireCalculatorForm autoCalculate />) as unknown as ReactNode);

    const projectionCard = (await screen.findByText('Financial Projection')).closest(
      '[data-slot="card"]',
    );

    expect(projectionCard).toHaveClass('-mx-3');
    expect(projectionCard).toHaveClass('sm:mx-0');
  });
});
