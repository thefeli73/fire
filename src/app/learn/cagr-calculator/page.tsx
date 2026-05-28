import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';

import { AuthorBio } from '@/app/components/AuthorBio';
import { FaqSection, type FaqItem } from '@/app/components/FaqSection';
import { Button } from '@/components/ui/button';

import { CagrCalculator } from './CagrCalculator';

const pageUrl = 'https://investingfire.com/learn/cagr-calculator';
const fireCalculatorUrl = '/?cagr=7&simulationMode=monte-carlo&autoCalculate=true';

const faqs: FaqItem[] = [
  {
    question: 'What does CAGR mean?',
    answer:
      'CAGR means compound annual growth rate. It is the steady yearly rate that turns one portfolio balance into another balance over a chosen time period.',
  },
  {
    question: 'Is CAGR the same as average return?',
    answer:
      'No. A simple average adds yearly returns and divides by years. CAGR includes compounding, so it better shows the annualized growth path between a starting balance and an ending balance.',
  },
  {
    question: 'How should I use CAGR in a FIRE calculator?',
    answer:
      'Use CAGR as your expected annual growth rate before inflation, then test conservative, baseline, and optimistic assumptions. Small changes in CAGR can move your retirement timeline by years.',
  },
];

export const metadata: Metadata = {
  title: 'CAGR Calculator Online | Compound Annual Growth Rate Calculator CAGR',
  description:
    'Use this compound annual growth rate calculator CAGR online to project savings, contributions, and interest before testing FIRE scenarios.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'CAGR Calculator Online | InvestingFIRE',
    description:
      'Project compound annual growth rate, savings, contributions, and interest before testing FIRE scenarios.',
    type: 'article',
    siteName: 'InvestingFIRE',
    url: pageUrl,
    images: [
      {
        url: 'https://investingfire.com/apple-icon.png',
        width: 180,
        height: 180,
        alt: 'InvestingFIRE Logo',
      },
    ],
  },
};

export default function CagrCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'WebApplication'],
    headline: 'CAGR Calculator Online: Compound Annual Growth Rate Projection',
    name: 'CAGR Calculator Online',
    description:
      'A dedicated CAGR growth projection calculator for modeling initial deposits, savings, contributions, and interest.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    author: {
      '@type': 'Organization',
      name: 'InvestingFIRE Team',
      url: 'https://investingfire.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'InvestingFIRE',
      logo: {
        '@type': 'ImageObject',
        url: 'https://investingfire.com/apple-icon.png',
      },
    },
    datePublished: '2026-05-28',
    dateModified: '2026-05-28',
  };

  return (
    <div className="from-background via-primary/10 to-secondary/10 text-foreground relative min-h-screen overflow-hidden bg-gradient-to-b px-4 py-12">
      <Script id="cagr-calculator-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(jsonLd)}
      </Script>

      <article className="relative z-10 mx-auto max-w-6xl">
        <nav className="text-muted-foreground mb-6 text-sm">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/learn" className="hover:text-primary">
            Learn
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">CAGR Calculator</span>
        </nav>

        <header className="mx-auto mb-8 max-w-3xl text-center">
          <span className="bg-primary/15 text-primary rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase shadow-sm">
            Compound annual growth rate
          </span>
          <h1 className="from-primary via-accent to-primary mt-6 bg-linear-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-md lg:text-6xl">
            CAGR Calculator Online
          </h1>
          <p className="text-foreground/80 mt-4 text-lg leading-relaxed text-balance md:text-xl">
            A focused CAGR tool for growth projection, modeling how an initial deposit, monthly savings,
            and CAGR combine into long-term balance growth.
          </p>
        </header>

        <div className="-mx-4 sm:mx-0">
          <CagrCalculator />
        </div>

        <div className="prose prose-slate dark:prose-invert mx-auto mt-12 max-w-3xl">
          <h2>What CAGR Measures</h2>
          <p>
            CAGR converts uneven portfolio growth into one steady annual rate. If a portfolio rises and
            falls over several years, CAGR answers: “what annual return would create the same ending
            balance if growth happened smoothly?”
          </p>

          <h2>Why CAGR Matters for FIRE</h2>
          <p>
            FIRE plans depend heavily on long-term compounding. A higher CAGR shortens the time needed to
            reach financial independence; a lower CAGR means more savings, more time, or a smaller
            monthly allowance. That is why calculator assumptions should be tested instead of treated as
            promises.
          </p>

          <h2>How to Use This CAGR Calculator</h2>
          <ol>
            <li>Enter your initial deposit and monthly savings.</li>
            <li>Set the number of years you want to project.</li>
            <li>Adjust CAGR to compare conservative, baseline, and optimistic assumptions.</li>
            <li>
              Read the stacked bars to separate principal from deposit interest and savings interest.
            </li>
          </ol>

          <div className="bg-primary/5 my-12 rounded-2xl border p-8 text-center">
            <h2 className="mt-0 text-2xl font-bold">Need the full FIRE calculator?</h2>
            <p className="mb-6 text-lg">
              This CAGR tool focuses on balance projection. The FIRE calculator has more knobs:
              inflation, withdrawal strategy, retirement age, Monte Carlo, and historical simulation.
            </p>
            <Link href={fireCalculatorUrl}>
              <Button size="lg" className="text-lg font-bold">
                Open FIRE Calculator →
              </Button>
            </Link>
          </div>

          <FaqSection faqs={faqs} title="CAGR Calculator FAQ" />

          <AuthorBio />
        </div>
      </article>
    </div>
  );
}
