import Image from "next/image";
import FireCalculatorForm from "./components/FireCalculatorForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "./components/footer";

export default function HomePage() {
  return (
    <main className="text-primary-foreground to-destructive from-secondary flex min-h-screen flex-col items-center bg-gradient-to-b p-4">
      <div className="mx-auto flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex flex-row flex-wrap items-center justify-center gap-4 align-middle">
          <Image
            src="/investingfire_logo_no-bg.svg"
            alt="InvestingFIRE Logo"
            width={100}
            height={100}
          />
          <h1 className="from-primary via-primary-foreground to-primary bg-gradient-to-r bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-md sm:text-[5rem]">
            InvestingFIRE
          </h1>
        </div>
        <p className="text-primary-foreground/90 text-xl font-semibold md:text-2xl">
          The #1 FIRE Calculator
        </p>
        <div className="mt-8 w-full max-w-2xl">
          <FireCalculatorForm />
        </div>
      </div>

      {/* Added SEO Content Sections */}
      <div className="mx-auto max-w-2xl py-12 text-left">
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            What is FIRE? Understanding Financial Independence and Early
            Retirement
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            FIRE stands for &quot;Financial Independence, Retire Early.&quot;
            It&apos;s a movement focused on aggressive saving and strategic
            investing to build a substantial portfolio. The goal is for
            investment returns to cover living expenses indefinitely, freeing
            you from traditional employment. Achieving FIRE means gaining the
            freedom to pursue passions, travel, or simply enjoy life without
            needing a regular paycheck. Sound investing advice is crucial for
            building the wealth needed.
          </p>
          <p className="text-lg leading-relaxed">
            The core principle involves maximizing your savings rate (often
            50%+) and investing wisely, typically in low-cost, diversified
            assets like index funds. Your &quot;FIRE number&quot; – the capital
            needed – is often estimated as 25 times your desired annual
            spending, derived from the 4% safe withdrawal rate guideline. This
            FIRE calculator helps you personalize this estimate.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            How This FIRE Calculator Provides Investing Insights
          </h2>
          <p className="mb-4 text-lg leading-relaxed">
            This calculator helps visualize your path to FIRE by projecting
            investment growth based on your inputs. Understanding these
            projections is a key piece of investing advice for long-term
            planning. Here&apos;s a breakdown of the inputs:
          </p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-lg">
            <li>
              <strong>Starting Capital:</strong> The total amount you currently
              have invested.
            </li>
            <li>
              <strong>Monthly Savings:</strong> The amount you consistently save
              and invest each month.
            </li>
            <li>
              <strong>Current Age:</strong> Your current age in years.
            </li>
            <li>
              <strong>Expected Annual Growth Rate (%):</strong> The average
              annual return you expect from your investments (after fees, before
              inflation).
            </li>
            <li>
              <strong>Desired Monthly Allowance (Today&apos;s Value):</strong>{" "}
              How much you want to be able to spend each month in retirement, in
              today&apos;s money value.
            </li>
            <li>
              <strong>Annual Inflation Rate (%):</strong> The expected average
              rate at which the cost of living will increase.
            </li>
            <li>
              <strong>Life Expectancy (Age):</strong> The age until which you
              want your funds to last.
            </li>
          </ul>
          <p className="text-lg leading-relaxed">
            The calculator simulates your investment growth year by year,
            incorporating monthly contributions, the power of compound growth (a
            core investing principle), and inflation&apos;s impact on your
            target allowance. It estimates the age at which your capital could
            sustain your desired, inflation-adjusted monthly spending throughout
            your expected retirement until your specified life expectancy. It
            calculates your potential &quot;FIRE Number&quot; and the age you
            might reach financial independence.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            FIRE & Investing Frequently Asked Questions (FAQ)
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">
                What is the 4% rule?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                The 4% rule is a guideline suggesting that you can safely
                withdraw 4% of your investment portfolio&apos;s value in your
                first year of retirement, and then adjust that amount for
                inflation each subsequent year, with a high probability of your
                money lasting for at least 30 years. This calculator uses a more
                dynamic simulation based on your life expectancy but is related
                to this concept.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">
                Is the Expected Growth Rate realistic? Finding the right
                investing advice often starts here.
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Historically, diversified stock market investments have returned
                around 7-10% annually long-term (before inflation). A rate of 7%
                (after fees) is common, but remember past performance
                doesn&apos;t guarantee future results, a fundamental piece of
                investing advice. Choose a rate reflecting your risk tolerance
                and investment strategy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold">
                How does inflation impact my FIRE number?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Inflation erodes the purchasing power of money over time. Your
                desired monthly allowance needs to increase each year just to
                maintain the same standard of living. This calculator accounts
                for this by adjusting your target allowance upwards based on the
                inflation rate you provide, ensuring the calculated FIRE number
                supports your desired lifestyle in future dollars.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold">
                Can I really retire early with FIRE?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Retiring significantly early is achievable but demands
                discipline, a high savings rate, and smart investing. Success
                depends on income, expenses, savings habits, and investment
                returns. Use this FIRE calculator as a planning tool,
                understanding it provides estimates based on your assumptions
                and chosen investing approach.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-semibold">
                What does FIRE stand for?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                FIRE stands for Financial Independence, Retire Early. It
                represents a lifestyle movement aimed at maximizing your savings
                rate through increased income and/or decreased expenses to
                achieve financial independence and retire much earlier than
                traditional retirement age.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-xl font-semibold">
                How much should I save each month?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                FIRE enthusiasts typically aim to save 50-70% of their income.
                The more you can save, the faster you&apos;ll reach your FIRE
                goal. However, the right amount depends on your income,
                lifestyle, and target retirement age. Use the calculator to
                experiment with different monthly savings amounts to see their
                impact on your retirement timeline.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Optional: Add a section for relevant resources/links here */}
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            FIRE Journey & Investing Resources
          </h2>
          <p className="mb-6 text-lg leading-relaxed">
            Ready to dive deeper into FIRE and solidify your investing strategy?
            Explore these valuable resources for financial independence planning
            and investing advice:
          </p>

          <div className="bg-secondary/20 my-8 rounded-md p-4 text-lg">
            <p className="font-semibold">Getting Started with FIRE:</p>
            <ol className="ml-6 list-decimal space-y-1">
              <li>
                Calculate your personal numbers using this FIRE calculator and
                other tools.
              </li>
              <li>
                Seek sound investing advice and consider joining communities
                like r/Fire for support.
              </li>
              <li>Explore books and podcasts to deepen your understanding</li>
            </ol>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xl font-semibold">
                Blogs & Investing Websites
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <a
                    href="https://www.mrmoneymustache.com/2012/01/13/the-shockingly-simple-math-behind-early-retirement/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Mr. Money Mustache - Simple Math Behind Early Retirement &
                    Investing
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.playingwithfire.co/resources"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Playing With FIRE - Comprehensive Resources
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/Fire/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    r/Fire Reddit Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">
                Books & Investment Learning
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <a
                    href="https://www.amazon.com/Your-Money-Life-Transforming-Relationship/dp/0143115766"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Your Money or Your Life - Foundational FIRE & Investing
                    Principles
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.playingwithfire.co/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Playing With FIRE Documentary
                  </a>
                </li>
                <li>
                  <a
                    href="https://podcasts.apple.com/us/podcast/can-you-retire-now-this-fire-calculator-will-tell-you/id1330225136?i=1000683436292"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    BiggerPockets Money Podcast - FIRE Calculators & Investing
                    Strategies
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">
                Additional FIRE & Investing Calculators
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <a
                    href="https://walletburst.com/tools/coast-fire-calculator/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Coast FIRE Calculator - For those considering a partial
                    early retirement
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.empower.com/retirement-calculator"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Empower Retirement Planner - Free portfolio analysis and net
                    worth tracking
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    CAGR Compound Interest Calculator - Understand Investment
                    Growth
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">
                Recent Investing & FIRE Articles
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <a
                    href="https://www.businessinsider.com/retiring-tech-early-coast-fire-make-me-millionaire-2025-4"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Coast FIRE: Retiring in your 30s while becoming a
                    millionaire by 60
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.businessinsider.com/financial-independence-retire-early-saving-loneliness-retreat-bali-making-friends-2025-2"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    The Social Side of FIRE: Finding Community in Financial
                    Independence
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
