import { createElement, type ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HomePage, { metadata } from '../page';

vi.mock('next/image', () => ({
  default: ({ alt, ...props }: any) => createElement('img', { alt, ...props }),
}));

vi.mock('next/script', () => ({
  default: () => null,
}));

vi.mock('../components/FireCalculatorForm', () => ({
  default: () => createElement('div', { 'data-testid': 'fire-calculator-form' }, 'FireCalculatorForm'),
}));

vi.mock('../components/BackgroundPattern', () => ({
  default: () => createElement('div', { 'data-testid': 'background-pattern' }),
}));

vi.mock('../components/Testimonials', () => ({
  Testimonials: () => createElement('div', { 'data-testid': 'testimonials' }),
}));

vi.mock('../components/FaqSection', () => ({
  FaqSection: ({ faqs, title }: any) =>
    createElement(
      'section',
      { 'data-testid': 'faq-section' },
      createElement('h2', null, title),
      faqs.map((faq: { question: string; answer: string }) =>
        createElement('article', { key: faq.question }, faq.question, ' ', faq.answer),
      ),
    ),
}));

describe('homepage AI-search copy', () => {
  it('keeps metadata focused on FIRE calculator retrieval terms', () => {
    expect(metadata.title).toContain('FIRE Calculator');
    expect(metadata.description).toMatch(/FIRE number/i);
    expect(metadata.description).toMatch(/retirement age/i);
    expect(metadata.description).toMatch(/Monte Carlo/i);
  });

  it('renders an extractable FIRE calculator answer near the calculator', () => {
    render(createElement(HomePage as any) as unknown as ReactNode);

    const answerSection = screen.getByText(/What does this FIRE calculator do\?/i).closest('section');

    expect(answerSection).not.toBeNull();
    expect(
      within(answerSection as HTMLElement).getByText(
        /This FIRE calculator helps you plan for Financial Independence, Retire Early/i,
      ),
    ).toBeInTheDocument();
    expect(
      within(answerSection as HTMLElement).getByText(/Financial Independence, Retire Early/i),
    ).toBeInTheDocument();
  });

  it('explains the calculator formula and assumptions in quote-ready copy', () => {
    render(createElement(HomePage as any) as unknown as ReactNode);

    const methodologySection = screen.getByText(/How this FIRE calculator works/i).closest('section');

    expect(methodologySection).not.toBeNull();
    expect(
      within(methodologySection as HTMLElement).getByText(
        /FIRE number = annual spending divided by withdrawal rate/i,
      ),
    ).toBeInTheDocument();
    expect(
      within(methodologySection as HTMLElement).getByText(/year-by-year projection/i),
    ).toBeInTheDocument();
    expect(
      within(methodologySection as HTMLElement).getByText(/deterministic or Monte Carlo/i),
    ).toBeInTheDocument();
  });
});
