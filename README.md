![InvestingFIRE logo](/src/app/apple-icon.png)

# InvestingFIRE 🔥 — The #1 Interactive FIRE Calculator

**InvestingFIRE** is a responsive web application for calculating your path to Financial Independence and Early Retirement (FIRE). It features a year-by-year projection engine that simulates both accumulation (savings and investment growth) and retirement (withdrawals) phases.

Deployed version: [https://investingfire.com](https://investingfire.com)

---

## 🎯 Goal & Vision

### **Goal**
To build the most comprehensive, user-friendly, and transparent open-source financial independence calculator on the web.

### **Vision**
Democratize financial planning by providing professional-grade simulation tools in an accessible, privacy-focused, and beautiful interface. We believe everyone should have the ability to model their financial future without needing a finance degree or expensive software.

### **Business Model**
InvestingFIRE operates on a transparent open-source model:
1.  **Free Forever Core:** The essential calculation tools will always be free and open-source.
2.  **Community Supported:** We rely on community contributions (code & feedback) to improve the tool.
3.  **Educational Affiliates:** We may curate high-quality resources (books, courses, tools) to help users on their journey, keeping the tool free of intrusive ads.

---

## 🗺️ Roadmap

We are actively expanding the capabilities of InvestingFIRE. Below is our plan broken down into phases.

### **Phase 1: Enhanced Simulation (The Engine)**
Focus on making the math more robust and flexible.
- [ ] **Coast FIRE Mode:** Option to stop contributions at a certain age but retire later.
- [ ] **Barista FIRE Mode:** Include part-time income during "retirement" years.
- [ ] **Monte Carlo Simulations:** Add probabilistic outcomes (e.g., "95% chance of success") instead of just deterministic linear growth.
- [ ] **Variable Withdrawal Strategies:** Implement dynamic withdrawal rules (e.g., Guyton-Klinger) beyond just fixed inflation-adjusted withdrawals.

### **Phase 2: User Experience & Persistence**
Make the tool easier to use and return to.
- [ ] **URL State Sharing:** Encode form values into the URL so scenarios can be bookmarked and shared.
- [ ] **Local Persistence:** Automatically save user inputs to `localStorage` so they don't vanish on refresh.
- [ ] **Locale Support:** Allow users to select number formatting while keeping calculator amounts currency-agnostic.

### **Phase 3: Advanced Features & Analytics**
For the power users who need more detail.
- [ ] **Tax Considerations:** Simple toggles for Pre-tax vs. Post-tax estimations.
- [ ] **Scenario Comparison:** Compare two different plans side-by-side (e.g., "Retire at 45 vs 55").
- [ ] **Data Export:** Download projection data as CSV or PDF reports.

### **Phase 4: Content & Community**
- [ ] **Blog/Guides:** Integrate a CMS (like Markdown/MDX) for in-depth financial guides.
- [ ] **Community Presets:** "One-click" setups for common strategies (e.g., "Lean FIRE", "Fat FIRE").

---

## 🚀 Features at a Glance

- **⚡️ Real-Time Projections:** Every field updates the chart _as you type_. Experiment with savings, growth rates, inflation, or retirement age and see your future instantly.
- **📈 Interactive Chart:** Dual-area plots for portfolio value and future monthly spending, plus reference lines for FIRE milestones and “4% rule” legends.
- **🧠 Education Baked In:** Contextual tooltips, deep-dive sections on how FIRE works, FAQs, and must-read resources included.
- **🔎 Detailed Methodology:** Not just a 25x rule — runs a full, year-by-year simulation with inflation-adjusted withdrawals and optional 4%-rule overlays.
- **👌 Modern UX:** Typing, sliding, or clicking feels _good_. Responsive on all devices.

---

## 🧰 How It Works

The calculator models your FIRE journey in two phases:

1. **Accumulation:**
   - Your starting capital is grown by your expected CAGR (~7% by default).
   - Monthly savings are added for each year until retirement.
   - Every variable can be adjusted live (capital, savings, age, growth, inflation, spending, target retirement).

2. **Retirement:**
   - Your balance continues to grow by CAGR.
   - Each year, an inflation-adjusted monthly allowance is withdrawn.
   - The simulation runs until your selected life expectancy, showing the possibility of portfolio depletion.

**Key Outputs:**

- 🔥 “FIRE Number”: Portfolio value at your defined retirement age
- 📊 Interactive projection chart: See how your nest egg and withdrawals evolve over time
- 4️⃣ “4% Rule” overlays: Compare dynamic results to classic rule-of-thumb

---

## 🌟 Try It For Yourself

To run locally:

1. **Clone the repo**
   ```bash
   git clone https://git.schulze.network/schulze/fire.git
   cd fire
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Run the app**
   ```bash
   pnpm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) and unleash the fire.

### Running Tests 🧪

We use **Vitest** for unit testing and **Playwright** for end-to-end (E2E) testing.

**Unit Tests:**
```bash
pnpm test
```

**E2E Tests:**
```bash
# First install browsers (only needed once)
pnpm exec playwright install

# Run tests
pnpm test:e2e
```

---

## ✏️ Inputs & Variables

- **Starting Capital** — How much you’ve already invested
- **Monthly Savings** — What you’ll add each month
- **Current Age & Retirement Age** — Your FI timeline
- **Life Expectancy** — How long do you want income to last?
- **Expected Growth Rate (CAGR)** — Portfolio annual % return, before inflation
- **Inflation Rate** — Cost of living increases
- **Desired Monthly Allowance** — Your lifestyle, today’s value

As you adjust these, all projections update instantly _without needing to hit “Calculate.”_

Try many “what ifs” fast.

---

## 👩‍💻 Contributing

Pull requests are welcome! Open issues for bugs, new features, or debate about safe withdrawal rates and tax assumptions.

---

## 📄 License

[GPL-3.0](./LICENSE)

---

## 🥇 Why Use InvestingFIRE?

- You want the truth — not just a 4% fantasy.
- You want to learn, not just punch in numbers.
- You want clarity, speed, and modern UI.
- You want to show your friends the best FIRE tool on the web.

Enjoy the _rocket ride_ to financial independence.  
**InvestingFIRE — Know your number. Change your future.**
