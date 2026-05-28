import Link from 'next/link';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { FourPercentRuleChart } from '@/app/components/charts/FourPercentRuleChart';
import { AuthorBio } from '@/app/components/AuthorBio';
import { FaqSection, type FaqItem } from '@/app/components/FaqSection';
import type { Metadata } from 'next';

const currentYear = new Date().getFullYear();

const faqs: FaqItem[] = [
  {
    question: 'What is the 4% rule and where does it come from?',
    answer:
      'The 4% rule was popularized by historical withdrawal-rate research, including the Trinity Study (1998). In the Trinity Study, a 50% stock/50% bond portfolio with a 4% initial withdrawal, adjusted annually for inflation or deflation, survived 95% of overlapping 30-year periods from 1926-1995.',
  },
  {
    question: 'Is the 4% rule still safe for FIRE?',
    answer:
      'For early retirees with 40-50+ year horizons, 4% can be aggressive. Many planners test a lower withdrawal rate in a Monte Carlo calculator, such as 3.25% to 3.5%, because the original Trinity Study focused on payout periods up to 30 years.',
  },
  {
    question: 'What withdrawal rate lasts 50 years?',
    answer:
      'No withdrawal rate is guaranteed, but extended FIRE retirements often need more conservative starting rates than a traditional 30-year retirement. A 3.25% to 3.5% starting point gives more margin before you test the plan against your own assumptions.',
  },
  {
    question: 'What is sequence of returns risk?',
    answer:
      'Sequence of returns risk is the danger of experiencing poor market returns early in retirement. If you withdraw from a declining portfolio, you sell more shares to maintain income, leaving less to recover when markets rebound. This can deplete your portfolio even if long-term average returns are good.',
  },
  {
    question: 'Should I withdraw 4% of my current balance each year?',
    answer:
      'No. The 4% rule uses your initial retirement portfolio value. You withdraw 4% of that starting amount, then increase it by inflation each year—regardless of market performance. Some prefer percentage-of-portfolio strategies, which adjust spending to market conditions.',
  },
  {
    question: 'What is the guardrails withdrawal strategy?',
    answer:
      'The guardrails approach sets upper and lower bounds on spending. If your portfolio drops significantly, you reduce withdrawals (skip discretionary spending). If it grows substantially, you give yourself a raise. This flexibility dramatically improves portfolio survival rates.',
  },
  {
    question: 'How does inflation affect the 4% rule?',
    answer:
      'Inflation is built into the 4% rule—you increase withdrawals by the inflation rate each year to maintain purchasing power. However, periods of unexpectedly high inflation (like recent years) can stress portfolios more than historical averages suggest.',
  },
];

export const metadata: Metadata = {
  title: `4% Rule in ${currentYear}: Safe Withdrawal Rate Calculator | InvestingFIRE`,
  description:
    'Compare 4% vs 3.5%, understand sequence-of-returns risk, and test safer retirement scenarios with Monte Carlo.',
  alternates: {
    canonical: 'https://investingfire.com/learn/safe-withdrawal-rate-4-percent-rule',
  },
  openGraph: {
    title: `4% Rule in ${currentYear}: Safe Withdrawal Rate Calculator | InvestingFIRE`,
    description:
      'Compare 4% vs 3.5%, understand sequence-of-returns risk, and test safer retirement scenarios with Monte Carlo.',
    type: 'article',
    siteName: 'InvestingFIRE',
    url: 'https://investingfire.com/learn/safe-withdrawal-rate-4-percent-rule',
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

export default function SafeWithdrawalPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Safe Withdrawal Rate: Is the 4% Rule Still Safe?',
    description:
      'Compare 4% vs 3.5%, understand sequence-of-returns risk, and test safer retirement scenarios with Monte Carlo.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://investingfire.com/learn/safe-withdrawal-rate-4-percent-rule',
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
    datePublished: '2025-01-15',
    dateModified: new Date().toISOString(),
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <Script id="safe-withdrawal-jsonld" type="application/ld+json" strategy="beforeInteractive">
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
        <span className="text-foreground">Safe Withdrawal Rates</span>
      </nav>

      <header className="mb-10">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Safe Withdrawal Rate: <br />
          <span className="text-primary">Is the 4% Rule Still Safe?</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          The &quot;4% Rule&quot; is the bedrock of the FIRE movement. The Trinity Study tested
          how withdrawal rates held up across historical 15- to 30-year retirements. Does that
          evidence still hold up for modern FIRE timelines?
        </p>
      </header>

      <div className="max-w-none">
        <h2>What is the 4% Rule?</h2>
        <p>
          The rule was popularized by historical withdrawal-rate research, including the{' '}
          <a
            href="https://www.aaii.com/files/pdf/6794_retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            Trinity Study
          </a>{' '}
          (1998), which looked at historical stock/bond portfolios to see how often they would last
          for 15, 20, 25, or 30 years at different withdrawal rates.
        </p>
        <p>
          In the CPI-adjusted table, a portfolio of 50% stocks and 50% bonds survived{' '}
          <strong>95% of the time</strong> over overlapping 30-year periods from 1926-1995 when
          the retiree withdrew 4% of the initial balance, then adjusted the withdrawal amount for
          inflation or deflation each year.
        </p>

        <Alert className="my-6">
          <Info className="size-4" />
          <AlertTitle>Key Distinction</AlertTitle>
          <AlertDescription>
            <span>
              The 4% is based on your <span className="italic">initial</span> portfolio value. If you
              start with 1M, you withdraw 40k. In year 2, if inflation was 3%, you withdraw
              41,200—regardless of whether the market is up or down.
            </span>
          </AlertDescription>
        </Alert>

        <div className="my-8">
          <FourPercentRuleChart />
        </div>

        <h2>The Problem with 4% in {currentYear}</h2>
        <p>
          While 4% worked historically, many experts argue it might be too aggressive for early retirees
          today. Why?
        </p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Longer Horizons:</strong> The Trinity Study tested payout periods up to 30 years. If
            you retire at 35, you might need your money to last 50 or 60 years.
          </li>
          <li>
            <strong>Valuations:</strong> When stock market valuations (CAPE ratios) are high, future
            returns tend to be lower.
          </li>
          <li>
            <strong>Sequence of Returns Risk:</strong> If the market crashes right after you retire (like
            in 2000 or 2008), depleting your portfolio early can make it impossible to recover, even if
            the market rebounds later.
          </li>
        </ul>

        <h2>Better Alternatives: Variable Withdrawal Rates</h2>
        <p>
          Instead of a rigid &quot;blind&quot; withdrawal, modern FIRE strategies suggest being dynamic.
        </p>
        <h3>1. The &quot;Guardrails&quot; Approach</h3>
        <p>
          If the market drops significantly, you cut your spending (e.g., skip the vacation, eat out
          less). If the market booms, you give yourself a raise. This flexibility massively increases
          your portfolio&apos;s success rate.
        </p>

        <h3>2. Lower the Initial Rate</h3>
        <p>
          Many cautious early retirees target a <strong>3.25% to 3.5%</strong> withdrawal rate. This
          leaves more room for long timelines, bad early returns, and future returns that may not look
          like the 1926-1995 backtest. No withdrawal rate guarantees success.
        </p>

        <h2>Simulate Your Safe Rate</h2>
        <p>
          Reading about it is one thing; seeing it is another. We&apos;ve built these scenarios directly
          into our calculator.
        </p>
        <p>
          Go to the calculator, expand the advanced options (or check the &quot;Simulation Mode&quot; if
          available), and switch between &quot;Deterministic&quot; (Fixed return) and &quot;Monte
          Carlo&quot; (Randomized) to see how volatility impacts your success chance.
        </p>

        <div className="my-8 text-center">
          <Link href="/?simulationMode=monte-carlo">
            <Button size="lg" variant="secondary" className="text-lg">
              Run Monte Carlo Simulation →
            </Button>
          </Link>
        </div>

        <h2>Conclusion</h2>
        <p>
          The 4% rule is a fantastic rule of thumb for planning, but a dangerous rule of law for
          execution. Use it to set your savings target, but remain flexible once you actually pull the
          trigger on retirement.
        </p>

        <FaqSection faqs={faqs} className="my-12" />

        <AuthorBio />
      </div>
    </article>
  );
}
