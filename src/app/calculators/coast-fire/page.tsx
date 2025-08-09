import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BackgroundPattern from "@/app/components/BackgroundPattern";
import Footer from "@/app/components/footer";
import CoastFireCalculator from "./CoastFireCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Coast FIRE Calculator - When Can You Stop Saving? | InvestingFIRE",
  description:
    "Calculate your Coast FIRE number and find out when you can stop saving for retirement. Free Coast FI calculator shows how compound interest can work for you.",
  keywords:
    "coast fire calculator, coast fi calculator, coast fire number, barista fire calculator, coast financial independence, stop saving calculator",
  openGraph: {
    title: "Coast FIRE Calculator - Stop Saving & Let Compound Interest Work",
    description:
      "Discover when you can stop saving for retirement and coast to financial independence. Free calculator with real-time projections.",
    type: "website",
    url: "https://investingfire.com/calculators/coast-fire",
  },
};

export default function CoastFirePage() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Coast FIRE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Coast FIRE (Financial Independence, Retire Early) is when you've saved enough that you can stop contributing to retirement accounts and still reach your FIRE number by your target retirement age through compound growth alone. You still need to cover current expenses but no longer need to save for retirement.",
        },
      },
      {
        "@type": "Question",
        name: "How is Coast FIRE different from regular FIRE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Regular FIRE means you have enough saved to retire immediately and live off withdrawals. Coast FIRE means you have enough that will grow to your FIRE number by retirement age without additional contributions. You still work to cover current expenses but can spend everything you earn.",
        },
      },
      {
        "@type": "Question",
        name: "What's the Coast FIRE formula?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Coast FIRE Number = FIRE Number ÷ (1 + growth rate)^years until retirement. For example, if you need $1 million at 65 and you're 35 with 30 years to go, assuming 7% growth: $1,000,000 ÷ (1.07)^30 = $131,367.",
        },
      },
      {
        "@type": "Question",
        name: "Is Coast FIRE realistic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Coast FIRE is very achievable, especially for those who start saving aggressively in their 20s or 30s. The key is front-loading retirement savings early in your career when compound interest has the most time to work. Many achieve Coast FIRE in 10-15 years of focused saving.",
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
        name: "Coast FIRE Calculator",
        item: "https://investingfire.com/calculators/coast-fire",
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
          Coast FIRE Calculator
        </h1>
        <p className="text-primary-foreground/90 max-w-2xl text-xl font-semibold md:text-2xl">
          Find Out When You Can Stop Saving and Let Compound Interest Do the
          Work
        </p>
      </div>

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      {/* Calculator */}
      <div className="z-10 mt-8 w-full max-w-4xl">
        <CoastFireCalculator />
      </div>

      {/* SEO Content */}
      <div className="z-10 mx-auto max-w-4xl px-4 py-12 text-left">
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            What Is Coast FIRE? Your Path to Stress-Free Saving
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            <strong>Coast FIRE</strong> represents a powerful milestone in your
            financial independence journey. It's the point where you've
            accumulated enough investments that you can completely stop saving
            for retirement and still reach your FIRE number by your target
            retirement age through compound growth alone.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            Unlike traditional FIRE where you need 25× your annual expenses
            saved before retiring, Coast FIRE allows you to "coast" to
            retirement. You still work to cover your current living expenses,
            but you can spend 100% of your income knowing your future retirement
            is already secured through the magic of compound interest.
          </p>

          <div className="bg-foreground/10 my-6 rounded-lg p-6">
            <h3 className="mb-3 text-xl font-semibold">Coast FIRE Benefits:</h3>
            <ul className="ml-6 list-disc space-y-2 text-lg">
              <li>
                <strong>Reduced financial stress</strong> - No more pressure to
                save aggressively
              </li>
              <li>
                <strong>Career flexibility</strong> - Take lower-paying but more
                fulfilling work
              </li>
              <li>
                <strong>Lifestyle upgrade</strong> - Spend your entire paycheck
                guilt-free
              </li>
              <li>
                <strong>Early achievement</strong> - Often reachable in your 30s
                or 40s
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            How the Coast FIRE Calculator Works
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            Our Coast FIRE calculator uses the time value of money principle to
            determine exactly how much you need invested today to reach your
            retirement goal without any additional contributions. Here's the
            math behind it:
          </p>

          <div className="bg-foreground/10 mb-6 rounded-lg p-6">
            <h3 className="mb-3 text-xl font-semibold">
              The Coast FIRE Formula:
            </h3>
            <p className="mb-4 font-mono text-lg">
              Coast FIRE Number = Target FIRE Number ÷ (1 + growth rate)^years
            </p>
            <p className="text-lg">Where:</p>
            <ul className="ml-6 list-disc space-y-1 text-lg">
              <li>Target FIRE Number = 25× your annual retirement expenses</li>
              <li>
                Growth rate = Expected annual investment return (e.g., 7%)
              </li>
              <li>Years = Time until your target retirement age</li>
            </ul>
          </div>

          <p className="mb-4 text-lg leading-relaxed">
            For example, if you need $1,000,000 to retire in 30 years and expect
            7% annual returns, you need just $131,367 invested today to coast to
            retirement. That's the power of compound interest working over
            decades!
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Coast FIRE vs Other FIRE Variations
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            Understanding how Coast FIRE fits into the broader FIRE movement
            helps you choose the right strategy for your situation:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-3 text-xl font-semibold">Coast FIRE</h3>
              <p className="mb-2">Stop saving, work for expenses only</p>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Achievable in 10-15 years</li>
                <li>Reduces financial stress immediately</li>
                <li>Perfect for career pivots</li>
              </ul>
            </div>

            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-3 text-xl font-semibold">Barista FIRE</h3>
              <p className="mb-2">Similar to Coast but work part-time</p>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Often includes health benefits</li>
                <li>More lifestyle flexibility</li>
                <li>Bridge to full retirement</li>
              </ul>
            </div>

            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-3 text-xl font-semibold">Traditional FIRE</h3>
              <p className="mb-2">Full retirement with 4% rule</p>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Need 25× annual expenses</li>
                <li>Complete work optional</li>
                <li>Takes longer to achieve</li>
              </ul>
            </div>

            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-3 text-xl font-semibold">Lean/Fat FIRE</h3>
              <p className="mb-2">Variations based on spending</p>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Lean: Minimal expenses</li>
                <li>Fat: Luxury lifestyle</li>
                <li>Different savings targets</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Strategies to Reach Coast FIRE Faster
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            Achieving Coast FIRE is all about front-loading your retirement
            savings while you're young. Here are proven strategies to accelerate
            your journey:
          </p>

          <div className="space-y-4">
            <div className="bg-foreground/10 rounded-lg p-4">
              <h3 className="mb-2 text-lg font-semibold">
                1. Maximize Tax-Advantaged Accounts Early
              </h3>
              <p>
                Prioritize 401(k), IRA, and HSA contributions in your 20s and
                30s. The tax savings compound alongside your investments.
              </p>
            </div>

            <div className="bg-foreground/10 rounded-lg p-4">
              <h3 className="mb-2 text-lg font-semibold">
                2. Live on One Income (If Partnered)
              </h3>
              <p>
                Save 100% of one partner's income while living on the other.
                This can cut your Coast FIRE timeline in half.
              </p>
            </div>

            <div className="bg-foreground/10 rounded-lg p-4">
              <h3 className="mb-2 text-lg font-semibold">
                3. House Hack or Geographic Arbitrage
              </h3>
              <p>
                Minimize housing costs through rental income or moving to lower
                cost areas while maintaining income.
              </p>
            </div>

            <div className="bg-foreground/10 rounded-lg p-4">
              <h3 className="mb-2 text-lg font-semibold">
                4. Invest Windfalls Immediately
              </h3>
              <p>
                Bonuses, tax refunds, and gifts go straight to investments.
                These lump sums have maximum time to compound.
              </p>
            </div>

            <div className="bg-foreground/10 rounded-lg p-4">
              <h3 className="mb-2 text-lg font-semibold">
                5. Increase Savings Rate Annually
              </h3>
              <p>
                Bump up your savings by 1-2% each year. You won't feel the pinch
                but will dramatically accelerate your timeline.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
          />
          <h2 className="mb-4 text-3xl font-bold">
            Coast FIRE Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">
                What is Coast FIRE?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Coast FIRE (Financial Independence, Retire Early) is when you've
                saved enough that you can stop contributing to retirement
                accounts and still reach your FIRE number by your target
                retirement age through compound growth alone. You still need to
                cover current expenses but no longer need to save for
                retirement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">
                How is Coast FIRE different from regular FIRE?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Regular FIRE means you have enough saved to retire immediately
                and live off withdrawals. Coast FIRE means you have enough that
                will grow to your FIRE number by retirement age without
                additional contributions. You still work to cover current
                expenses but can spend everything you earn.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold">
                What's the Coast FIRE formula?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Coast FIRE Number = FIRE Number ÷ (1 + growth rate)^years until
                retirement. For example, if you need $1 million at 65 and you're
                35 with 30 years to go, assuming 7% growth: $1,000,000 ÷
                (1.07)^30 = $131,367.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold">
                Is Coast FIRE realistic?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Yes, Coast FIRE is very achievable, especially for those who
                start saving aggressively in their 20s or 30s. The key is
                front-loading retirement savings early in your career when
                compound interest has the most time to work. Many achieve Coast
                FIRE in 10-15 years of focused saving.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-semibold">
                What if I already have some retirement savings?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Great! You're already on your way. Enter your current portfolio
                value in the calculator to see how close you are to Coast FIRE.
                You might be surprised to find you're closer than you think,
                especially if you have many years until retirement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-xl font-semibold">
                Should I actually stop saving once I hit Coast FIRE?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                That's a personal choice! Many people continue saving to reach
                full FIRE faster, build a buffer for market downturns, or
                upgrade their retirement lifestyle. Others use Coast FIRE as
                permission to pursue lower-paying passion projects or reduce
                work hours. The beauty is having options.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Success Stories */}
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Real Coast FIRE Success Stories
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-2 text-xl font-semibold">The Teacher's Tale</h3>
              <p className="text-sm">
                "I hit Coast FIRE at 32 after 10 years of saving 60% as an
                engineer. Now I teach high school physics—half the pay but 10x
                the satisfaction. My retirement is secured, so every paycheck
                goes to enjoying life now."
              </p>
            </div>

            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-2 text-xl font-semibold">
                The Entrepreneur's Freedom
              </h3>
              <p className="text-sm">
                "Reaching Coast FIRE at 38 gave me the courage to start my
                business. Without needing to save for retirement, I could
                reinvest everything back into growth. Best decision ever."
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-foreground/10 mb-12 rounded-lg p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">
            Want a Complete FIRE Plan?
          </h2>
          <p className="mb-6 text-lg">
            Coast FIRE is just one strategy. Our comprehensive FIRE calculator
            models your entire journey with multiple scenarios, withdrawal
            strategies, and detailed projections.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="bg-primary text-primary-foreground inline-block rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90"
            >
              Try Full FIRE Calculator →
            </Link>
            <Link
              href="/calculators/4-percent-rule"
              className="bg-secondary text-secondary-foreground inline-block rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90"
            >
              Explore 4% Rule →
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
