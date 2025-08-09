import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BackgroundPattern from "@/app/components/BackgroundPattern";
import Footer from "@/app/components/footer";
import FireByAgeCalculator from "./FireByAgeCalculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FIRE by Age Guide - Retire at 30, 35, 40, 45, 50, 55 | InvestingFIRE",
  description:
    "Complete guide to achieving FIRE at any age. Learn how much you need to retire at 30, 35, 40, 45, 50, or 55. Free calculator with age-specific strategies and savings targets.",
  keywords:
    "retire at 40, retire at 45, retire at 50, retire at 35, retire at 30, early retirement by age, FIRE age calculator, how much to retire at 40",
  openGraph: {
    title: "FIRE by Age Guide - When Can You Retire?",
    description:
      "Discover exactly how much you need to retire at 30, 35, 40, 45, 50, or 55. Complete guide with calculator and age-specific strategies.",
    type: "website",
    url: "https://investingfire.com/guides/fire-by-age",
  },
};

export default function FireByAgePage() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much do I need to retire at 40?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To retire at 40, you typically need 25-30x your annual expenses saved. For $50,000/year in expenses, that's $1.25-1.5 million. The higher multiplier accounts for a longer retirement period. Starting at 25, you'd need to save about $3,000-4,000/month assuming 7% returns.",
        },
      },
      {
        "@type": "Question",
        name: "Can I retire at 50 with $1 million?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can retire at 50 with $1 million if your annual expenses are $40,000 or less (using the 4% rule). For a more conservative 3.5% withdrawal rate, you'd need expenses under $35,000/year. Consider that you'll have 15 years before Medicare eligibility, so factor in health insurance costs.",
        },
      },
      {
        "@type": "Question",
        name: "What's the best age to retire early?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 'best' age depends on your personal circumstances, but many FIRE achievers target 40-50. This balances having enough working years to accumulate wealth with plenty of healthy retirement years. Earlier retirement requires more aggressive saving and potentially lower withdrawal rates.",
        },
      },
      {
        "@type": "Question",
        name: "How does retirement age affect withdrawal rates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Younger retirees should use lower withdrawal rates. While the 4% rule works for 30-year retirements, consider: Age 30-35: 3-3.25% withdrawal rate. Age 40-45: 3.5% withdrawal rate. Age 50-55: 3.75-4% withdrawal rate. Age 60+: 4-4.5% withdrawal rate.",
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
        name: "Guides",
        item: "https://investingfire.com/guides",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "FIRE by Age",
        item: "https://investingfire.com/guides/fire-by-age",
      },
    ],
  };

  const ageTargets = [
    {
      age: 30,
      multiplier: 33,
      withdrawalRate: 3,
      savingsYears: "5-10",
      challenges: [
        "Extremely aggressive saving required",
        "Limited career earnings time",
        "60+ year retirement horizon",
      ],
      strategies: [
        "Save 70-80% of income",
        "High-income career essential",
        "Consider geographic arbitrage",
      ],
    },
    {
      age: 35,
      multiplier: 30,
      withdrawalRate: 3.25,
      savingsYears: "10-15",
      challenges: [
        "Very high savings rate needed",
        "Family formation years",
        "55+ year retirement",
      ],
      strategies: [
        "Save 60-70% of income",
        "Maximize career growth",
        "House hack or minimize housing",
      ],
    },
    {
      age: 40,
      multiplier: 28,
      withdrawalRate: 3.5,
      savingsYears: "15-20",
      challenges: [
        "Peak earning years cut short",
        "Children's education costs",
        "Healthcare before Medicare",
      ],
      strategies: [
        "Save 50-60% of income",
        "Build multiple income streams",
        "Plan for health insurance",
      ],
    },
    {
      age: 45,
      multiplier: 27,
      withdrawalRate: 3.75,
      savingsYears: "20-25",
      challenges: [
        "Mid-career transition",
        "Aging parents care",
        "20 years to Medicare",
      ],
      strategies: [
        "Save 40-50% of income",
        "Consider Coast FIRE first",
        "Build health insurance fund",
      ],
    },
    {
      age: 50,
      multiplier: 25,
      withdrawalRate: 4,
      savingsYears: "25-30",
      challenges: [
        "Early retirement penalties",
        "15 years to Medicare",
        "Sequence of returns risk",
      ],
      strategies: [
        "Save 30-40% of income",
        "Ladder conversions",
        "Part-time work option",
      ],
    },
    {
      age: 55,
      multiplier: 25,
      withdrawalRate: 4.25,
      savingsYears: "30-35",
      challenges: [
        "10 years to Medicare",
        "Social Security timing",
        "Market volatility impact",
      ],
      strategies: [
        "Save 25-35% of income",
        "Rule of 55 withdrawals",
        "Bridge account planning",
      ],
    },
  ];

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
          FIRE by Age Guide
        </h1>
        <p className="text-primary-foreground/90 max-w-2xl text-xl font-semibold md:text-2xl">
          Complete Guide to Retiring at 30, 35, 40, 45, 50, or 55
        </p>
      </div>

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      {/* Calculator */}
      <div className="z-10 mt-8 w-full max-w-4xl">
        <FireByAgeCalculator />
      </div>

      {/* SEO Content */}
      <div className="z-10 mx-auto max-w-4xl px-4 py-12 text-left">
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Your Complete Guide to FIRE at Any Age
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            Achieving{" "}
            <strong>Financial Independence, Retire Early (FIRE)</strong> is
            possible at virtually any age, but the strategies, savings rates,
            and challenges vary dramatically depending on when you want to
            retire. This comprehensive guide breaks down exactly what it takes
            to retire at 30, 35, 40, 45, 50, or 55.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            The younger your target retirement age, the more aggressive your
            approach needs to be. While retiring at 55 might require saving
            25-35% of your income, retiring at 35 could demand 60-70% savings
            rates and significant lifestyle adjustments. Let's explore what's
            realistic for each age milestone.
          </p>
        </section>

        {/* Age-Specific Sections */}
        {ageTargets.map((target) => (
          <section
            key={target.age}
            className="mb-12 scroll-mt-20"
            id={`retire-at-${target.age}`}
          >
            <h2 className="mb-4 text-3xl font-bold">
              How to Retire at {target.age}: Complete Strategy
            </h2>

            <div className="bg-foreground/10 mb-6 rounded-lg p-6">
              <h3 className="mb-4 text-xl font-semibold">
                Quick Facts: Retiring at {target.age}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-medium">Target Multiple:</p>
                  <p className="text-primary text-2xl font-bold">
                    {target.multiplier}× annual expenses
                  </p>
                </div>
                <div>
                  <p className="font-medium">Safe Withdrawal Rate:</p>
                  <p className="text-primary text-2xl font-bold">
                    {target.withdrawalRate}%
                  </p>
                </div>
                <div>
                  <p className="font-medium">Typical Saving Period:</p>
                  <p className="text-primary text-2xl font-bold">
                    {target.savingsYears} years
                  </p>
                </div>
                <div>
                  <p className="font-medium">For $50k/year expenses:</p>
                  <p className="text-primary text-2xl font-bold">
                    ${(target.multiplier * 50).toLocaleString()}k needed
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-xl font-semibold">Key Challenges</h3>
                <ul className="ml-6 list-disc space-y-2 text-lg">
                  {target.challenges.map((challenge, idx) => (
                    <li key={idx}>{challenge}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold">
                  Winning Strategies
                </h3>
                <ul className="ml-6 list-disc space-y-2 text-lg">
                  {target.strategies.map((strategy, idx) => (
                    <li key={idx}>{strategy}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-lg leading-relaxed">
              {target.age <= 35 &&
                "This ultra-early retirement requires exceptional discipline and often a very high income. Most successful retirees at this age work in tech, finance, or have entrepreneurial success. Geographic arbitrage is almost essential."}
              {target.age > 35 &&
                target.age <= 45 &&
                "This is the sweet spot for many FIRE achievers - enough time to build wealth while still having decades of healthy retirement. Focus on maximizing your peak earning years and maintaining a high savings rate."}
              {target.age > 45 &&
                "This more traditional early retirement timeline allows for a balanced approach. You'll have more time to benefit from compound growth and can use strategies like the Rule of 55 for penalty-free 401(k) access."}
            </p>
          </section>
        ))}

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Age-Specific FIRE Strategies Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="bg-foreground/5 w-full border-collapse rounded-lg">
              <thead>
                <tr className="border-foreground/20 border-b">
                  <th className="p-4 text-left">Retirement Age</th>
                  <th className="p-4 text-center">Savings Rate</th>
                  <th className="p-4 text-center">Years to Save</th>
                  <th className="p-4 text-center">Withdrawal Rate</th>
                  <th className="p-4 text-center">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-foreground/10 border-b">
                  <td className="p-4 font-medium">Retire at 30</td>
                  <td className="p-4 text-center">70-80%</td>
                  <td className="p-4 text-center">5-10</td>
                  <td className="p-4 text-center">3%</td>
                  <td className="p-4 text-center text-red-600">Very High</td>
                </tr>
                <tr className="border-foreground/10 border-b">
                  <td className="p-4 font-medium">Retire at 35</td>
                  <td className="p-4 text-center">60-70%</td>
                  <td className="p-4 text-center">10-15</td>
                  <td className="p-4 text-center">3.25%</td>
                  <td className="p-4 text-center text-orange-600">High</td>
                </tr>
                <tr className="border-foreground/10 border-b">
                  <td className="p-4 font-medium">Retire at 40</td>
                  <td className="p-4 text-center">50-60%</td>
                  <td className="p-4 text-center">15-20</td>
                  <td className="p-4 text-center">3.5%</td>
                  <td className="p-4 text-center text-yellow-600">
                    Moderate-High
                  </td>
                </tr>
                <tr className="border-foreground/10 border-b">
                  <td className="p-4 font-medium">Retire at 45</td>
                  <td className="p-4 text-center">40-50%</td>
                  <td className="p-4 text-center">20-25</td>
                  <td className="p-4 text-center">3.75%</td>
                  <td className="p-4 text-center text-blue-600">Moderate</td>
                </tr>
                <tr className="border-foreground/10 border-b">
                  <td className="p-4 font-medium">Retire at 50</td>
                  <td className="p-4 text-center">30-40%</td>
                  <td className="p-4 text-center">25-30</td>
                  <td className="p-4 text-center">4%</td>
                  <td className="p-4 text-center text-green-600">
                    Low-Moderate
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Retire at 55</td>
                  <td className="p-4 text-center">25-35%</td>
                  <td className="p-4 text-center">30-35</td>
                  <td className="p-4 text-center">4.25%</td>
                  <td className="p-4 text-center text-green-600">Low</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Critical Considerations by Retirement Age
          </h2>

          <div className="space-y-6">
            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Healthcare Coverage Gap
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <strong>Retire at 30-40:</strong> 25-35 years until Medicare -
                  Budget $15-25k/year for health insurance
                </li>
                <li>
                  <strong>Retire at 45-50:</strong> 15-20 years gap - Consider
                  ACA subsidies and HSA maximization
                </li>
                <li>
                  <strong>Retire at 55:</strong> 10-year gap - Explore COBRA,
                  spouse's plan, or private insurance
                </li>
              </ul>
            </div>

            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Social Security Strategy
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <strong>Retire before 35:</strong> Minimal SS benefits - Plan
                  without relying on it
                </li>
                <li>
                  <strong>Retire at 40-45:</strong> Reduced benefits - Factor in
                  25-50% of normal benefit
                </li>
                <li>
                  <strong>Retire at 50-55:</strong> Near-full benefits - Can be
                  significant income supplement
                </li>
              </ul>
            </div>

            <div className="bg-foreground/10 rounded-lg p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Investment Allocation
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <strong>60+ year retirement:</strong> 80-90% stocks for
                  growth, rebalance gradually
                </li>
                <li>
                  <strong>40-50 year retirement:</strong> 70-80% stocks,
                  consider bond ladder for first decade
                </li>
                <li>
                  <strong>30-40 year retirement:</strong> 60-70% stocks,
                  traditional balanced approach
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
          />
          <h2 className="mb-4 text-3xl font-bold">FIRE by Age FAQ</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">
                How much do I need to retire at 40?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                To retire at 40, you typically need 25-30x your annual expenses
                saved. For $50,000/year in expenses, that's $1.25-1.5 million.
                The higher multiplier accounts for a longer retirement period.
                Starting at 25, you'd need to save about $3,000-4,000/month
                assuming 7% returns.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">
                Can I retire at 50 with $1 million?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Yes, you can retire at 50 with $1 million if your annual
                expenses are $40,000 or less (using the 4% rule). For a more
                conservative 3.5% withdrawal rate, you'd need expenses under
                $35,000/year. Consider that you'll have 15 years before Medicare
                eligibility, so factor in health insurance costs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold">
                What's the best age to retire early?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                The "best" age depends on your personal circumstances, but many
                FIRE achievers target 40-50. This balances having enough working
                years to accumulate wealth with plenty of healthy retirement
                years. Earlier retirement requires more aggressive saving and
                potentially lower withdrawal rates.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold">
                How does retirement age affect withdrawal rates?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Younger retirees should use lower withdrawal rates. While the 4%
                rule works for 30-year retirements, consider:
                <ul className="mt-2 ml-6 list-disc">
                  <li>Age 30-35: 3-3.25% withdrawal rate</li>
                  <li>Age 40-45: 3.5% withdrawal rate</li>
                  <li>Age 50-55: 3.75-4% withdrawal rate</li>
                  <li>Age 60+: 4-4.5% withdrawal rate</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-semibold">
                Is retiring at 35 realistic?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Retiring at 35 is challenging but achievable with the right
                circumstances: high income ($100k+), low expenses, 60-70%
                savings rate, and disciplined investing. Most who achieve this
                work in high-paying fields, live frugally, and often have no
                children or delay having them. Geographic arbitrage to low-cost
                areas helps significantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-xl font-semibold">
                What about retiring with kids?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Retiring early with children adds complexity but is doable. Key
                considerations: Budget $10-15k per child annually, plan for
                college (529 plans), factor in larger housing needs, and
                consider part-time work for stability. Many FIRE families find
                that having more time with kids is worth the extra financial
                planning required.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Quick Reference */}
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Quick Reference: FIRE Numbers by Age
          </h2>
          <div className="bg-foreground/10 rounded-lg p-6">
            <p className="mb-4 text-lg font-medium">
              Based on $50,000 annual expenses:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {ageTargets.map((target) => (
                <div
                  key={target.age}
                  className="bg-background/50 flex justify-between rounded p-3"
                >
                  <span className="font-medium">Retire at {target.age}:</span>
                  <span className="text-primary font-bold">
                    ${(target.multiplier * 50).toLocaleString()},000
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-foreground/10 mb-12 rounded-lg p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">
            Ready to Plan Your Early Retirement?
          </h2>
          <p className="mb-6 text-lg">
            Use our comprehensive calculators to create your personalized FIRE
            plan, whether you're targeting retirement at 35 or 55.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="bg-primary text-primary-foreground inline-block rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90"
            >
              FIRE Calculator →
            </Link>
            <Link
              href="/calculators/coast-fire"
              className="bg-secondary text-secondary-foreground inline-block rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90"
            >
              Coast FIRE Calculator →
            </Link>
            <Link
              href="/calculators/4-percent-rule"
              className="bg-secondary text-secondary-foreground inline-block rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90"
            >
              4% Rule Calculator →
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
