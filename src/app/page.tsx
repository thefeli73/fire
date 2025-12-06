import Image from 'next/image';
import FireCalculatorForm from './components/FireCalculatorForm';
import BackgroundPattern from './components/BackgroundPattern';
import { FaqSection, type FaqItem } from './components/FaqSection';
import { Testimonials } from './components/Testimonials';
import { extractCalculatorValuesFromSearch } from '@/lib/retire-at';

const faqs: FaqItem[] = [
  {
    question: 'What methodology does this calculator use?',
    answer:
      'We run a multi-year projection in two phases: 1. Accumulation: Your balance grows by CAGR and you add monthly savings. 2. Retirement: The balance continues compounding, but you withdraw an inflation-adjusted monthly allowance. The result: a precise estimate of the capital you\'ll have at retirement (your "FIRE Number") and how long it will last until your chosen life expectancy.',
  },
  {
    question: "Why isn't this just the 4% rule?",
    answer:
      "The 4% rule is a useful starting point (25x annual spending), but it assumes a fixed withdrawal rate with inflation adjustments and doesn't model ongoing savings or dynamic market returns. Our calculator simulates each year's growth, contributions, and inflation-indexed withdrawals to give you a tailored picture.",
  },
  {
    question: 'How do I choose a realistic growth rate?',
    answer:
      'Historically, a diversified portfolio of equities and bonds has returned around 7-10% per year before inflation. We recommend starting around 6-8% (net of fees), then running "what-if" scenarios—5% on the conservative side, 10% on the aggressive side—to see how they affect your timeline.',
  },
  {
    question: 'How does inflation factor into my FIRE Number?',
    answer:
      "Cost of living rises. To maintain today's lifestyle, your monthly allowance must grow each year by your inflation rate. This calculator automatically inflates your desired monthly spending and subtracts it from your portfolio during retirement, ensuring your FIRE Number keeps pace with rising expenses.",
  },
  {
    question: 'Can I really retire early with FIRE?',
    answer:
      'Early retirement is achievable with disciplined saving, smart investing, and realistic assumptions. This tool helps you set targets, visualize outcomes, and adjust inputs—so you can build confidence in your plan and make informed trade-offs between lifestyle, risk, and timeline.',
  },
  {
    question: 'How should I use this calculator effectively?',
    answer:
      'Start with your actual numbers (capital, savings, age). Set conservative - mid - aggressive growth rates to bound possibilities. Slide your retirement age to explore "early" vs. "traditional" scenarios. Review the chart—especially the reference lines—to see when you hit FI and how withdrawals impact your balance. Experiment with higher savings rates or lower target spending to accelerate your path.',
  },
];

export default async function HomePage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedParams = await searchParams;

  // Parse target age from params to seed defaults correctly (e.g. currentAge logic depends on it)
  const paramRetireAge = Array.isArray(resolvedParams.retirementAge)
    ? resolvedParams.retirementAge[0]
    : resolvedParams.retirementAge;

  const targetAge =
    paramRetireAge && !Number.isNaN(Number(paramRetireAge)) ? Number(paramRetireAge) : 55;

  const initialValues = extractCalculatorValuesFromSearch(resolvedParams, targetAge);

  return (
    <div className="from-background via-primary/10 to-secondary/10 text-foreground relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-gradient-to-b px-4 pt-6 pb-16">
      <BackgroundPattern />
      <div className="z-10 mx-auto flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex flex-row flex-wrap items-center justify-center gap-4 align-middle">
          <Image
            priority
            unoptimized
            src="/investingfire_logo_no-bg.svg"
            alt="InvestingFIRE Logo"
            width={100}
            height={100}
          />
          <h1 className="from-primary via-accent to-primary bg-linear-to-r bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-md sm:text-[5rem]">
            InvestingFIRE
          </h1>
        </div>
        <span className="bg-primary/15 text-primary rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase shadow-sm">
          100% free • built for educational use
        </span>
        <p className="text-foreground/90 text-xl font-semibold md:text-2xl">The #1 FIRE Calculator</p>
        <p className="text-foreground/80 max-w-2xl text-base text-balance md:text-lg">
          Plan your path to financial independence with transparent math—ad-free and built to teach you
          how FIRE works.
        </p>
        <div className="mt-8 w-full max-w-2xl">
          <FireCalculatorForm initialValues={initialValues} />
        </div>
      </div>

      <div className="z-10 mx-auto max-w-4xl px-4">
        <Testimonials />
      </div>

      {/* Added SEO Content Sections */}
      <div className="z-10 mx-auto max-w-2xl py-12 text-left">
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            What Is FIRE? Understanding Financial Independence and Early Retirement
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            FIRE stands for <strong>Financial Independence, Retire Early</strong>. It&apos;s a lifestyle
            movement built around two core ideas:
          </p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-lg">
            <li>
              <strong>Aggressive saving & investing</strong>—often 50%+ of income—so your capital grows
              rapidly.
            </li>
            <li>
              <strong>Passive-income coverage</strong>—when your investment returns exceed your living
              expenses, you gain freedom from a traditional 9-5.
            </li>
          </ul>
          <p className="text-lg leading-relaxed">
            By reaching your personal <em>FIRE Number</em>—the nest egg needed to cover your
            inflation-adjusted spending—you unlock the option to step away from a daily paycheck and
            pursue passion projects, travel, family, or anything else. This calculator helps you simulate
            your journey, estimate how much you need, and visualize both your accumulation phase and your
            retirement withdrawals over time.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            How This FIRE Calculator Provides Investing Insights
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            Our interactive tool goes beyond a simple&quot;25x annual spending&quot; rule. It runs a{' '}
            <strong>year-by-year simulation</strong> of your portfolio, combining:
          </p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-lg">
            <li>
              <strong>Starting Capital</strong>—your current invested balance
            </li>
            <li>
              <strong>Monthly Savings</strong>—ongoing contributions to your portfolio
            </li>
            <li>
              <strong>Expected Annual Growth Rate (CAGR)</strong>—compounding returns before inflation
            </li>
            <li>
              <strong>Annual Inflation Rate</strong>—to inflate your target withdrawal each year
            </li>
            <li>
              <strong>Desired Monthly Allowance</strong>—today&apos;s-value spending goal
            </li>
            <li>
              <strong>Retirement Age & Life Expectancy</strong>—defines your accumulation horizon and
              payout period
            </li>
          </ul>
          <p className="text-lg leading-relaxed">Key features:</p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-lg">
            <li>
              <strong>Real-time calculation</strong>—as you tweak any input, your FIRE Number and chart
              update instantly.
            </li>
            <li>
              <strong>Interactive chart</strong> with area plots for both <em>portfolio balance</em> and{' '}
              <em>inflation-adjusted allowance</em>, plus reference lines showing your retirement date
              and required FIRE Number.
            </li>
            <li>
              <strong>Custom simulation</strong>—switches from accumulation (adding savings) to
              retirement (withdrawing allowance), compounding each year based on your growth rate.
            </li>
          </ul>
          <p className="text-lg leading-relaxed">
            With this level of granularity, you can confidently experiment with savings rate, target
            retirement age, and investment assumptions to discover how small tweaks speed up or delay
            your path to financial independence.
          </p>
        </section>

        <FaqSection
          faqs={faqs}
          title="FIRE & Investing Frequently Asked Questions (FAQ)"
          className="mb-12"
        />

        {/* Optional: Add a section for relevant resources/links here */}
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">FIRE Journey & Investing Resources</h2>
          <p className="mb-6 text-lg leading-relaxed">
            Ready to deepen your knowledge and build a bullet-proof plan? Below are some of our favorite
            blogs, books, tools, and communities for financial independence and smart investing.
          </p>

          <div className="text-background bg-foreground my-8 rounded-md p-4 text-lg">
            <p className="font-semibold">Getting Started with FIRE:</p>
            <ol className="ml-6 list-decimal space-y-1">
              <li>Run your first projection above to find your target FIRE Number.</li>
              <li>Identify areas to boost savings or reduce expenses.</li>
              <li>Study index-fund strategies and low-cost investing advice.</li>
              <li>
                Join{' '}
                <a
                  href="https://www.reddit.com/r/Fire/"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  supportive communities like r/Fire
                </a>{' '}
                to learn from real journeys.
              </li>
            </ol>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xl font-semibold">Blogs & Websites</h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <a
                    href="https://www.mrmoneymustache.com/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Mr. Money Mustache
                  </a>{' '}
                  - Hardcore frugality & early retirement success stories.
                </li>
                <li>
                  <a
                    href="https://www.playingwithfire.co/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Playing With FIRE
                  </a>{' '}
                  - Community resources & real-life case studies.
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/Fire/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    r/Fire
                  </a>{' '}
                  - Active forum for questions, tips, and support.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">Books & Podcasts</h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <a
                    href="https://www.amazon.com/Your-Money-Life-Transforming-Relationship/dp/0143115766"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Your Money or Your Life
                  </a>{' '}
                  - The classic guide to aligning money with values.
                </li>
                <li>
                  <a
                    href="https://podcasts.apple.com/us/podcast/biggerpockets-money-podcast/id1330225136"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    BiggerPockets Money Podcast
                  </a>{' '}
                  - Interviews on FIRE strategies and wealth building.
                </li>
                <li>
                  <a
                    href="https://podcasts.apple.com/us/podcast/can-you-retire-now-this-fire-calculator-will-tell-you/id1330225136?i=1000683436292"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    InvestingFIRE Calculator Demo
                  </a>{' '}
                  - Deep dive on how interactive projections can guide your plan.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">Additional Calculators & Tools</h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <a href="https://ghostfol.io" target="_blank" className="text-primary hover:underline">
                    Ghostfolio
                  </a>{' '}
                  - Wealth management application for individuals.
                </li>
                <li>
                  <a
                    href="https://walletburst.com/tools/coast-fire-calculator/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Coast FIRE Calculator
                  </a>{' '}
                  - When you&quot;max out&quot; early contributions but let compounding do the rest.
                </li>
                <li>
                  <a
                    href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Compound Interest Calculator
                  </a>{' '}
                  - Explore the power of growth rates in isolation.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
