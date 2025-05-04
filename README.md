![InvestingFIRE logo](/src/app/apple-icon.png)

# InvestingFIRE 🔥 — The #1 Interactive FIRE Calculator

**InvestingFIRE** is a responsive web application for calculating your path to Financial Independence and Early Retirement (FIRE). It features a year-by-year projection engine that simulates both accumulation (savings and investment growth) and retirement (withdrawals) phases, allowing users to:

- Input starting capital, monthly savings, expected annual growth rate, inflation rate, current age, desired retirement age, life expectancy, and desired monthly retirement allowance.
- View a dynamic chart displaying projected portfolio balance and monthly allowance over time.
- Instantly see their estimated “FIRE number” (required capital at retirement), how long their capital will last, and compare results to the “4% rule.”
- Adjust assumptions live, with all calculations and visualizations updating automatically.
- Access explanatory content about FIRE methodology, key variables, and additional community resources, all on a single, consolidated page.

The project’s code is structured using React/Next.js with TypeScript, focusing on user experience, modern UI components, and clarity of financial assumptions.

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
   npm install
   ```
3. **Run the app**
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) and unleash the fire.

Deployed version: [https://investingfire.com](https://investingfire.com)

---

## ✏️ Inputs & Variables

- **Starting Capital** — How much you’ve already invested
- **Monthly Savings** — What you’ll add each month
- **Current Age & Retirement Age** — Your FI timeline
- **Life Expectancy** — How long do you want income to last?
- **Expected Growth Rate (CAGR)** — Portfolio annual % return, before inflation
- **Inflation Rate** — Cost of living increases
- **Desired Monthly Allowance** — Your lifestyle, today’s dollars

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
