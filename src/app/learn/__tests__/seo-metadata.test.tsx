import { createElement, type ReactNode } from 'react';
import { readFileSync } from 'node:fs';
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
  CardDescription: ({ children, ...props }: any) => createElement('p', props, children),
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

vi.mock('recharts', async () => {
  const originalModule = await vi.importActual<any>('recharts');

  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => children,
  };
});

import MatrixPage, { metadata as matrixMetadata } from '../safe-withdrawal-rate-matrix/page';
import { metadata as fourPercentMetadata } from '../safe-withdrawal-rate-4-percent-rule/page';
import CoastVsLeanPage from '../coast-fire-vs-lean-fire/page';
import CagrCalculatorPage, { metadata as cagrCalculatorMetadata } from '../cagr-calculator/page';

const currentYear = String(new Date().getFullYear());
const hardCodedYear = String(2000 + 26);

describe('learn page metadata', () => {
  it('keeps SWR matrix SEO metadata aligned', () => {
    expect(matrixMetadata.title).toContain('Safe Withdrawal Rate Calculator');
    expect(matrixMetadata.title).toContain(`${currentYear} Matrix`);
    expect(matrixMetadata.description).toContain('30, 40, 50, and 60-year retirements');
  });

  it('keeps 4% rule SEO metadata aligned', () => {
    expect(fourPercentMetadata.title).toContain('4% Rule');
    expect(fourPercentMetadata.title).toContain(currentYear);
    expect(fourPercentMetadata.title).toMatch(/Calculator|FIRE Calculator/);
  });

  it('keeps CAGR calculator SEO metadata aligned', () => {
    expect(cagrCalculatorMetadata.title).toContain('CAGR Calculator');
    expect(cagrCalculatorMetadata.description).toMatch(/compound annual growth rate calculator/i);
  });

  it('uses JS current-year values instead of hard-coded year strings', () => {
    const matrixSource = readFileSync('src/app/learn/safe-withdrawal-rate-matrix/page.tsx', 'utf8');
    const fourPercentSource = readFileSync(
      'src/app/learn/safe-withdrawal-rate-4-percent-rule/page.tsx',
      'utf8',
    );

    expect(matrixSource).not.toContain(hardCodedYear);
    expect(fourPercentSource).not.toContain(hardCodedYear);
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

  it('explains matrix horizons and modeled success rates', () => {
    render(createElement(MatrixPage as any) as unknown as ReactNode);

    expect(screen.getByText(/30\/40\/50\/60 columns are retirement horizons/i)).toBeInTheDocument();
    expect(screen.getByText(/modeled success rates\s*\(%\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/The original Trinity Study tested 15-, 20-, 25-, and 30-year periods/i),
    ).toBeInTheDocument();
  });

  it('renders CAGR calculator CTA and explanatory copy', () => {
    const { container } = render(createElement(CagrCalculatorPage as any) as unknown as ReactNode);
    const hrefs = Array.from(container.querySelectorAll('a')).map((link) => link.getAttribute('href'));

    expect(screen.getByText(/CAGR calculator online/i)).toBeInTheDocument();
    expect(screen.getByText(/Monte Carlo/i)).toBeInTheDocument();
    expect(screen.getByText(/more knobs/i)).toBeInTheDocument();
    expect(hrefs).toContain('/?cagr=7&simulationMode=monte-carlo&autoCalculate=true');
  });
});
