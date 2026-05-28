import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';

import { AuthorBio } from '@/app/components/AuthorBio';
import { FaqSection, type FaqItem } from '@/app/components/FaqSection';
import { Button } from '@/components/ui/button';

const pageUrl = 'https://investingfire.com/learn/cagr-calculator';

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
    'Use this CAGR calculator online guide to understand compound annual growth rate calculator CAGR inputs and test annual growth assumptions in your FIRE plan.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'CAGR Calculator Online | InvestingFIRE',
    description:
      'Understand compound annual growth rate calculator CAGR inputs and test annual growth assumptions with the InvestingFIRE calculator.',
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
    '@type': 'Article',
    headline: 'CAGR Calculator Online: Compound Annual Growth Rate for FIRE Planning',
    description:
      'A plain-English guide to compound annual growth rate and how to use CAGR assumptions in FIRE projections.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
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
    dateModified: new Date().toISOString(),
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <Script id="cagr-calculator-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(jsonLd)}
      </Script>

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

      <header className="mb-8">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          CAGR Calculator Online: <br />
          <span className="text-primary">Annualized Portfolio Growth for FIRE</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          This compound annual growth rate calculator CAGR guide explains the growth input behind FIRE
          projections and links straight into the InvestingFIRE calculator with a 7% annual growth
          assumption.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>What CAGR Measures</h2>
        <p>
          CAGR converts uneven portfolio growth into one steady annual rate. If a portfolio rises and
          falls over several years, CAGR answers: “what annual return would create the same ending
          balance if growth happened smoothly?”
        </p>

        <h2>Why CAGR Matters for FIRE</h2>
        <p>
          FIRE plans depend heavily on long-term compounding. A higher CAGR shortens the time needed to
          reach financial independence; a lower CAGR means more savings, more time, or a smaller monthly
          allowance. That is why calculator assumptions should be tested instead of treated as promises.
        </p>

        <h2>How to Use the CAGR Input</h2>
        <ol>
          <li>Start with a baseline growth rate such as 7% before inflation.</li>
          <li>Lower the rate to 5–6% for a conservative case.</li>
          <li>Raise it only for an optimistic case, then compare how your timeline changes.</li>
          <li>Switch to Monte Carlo mode to see how volatility affects the same average return.</li>
        </ol>

        <div className="bg-primary/5 my-12 rounded-2xl border p-8 text-center">
          <h3 className="mt-0 text-2xl font-bold">Test CAGR in the FIRE calculator</h3>
          <p className="mb-6 text-lg">
            Use the calculator with CAGR set to 7%, then adjust growth, inflation, savings, and
            retirement age to compare scenarios.
          </p>
          <Link href="/?cagr=7&simulationMode=monte-carlo&autoCalculate=true">
            <Button size="lg" className="text-lg font-bold">
              Open CAGR Calculator →
            </Button>
          </Link>
        </div>

        <FaqSection faqs={faqs} title="CAGR Calculator FAQ" />

        <AuthorBio />
      </div>
    </article>
  );
}
