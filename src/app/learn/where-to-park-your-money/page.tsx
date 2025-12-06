import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { AuthorBio } from '@/app/components/AuthorBio';
import { FaqSection, type FaqItem } from '@/app/components/FaqSection';

const faqs: FaqItem[] = [
  {
    question: 'Is a single world ETF enough?',
    answer:
      'For most long-term investors, a single, low-cost global index fund (like VT in the US or VWCE in the EU) paired with a risk-appropriate bond fund is sufficient. Add regional tilts only if you have a clear, deliberate reason.',
  },
  {
    question: 'Should I choose accumulating or distributing share classes?',
    answer:
      'If your tax system does not tax unrealized gains and you want simplicity, accumulating share classes can reduce paperwork. In countries that tax deemed distributions or where you need cash flow, distributing classes may make sense.',
  },
  {
    question: 'How often should I rebalance?',
    answer:
      'Set simple guardrails: rebalance when an asset class is 5–10 percentage points away from target, or on a set cadence (e.g., annually). Avoid excessive trading to minimize taxes and fees.',
  },
  {
    question: 'Can I mix local pension schemes with global ETFs?',
    answer:
      'Yes—use tax-advantaged accounts first (IRA/401k, ISA/SIPP, RRSP/TFSA, ISK/KF, Superannuation, etc.). Align assets to account type: tax-inefficient assets (bonds/REITs) in tax shelters; tax-efficient broad equity ETFs in taxable.',
  },
  {
    question: 'What if my broker doesn’t offer fractional shares?',
    answer:
      'Use ETFs with lower share prices, contribute in larger but less frequent batches, or pick brokers that support fractional investing. Always compare FX costs and custody protections before moving.',
  },
];

export const metadata = {
  title: `Where to Park Your Money for FIRE (${new Date().getFullYear().toString()})`,
  description:
    'Build a globally diversified, low-cost index portfolio, avoid home bias, and use the right tax wrappers—wherever you live. A practical guide for FIRE investors.',
  openGraph: {
    title: 'Where to Park Your Money for FIRE',
    description: 'Global index investing playbook: avoid home bias, cut fees, optimize taxes.',
    type: 'article',
    url: 'https://investingfire.com/learn/where-to-park-your-money',
  },
};

export default function ParkYourMoneyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Where to Park Your Money for FIRE',
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
    datePublished: '2025-01-24',
    description:
      'A global guide to placing your money for FIRE: low-cost index funds, tax wrappers, and avoiding home bias.',
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-muted-foreground mb-6 text-sm">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/learn" className="hover:text-primary">
          Learn
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Where to Park Your Money</span>
      </nav>

      <header className="mb-10">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Where to Park Your Money for FIRE <br />
          <span className="text-primary">Global, Low-Cost, Tax-Savvy</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          The right accounts and funds can shave years off your FIRE timeline. This guide shows how to
          avoid home bias, keep costs low, and use country-specific tax wrappers without overcomplicating
          your plan.
        </p>
      </header>

      <div className="max-w-none">
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Key Principle</AlertTitle>
          <AlertDescription>
            Broad, low-cost diversification beats stock picking. Start with a simple global equity fund,
            add a bond sleeve matched to your risk tolerance, and automate contributions.
          </AlertDescription>
        </Alert>

        <h2>Why Placement Matters</h2>
        <p>
          Costs, taxes, and diversification drive long-term returns. Optimizing where you hold assets can
          add 0.5–1.0% per year—a massive difference over decades.
        </p>

        <h2 className="mt-16" id="home-bias">
          Avoiding Home Bias
        </h2>
        <p>
          Home bias is the tendency to overweight your domestic market. This increases concentration risk
          (currency, regulation, sector tilt). Global market-cap exposure reduces single-country
          drawdowns and captures growth wherever it occurs.
        </p>
        <p className="text-muted-foreground text-sm">
          Want a deeper dive? Read our{' '}
          <Link href="/learn/home-bias-in-investing" className="text-primary hover:underline">
            Home Bias Explained
          </Link>{' '}
          guide.
        </p>

        <h2 className="mt-16">Core Portfolio Recipe (Global First)</h2>
        <p>Pick one diversified equity base, then pair with a hedged bond fund if you need stability.</p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Global Equity (One-Fund)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-4">
                <li>US: VT (Vanguard Total World), or VTI + VXUS</li>
                <li>EU/EEA (PRIIPs): VWCE (FTSE All-World UCITS), or IWDA + EMIM</li>
                <li>UK: VWRA or VUAG</li>
                <li>Canada: VEQT or XEQT (all-in-one), or VTI+VEA+VEE if allowed</li>
                <li>Australia/NZ: DHHF, or VGS + VGE</li>
                <li>Asia (SG/HK): IE-domiciled ACWI/FTSE All-World equivalents where available</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Bonds & Stability</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-4">
                <li>US: BNDW (global aggregate) or BND/BNDX mix</li>
                <li>
                  EU/EEA/UK: AGGH (global agg hedged), or government bond UCITS hedged to home currency
                </li>
                <li>Canada: VAB (aggregate) or ZAG</li>
                <li>Australia: VAF or GOVT; NZ: NZB hedged options if available</li>
                <li>Cash bucket: 6–12 months in high-yield savings/term deposits for near-term needs</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="mt-16">Where to Hold (Tax Wrappers by Region)</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>US</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                401k/403b, Traditional & Roth IRA, HSA. Avoid PFICs if abroad. Use total-market ETFs.
              </p>
              <p className="text-muted-foreground text-sm">
                IRS basics:{' '}
                <Link
                  href="https://www.irs.gov/retirement-plans"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  irs.gov/retirement-plans
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UK</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                ISA for tax-free growth; SIPP for tax relief. Consider accumulating UCITS ETFs for
                simplicity.
              </p>
              <p className="text-muted-foreground text-sm">
                HMRC ISA guidance:{' '}
                <Link
                  href="https://www.gov.uk/individual-savings-accounts"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  gov.uk/individual-savings-accounts
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                RRSP (treaty relief on US ETFs), TFSA (note US withholding not fully relieved), and RESP
                for kids.
              </p>
              <p className="text-muted-foreground text-sm">
                CRA TFSA rules:{' '}
                <Link
                  href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  canada.ca/.../tax-free-savings-account
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sweden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                ISK for simplified tax and automatic reporting; KF when holding US/IE ETFs for better
                withholding outcomes.
              </p>
              <p className="text-muted-foreground text-sm">
                Skatteverket ISK info:{' '}
                <Link
                  href="https://www.skatteverket.se/privat/skatter/vardepapper/investeringssparkontoisk"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  skatteverket.se/.../isk
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>EU / EEA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                PRIIPs means UCITS ETFs. Choose accumulating share classes if tax-efficient. Mind local
                deemed-distribution rules.
              </p>
              <p className="text-muted-foreground text-sm">
                EU PRIIPs overview:{' '}
                <Link
                  href="https://finance.ec.europa.eu/consumer-finance-and-payments/retail-financial-services/key-information-documents-packaged-retail-and-insurance-based-investment-products-priips_en"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  finance.ec.europa.eu/.../priips
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Australia / NZ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                Superannuation for tax advantage. Outside super, consider broad ASX/NZX ETFs plus global
                UCITS/US-listed where permitted.
              </p>
              <p className="text-muted-foreground text-sm">
                ATO super basics:{' '}
                <Link
                  href="https://www.ato.gov.au/individuals/super/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ato.gov.au/individuals/super
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Singapore / Hong Kong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                Use reputable brokers with access to IE-domiciled ETFs (reduced withholding vs US). Watch
                FX and custody fees.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>India</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                Domestic index funds (Nifty 50/500, Sensex) for core. Overseas ETFs via LRS subject to
                limits and tax on foreign assets.
              </p>
              <p className="text-muted-foreground text-sm">
                RBI LRS details:{' '}
                <Link
                  href="https://rbi.org.in/scripts/FAQView.aspx?Id=115"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  rbi.org.in/.../FAQView.aspx?Id=115
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="mt-16">Broker Checklist</h2>
        <ul className="mb-6 list-disc space-y-2 pl-5">
          <li>Regulation and investor protection (SIPC/FSCS/IIROC/etc.)</li>
          <li>All-in costs: commissions, FX spreads, custody, inactivity, and withdrawal fees</li>
          <li>Fractional shares and automatic DCA support</li>
          <li>Access to UCITS/PRIIPs-compliant funds if required</li>
          <li>Reliable tax documents (1099, T5, annual statements) and easy export</li>
        </ul>

        <h2 className="mt-16">Execution Playbook</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Define your target mix (e.g., 90/10 or 70/30) and write a one-page IPS.</li>
          <li>Automate monthly contributions; avoid market timing.</li>
          <li>Rebalance annually or when allocations drift 5–10 points.</li>
          <li>Keep 6–12 months of expenses in cash to manage withdrawal risk.</li>
          <li>Review tax changes yearly; wrappers and treaty benefits can shift.</li>
        </ol>

        <h2 className="mt-16">Further Reading & Evidence</h2>
        <ul className="mb-6 list-disc space-y-2 pl-5">
          <li>
            Vanguard Research, “Global equity investing: The benefits of diversification” —{' '}
            <Link
              href="https://corporate.vanguard.com/content/dam/corp/research/pdf/global-equity-investing-benefits-diversification.pdf"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vanguard
            </Link>
          </li>
          <li>
            MSCI, “The Home Bias Effect in Global Portfolios” —{' '}
            <Link
              href="https://www.msci.com/research-and-insights/quick-take/did-home-bias-help"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MSCI
            </Link>
          </li>
          <li>
            SPIVA scorecards (active vs passive) —{' '}
            <Link
              href="https://www.spglobal.com/spdji/en/research-insights/spiva/"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              S&P Dow Jones Indices
            </Link>
          </li>
          <li>
            Bogleheads “Three-Fund Portfolio” —{' '}
            <Link
              href="https://www.bogleheads.org/wiki/Three-fund_portfolio"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bogleheads Wiki
            </Link>
          </li>
        </ul>

        <div className="my-10 grid gap-4 sm:grid-cols-2">
          <Link href="/">
            <Button size="lg" className="w-full text-lg">
              Run the FIRE Calculator →
            </Button>
          </Link>
          <Link href="/learn/safe-withdrawal-rate-4-percent-rule">
            <Button size="lg" variant="secondary" className="w-full text-lg">
              Learn Safe Withdrawals →
            </Button>
          </Link>
        </div>

        <FaqSection faqs={faqs} className="my-12" />

        <AuthorBio />
      </div>
    </article>
  );
}
