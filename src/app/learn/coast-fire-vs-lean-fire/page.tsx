import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CoastFireChart } from '@/app/components/charts/CoastFireChart';
import { AuthorBio } from '@/app/components/AuthorBio';

export const metadata = {
  title: `Coast FIRE vs. Lean FIRE: Which Strategy Is Right For You? (${new Date().getFullYear().toString()})`,
  description:
    'Compare Coast FIRE (front-loading savings) with Lean FIRE (minimalist living). See the math, pros, cons, and find your path to freedom.',
  openGraph: {
    title: 'Coast FIRE vs. Lean FIRE: The Ultimate Comparison',
    description:
      "Don't just retire early—retire smarter. We break down the two most popular alternative FIRE strategies.",
    type: 'article',
    url: 'https://investingfire.com/learn/coast-fire-vs-lean-fire',
  },
};

export default function CoastVsLeanPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Coast FIRE vs. Lean FIRE: Which Strategy Is Right For You?',
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
    datePublished: '2025-01-20',
    description:
      'Compare Coast FIRE vs Lean FIRE strategies to find your best path to financial independence.',
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
        <span className="text-foreground">Coast vs. Lean FIRE</span>
      </nav>

      <header className="mb-10">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Coast FIRE vs. Lean FIRE <br />
          <span className="text-primary">Choosing Your Path to Freedom</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Traditional FIRE requires a massive nest egg. But what if you could retire sooner by tweaking
          the variables? Enter <strong>Coast FIRE</strong> and <strong>Lean FIRE</strong>—two powerful
          strategies for those who want freedom without the wait.
        </p>
      </header>

      <div className="max-w-none">
        <h2>The Quick Summary</h2>
        <p>Not sure which one fits you? Here is the high-level breakdown:</p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">🏖️ Coast FIRE</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mt-0 list-disc space-y-2 pl-4">
                <li>
                  <strong>Goal:</strong> Save enough <em>early</em> so compound interest covers your
                  retirement.
                </li>
                <li>
                  <strong>Lifestyle:</strong> Work to cover <em>current</em> expenses only.
                </li>
                <li>
                  <strong>Best For:</strong> Young professionals with high savings rates who want to
                  &quot;downshift&quot; careers later.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">🌱 Lean FIRE</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mt-0 list-disc space-y-2 pl-4">
                <li>
                  <strong>Goal:</strong> Retire completely on a smaller budget (e.g., $30k-$40k/year).
                </li>
                <li>
                  <strong>Lifestyle:</strong> Minimalist, frugal, simple living.
                </li>
                <li>
                  <strong>Best For:</strong> People who hate their jobs and value time over luxury.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="mt-12">Deep Dive: Coast FIRE</h2>
        <p>
          <strong>Coast FIRE</strong> is about reaching a &quot;tipping point&quot; where you no longer
          need to contribute to your retirement accounts. Your existing investments, left alone to
          compound for 10-20 years, will grow into a full retirement fund.
        </p>
        <p>
          Once you hit your Coast number, you only need to earn enough money to pay your monthly bills.
          This opens the door to:
        </p>
        <ul>
          <li>Switching to a lower-stress job</li>
          <li>Working part-time</li>
          <li>Taking sabbaticals</li>
        </ul>

        <div className="my-8">
          <CoastFireChart />
        </div>

        <h2 className="mt-12">Deep Dive: Lean FIRE</h2>
        <p>
          <strong>Lean FIRE</strong> attacks the equation from the expense side. By drastically lowering
          your cost of living, you lower your required FIRE number.
        </p>
        <p>
          If you can live happily on $35,000 a year, you &quot;only&quot; need $875,000 to retire (based
          on the 4% rule). Compare that to a &quot;Fat FIRE&quot; lifestyle spending $100,000, which
          requires $2.5 million. Lean FIRE is the fastest path out of the workforce, but it requires
          discipline.
        </p>

        <Separator className="my-16" />

        <h2>Run The Numbers</h2>
        <p>The best way to decide is to see the math. Use our calculator to simulate both scenarios:</p>
        <ol>
          <li>
            <strong>For Coast FIRE:</strong> Input your current age and a &quot;Coast Age&quot; (e.g.,
            35). See if your current balance grows enough by age 60 without adding more.
          </li>
          <li>
            <strong>For Lean FIRE:</strong> Lower your &quot;Desired Monthly Allowance&quot; to a
            minimalist level and see how fast you reach freedom.
          </li>
        </ol>

        <div className="my-10 text-center">
          <Link href="/">
            <Button size="lg" className="text-lg">
              Compare Strategies with the Calculator →
            </Button>
          </Link>
        </div>

        <h2>Which Should You Choose?</h2>
        <p>
          You don&apos;t have to pick one today. Many people start with a <strong>Lean FIRE</strong>{' '}
          mindset to save aggressively, then transition to <strong>Coast FIRE</strong> once they have a
          safety net, allowing them to enjoy their 30s and 40s more.
        </p>
        <p>
          The most important step is to just <strong>start</strong>.
        </p>

        <AuthorBio />
      </div>
    </article>
  );
}
