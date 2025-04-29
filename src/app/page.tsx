import FireCalculatorForm from "./components/FireCalculatorForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  return (
    <main className="text-primary-foreground to-destructive from-secondary flex min-h-screen flex-col items-center bg-gradient-to-b p-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-primary-foreground text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          The #1 FIRE Calculator
        </h1>
        <FireCalculatorForm />
      </div>

      {/* Added SEO Content Sections */}
      <div className="container mx-auto max-w-4xl px-4 py-8 text-left">
        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">What is FIRE?</h2>
          <p className="mb-4 text-lg leading-relaxed">
            FIRE stands for &quot;Financial Independence, Retire Early.&quot;
            It&apos;s a movement focused on aggressive saving and investing to
            build a large enough portfolio that the returns can cover living
            expenses indefinitely. Achieving FIRE means you are no longer
            dependent on traditional employment to fund your lifestyle, giving
            you the freedom to pursue passions, travel, or simply enjoy life
            without the need for a regular paycheck.
          </p>
          <p className="text-lg leading-relaxed">
            The core principle often involves saving a high percentage of income
            (sometimes 50% or more) and investing it wisely, typically in
            low-cost index funds. The target amount, often called the &quot;FIRE
            number,&quot; is usually calculated as 25 times your desired annual
            spending, based on the 4% safe withdrawal rate rule.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">How This Calculator Works</h2>
          <p className="mb-4 text-lg leading-relaxed">
            This calculator helps you estimate your path to FIRE based on your
            current financial situation and future projections. Here&apos;s a
            breakdown of the inputs:
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
            factoring in monthly contributions, compound growth, and
            inflation&apos;s effect on your target allowance. It then determines
            the age at which your accumulated capital is sufficient to sustain
            your desired, inflation-adjusted monthly allowance throughout your
            expected retirement years until your specified life expectancy. It
            estimates your &quot;FIRE Number&quot; (the capital needed at
            retirement) and the age you might reach it.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">
            Frequently Asked Questions (FAQ)
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
                Is the Expected Growth Rate realistic?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Historically, diversified stock market investments have returned
                around 7-10% annually over the long term, before inflation. A
                rate of 7% (after fees) is often used as a reasonable estimate,
                but past performance doesn&apos;t guarantee future results.
                It&apos;s crucial to choose a rate you feel comfortable with and
                understand the associated risks.
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
                Can I really retire early?
              </AccordionTrigger>
              <AccordionContent className="text-lg leading-relaxed">
                Retiring significantly earlier than traditional retirement age
                is possible but requires discipline, a high savings rate, and
                consistent investment growth. The feasibility depends heavily on
                your income, expenses, savings habits, and investment returns.
                Use this calculator as a tool for planning and motivation, but
                remember it provides estimates based on your inputs.
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
            Further Reading & Resources
          </h2>
          <p className="mb-6 text-lg leading-relaxed">
            Want to learn more about FIRE and continue your journey to financial
            independence? Here are some valuable resources to explore:
          </p>

          <div className="bg-secondary/20 my-8 rounded-md p-4 text-lg">
            <p className="font-semibold">Getting Started with FIRE:</p>
            <ol className="ml-6 list-decimal space-y-1">
              <li>
                Read foundational content like Mr. Money Mustache&apos;s simple
                math article
              </li>
              <li>
                Calculate your personal numbers using this and other FIRE
                calculators
              </li>
              <li>
                Join communities like r/Fire to ask questions and find support
              </li>
              <li>Explore books and podcasts to deepen your understanding</li>
            </ol>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xl font-semibold">Blogs & Websites</h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <a
                    href="https://www.mrmoneymustache.com/2012/01/13/the-shockingly-simple-math-behind-early-retirement/"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Mr. Money Mustache - The Shockingly Simple Math Behind Early
                    Retirement
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
              <h3 className="mb-3 text-xl font-semibold">Books & Learning</h3>
              <ul className="ml-6 list-disc space-y-2 text-lg">
                <li>
                  <a
                    href="https://www.amazon.com/Your-Money-Life-Transforming-Relationship/dp/0143115766"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Your Money or Your Life - Vicki Robin & Joe Dominguez
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
                    BiggerPockets Money Podcast - FIRE Calculators
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">
                Additional Calculators & Tools
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
                    CAGR Compound Interest Calculator - Calculate how your
                    investments grow over time
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">
                Recent Articles & Trends
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
    </main>
  );
}
