export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  tag: string;
  excerpt: string;
  body: string[];
}

export const posts: BlogPost[] = [
  {
    slug: "bank-of-canada-rate-outlook",
    title: "What the Bank of Canada's Latest Rate Hold Means for Mortgage Shoppers",
    date: "2026-07-14",
    author: "MortgageVerse Editorial",
    tag: "Rates",
    excerpt:
      "The policy rate held steady again this quarter. Here's how that ripples through variable rates, fixed pricing, and the stress test benchmark.",
    body: [
      "The Bank of Canada's overnight rate directly drives prime rate, which is what variable-rate mortgages and HELOCs are priced against. A hold means existing variable-rate borrowers see no change to their payment this cycle.",
      "Fixed mortgage rates move independently, tracking Government of Canada bond yields, which price in expectations about where the policy rate is headed — not just where it is today. That's why fixed rates sometimes move even when the Bank does nothing.",
      "For buyers who haven't locked a rate hold yet, the practical takeaway is the same as always: get pre-approved early, and re-run your affordability and stress test numbers whenever the rate environment shifts materially.",
    ],
  },
  {
    slug: "spring-market-first-time-buyers",
    title: "5 Things First-Time Buyers Are Getting Wrong This Spring",
    date: "2026-06-02",
    author: "MortgageVerse Editorial",
    tag: "Buyer Tips",
    excerpt:
      "From skipping pre-approval to underestimating closing costs — the patterns we keep seeing in this year's buyer questions.",
    body: [
      "Shopping before getting pre-approved remains the most common misstep — it leads to falling for homes outside your real budget, then re-calibrating expectations under time pressure.",
      "The second most common issue: treating the down payment as the whole cash requirement, and forgetting to budget separately for closing costs, which typically run 1.5%–4% of the purchase price.",
      "We're also seeing buyers stress-test their own comfort level, not just the federal stress test — running their numbers at a rate a point or two above their contract rate to make sure a future renewal wouldn't be a shock.",
    ],
  },
  {
    slug: "fhsa-vs-rrsp-home-buyers-plan",
    title: "FHSA vs. RRSP Home Buyers' Plan: Can You Use Both?",
    date: "2026-05-19",
    author: "MortgageVerse Editorial",
    tag: "Savings Strategy",
    excerpt:
      "Short answer: yes, and combining them is one of the more effective down-payment strategies available to first-time buyers today.",
    body: [
      "The First Home Savings Account (FHSA) offers RRSP-style tax deductions on the way in and TFSA-style tax-free withdrawals on the way out, specifically for a first home purchase, up to its lifetime contribution limit.",
      "The Home Buyers' Plan (HBP) lets you withdraw from an existing RRSP tax-free for a down payment, provided you repay it over 15 years.",
      "Used together, a buyer can combine FHSA withdrawals with an HBP withdrawal toward the same purchase, meaningfully increasing the down payment they can pull from registered savings — worth modelling early, since the FHSA in particular needs time to accumulate contribution room.",
    ],
  },
  {
    slug: "condo-fees-and-qualifying",
    title: "Why Condo Fees Can Shrink Your Mortgage Approval More Than You'd Expect",
    date: "2026-04-08",
    author: "MortgageVerse Editorial",
    tag: "Qualifying",
    excerpt:
      "Lenders include half of your condo fees in your debt service ratios — which means a $600/month fee can meaningfully reduce your approved amount.",
    body: [
      "Under standard GDS/TDS calculations, lenders include 50% of monthly condo fees as a housing cost, alongside your mortgage payment, property tax and heating.",
      "That means two identically priced properties — one freehold, one condo with high fees — can produce noticeably different qualifying amounts for the same buyer.",
      "If you're condo shopping, it's worth running your numbers with the specific building's fees rather than a rough citywide average, since fees vary widely by building age, amenities and reserve fund health.",
    ],
  },
];
