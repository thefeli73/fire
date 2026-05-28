import { createElement, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { FourPercentRuleChart } from '../FourPercentRuleChart';
import { CoastFireChart } from '../CoastFireChart';

vi.mock('recharts', async () => {
  const originalModule = await vi.importActual<typeof import('recharts')>('recharts');

  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => children,
  };
});

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
});

describe('chart clarity labels', () => {
  it('labels 4% rule chart axes with retirement years and starting balance percent', () => {
    render(createElement(FourPercentRuleChart as any) as unknown as ReactNode);

    expect(screen.getByText(/Years of retirement/i)).toBeInTheDocument();
    expect(screen.getByText(/% of initial balance|starting balance\s*=\s*100/i)).toBeInTheDocument();
  });

  it('labels Coast FIRE chart axes with age and currency-agnostic portfolio balance', () => {
    render(createElement(CoastFireChart as any) as unknown as ReactNode);

    expect(screen.getByText(/Age\s*\(years\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Portfolio balance/i)).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(['U', 'S', 'D'].join(''), 'i'))).not.toBeInTheDocument();
  });
});
