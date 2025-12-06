import Link from 'next/link';
import type { Metadata } from 'next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaqSection, type FaqItem } from '@/app/components/FaqSection';
import {
  RETIRE_AT_AGE_PRESETS,
  buildSpendScenarios,
  calculateNestEggFromSpend,
  extractCalculatorValuesFromSearch,
  parseAgeParam,
} from '@/lib/retire-at';
import { BASE_URL } from '@/lib/constants';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface RetireAtPageProps {
  params: Promise<{ age: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const currencyFormatter = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const faqForAge = (age: number): FaqItem[] => {
  const ageLabel = age.toString();
  return [
    {
      question: `How much do I need to retire at ${ageLabel}?`,
      answer:
        'A quick rule is your desired annual spending divided by a safe withdrawal rate. Using 4%, multiply your yearly spend by 25. Spending $60k/year means roughly $1.5M. Use the calculator below to tailor the projection to your own savings, growth, and inflation assumptions.',
    },
    {
      question: `What savings rate should I target to retire at ${ageLabel}?`,
      answer:
        'Aim for a 40–60% savings rate if you want to retire in 10–15 years. The exact rate depends on your starting capital, investment returns, and spending goal. Slide the monthly savings input to see how it moves your FIRE number and timeline.',
    },
    {
      question: 'Is the 4% rule safe for this timeline?',
      answer:
        'The 4% rule is a starting point, not a guarantee. Consider 3.5–4% for longer retirements or higher inflation periods. The calculator supports both fixed and percentage-based withdrawals so you can stress-test more conservative plans.',
    },
    {
      question: 'What if markets underperform?',
      answer:
        'Use a lower CAGR (e.g., 5–6%) and a higher inflation rate (e.g., 3%) in the calculator. Switch to Monte Carlo mode to see success probabilities with volatility. Also build flexibility into spending: trimming costs in bad years greatly improves durability.',
    },
  ];
};

export const generateStaticParams = () =>
  RETIRE_AT_AGE_PRESETS.map((age) => ({
    age: age.toString(),
  }));

export const generateMetadata = async ({ params }: RetireAtPageProps): Promise<Metadata> => {
  const { age: slugAge } = await params;
  const age = parseAgeParam(slugAge);
  const ageLabel = age.toString();
  const title = `How Much Do You Need to Retire at ${ageLabel}? | InvestingFIRE`;
  const description = `Instant answer plus calculator: see how much you need saved to retire at ${ageLabel}, modeled with your spending, returns, and inflation assumptions.`;
  const canonical = `${BASE_URL.replace(/\/$/, '')}/learn/retire-at/${ageLabel}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
    },
  };
};

export default async function RetireAtPage({ params, searchParams }: RetireAtPageProps) {
  const { age: slugAge } = await params;
  const resolvedSearch = (await searchParams) ?? {};
  const age = parseAgeParam(slugAge);
  const ageLabel = age.toString();
  const initialValues = extractCalculatorValuesFromSearch(resolvedSearch, age);
  const monthlySpend = initialValues.desiredMonthlyAllowance ?? 4000;
  const withdrawalRate = 0.04;
  const quickNestEgg = calculateNestEggFromSpend(monthlySpend, withdrawalRate);
  const scenarios = buildSpendScenarios(monthlySpend, withdrawalRate);

  const canonical = `${BASE_URL.replace(/\/$/, '')}/learn/retire-at/${ageLabel}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How Much Do You Need to Retire at ${ageLabel}?`,
    description:
      'Detailed guidance plus an interactive calculator showing exactly how much you need saved to retire at your target age.',
    mainEntityOfPage: canonical,
    datePublished: '2025-01-25',
    dateModified: new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name: 'InvestingFIRE',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}apple-icon.png`,
      },
    },
  };

  const queryParams = new URLSearchParams();
  if (initialValues.currentAge) queryParams.set('currentAge', initialValues.currentAge.toString());
  queryParams.set('retirementAge', age.toString());
  queryParams.set('monthlySpend', monthlySpend.toString());
  if (initialValues.monthlySavings)
    queryParams.set('monthlySavings', initialValues.monthlySavings.toString());
  if (initialValues.startingCapital)
    queryParams.set('startingCapital', initialValues.startingCapital.toString());

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-muted-foreground mb-6 text-sm">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/learn" className="hover:text-primary">
          Learn
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Retire at {age}</span>
      </nav>

      <header className="mb-10">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
          How Much Do I Need to Retire at {age}?
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Get an instant rule-of-thumb number, then dial in the details with the FIRE calculator loaded
          for age {age}. Adjust savings, returns, inflation, and withdrawals to stress-test your plan.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Answer</CardTitle>
            <CardDescription>
              Based on a {Math.round(withdrawalRate * 100)}% withdrawal rate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg">
              With a monthly spend of <strong>{currencyFormatter.format(monthlySpend)}</strong>, you need
              roughly <strong>{currencyFormatter.format(quickNestEgg)}</strong> invested to retire at{' '}
              {age}.
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
              <li>Uses the classic “Rule of 25” (annual spend ÷ {withdrawalRate * 100}%)</li>
              <li>Assumes inflation-adjusted withdrawals and a diversified portfolio</li>
              <li>Refine the projection below with your exact savings, age, and market assumptions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>At-a-Glance</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Target age</span>
              <span className="text-foreground font-semibold">{age}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Monthly spend (today)</span>
              <span className="text-foreground font-semibold">
                {currencyFormatter.format(monthlySpend)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Withdrawal rate</span>
              <span className="text-foreground font-semibold">{(withdrawalRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rule-of-25 nest egg</span>
              <span className="text-foreground font-semibold">
                {currencyFormatter.format(quickNestEgg)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12 space-y-6">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Spend Scenarios</h2>
            <p className="text-muted-foreground">
              Lean, classic, and comfortable budgets with required nest eggs.
            </p>
          </div>
          <Link
            href="/learn/safe-withdrawal-rate-4-percent-rule"
            className="text-primary text-sm hover:underline"
          >
            Why the {Math.round(withdrawalRate * 100)}% rule?
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <Card key={scenario.key} className="h-full">
              <CardHeader>
                <CardTitle>{scenario.label}</CardTitle>
                <CardDescription>
                  {currencyFormatter.format(scenario.monthlySpend)} / month
                </CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Annual spend</span>
                  <span className="text-foreground font-semibold">
                    {currencyFormatter.format(scenario.annualSpend)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Needed to retire</span>
                  <span className="text-foreground font-semibold">
                    {currencyFormatter.format(scenario.nestEgg)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 space-y-6">
        <div className="bg-primary/5 rounded-xl border p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Plan Your Details?</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            This page gives you a ballpark estimate. Use our full-featured calculator to customize
            inflation, market returns, simulation modes (Monte Carlo), and more for your specific
            situation.
          </p>
          <Button size="lg" className="h-auto px-8 py-6 text-lg" asChild>
            <Link href={`/?${queryParams.toString()}`}>Open Full Calculator for Age {age}</Link>
          </Button>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Key Levers to Watch</CardTitle>
            <CardDescription>Improve success odds for age {age}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
              <li>Boost savings rate in the final 5–10 years before {age}</li>
              <li>Lower planned spending or add part-time income (Barista/Coast FIRE)</li>
              <li>Use conservative returns (5–7%) and realistic inflation (2–3%)</li>
              <li>Consider longer life expectancy (age {age + 30}+)</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <FaqSection faqs={faqForAge(age)} className="my-12" />
    </article>
  );
}
