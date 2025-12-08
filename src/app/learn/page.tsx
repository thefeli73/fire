import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlurThing from '../components/blur-thing';
import { RETIRE_AT_AGE_PRESETS } from '@/lib/retire-at';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn FIRE | Financial Independence Guides & Resources',
  description:
    'Master the art of Financial Independence and Early Retirement. Deep dives into safe withdrawal rates, asset allocation, and FIRE strategies.',
  alternates: {
    canonical: 'https://investingfire.com/learn',
  },
  openGraph: {
    title: 'Learn FIRE | Financial Independence Guides & Resources',
    description:
      'Master the art of Financial Independence and Early Retirement. Deep dives into safe withdrawal rates, asset allocation, and FIRE strategies.',
    siteName: 'InvestingFIRE',
    url: 'https://investingfire.com/learn',
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

const retireAgeLinks = RETIRE_AT_AGE_PRESETS;

export default function LearnHubPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">FIRE Knowledge Base</h1>
        <p className="text-muted-foreground text-xl">
          Everything you need to know to leave the rat race behind.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Article 1 */}
        <Link href="/learn/what-is-fire" className="transition-transform hover:scale-[1.02]">
          <Card className="hover:border-primary/50 h-full cursor-pointer border-2 transition-all">
            <BlurThing />
            <CardHeader>
              <div className="mb-2">
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Beginner
                </span>
              </div>
              <CardTitle className="text-2xl">What is FIRE?</CardTitle>
              <CardDescription>
                The comprehensive guide to Financial Independence, Retire Early.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Understand the core philosophy, the math behind the movement, and how to start your
                journey today.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Article 2 */}
        <Link
          href="/learn/safe-withdrawal-rate-4-percent-rule"
          className="transition-transform hover:scale-[1.02]"
        >
          <Card className="hover:border-primary/50 h-full cursor-pointer border-2">
            <CardHeader>
              <div className="mb-2">
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  Strategy
                </span>
              </div>
              <CardTitle className="text-2xl">The 4% Rule Explained</CardTitle>
              <CardDescription>
                Is it still safe in {new Date().getFullYear().toString()}? A data-driven look at
                withdrawal rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Dive into the Trinity Study, sequence of returns risk, and how to bulletproof your
                retirement income.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Article 3 */}
        <Link href="/learn/coast-fire-vs-lean-fire" className="transition-transform hover:scale-[1.02]">
          <Card className="hover:border-primary/50 h-full cursor-pointer border-2">
            <CardHeader>
              <div className="mb-2">
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  Comparison
                </span>
              </div>
              <CardTitle className="text-2xl">Coast FIRE vs. Lean FIRE</CardTitle>
              <CardDescription>Which strategy fits your lifestyle?</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Comparing different flavors of financial independence to find your perfect fit.
                Front-load your savings or minimize your expenses?
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Article 4 */}
        <Link href="/learn/where-to-park-your-money" className="transition-transform hover:scale-[1.02]">
          <Card className="hover:border-primary/50 h-full cursor-pointer border-2">
            <CardHeader>
              <div className="mb-2">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  Portfolio
                </span>
              </div>
              <CardTitle className="text-2xl">Where to Park Your Money</CardTitle>
              <CardDescription>
                Global, low-cost index strategies, tax wrappers, and broker tips for FIRE.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Build a world-allocation portfolio, avoid home bias, and choose the right accounts
                whether you&apos;re in the US, EU, UK, Canada, Australia, or elsewhere.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Article 5 */}
        <Link href="/learn/home-bias-in-investing" className="transition-transform hover:scale-[1.02]">
          <Card className="hover:border-primary/50 h-full cursor-pointer border-2">
            <CardHeader>
              <div className="mb-2">
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                  Risk
                </span>
              </div>
              <CardTitle className="text-2xl">Home Bias Explained</CardTitle>
              <CardDescription>Why country concentration hurts—and how to fix it.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Understand the hidden risks of overweighting your domestic market and learn practical
                steps to diversify globally without creating tax headaches.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-14 space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Retire By Age</h2>
          <p className="text-muted-foreground">
            See exactly how much you need to retire at different ages, backed by the calculator.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {retireAgeLinks.map((age) => (
            <Link
              key={age}
              href={`/learn/retire-at/${age.toString()}`}
              className="transition-transform hover:scale-[1.02]"
            >
              <Card className="hover:border-primary/50 h-full cursor-pointer border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Retire at {age}</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    How much to save, what to invest, and what to tweak for age {age}.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-muted mt-16 rounded-xl p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Ready to see the numbers?</h2>
        <p className="text-muted-foreground mb-6">
          Put theory into practice with our interactive projection tool.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          Launch Calculator
        </Link>
      </div>
    </div>
  );
}
