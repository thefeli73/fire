import Link from 'next/link';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { AuthorBio } from '@/app/components/AuthorBio';
import { FaqSection, type FaqItem } from '@/app/components/FaqSection';
import type { Metadata } from 'next';

const currentYear = new Date().getFullYear();

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

export const metadata: Metadata = {
  title: `Safe Withdrawal Rate Calculator & ${currentYear} Matrix | InvestingFIRE`,
  description:
    'Compare safe withdrawal rates for 30, 40, 50, and 60-year retirements, then test your own FIRE plan with a Monte Carlo calculator.',
  alternates: {
    canonical: 'https://investingfire.com/learn/safe-withdrawal-rate-matrix',
  },
  openGraph: {
    title: `Safe Withdrawal Rate Calculator & ${currentYear} Matrix | InvestingFIRE`,
    description:
      'Compare safe withdrawal rates for 30, 40, 50, and 60-year retirements, then test your own FIRE plan with a Monte Carlo calculator.',
    type: 'article',
    siteName: 'InvestingFIRE',
    url: 'https://investingfire.com/learn/safe-withdrawal-rate-matrix',
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

export default function SwrMatrixPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Safe Withdrawal Rates in ${currentYear}: The 30, 40, 50, and 60-Year Matrix`,
    description:
      'Extended-horizon safe withdrawal rate planning for 30, 40, 50, and 60-year retirement timelines.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://investingfire.com/learn/safe-withdrawal-rate-matrix',
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
    datePublished: '2025-02-15',
    dateModified: new Date().toISOString(),
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <Script id="swr-matrix-jsonld" type="application/ld+json" strategy="beforeInteractive">
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
        <span className="text-foreground">SWR Matrix</span>
      </nav>

      <header className="mb-8">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Safe Withdrawal Rates in {currentYear}: <br />
          <span className="text-primary">The 30, 40, 50, and 60-Year Matrix</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Compare 30, 40, 50, and 60-year retirement horizons before you trust a rule of thumb. These
          numbers are years in retirement, not your age.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>The SWR Success Matrix</h2>
        <p>
          Start with the table. If your retirement could run 50-60 years, the classic 4% rule carries
          more risk than the original 30-year framing suggests.
        </p>
        <p className="text-muted-foreground text-sm">
          30/40/50/60 columns are retirement horizons, not ages; cells show modeled success rates (%).
          The original Trinity Study tested 15-, 20-, 25-, and 30-year periods from 1926-1995, not
          40-60-year retirements.
        </p>

        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="text-muted-foreground mb-3 text-left text-sm">
              Success rate by withdrawal rate and retirement horizon.
            </caption>
            <thead>
              <tr className="bg-muted border-b">
                <th className="p-4 font-bold">Withdrawal Rate</th>
                <th className="p-4 font-bold">30-year retirement</th>
                <th className="p-4 font-bold">40-year retirement</th>
                <th className="p-4 font-bold">50-year retirement</th>
                <th className="p-4 font-bold">60-year retirement</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium">3.0%</td>
                <td className="p-4 text-green-600 dark:text-green-400">100%</td>
                <td className="p-4 text-green-600 dark:text-green-400">100%</td>
                <td className="p-4 text-green-600 dark:text-green-400">100%</td>
                <td className="p-4 text-green-600 dark:text-green-400">100%</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">3.5%</td>
                <td className="p-4 text-green-600 dark:text-green-400">100%</td>
                <td className="p-4 text-green-600 dark:text-green-400">99%</td>
                <td className="p-4 text-green-600 dark:text-green-400">98%</td>
                <td className="p-4 text-green-600 dark:text-green-400">97%</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">4.0%</td>
                <td className="p-4 text-green-600 dark:text-green-400">95%</td>
                <td className="p-4">89%</td>
                <td className="p-4">85%</td>
                <td className="p-4">82%</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">4.5%</td>
                <td className="p-4">86%</td>
                <td className="p-4">78%</td>
                <td className="p-4">72%</td>
                <td className="p-4">68%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Why 30 Years Isn&apos;t Enough</h2>
        <p>
          The popular 4% framing is rooted in traditional retirement planning and the Trinity
          Study&apos;s maximum 30-year payout period. In that study&apos;s CPI-adjusted results, a 50%
          stock/50% bond portfolio using a 4% initial withdrawal succeeded in 95% of overlapping
          30-year periods. If you are part of the FIRE (Financial Independence, Early Retirement)
          movement and retire at 35 or 45, you may need your portfolio to last 50 or even 60 years.
        </p>
        <p>
          Over these extended timelines, the failure rate of a 4% withdrawal increases significantly.
          Small differences in your initial withdrawal rate can be the difference between a growing nest
          egg and a depleted portfolio.
        </p>
        <h2>Key Insights for Early Retirees</h2>
        <ul>
          <li>
            <strong>The 3.5% &quot;Safe Haven&quot;:</strong> For those looking for near-certainty over a
            50-year horizon, 3.5% leaves more margin than 4% in this extended-horizon model.
          </li>
          <li>
            <strong>The 4% Risk:</strong> While 4% is often cited as safe for 30-year planning, it carries
            an ~18% failure risk over 60 years in this model. This is why many FIRE practitioners
            use &quot;guardrails&quot; to adjust spending during market downturns.
          </li>
          <li>
            <strong>Sequence of Returns:</strong> The biggest threat to a 50-year retirement isn&apos;t
            the average return, but the returns in the first 5-10 years.
          </li>
        </ul>

        <div className="bg-primary/5 my-12 rounded-2xl border p-8 text-center">
          <h3 className="mt-0 text-2xl font-bold">Test Your Own Numbers</h3>
          <p className="mb-6 text-lg">
            Don&apos;t rely on averages. Test your withdrawal rate against market volatility and see how
            your portfolio holds up across thousands of Monte Carlo runs.
          </p>
          <Link href="/?simulationMode=monte-carlo&withdrawalPercentage=3.5">
            <Button size="lg" className="text-lg font-bold">
              Run the Monte Carlo Calculator →
            </Button>
          </Link>
        </div>

        <FaqSection faqs={faqs} title="Safe Withdrawal Rate Matrix FAQ" className="my-12" />

        <AuthorBio />
      </div>
    </article>
  );
}
