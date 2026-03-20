import Link from 'next/link';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { AuthorBio } from '@/app/components/AuthorBio';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safe Withdrawal Rates in 2026: The 30, 40, and 50-Year Matrix | InvestingFIRE',
  description:
    'Updated Trinity Study success rates for 40, 50, and 60-year retirement horizons. Find your safe withdrawal rate for early retirement.',
  alternates: {
    canonical: 'https://investingfire.com/learn/safe-withdrawal-rate-matrix',
  },
  openGraph: {
    title: 'Safe Withdrawal Rates in 2026: The 30, 40, and 50-Year Matrix | InvestingFIRE',
    description:
      'Updated Trinity Study success rates for 40, 50, and 60-year retirement horizons. Find your safe withdrawal rate for early retirement.',
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
    headline: 'Safe Withdrawal Rates in 2026: The 30, 40, and 50-Year Matrix',
    description:
      'Updated Trinity Study success rates for 40, 50, and 60-year retirement horizons. Find your safe withdrawal rate for early retirement.',
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

      <header className="mb-10">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Safe Withdrawal Rates in 2026: <br />
          <span className="text-primary">The 30, 40, and 50-Year Matrix</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          The original Trinity Study changed how we think about retirement. But for the FIRE community,
          30 years is just the beginning.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>Why 30 Years Isn&apos;t Enough</h2>
        <p>
          The &quot;4% Rule&quot; was designed for traditional retirees—people leaving the workforce at
          65 and planning for a 30-year horizon. If you are part of the FIRE (Financial Independence,
          Early Retirement) movement and retire at 35 or 45, you need your portfolio to last 50 or even
          60 years.
        </p>
        <p>
          Over these extended timelines, the failure rate of a 4% withdrawal increases significantly.
          Small differences in your initial withdrawal rate can be the difference between a growing nest
          egg and a depleted portfolio.
        </p>

        <h2>The SWR Success Matrix</h2>
        <p>
          Below is the updated matrix showing the historical success rates of various withdrawal rates
          across different time horizons. These figures assume a diversified portfolio (typically 75%
          stocks, 25% bonds) and inflation-adjusted withdrawals.
        </p>

        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-muted border-b">
                <th className="p-4 font-bold">Withdrawal Rate</th>
                <th className="p-4 font-bold">30 Years</th>
                <th className="p-4 font-bold">40 Years</th>
                <th className="p-4 font-bold">50 Years</th>
                <th className="p-4 font-bold">60 Years</th>
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

        <h2>Key Insights for Early Retirees</h2>
        <ul>
          <li>
            <strong>The 3.5% &quot;Safe Haven&quot;:</strong> For those looking for near-certainty over a
            50-year horizon, 3.5% has historically been the sweet spot.
          </li>
          <li>
            <strong>The 4% Risk:</strong> While 4% is often cited as safe, it carries an ~18% failure
            risk over 60 years. This is why many FIRE practitioners use &quot;guardrails&quot; to adjust
            spending during market downturns.
          </li>
          <li>
            <strong>Sequence of Returns:</strong> The biggest threat to a 50-year retirement isn&apos;t
            the average return, but the returns in the first 5-10 years.
          </li>
        </ul>

        <div className="bg-primary/5 my-12 rounded-2xl border p-8 text-center">
          <h3 className="mt-0 text-2xl font-bold">Test Your Own Numbers</h3>
          <p className="mb-6 text-lg">
            Don&apos;t rely on averages. Run your specific portfolio through every historical market
            cycle since 1871 using our advanced backtesting engine.
          </p>
          <Link href="/?simulationMode=historical">
            <Button size="lg" className="text-lg font-bold">
              Launch Historical Backtest Engine →
            </Button>
          </Link>
        </div>

        <AuthorBio />
      </div>
    </article>
  );
}
