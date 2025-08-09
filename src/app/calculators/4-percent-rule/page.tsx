import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BackgroundPattern from "@/app/components/BackgroundPattern";
import Footer from "@/app/components/footer";
import FourPercentRuleCalculator from "./FourPercentRuleCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "4% Rule Calculator - Safe Withdrawal Rate for FIRE | InvestingFIRE",
  description:
    "Calculate your safe withdrawal rate using the 4% rule. Determine how much you need to retire early and how long your retirement savings will last. Free FIRE calculator with real-time results.",
  keywords:
    "4 percent rule calculator, safe withdrawal rate calculator, 4% rule retirement, FIRE calculator, retirement withdrawal calculator, Trinity Study calculator",
  openGraph: {
    title: "4% Rule Calculator - Safe Withdrawal Rate Calculator",
    description:
      "Free 4% rule calculator to determine your safe withdrawal rate and retirement portfolio size. Based on the Trinity Study for FIRE planning.",
    type: "website",
    url: "https://investingfire.com/calculators/4-percent-rule",
  },
};

export default function FourPercentRulePage() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the 4% rule?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 4% rule is a retirement planning guideline that suggests you can safely withdraw 4% of your retirement portfolio in the first year, then adjust that amount for inflation each subsequent year, with a high probability of not running out of money over 30 years.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is the 4% rule?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 4% rule, based on the Trinity Study, showed a 95% success rate for a 30-year retirement with a 50/50 stock/bond portfolio. However, it's based on historical U.S. market data and may need adjustment for longer retirements, different asset allocations, or varying market conditions.",
        },
      },
      {
        "@type": "Question",
        name: "Is 4% too conservative or too aggressive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your situation. For early retirees with 40-50+ year horizons, 4% might be too aggressive. Some prefer 3-3.5%. Conversely, flexible spenders who can reduce withdrawals in down markets might safely use 4.5-5%. Personal factors like other income sources and spending flexibility matter.",
        },
      },
      {
        "@type": "Question",
        name: "How do I calculate my FIRE number using the 4% rule?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply multiply your annual expenses by 25. For example, if you need $40,000 per year, your FIRE number is $1,000,000 ($40,000 × 25). This gives you a portfolio where 4% equals your annual spending needs.",
        },
      },
    ],
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://investingfire.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        item: "https://investingfire.com/calculators",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "4% Rule Calculator",
        item: "https://investingfire.com/calculators/4-percent-rule",
      },
    ],
  };

  return (
    <main className="text-primary-foreground to-destructive from-secondary flex min-h-screen flex-col items-center bg-gradient-to-b p-2">
      <BackgroundPattern />

      {/* Header */}
      <div className="z-10 mx-auto flex flex-col items-center justify-center gap-4 text-center">
        <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-4 align-middle">
          <Link
            href="/"
            className="flex items-center gap-4 transition-opacity hover:opacity-90"
          >
            <Image
              priority
              unoptimized
              src="/investingfire_logo_no-bg.svg"
              alt="InvestingFIRE Logo"
              width={60}
              height={60}
            />
            <span className="text-2xl font-bold">InvestingFIRE</span>
          </Link>
        </div>

        <h1 className="from-primary via-primary-foreground to-primary mt-8 bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-md sm:text-[4rem]">
          4% Rule Calculator
        </h1>
        <p className="text-primary-foreground/90 max-w-2xl text-xl font-semibold md:text-2xl">
          Calculate Your Safe Withdrawal Rate & FIRE Number Using the Trinity
          Study Method
        </p>
      </div>

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      {/* Calculator */}
      <div className="z-10 mt-8 w-full max-w-4xl">
        <FourPercentRuleCalculator />
      </div>

      {/* SEO Content */}
      <div className="z-10 mx-auto max-w-4xl px-4 py-12 text-left">
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Understanding the 4% Rule for Safe Retirement Withdrawals
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            The <strong>4% rule</strong> is one of the most widely recognized
            guidelines in retirement planning, particularly within the FIRE
            (Financial Independence, Retire Early) community. This rule of thumb
            suggests you can withdraw 4% of your retirement portfolio in the
            first year of retirement, then adjust that dollar amount for
            inflation each subsequent year, with a high probability of not
            depleting your savings over a 30-year retirement period.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            Originating from the groundbreaking <strong>Trinity Study</strong>{" "}
            (1998), which analyzed historical market data from 1926-1995, the 4%
            rule demonstrated a 95% success rate for mixed portfolios of stocks
            and bonds over 30-year periods. This simple yet powerful concept
            revolutionized retirement planning by providing a clear target:
            accumulate 25 times your annual expenses to achieve financial
            independence.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            How the 4% Rule Calculator Works
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            Our 4% rule calculator helps you determine two critical numbers for
            your retirement planning:
          </p>
          <ol className="mb-6 ml-6 list-decimal space-y-3 text-lg">
            <li>
              <strong>Your FIRE Number</strong> - The total portfolio size
              needed to support your desired lifestyle using the 4% withdrawal
              rate
            </li>
            <li>
              <strong>Safe Annual Withdrawal</strong> - How much you can
              withdraw from a given portfolio size while maintaining the 4% rule
            </li>
          </ol>

          <div className="bg-foreground/10 mb-6 rounded-lg p-6">
            <h3 className="mb-3 text-xl font-semibold">
              Quick 4% Rule Formula:
            </h3>
            <p className="mb-2 text-lg">
              <strong>FIRE Number = Annual Expenses × 25</strong>
            </p>
            <p className="text-lg">
              <strong>Safe Annual Withdrawal = Portfolio Value × 0.04</strong>
            </p>
          </div>

          <p className="mb-4 text-lg leading-relaxed">
            For example, if you need $50,000 per year to cover your expenses,
            your FIRE number would be $1,250,000 ($50,000 × 25). Conversely, if
            you have a $2,000,000 portfolio, you could safely withdraw $80,000
            in the first year (2,000,000 × 0.04).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Adjusting the 4% Rule for Your Situation
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            While the 4% rule provides an excellent starting point, many
            financial experts suggest adjustments based on individual
            circumstances:
          </p>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-3 text-xl font-semibold">
                More Conservative Approaches
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <strong>3.5% Rule</strong> - For early retirees with 40-50+
                  year horizons
                </li>
                <li>
                  <strong>3% Rule</strong> - Ultra-conservative for maximum
                  safety
                </li>
                <li>
                  <strong>Dynamic Withdrawals</strong> - Adjust based on market
                  performance
                </li>
              </ul>
            </div>

            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Factors That May Allow Higher Withdrawals
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <strong>Flexible Spending</strong> - Ability to reduce
                  expenses in down markets
                </li>
                <li>
                  <strong>Part-time Income</strong> - Earning some money in
                  retirement
                </li>
                <li>
                  <strong>Social Security/Pensions</strong> - Additional income
                  sources later
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            4% Rule vs. Other FIRE Strategies
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            The 4% rule is just one approach to achieving financial
            independence. Here's how it compares to other popular FIRE
            strategies:
          </p>

          <div className="space-y-4">
            <div className="bg-foreground/10 rounded-lg p-4">
              <h3 className="mb-2 text-lg font-semibold">
                Traditional FIRE (4% Rule)
              </h3>
              <p>
                Target: 25× annual expenses | Best for: Balanced lifestyle with
                moderate spending
              </p>
            </div>

            <div className="bg-foreground/10 rounded-lg p-4">
              <h3 className="mb-2 text-lg font-semibold">
                Lean FIRE (3-3.5% Rule)
              </h3>
              <p>
                Target: 28-33× annual expenses | Best for: Minimalist lifestyle,
                maximum safety
              </p>
            </div>

            <div className="bg-foreground/10 rounded-lg p-4">
              <h3 className="mb-2 text-lg font-semibold">
                Fat FIRE (4-5% Rule)
              </h3>
              <p>
                Target: 20-25× annual expenses | Best for: Luxurious retirement
                with higher spending
              </p>
            </div>

            <div className="bg-foreground/10 rounded-lg p-4">
              <h3 className="mb-2 text-lg font-semibold">Coast FIRE</h3>
              <p>
                Let investments grow while covering expenses with part-time work
              </p>
            </div>
          </div>

          <p className="mt-4 text-lg">
            Want to explore these strategies in detail? Try our{" "}
            <Link
              href="/"
              className="text-primary font-semibold hover:underline"
            >
              comprehensive FIRE calculator
            </Link>{" "}
            for a full retirement simulation.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
          />
          <h2 className="mb-4 text-3xl font-bold">
            4% Rule Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">
                What is the 4% rule?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                The 4% rule is a retirement planning guideline that suggests you
                can safely withdraw 4% of your retirement portfolio in the first
                year, then adjust that amount for inflation each subsequent
                year, with a high probability of not running out of money over
                30 years.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">
                How accurate is the 4% rule?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                The 4% rule, based on the Trinity Study, showed a 95% success
                rate for a 30-year retirement with a 50/50 stock/bond portfolio.
                However, it's based on historical U.S. market data and may need
                adjustment for longer retirements, different asset allocations,
                or varying market conditions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold">
                Is 4% too conservative or too aggressive?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                It depends on your situation. For early retirees with 40-50+
                year horizons, 4% might be too aggressive. Some prefer 3-3.5%.
                Conversely, flexible spenders who can reduce withdrawals in down
                markets might safely use 4.5-5%. Personal factors like other
                income sources and spending flexibility matter.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold">
                How do I calculate my FIRE number using the 4% rule?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Simply multiply your annual expenses by 25. For example, if you
                need $40,000 per year, your FIRE number is $1,000,000 ($40,000 ×
                25). This gives you a portfolio where 4% equals your annual
                spending needs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-semibold">
                Does the 4% rule account for taxes?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                No, the 4% rule calculates gross withdrawals. You'll need to
                account for taxes separately based on your account types
                (traditional vs. Roth IRA, taxable accounts) and tax bracket.
                Many FIRE planners target a portfolio 25-30% larger than the
                basic calculation to cover taxes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-xl font-semibold">
                What asset allocation works best with the 4% rule?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                The original Trinity Study found success with portfolios ranging
                from 50/50 to 75/25 stocks/bonds. Higher stock allocations
                generally provided better long-term results but with more
                volatility. Most FIRE practitioners use 60-80% stocks for the
                growth needed to sustain long retirements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Call to Action */}
        <section className="bg-foreground/10 mb-12 rounded-lg p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">
            Ready for a More Detailed FIRE Analysis?
          </h2>
          <p className="mb-6 text-lg">
            While the 4% rule provides a great starting point, our comprehensive
            FIRE calculator offers year-by-year projections, inflation
            adjustments, and personalized scenarios for your unique situation.
          </p>
          <Link
            href="/"
            className="bg-primary text-primary-foreground inline-block rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90"
          >
            Try Our Full FIRE Calculator →
          </Link>
        </section>
      </div>

      <Footer />
    </main>
  );
}
