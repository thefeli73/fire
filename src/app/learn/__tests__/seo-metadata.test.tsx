import { createElement, type ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

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

vi.mock('@/components/ui/alert', () => ({
  Alert: ({ children, ...props }: any) => createElement('div', props, children),
  AlertDescription: ({ children, ...props }: any) => createElement('div', props, children),
  AlertTitle: ({ children, ...props }: any) => createElement('div', props, children),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => createElement('section', props, children),
  CardContent: ({ children, ...props }: any) => createElement('div', props, children),
  CardHeader: ({ children, ...props }: any) => createElement('header', props, children),
  CardTitle: ({ children, ...props }: any) => createElement('h2', props, children),
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: (props: any) => createElement('hr', props),
}));

vi.mock('@/app/components/AuthorBio', () => ({
  AuthorBio: (props: any) => createElement('div', props, 'AuthorBio'),
}));

vi.mock('@/app/components/FaqSection', () => ({
  FaqSection: (props: any) => createElement('div', props, 'FaqSection'),
}));

vi.mock('@/app/components/charts/FourPercentRuleChart', () => ({
  FourPercentRuleChart: () => createElement('div', { 'data-testid': 'four-percent-rule-chart' }),
}));

vi.mock('@/app/components/charts/CoastFireChart', () => ({
  CoastFireChart: () => createElement('div', { 'data-testid': 'coast-fire-chart' }),
}));

import MatrixPage, { metadata as matrixMetadata } from '../safe-withdrawal-rate-matrix/page';
import { metadata as fourPercentMetadata } from '../safe-withdrawal-rate-4-percent-rule/page';
import CoastVsLeanPage from '../coast-fire-vs-lean-fire/page';

describe('learn page metadata', () => {
  it('keeps SWR matrix SEO metadata aligned', () => {
    expect(matrixMetadata.title).toContain('Safe Withdrawal Rate Calculator');
    expect(matrixMetadata.title).toContain('2026 Matrix');
    expect(matrixMetadata.description).toContain('30, 40, 50, and 60-year retirements');
  });

  it('keeps 4% rule SEO metadata aligned', () => {
    expect(fourPercentMetadata.title).toContain('4% Rule');
    expect(fourPercentMetadata.title).toContain('2026');
    expect(fourPercentMetadata.title).toMatch(/Calculator|FIRE Calculator/);
  });
});

describe('learn page links', () => {
  it('renders matrix page Monte Carlo link and no historical link', () => {
    const { container } = render(createElement(MatrixPage as any) as unknown as ReactNode);
    const hrefs = Array.from(container.querySelectorAll('a')).map((link) => link.getAttribute('href'));

    expect(hrefs).toContain('/?simulationMode=monte-carlo&withdrawalPercentage=3.5');
    expect(hrefs).not.toContain('/?simulationMode=historical');
  });

  it('renders Coast FIRE calculator link', () => {
    const { container } = render(createElement(CoastVsLeanPage as any) as unknown as ReactNode);
    const hrefs = Array.from(container.querySelectorAll('a')).map((link) => link.getAttribute('href'));

    expect(hrefs).toContain('/?coastFireAge=35&autoCalculate=true');
  });

  it('explains matrix horizons and historical success rates', () => {
    render(createElement(MatrixPage as any) as unknown as ReactNode);

    expect(screen.getByText(/30\/40\/50\/60 columns are retirement horizons/i)).toBeInTheDocument();
    expect(screen.getByText(/historical success rates\s*\(%\)/i)).toBeInTheDocument();
  });
});
