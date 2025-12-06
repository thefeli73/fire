import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background z-10 w-full border-t">
      <div className="from-primary/15 to-secondary/10 bg-gradient-to-b py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="bg-background/80 shadow-primary/10 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3 shadow-sm backdrop-blur">
            <div className="text-primary text-sm font-semibold">
              InvestingFIRE is ad-free and built as an educational tool.
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="space-y-3">
              <h3 className="font-bold">InvestingFIRE</h3>
              <p className="text-muted-foreground text-sm">
                The most accurate FIRE calculator on the web. Plan your path to financial independence
                with clarity and confidence.
              </p>
            </div>

            {/* Tools */}
            <div className="space-y-3">
              <h4 className="font-semibold">Tools</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                    #1 FIRE Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://ghostfolio.schulze.network"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Free hosted Ghostfolio
                  </Link>
                </li>
              </ul>
            </div>

            {/* Learn */}
            <div className="space-y-3">
              <h4 className="font-semibold">Learn</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/learn"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn/what-is-fire"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    What is FIRE?
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn/safe-withdrawal-rate-4-percent-rule"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    The 4% Rule
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn/coast-fire-vs-lean-fire"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Coast vs. Lean FIRE
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal / About */}
            {/*}
            <div className="space-y-3">
              <h4 className="font-semibold">About</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://schulze.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Schulze.network
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/SchulzeGit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            */}
          </div>

          <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-xs">
            <p>
              © {new Date().getFullYear().toString()} InvestingFIRE. All rights reserved. |{' '}
              <a
                href="https://schulze.network"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Hosting by Schulze.network
              </a>
            </p>
            <p className="mt-2">
              Disclaimer: This calculator is for educational purposes only. Consult a financial advisor
              before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
