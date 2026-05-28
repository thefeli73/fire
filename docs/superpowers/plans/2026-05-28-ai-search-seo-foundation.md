# AI Search SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve InvestingFIRE visibility in AI-assisted search by making the homepage, calculator results, and safe-withdrawal pages easier to retrieve, quote, and navigate.

**Architecture:** Keep the homepage as the canonical calculator entry point. Add quote-ready answer/methodology blocks to `src/app/page.tsx`, add visible FAQ sections that reuse existing `FaqSection` JSON-LD, and add contextual result cards to `FireCalculatorForm` without moving calculator logic out of the existing component. Use small pure helpers for next-step selection so behavior is testable without rendering the whole calculator.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library, next-plausible, shadcn-style UI components, existing `FaqSection` schema renderer.

---

## Scope

This plan implements the first AI-search/GEO foundation batch:

1. Homepage extractable answer block for `FIRE calculator`, `Financial Independence, Retire Early`, `FIRE number`, and `FIRE age`.
2. Homepage methodology block with formula and assumptions written for both users and AI extractors.
3. Visible safe-withdrawal FAQ sections with FAQPage schema through `FaqSection`.
4. Contextual calculator result cards that send engaged homepage users to relevant learn pages.
5. Plausible tracking for result-card clicks.

Out of scope for this batch:

- Dedicated `/fire-calculator` route. Decide after 14–28 days of post-change GSC data.
- New Monte Carlo content cluster pages. Build after the foundation changes prove internal click movement.
- Generic CAGR calculator expansion. Current broad CAGR SERP is too crowded; only FIRE-specific calculator content should be added later.

## Current data driving this plan

- `fire calculator`: 43,347 impressions, 1,440 clicks, 3.32% CTR, avg position 8.44. AI-search examples pull top 5-ish results, so rank 8 is likely invisible.
- Homepage `/`: 2,344 clicks, 66,215 impressions, 3.54% CTR, 96.9% of page clicks, ~3m engagement.
- Pages/visit: 1.04. Users calculate and leave; result-state routing is the biggest product-side gap.
- Safe-withdrawal pages: ~109k combined impressions with ~0.04–0.05% CTR. They need quote-ready answers and visible FAQs.
- Monte Carlo query variants rank ~3–4 with high CTR. Result cards should route users toward Monte Carlo/SWR content.

## File structure

- Modify `src/app/page.tsx`: add homepage answer/methodology blocks and tighten FAQ wording.
- Create `src/app/__tests__/home-page-ai-seo.test.tsx`: test quote-ready homepage copy without rendering the full calculator.
- Modify `src/app/learn/safe-withdrawal-rate-matrix/page.tsx`: add visible FAQ array, import/use `FaqSection`, and ensure matrix FAQ answers mention horizons and modeled success rates.
- Modify `src/app/learn/safe-withdrawal-rate-4-percent-rule/page.tsx`: refine existing `faqs` for AI-answer clarity and keep visible FAQ schema through `FaqSection`.
- Modify `src/app/learn/__tests__/seo-metadata.test.tsx`: render FaqSection text in mocks and assert visible FAQ content.
- Create `src/app/components/calculator-next-steps.ts`: pure recommendation helper for calculator result cards.
- Create `src/app/components/__tests__/calculator-next-steps.test.ts`: fast unit tests for recommendation logic.
- Modify `src/app/components/FireCalculatorForm.tsx`: render next-step cards after successful calculation and track clicks.
- Modify `src/app/components/__tests__/FireCalculatorForm.test.tsx`: integration tests for next-step card rendering and Plausible click event.

## Product copy constraints

- Keep calculator and learning-page copy currency-agnostic. Use `portfolio balance`, `monthly allowance`, `40,000`, or `40k` style wording.
- Do not add currency codes or symbol-prefixed examples in new UI copy.
- After implementation, search changed user-facing files for currency codes, currency terms, and symbol-prefixed amounts before claiming done.

---

### Task 1: Homepage AI-search answer and methodology blocks

**Files:**
- Create: `src/app/__tests__/home-page-ai-seo.test.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write the failing homepage AI-copy test**

Create `src/app/__tests__/home-page-ai-seo.test.tsx`:

```tsx
import { createElement, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
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

    expect(screen.getByText(/What does this FIRE calculator do\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/This FIRE calculator helps you plan for Financial Independence, Retire Early/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Financial Independence, Retire Early/i)).toBeInTheDocument();
  });

  it('explains the calculator formula and assumptions in quote-ready copy', () => {
    render(createElement(HomePage as any) as unknown as ReactNode);

    expect(screen.getByText(/How this FIRE calculator works/i)).toBeInTheDocument();
    expect(screen.getByText(/FIRE number = annual spending divided by withdrawal rate/i)).toBeInTheDocument();
    expect(screen.getByText(/year-by-year projection/i)).toBeInTheDocument();
    expect(screen.getByText(/deterministic or Monte Carlo/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the homepage test and verify RED**

Run:

```bash
pnpm vitest run src/app/__tests__/home-page-ai-seo.test.tsx
```

Expected: the new copy tests fail because `What does this FIRE calculator do?`, the formula sentence, and `deterministic or Monte Carlo` are not present yet.

- [ ] **Step 3: Add the extractable answer block to `src/app/page.tsx`**

In `src/app/page.tsx`, insert this block after the paragraph ending with `how FIRE works.` and before the calculator wrapper that currently starts `<div className="-mx-4 mt-8 w-screen sm:mx-0 sm:w-full sm:max-w-2xl">`:

```tsx
        <section className="bg-background/80 border-primary/15 mt-6 max-w-2xl rounded-2xl border p-5 text-left shadow-sm backdrop-blur">
          <h2 className="mb-2 text-xl font-bold">What does this FIRE calculator do?</h2>
          <p className="text-foreground/80 leading-relaxed">
            This FIRE calculator helps you plan for Financial Independence, Retire Early by estimating
            your FIRE number, projected FIRE age, and portfolio survival using your current portfolio
            balance, savings rate, expected returns, retirement spending, inflation, and withdrawal rate.
          </p>
        </section>
```

- [ ] **Step 4: Replace the existing methodology section heading and opening copy**

In `src/app/page.tsx`, find the section starting with:

```tsx
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            How This FIRE Calculator Provides Investing Insights
          </h2>
```

Replace the heading and first paragraph with:

```tsx
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">How this FIRE calculator works</h2>
          <p className="mb-4 text-lg leading-relaxed">
            FIRE number = annual spending divided by withdrawal rate. This calculator starts with that
            rule of thumb, then runs a year-by-year projection so you can test how savings, investment
            growth, inflation, retirement age, and deterministic or Monte Carlo assumptions change the
            result.
          </p>
```

Keep the existing list that starts with `Starting Capital` after the new paragraph.

- [ ] **Step 5: Run the homepage test and verify GREEN**

Run:

```bash
pnpm vitest run src/app/__tests__/home-page-ai-seo.test.tsx
```

Expected: all tests in `home-page-ai-seo.test.tsx` pass.

- [ ] **Step 6: Commit Task 1**

```bash
git add src/app/page.tsx src/app/__tests__/home-page-ai-seo.test.tsx
git commit -m "feat: add ai-search homepage answer block"
```

---

### Task 2: Visible FAQ blocks for safe-withdrawal AI answers

**Files:**
- Modify: `src/app/learn/safe-withdrawal-rate-matrix/page.tsx`
- Modify: `src/app/learn/safe-withdrawal-rate-4-percent-rule/page.tsx`
- Modify: `src/app/learn/__tests__/seo-metadata.test.tsx`

- [ ] **Step 1: Update the FAQ mock and write failing safe-withdrawal FAQ tests**

In `src/app/learn/__tests__/seo-metadata.test.tsx`, replace the current `FaqSection` mock:

```tsx
vi.mock('@/app/components/FaqSection', () => ({
  FaqSection: (props: any) => createElement('div', props, 'FaqSection'),
}));
```

with:

```tsx
vi.mock('@/app/components/FaqSection', () => ({
  FaqSection: ({ faqs, title, ...props }: any) =>
    createElement(
      'section',
      props,
      createElement('h2', null, title ?? 'Frequently Asked Questions'),
      faqs.map((faq: { question: string; answer: string }) =>
        createElement('article', { key: faq.question }, faq.question, ' ', faq.answer),
      ),
    ),
}));
```

Then add these tests before the closing `});` of `describe('learn page links', () => {`:

```tsx
  it('renders matrix FAQs that define horizons and success rates for answer engines', () => {
    render(createElement(MatrixPage as any) as unknown as ReactNode);

    expect(screen.getByText(/What do 30, 40, 50, and 60 years mean/i)).toBeInTheDocument();
    expect(screen.getByText(/They are retirement horizons, not ages/i)).toBeInTheDocument();
    expect(screen.getByText(/What does success rate mean/i)).toBeInTheDocument();
    expect(screen.getByText(/modeled share of scenarios/i)).toBeInTheDocument();
  });

  it('renders 4% rule FAQs that answer calculator-oriented search intent', () => {
    render(createElement(SafeWithdrawalPage as any) as unknown as ReactNode);

    expect(screen.getByText(/Is the 4% rule still safe for FIRE/i)).toBeInTheDocument();
    expect(screen.getByText(/test a lower withdrawal rate in a Monte Carlo calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/What withdrawal rate lasts 50 years/i)).toBeInTheDocument();
  });
```

At the imports in the same file, change:

```tsx
import { metadata as fourPercentMetadata } from '../safe-withdrawal-rate-4-percent-rule/page';
```

to:

```tsx
import SafeWithdrawalPage, { metadata as fourPercentMetadata } from '../safe-withdrawal-rate-4-percent-rule/page';
```

- [ ] **Step 2: Run learn-page tests and verify RED**

Run:

```bash
pnpm vitest run src/app/learn/__tests__/seo-metadata.test.tsx
```

Expected: FAQ tests fail because the matrix page does not render `FaqSection` and the 4% page does not yet include the new calculator-oriented FAQ wording.

- [ ] **Step 3: Add FAQ support to `safe-withdrawal-rate-matrix/page.tsx`**

Add this import near the existing imports:

```tsx
import { FaqSection, type FaqItem } from '@/app/components/FaqSection';
```

Add this `faqs` array after `const currentYear = new Date().getFullYear();`:

```tsx
const faqs: FaqItem[] = [
  {
    question: 'What do 30, 40, 50, and 60 years mean in the SWR matrix?',
    answer:
      'They are retirement horizons, not ages. A 50-year column means the portfolio needs to support 50 years of withdrawals after retirement.',
  },
  {
    question: 'What does success rate mean in a safe withdrawal rate table?',
    answer:
      'Success rate is the modeled share of scenarios where the portfolio still has money at the end of the retirement horizon.',
  },
  {
    question: 'What withdrawal rate is safer for long FIRE retirements?',
    answer:
      'For 40- to 60-year retirements, many FIRE planners test rates below 4%, such as 3.25% to 3.5%, then stress-test the plan with market volatility.',
  },
  {
    question: 'How should I use this matrix with the calculator?',
    answer:
      'Use the matrix to choose a starting withdrawal rate, then run the calculator in Monte Carlo mode to test how that rate behaves with your own timeline and assumptions.',
  },
];
```

Render it before `<AuthorBio />`:

```tsx
        <FaqSection faqs={faqs} title="Safe Withdrawal Rate Matrix FAQ" className="my-12" />

        <AuthorBio />
```

- [ ] **Step 4: Refine 4% rule FAQs in `safe-withdrawal-rate-4-percent-rule/page.tsx`**

In the existing `faqs` array, replace the answer for `Is 4% still safe for early retirees?` with:

```ts
      'For early retirees with 40-50+ year horizons, 4% can be aggressive. Many planners test a lower withdrawal rate in a Monte Carlo calculator, such as 3.25% to 3.5%, because the original Trinity Study focused on payout periods up to 30 years.',
```

Add this FAQ object after the `Is 4% still safe for early retirees?` object:

```ts
  {
    question: 'What withdrawal rate lasts 50 years?',
    answer:
      'No withdrawal rate is guaranteed, but extended FIRE retirements often need more conservative starting rates than a traditional 30-year retirement. A 3.25% to 3.5% starting point gives more margin before you test the plan against your own assumptions.',
  },
```

Change the question text from:

```ts
    question: 'Is 4% still safe for early retirees?',
```

to:

```ts
    question: 'Is the 4% rule still safe for FIRE?',
```

- [ ] **Step 5: Run learn-page tests and verify GREEN**

Run:

```bash
pnpm vitest run src/app/learn/__tests__/seo-metadata.test.tsx
```

Expected: all learn-page metadata/link/FAQ tests pass.

- [ ] **Step 6: Commit Task 2**

```bash
git add src/app/learn/safe-withdrawal-rate-matrix/page.tsx src/app/learn/safe-withdrawal-rate-4-percent-rule/page.tsx src/app/learn/__tests__/seo-metadata.test.tsx
git commit -m "feat: add safe withdrawal faq answers"
```

---

### Task 3: Pure next-step recommendation helper

**Files:**
- Create: `src/app/components/calculator-next-steps.ts`
- Create: `src/app/components/__tests__/calculator-next-steps.test.ts`

- [ ] **Step 1: Write failing unit tests for next-step selection**

Create `src/app/components/__tests__/calculator-next-steps.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getCalculatorNextSteps } from '../calculator-next-steps';

describe('getCalculatorNextSteps', () => {
  it('recommends Monte Carlo and safe withdrawal reading for deterministic results', () => {
    const steps = getCalculatorNextSteps({
      simulationMode: 'deterministic',
      withdrawalStrategy: 'fixed',
      retirementDurationYears: 34,
      successRate: undefined,
      coastFireAge: undefined,
    });

    expect(steps.map((step) => step.href)).toContain('/?simulationMode=monte-carlo&autoCalculate=true');
    expect(steps.map((step) => step.href)).toContain('/learn/safe-withdrawal-rate-4-percent-rule');
  });

  it('recommends the SWR matrix when retirement duration is 40 years or longer', () => {
    const steps = getCalculatorNextSteps({
      simulationMode: 'monte-carlo',
      withdrawalStrategy: 'percentage',
      retirementDurationYears: 50,
      successRate: 82,
      coastFireAge: undefined,
    });

    expect(steps.map((step) => step.href)).toContain('/learn/safe-withdrawal-rate-matrix');
  });

  it('recommends Coast FIRE reading when a coast FIRE age is present', () => {
    const steps = getCalculatorNextSteps({
      simulationMode: 'deterministic',
      withdrawalStrategy: 'fixed',
      retirementDurationYears: 30,
      successRate: undefined,
      coastFireAge: 35,
    });

    expect(steps.map((step) => step.href)).toContain('/learn/coast-fire-vs-lean-fire');
  });

  it('caps recommendations at three cards', () => {
    const steps = getCalculatorNextSteps({
      simulationMode: 'deterministic',
      withdrawalStrategy: 'percentage',
      retirementDurationYears: 55,
      successRate: 72,
      coastFireAge: 35,
    });

    expect(steps).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run helper tests and verify RED**

Run:

```bash
pnpm vitest run src/app/components/__tests__/calculator-next-steps.test.ts
```

Expected: fails because `src/app/components/calculator-next-steps.ts` does not exist.

- [ ] **Step 3: Create the recommendation helper**

Create `src/app/components/calculator-next-steps.ts`:

```ts
export interface CalculatorNextStepContext {
  simulationMode: 'deterministic' | 'monte-carlo';
  withdrawalStrategy: 'fixed' | 'percentage';
  retirementDurationYears: number;
  successRate?: number;
  coastFireAge?: number;
}

export interface CalculatorNextStep {
  id: 'monte-carlo' | 'safe-withdrawal' | 'swr-matrix' | 'coast-fire';
  title: string;
  description: string;
  href: string;
  cta: string;
}

const stepCatalog = {
  monteCarlo: {
    id: 'monte-carlo',
    title: 'Stress-test market risk',
    description: 'Run the same plan with randomized returns to see how volatility changes the outcome.',
    href: '/?simulationMode=monte-carlo&autoCalculate=true',
    cta: 'Try Monte Carlo',
  },
  safeWithdrawal: {
    id: 'safe-withdrawal',
    title: 'Check withdrawal-rate risk',
    description: 'Learn when the 4% rule works, when it strains, and how lower rates add margin.',
    href: '/learn/safe-withdrawal-rate-4-percent-rule',
    cta: 'Read the 4% guide',
  },
  swrMatrix: {
    id: 'swr-matrix',
    title: 'Compare long retirement horizons',
    description: 'See modeled success rates for 30-, 40-, 50-, and 60-year retirements.',
    href: '/learn/safe-withdrawal-rate-matrix',
    cta: 'Open the SWR matrix',
  },
  coastFire: {
    id: 'coast-fire',
    title: 'Explore Coast FIRE',
    description: 'See how front-loaded saving can let compounding carry more of the plan later.',
    href: '/learn/coast-fire-vs-lean-fire',
    cta: 'Compare FIRE paths',
  },
} satisfies Record<string, CalculatorNextStep>;

export function getCalculatorNextSteps(context: CalculatorNextStepContext): CalculatorNextStep[] {
  const steps: CalculatorNextStep[] = [];

  if (context.simulationMode === 'deterministic') {
    steps.push(stepCatalog.monteCarlo);
  }

  if (context.retirementDurationYears >= 40) {
    steps.push(stepCatalog.swrMatrix);
  }

  if (context.withdrawalStrategy === 'percentage' || (context.successRate !== undefined && context.successRate < 85)) {
    steps.push(stepCatalog.safeWithdrawal);
  }

  if (context.coastFireAge !== undefined && context.coastFireAge > 0) {
    steps.push(stepCatalog.coastFire);
  }

  if (!steps.some((step) => step.id === 'safe-withdrawal')) {
    steps.push(stepCatalog.safeWithdrawal);
  }

  return Array.from(new Map(steps.map((step) => [step.id, step])).values()).slice(0, 3);
}
```

- [ ] **Step 4: Run helper tests and verify GREEN**

Run:

```bash
pnpm vitest run src/app/components/__tests__/calculator-next-steps.test.ts
```

Expected: all helper tests pass.

- [ ] **Step 5: Commit Task 3**

```bash
git add src/app/components/calculator-next-steps.ts src/app/components/__tests__/calculator-next-steps.test.ts
git commit -m "feat: add calculator next-step recommendations"
```

---

### Task 4: Render contextual result cards in the calculator

**Files:**
- Modify: `src/app/components/FireCalculatorForm.tsx`
- Modify: `src/app/components/__tests__/FireCalculatorForm.test.tsx`

- [ ] **Step 1: Write failing calculator integration tests**

In `src/app/components/__tests__/FireCalculatorForm.test.tsx`, add these tests after `emits save/share analytics after sharing results`:

```tsx
  it('shows contextual next-step cards after calculation', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    await user.click(screen.getByRole('button', { name: /Calculate/i }));

    expect(await screen.findByText(/Recommended next steps/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Try Monte Carlo/i })).toHaveAttribute(
      'href',
      '/?simulationMode=monte-carlo&autoCalculate=true',
    );
    expect(screen.getByRole('link', { name: /Read the 4% guide/i })).toHaveAttribute(
      'href',
      '/learn/safe-withdrawal-rate-4-percent-rule',
    );
  });

  it('tracks calculator next-step clicks', async () => {
    const user = userEvent.setup();
    render((<FireCalculatorForm />) as unknown as ReactNode);

    await user.click(screen.getByRole('button', { name: /Calculate/i }));
    const nextStepLink = await screen.findByRole('link', { name: /Try Monte Carlo/i });

    await user.click(nextStepLink);

    expect(plausibleMock).toHaveBeenCalledWith(
      'calculator_next_step_click',
      expect.objectContaining({
        props: expect.objectContaining({
          next_step_id: 'monte-carlo',
          destination: '/?simulationMode=monte-carlo&autoCalculate=true',
          source_path: '/',
        }),
      }),
    );
  });
```

- [ ] **Step 2: Run calculator tests and verify RED**

Run:

```bash
pnpm vitest run src/app/components/__tests__/FireCalculatorForm.test.tsx
```

Expected: the two new tests fail because result cards and `calculator_next_step_click` tracking do not exist.

- [ ] **Step 3: Import next-step helper in `FireCalculatorForm.tsx`**

Add this import near the existing local imports:

```tsx
import { getCalculatorNextSteps } from './calculator-next-steps';
```

- [ ] **Step 4: Add next-step data inside `FireCalculatorForm`**

After the `form` initialization block, add:

```tsx
  const retirementDurationYears =
    Number(form.watch('lifeExpectancy')) - Number(form.watch('retirementAge'));
  const nextSteps = result?.error
    ? []
    : getCalculatorNextSteps({
        simulationMode: form.watch('simulationMode'),
        withdrawalStrategy: form.watch('withdrawalStrategy'),
        retirementDurationYears,
        successRate: result?.successRate,
        coastFireAge: form.watch('coastFireAge'),
      });
```

- [ ] **Step 5: Add a click tracker helper inside `FireCalculatorForm`**

Add this function near `handleShare`:

```tsx
  const trackNextStepClick = (nextStepId: string, destination: string) => {
    plausible('calculator_next_step_click', {
      props: {
        next_step_id: nextStepId,
        destination,
        source_path: safeSourcePath(),
      },
    });
  };
```

- [ ] **Step 6: Render next-step cards after successful result summary**

In `FireCalculatorForm.tsx`, after the result summary grid ending with `</div>` around lines 1237–1272, insert this block before the fragment closes:

```tsx
      {result && !result.error && nextSteps.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Recommended next steps</CardTitle>
            <CardDescription className="text-xs">
              Use your result to stress-test risk, compare withdrawal rates, or explore related FIRE paths.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {nextSteps.map((step) => (
                <Link
                  key={step.id}
                  href={step.href}
                  onClick={() => {
                    trackNextStepClick(step.id, step.href);
                  }}
                  className="border-border bg-background hover:bg-muted block rounded-lg border p-4 transition-colors"
                >
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
                  <p className="text-primary mt-3 text-sm font-medium">{step.cta} →</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
```

- [ ] **Step 7: Run calculator tests and verify GREEN**

Run:

```bash
pnpm vitest run src/app/components/__tests__/calculator-next-steps.test.ts src/app/components/__tests__/FireCalculatorForm.test.tsx
```

Expected: helper and calculator tests pass.

- [ ] **Step 8: Commit Task 4**

```bash
git add src/app/components/FireCalculatorForm.tsx src/app/components/__tests__/FireCalculatorForm.test.tsx
git commit -m "feat: route calculator results to next steps"
```

---

### Task 5: Verification and currency-agnostic content audit

**Files:**
- Verify: `src/app/page.tsx`
- Verify: `src/app/learn/safe-withdrawal-rate-matrix/page.tsx`
- Verify: `src/app/learn/safe-withdrawal-rate-4-percent-rule/page.tsx`
- Verify: `src/app/components/FireCalculatorForm.tsx`
- Verify: tests created/modified above

- [ ] **Step 1: Run targeted tests**

Run:

```bash
pnpm vitest run src/app/__tests__/home-page-ai-seo.test.tsx src/app/learn/__tests__/seo-metadata.test.tsx src/app/components/__tests__/calculator-next-steps.test.ts src/app/components/__tests__/FireCalculatorForm.test.tsx
```

Expected: all targeted tests pass.

- [ ] **Step 2: Run full tests**

Run:

```bash
pnpm test
```

Expected: all Vitest files pass.

- [ ] **Step 3: Run lint and type checks**

Run:

```bash
pnpm run check
```

Expected: `next typegen`, `oxlint`, and `tsc --noEmit` pass.

- [ ] **Step 4: Run production build**

Run:

```bash
pnpm run build
```

Expected: Next.js build compiles and all static pages generate.

- [ ] **Step 5: Search changed user-facing files for currency-specific copy**

Run:

```bash
rg -n 'USD|SEK|EUR|dollar|dollars|krona|kronor|[$€£][0-9]' src/app/page.tsx src/app/learn/safe-withdrawal-rate-matrix/page.tsx src/app/learn/safe-withdrawal-rate-4-percent-rule/page.tsx src/app/components/FireCalculatorForm.tsx src/app/components/calculator-next-steps.ts
```

Expected: no matches in newly added user-facing copy. If existing matches appear outside this change, do not expand scope; report them separately.

- [ ] **Step 6: Review diff**

Run:

```bash
git diff --stat
git diff -- src/app/page.tsx src/app/learn/safe-withdrawal-rate-matrix/page.tsx src/app/learn/safe-withdrawal-rate-4-percent-rule/page.tsx src/app/components/FireCalculatorForm.tsx src/app/components/calculator-next-steps.ts
```

Expected: diff only contains homepage AI answer/methodology copy, visible FAQs, next-step helper/UI, and tests.

- [ ] **Step 7: Final commit**

If Tasks 1–4 were not committed separately, commit all intended files now:

```bash
git add src/app/page.tsx src/app/__tests__/home-page-ai-seo.test.tsx src/app/learn/safe-withdrawal-rate-matrix/page.tsx src/app/learn/safe-withdrawal-rate-4-percent-rule/page.tsx src/app/learn/__tests__/seo-metadata.test.tsx src/app/components/calculator-next-steps.ts src/app/components/__tests__/calculator-next-steps.test.ts src/app/components/FireCalculatorForm.tsx src/app/components/__tests__/FireCalculatorForm.test.tsx
git commit -m "feat: improve ai-search seo foundation"
```

---

## Measurement after release

- Wait 14–28 days before judging SEO movement.
- Track GSC query clusters weekly:
  - `fire calculator`
  - `FIRE calculator financial independence retire early`
  - `safe withdrawal rate calculator`
  - `4 percent rule calculator`
  - `Monte Carlo retirement calculator`
- Track Plausible events:
  - `calculator_calculate`
  - `calculator_save_share`
  - `calculator_next_step_click`
- Target outcomes:
  - `fire calculator` avg position moves from ~8.44 toward top 5.
  - Homepage pages/visit moves from 1.04 toward 1.15+.
  - Calculator next-step click rate reaches 5–10% of result-generating visits.
  - Safe-withdrawal CTR moves from ~0.04–0.05% toward 0.3–0.8% after recrawl.

## Self-review notes

- Coverage: Tasks cover homepage retrieval copy, quote-ready methodology, visible FAQs/FAQ schema, result-state routing, Plausible tracking, and verification.
- Completeness scan: no open slots, no deferred implementation sections, and no unspecified file paths.
- Type consistency: `CalculatorNextStepContext` matches current form values for `simulationMode`, `withdrawalStrategy`, `successRate`, `coastFireAge`, and derived retirement duration.
- Scope: dedicated `/fire-calculator` route and Monte Carlo content cluster are intentionally deferred because this batch should ship quickly and be measured before larger URL/content architecture changes.
