import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { AuthorBio } from '@/app/components/AuthorBio';
import { FaqSection, type FaqItem } from '@/app/components/FaqSection';
import type { Metadata } from 'next';

const faqs: FaqItem[] = [
  {
    question: 'How much of my portfolio should be domestic?',
    answer:
      'A common approach is market-cap weighting globally (roughly 55–60% US, 40–45% international today). Some investors keep 10–30% home tilt for currency needs, but large overweights increase concentration risk.',
  },
  {
    question: 'Does currency hedging remove home bias?',
    answer:
      'No. Hedging manages currency volatility but does not reduce country/sector concentration. Home bias is about overweighting domestic equities relative to their global weight.',
  },
  {
    question: 'Are there times when a home tilt makes sense?',
    answer:
      'Yes. If you have future liabilities in local currency (housing, tuition) or you want to simplify taxes, a modest tilt can be justified. Keep it intentional and sized.',
  },
  {
    question: 'What about emerging markets?',
    answer:
      'Global indexes already include emerging markets (EM). Adding a small EM tilt is optional; avoid excluding EM entirely to prevent regional concentration.',
  },
  {
    question: 'How do I reduce home bias in practice?',
    answer:
      'Replace single-country funds with global or All-World ETFs. Set an allocation policy (e.g., 80% global cap-weight, 20% local tilt) and rebalance to it instead of reacting to headlines.',
  },
];

export const metadata: Metadata = {
  title: 'Home Bias in Investing: Why It Matters and How to Fix It',
  description:
    'Home bias concentrates risk in one country. Learn why it happens, how it hurts returns, and simple steps to global diversification.',
  alternates: {
    canonical: 'https://investingfire.com/learn/home-bias-in-investing',
  },
  openGraph: {
    title: 'Home Bias in Investing: Why It Matters and How to Fix It',
    description: 'Reduce country concentration, improve diversification, and stay tax aware.',
    type: 'article',
    siteName: 'InvestingFIRE',
    url: 'https://investingfire.com/learn/home-bias-in-investing',
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

export default function HomeBiasPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Home Bias in Investing: Why It Matters and How to Fix It',
    author: {
      '@type': 'Organization',
      name: 'InvestingFIRE Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'InvestingFIRE',
      logo: {
        '@type': 'ImageObject',
        url: 'https://investingfire.com/apple-icon.png',
      },
    },
    datePublished: '2025-01-24',
    description:
      'Understand home bias, its risks, and practical steps to diversify globally while respecting local tax rules.',
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
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
        <span className="text-foreground">Home Bias</span>
      </nav>

      <header className="mb-10">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Home Bias: The Hidden Risk in Your Portfolio
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Overweighting your home market feels comfortable but concentrates risk. Here’s why it happens
          and how to diversify without creating tax headaches.
        </p>
      </header>

      <div className="max-w-none">
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Bias Check</AlertTitle>
          <AlertDescription>
            If your country is less than 10% of global market cap but more than 50% of your portfolio,
            you’re taking concentrated country and currency risk.
          </AlertDescription>
        </Alert>

        <h2>What is Home Bias?</h2>
        <p>
          Home bias is the tendency to hold a far larger share of domestic stocks than their global
          weight. Investors in the US, UK, Canada, Sweden, India, and Australia all exhibit this behavior
          despite different market sizes.
        </p>

        <h2>Why It Happens</h2>
        <ul className="mb-6 list-disc space-y-2 pl-5">
          <li>
            <strong>Familiarity:</strong> You know the brands and news cycle.
          </li>
          <li>
            <strong>Currency needs:</strong> You expect to spend in your local currency.
          </li>
          <li>
            <strong>Access & regulation:</strong> Some brokers limit foreign listings (PRIIPs/UCITS).
          </li>
          <li>
            <strong>Tax frictions:</strong> Forms, withholding tax, and paperwork discourage global
            exposure.
          </li>
        </ul>

        <h2 className="mt-16">Why It’s Risky</h2>
        <ul className="mb-6 list-disc space-y-2 pl-5">
          <li>
            Country/sector concentration (e.g., US tech, Canadian financials/energy, Swedish industrials)
          </li>
          <li>Currency risk without diversification benefits</li>
          <li>Policy and regulatory risk (capital controls, tax changes)</li>
          <li>Missed growth in other regions and sectors</li>
        </ul>

        <h2 className="mt-16">Fixing Home Bias (Practical Steps)</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Measure: compare your country weight to global cap weights (ACWI/FTSE All-World).</li>
          <li>Adopt a global core: one All-World ETF (VWCE, VT, VWRA, DHHF) or IWDA+EMIM combo.</li>
          <li>Set a deliberate tilt: e.g., 20% home, 80% global. Rebalance to policy, not headlines.</li>
          <li>
            Match currency to liabilities: keep cash for near-term local spending; hedge bonds where
            available.
          </li>
          <li>Use local wrappers to handle tax but hold global funds inside them when allowed.</li>
        </ol>

        <h2 className="mt-16">Tax & Wrapper Considerations</h2>
        <p>
          You can stay globally diversified while using local tax shelters. The key is picking the right
          share class and domicile:
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-5">
          <li>
            US: Avoid PFICs; prefer US-domiciled ETFs in IRAs/401k. Consider foreign tax credits in
            taxable.
          </li>
          <li>
            UK/EU: UCITS ETFs (PRIIPs compliant). Accumulating classes reduce admin in many systems.
          </li>
          <li>Canada: US-domiciled ETFs in RRSP may reduce withholding; TFSA does not.</li>
          <li>
            Sweden: ISK/KF simplify reporting; IE-domiciled ETFs help withholding compared to
            US-domiciled.
          </li>
          <li>
            Australia/NZ: Use Super for tax efficiency; outside, consider broad local + global ETFs.
          </li>
        </ul>

        <h2 className="mt-16">Evidence & Further Reading</h2>
        <ul className="mb-6 list-disc space-y-2 pl-5">
          <li>
            MSCI,&quot;The Home Bias Effect in Global Portfolios&quot; —{' '}
            <Link
              href="https://www.msci.com/research-and-insights/quick-take/did-home-bias-help"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MSCI
            </Link>
          </li>
          <li>
            Vanguard Research,&quot;Global equity investing: The benefits of diversification&quot; —{' '}
            <Link
              href="https://www.vanguardmexico.com/content/dam/intl/americas/documents/mexico/en/global-equity-investing-diversification-sizing.pdf"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vanguard
            </Link>
          </li>
          <li>
            Sercu &amp; Vanpee (2012),&quot;The home bias puzzle in equity portfolios&quot; —{' '}
            <Link
              href="https://doi.org/10.1093/acprof:oso/9780199754656.003.0015"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Oxford University Press
            </Link>
          </li>
          <li>
            Fisher, Shah &amp; Titman (2017),&quot;Should you tilt your equity portfolio to smaller
            countries?&quot; —{' '}
            <Link
              href="https://doi.org/10.3905/jpm.2017.44.1.127"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Journal of Portfolio Management
            </Link>
          </li>
          <li>
            Attig &amp; Sy (2023), &quot;Diversification during hard times&quot; —{' '}
            <Link
              href="https://doi.org/10.1080/0015198X.2022.2160620"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Financial Analysts Journal
            </Link>
          </li>
          <li>
            Blanchett (2021),&quot;Foreign revenue: A new world of risk exposures&quot; —{' '}
            <Link
              href="https://doi.org/10.3905/jpm.2021.1.237"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Journal of Portfolio Management
            </Link>
          </li>
          <li>
            Anarkulova, Cederburg &amp; O’Doherty (2023),&quot;Beyond the status quo: A critical
            assessment of lifecycle investment advice&quot; —{' '}
            <Link
              href="https://doi.org/10.2139/ssrn.4590406"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SSRN
            </Link>
          </li>
          <li>
            Goetzmann (2004),&quot;Will history rhyme?&quot; —{' '}
            <Link
              href="https://doi.org/10.3905/jpm.2004.442619"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Journal of Portfolio Management
            </Link>
          </li>
          <li>
            Ritter (2012),&quot;Is economic growth good for investors?&quot; —{' '}
            <Link
              href="https://doi.org/10.1111/j.1745-6622.2012.00385.x"
              className="text-primary hover:underline"
            >
              Journal of Applied Corporate Finance
            </Link>
          </li>
          <li>
            French (2022),&quot;Five things I know about investing&quot; —{' '}
            <Link
              href="https://www.dimensional.com/us-en/insights/five-things-i-know-about-investing"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dimensional
            </Link>
          </li>
          <li>
            Bryan (2018),&quot;World War 1 and global stock markets&quot; —{' '}
            <Link
              href="https://globalfinancialdata.com/world-war-1-and-global-stock-markets"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Global Financial Data
            </Link>
          </li>
          <li>
            Episode 200: Prof. Eugene Fama (2022) —{' '}
            <Link
              href="https://rationalreminder.ca/podcast/200"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rational Reminder Podcast
            </Link>
          </li>
          <li>
            Merton (1973),&quot;An intertemporal capital asset pricing model&quot; —{' '}
            <Link
              href="https://doi.org/10.2307/1913811"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Econometrica
            </Link>
          </li>
        </ul>

        <div className="my-10 grid gap-4 sm:grid-cols-2">
          <Link href="/learn/where-to-park-your-money">
            <Button size="lg" className="w-full text-lg">
              Build a Global Portfolio →
            </Button>
          </Link>
          <Link href="/learn/safe-withdrawal-rate-4-percent-rule">
            <Button size="lg" variant="secondary" className="w-full text-lg">
              Plan Withdrawals →
            </Button>
          </Link>
        </div>

        <FaqSection faqs={faqs} className="my-12" />

        <AuthorBio />
      </div>
    </article>
  );
}
