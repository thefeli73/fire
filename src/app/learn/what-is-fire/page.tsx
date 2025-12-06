import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FireFlowchart } from '@/app/components/charts/FireFlowchart';
import { AuthorBio } from '@/app/components/AuthorBio';

export const metadata = {
  title: `What is FIRE? The Ultimate Guide to Financial Independence (${new Date().getFullYear().toString()})`,
  description:
    'Discover the FIRE movement (Financial Independence, Retire Early). Learn how to calculate your FIRE number, savings rate, and retire decades ahead of schedule.',
  openGraph: {
    title: 'What is FIRE? The Ultimate Guide to Financial Independence',
    description: 'Stop trading time for money. The comprehensive guide to regaining your freedom.',
    type: 'article',
    url: 'https://investingfire.com/learn/what-is-fire',
  },
};

export default function WhatIsFirePage() {
  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What is FIRE? The Ultimate Guide to Financial Independence',
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
    datePublished: '2025-01-15',
    description:
      'Discover the FIRE movement. Learn how to calculate your FIRE number, savings rate, and retire decades ahead of schedule.',
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="text-muted-foreground mb-6 text-sm">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/learn" className="hover:text-primary">
          Learn
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">What is FIRE?</span>
      </nav>

      <header className="mb-10">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          What Is FIRE? <br />
          <span className="text-primary">The Modern Guide to Financial Freedom</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          FIRE stands for <strong>Financial Independence, Retire Early</strong>. It’s not just about
          quitting your job—it’s about reaching a point where work is optional, and your assets generate
          enough income to cover your lifestyle forever.
        </p>
      </header>

      <div className="max-w-none">
        <p>
          Imagine waking up on a Monday morning without an alarm clock. You don&apos;t have to rush to a
          commute, sit in traffic, or answer to a boss. Instead, you have the ultimate luxury:{' '}
          <strong>ownership of your time</strong>.
        </p>

        <div className="bg-card my-8 rounded-lg border p-6 shadow-sm">
          <h3 className="mt-0 text-xl font-semibold">💡 The Core Equation</h3>
          <p className="mb-4">
            FIRE isn&apos;t magic; it&apos;s math. The speed at which you can retire depends on one
            primary variable: <strong>Your Savings Rate</strong>.
          </p>
          <p className="mb-0">
            <span className="text-primary font-mono">
              High Income - Low Expenses = High Savings = Freedom
            </span>
          </p>
        </div>

        <div className="my-8">
          <FireFlowchart />
        </div>

        <h2>The 3 Pillars of FIRE</h2>
        <p>To achieve financial independence, you need to optimize three levers:</p>

        <ol className="mb-8 list-inside list-decimal space-y-2">
          <li>
            <strong>Spend Less (Frugality):</strong> Cutting unnecessary costs is the most powerful lever
            because it has a double effect: it increases your savings <em>and</em> lowers the amount you
            need to save forever.
          </li>
          <li>
            <strong>Earn More (Income):</strong> There is a floor to how much you can cut, but no ceiling
            to how much you can earn. Side hustles, career growth, and upskilling are key.
          </li>
          <li>
            <strong>Invest Wisely (Growth):</strong> Your money must work for you. Low-cost index funds
            (like VTSAX) are the vehicle of choice for the FIRE community due to their diversification
            and low fees.
          </li>
        </ol>

        <h2>What is &quot;The Number&quot;?</h2>
        <p>
          Your <strong>FIRE Number</strong> is the net worth you need to retire. The most common rule of
          thumb is the <strong>Rule of 25</strong>:
        </p>
        <blockquote>
          <p className="text-foreground text-xl font-medium not-italic">
            Annual Expenses × 25 = FIRE Number
          </p>
        </blockquote>
        <p>
          For example, if you spend <strong>$40,000</strong> per year, you need{' '}
          <strong>$1,000,000</strong> invested. This is based on the <em>4% Rule</em>, which suggests you
          can withdraw 4% of your portfolio in the first year of retirement (adjusted for inflation
          thereafter) with a high probability of not running out of money.
        </p>

        <div className="my-8 text-center">
          <Link href="/">
            <Button size="lg" className="text-lg">
              Calculate Your FIRE Number Now →
            </Button>
          </Link>
        </div>

        <h2>Types of FIRE</h2>
        <p>FIRE isn&apos;t one-size-fits-all. Over the years, several variations have emerged:</p>
        <ul>
          <li>
            <strong>Lean FIRE:</strong> Retiring on a budget (e.g., less than $40k/year). Great for
            minimalists.
          </li>
          <li>
            <strong>Fat FIRE:</strong> Retiring with abundance (e.g., $100k+/year). Requires a larger
            nest egg but offers a luxurious lifestyle.
          </li>
          <li>
            <strong>Barista FIRE:</strong> Reaching a portfolio size where you still work part-time
            (perhaps as a barista) for benefits or extra cash, reducing withdrawal pressure.
          </li>
          <li>
            <strong>Coast FIRE:</strong> Saving enough early on so that compound interest alone will hit
            your retirement target by age 65, allowing you to stop saving and just cover expenses.
          </li>
        </ul>

        <h2>Why {new Date().getFullYear().toString()} Changes Things</h2>
        <p>
          In {new Date().getFullYear().toString()}, we face unique challenges: higher inflation than the
          previous decade and potentially lower future stock market returns. This makes{' '}
          <strong>flexibility</strong> essential.
        </p>
        <p>
          Static calculators often fail to capture this nuance. That&apos;s why{' '}
          <Link href="/" className="text-primary hover:underline">
            InvestingFIRE.com
          </Link>{' '}
          allows you to adjust inflation assumptions and growth rates dynamically, helping you
          stress-test your plan against modern economic reality.
        </p>

        <h2>Conclusion</h2>
        <p>
          FIRE is more than a financial goal; it&apos;s a lifestyle design choice. It asks the question:{' '}
          <em>&quot;What would you do if money were no object?&quot;</em>
        </p>
        <p>
          Start by tracking your expenses, calculating your savings rate, and running your numbers. The
          best time to plant a tree was 20 years ago. The second best time is today.
        </p>

        <AuthorBio />
      </div>
    </article>
  );
}
