export interface Article {
  slug: string;
  title: string;
  category: string;
  readMins: number;
  summary: string;
  body: string[];
}

export const articles: Article[] = [
  {
    slug: "fixed-vs-variable-mortgage",
    title: "Fixed vs. Variable: How to Actually Choose",
    category: "Mortgage Basics",
    readMins: 7,
    summary:
      "The real trade-off isn't rate — it's how much payment uncertainty you can absorb over your term.",
    body: [
      "A fixed-rate mortgage locks your interest rate for the full term, so your payment never changes no matter what happens to the Bank of Canada's policy rate. A variable-rate mortgage moves with prime, which means your payment (or the portion going to interest) can rise or fall during your term.",
      "Historically, variable rates have cost less than fixed rates more often than not over a full amortization. But 'historically cheaper on average' is not the same as 'cheaper for you, this term.' The right question is not which product is statistically better — it's whether a payment increase of a few hundred dollars a month would meaningfully strain your budget.",
      "If you have little slack in your monthly budget, a fixed rate buys certainty even if it costs a bit more. If you have a financial cushion and a longer time horizon, a variable rate lets you benefit when rates fall, with the option to lock in later.",
      "Also worth checking: variable-rate mortgages usually have lower penalties to break early (typically three months' interest) compared to fixed-rate mortgages, which can use the more expensive interest rate differential (IRD) calculation. If you expect to move, refinance, or renew early, that difference matters.",
    ],
  },
  {
    slug: "how-the-stress-test-works",
    title: "How the Mortgage Stress Test Actually Works",
    category: "Qualifying",
    readMins: 6,
    summary:
      "Every insured and uninsured mortgage in Canada is qualified at a higher rate than you'll actually pay. Here's why, and how to calculate it yourself.",
    body: [
      "Since 2018, federally regulated lenders must qualify every mortgage applicant at the greater of their contract rate plus 2%, or a minimum benchmark rate. This is the 'stress test' — it exists to make sure you could still afford your payments if rates rose.",
      "Your lender then checks two ratios against your qualifying payment: Gross Debt Service (GDS), which is housing costs divided by income and must generally stay under 39%, and Total Debt Service (TDS), which adds your other debts and must stay under 44%.",
      "This means the price you qualify for is usually lower than what your actual (contract-rate) payment would suggest you can afford. It's a common source of surprise for first-time buyers — running the numbers before you shop can save a lot of disappointment at the pre-approval stage.",
    ],
  },
  {
    slug: "first-time-home-buyer-guide",
    title: "The First-Time Buyer's Guide to Getting Mortgage-Ready",
    category: "Getting Started",
    readMins: 9,
    summary:
      "A practical order of operations: credit, down payment, pre-approval, and the programs designed specifically for first-time buyers.",
    body: [
      "Start with your credit report, not your house search. Most lenders want to see a credit score of at least 600–680 for the best rates, and errors on credit reports are more common than people expect — check yours early enough to fix problems.",
      "Next, figure out your down payment and where it's coming from. Gifted down payments from immediate family are generally accepted with a signed letter; borrowed down payments (outside of specific programs) usually are not.",
      "Get a real pre-approval, not just a rate quote. A pre-approval involves a lender reviewing your income, debt and credit, and gives you a rate hold — typically 90-120 days — so you're protected if rates rise while you shop.",
      "Look into first-time buyer programs: the Home Buyers' Plan lets you withdraw from your RRSP tax-free for a down payment, the First Home Savings Account (FHSA) combines RRSP-style deductions with TFSA-style tax-free growth, and most provinces offer a land transfer tax rebate for first-time buyers.",
    ],
  },
  {
    slug: "understanding-cmhc-insurance",
    title: "Understanding CMHC Mortgage Insurance",
    category: "Mortgage Basics",
    readMins: 5,
    summary:
      "If your down payment is under 20%, you'll pay for default insurance. Here's what it actually protects, and how the premium is calculated.",
    body: [
      "Mortgage default insurance protects the lender — not you — if you stop making payments. It's required by law on any mortgage with a down payment under 20% (a 'high-ratio' mortgage), and it's what allows lenders to offer those mortgages at all.",
      "The premium is calculated as a percentage of your loan amount, and the percentage rises as your loan-to-value ratio rises — a 19% down payment pays a much smaller premium rate than a 5% down payment.",
      "The premium can be paid upfront or, more commonly, added to your mortgage principal and amortized along with the rest of your loan. In several provinces, provincial sales tax on the premium itself is due upfront and can't be added to the mortgage.",
    ],
  },
  {
    slug: "closing-costs-checklist",
    title: "The Closing Costs Nobody Warns You About",
    category: "Getting Started",
    readMins: 6,
    summary:
      "Budget for 1.5%–4% of the purchase price beyond your down payment. Here's exactly where that money goes.",
    body: [
      "Land transfer tax is usually the single largest closing cost, and it varies significantly by province and, in Toronto's case, by an additional municipal tax on top of the provincial one.",
      "Legal fees and disbursements (title search, registration) typically run $1,000–$2,000. Title insurance, home inspection, and appraisal fees each add a few hundred dollars more.",
      "Don't forget adjustments — reimbursing the seller for prepaid property tax or utilities — and the practical costs of actually moving. A simple rule of thumb: budget 1.5% to 4% of the purchase price, on top of your down payment, for closing.",
    ],
  },
  {
    slug: "renewal-vs-refinance",
    title: "Renewal vs. Refinance: What's the Difference?",
    category: "Existing Homeowners",
    readMins: 5,
    summary:
      "Your term ends far more often than your amortization does. Knowing the difference determines your options — and your leverage.",
    body: [
      "A mortgage renewal happens at the end of your term (commonly 1–5 years) when your current agreement expires, but your amortization continues. You can renew with your existing lender or move to a new one — shopping around at renewal is one of the most underused ways to save money.",
      "A refinance is a new mortgage you actively apply for, usually to access home equity, consolidate debt, or change your rate/term outside the normal renewal timeline. Refinancing involves a new stress test and may involve breaking your current term, which can trigger a prepayment penalty.",
      "If you're happy with your lender and rate environment, renewal is simpler. If your needs have changed — you want to pull out equity, or consolidate higher-interest debt — refinancing might be worth the penalty, but run the math first.",
    ],
  },
];
