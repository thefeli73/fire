import { render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: ({ priority: _priority, unoptimized: _unoptimized, ...props }: any) =>
    createElement('img', props),
}));

vi.mock('next/script', () => ({
  default: () => null,
}));

vi.mock('../components/FireCalculatorForm', () => ({
  default: () => createElement('div', { 'data-testid': 'fire-calculator-form' }),
}));

vi.mock('../components/BackgroundPattern', () => ({
  default: () => null,
}));

vi.mock('../components/FaqSection', () => ({
  FaqSection: () => null,
}));

vi.mock('../components/Testimonials', () => ({
  Testimonials: () => null,
}));

import HomePage from '../page';

describe('home page calculator layout', () => {
  it('lets the calculator card span the full viewport on mobile', () => {
    render((<HomePage />) as unknown as ReactNode);

    const calculatorWrapper = screen.getByTestId('fire-calculator-form').parentElement;

    expect(calculatorWrapper).toHaveClass('w-screen');
    expect(calculatorWrapper).toHaveClass('-mx-4');
    expect(calculatorWrapper).toHaveClass('sm:mx-0');
    expect(calculatorWrapper).toHaveClass('sm:w-full');
    expect(calculatorWrapper).toHaveClass('sm:max-w-2xl');
  });
});
