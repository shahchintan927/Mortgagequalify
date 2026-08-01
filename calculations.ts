// All figures are estimates for planning purposes only and are not
// financial, legal, or tax advice. Rates, brackets, and premiums change —
// always confirm current numbers with a licensed mortgage professional,
// lawyer, or CMHC before making a decision.

export type Frequency = "monthly" | "biweekly" | "accelerated-biweekly" | "weekly";

const PAYMENTS_PER_YEAR: Record<Frequency, number> = {
  monthly: 12,
  biweekly: 26,
  "accelerated-biweekly": 26,
  weekly: 52,
};

/** Convert a nominal annual rate (compounded semi-annually, Canadian mortgage
 * convention) into an effective per-payment-period rate. */
function periodicRate(annualRatePct: number, paymentsPerYear: number) {
  const i = annualRatePct / 100;
  const semiAnnual = Math.pow(1 + i / 2, 2 / paymentsPerYear) - 1;
  return semiAnnual;
}

export function calculatePayment(
  principal: number,
  annualRatePct: number,
  amortizationYears: number,
  frequency: Frequency
) {
  const n = amortizationYears * PAYMENTS_PER_YEAR[frequency];
  const r = periodicRate(annualRatePct, PAYMENTS_PER_YEAR[frequency]);

  if (r === 0) return principal / n;

  let payment = (principal * r) / (1 - Math.pow(1 + r, -n));

  if (frequency === "accelerated-biweekly") {
    // accelerated = monthly payment / 2, paid 26x/year
    const monthly = calculatePayment(principal, annualRatePct, amortizationYears, "monthly");
    payment = monthly / 2;
  }

  return payment;
}

export interface AmortizationRow {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export function buildAmortizationSchedule(
  principal: number,
  annualRatePct: number,
  amortizationYears: number,
  frequency: Frequency,
  yearsToShow?: number
): AmortizationRow[] {
  const paymentsPerYear = PAYMENTS_PER_YEAR[frequency];
  const n = Math.round((yearsToShow ?? amortizationYears) * paymentsPerYear);
  const r = periodicRate(annualRatePct, paymentsPerYear);
  const payment = calculatePayment(principal, annualRatePct, amortizationYears, frequency);

  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let period = 1; period <= n && balance > 0; period++) {
    const interest = balance * r;
    let principalPortion = payment - interest;
    if (principalPortion > balance) principalPortion = balance;
    balance = Math.max(0, balance - principalPortion);
    rows.push({ period, payment, interest, principal: principalPortion, balance });
  }
  return rows;
}

/** Federal insured-mortgage price cap, effective Dec 15, 2024. Above this
 * price, a mortgage cannot be CMHC-insured regardless of down payment —
 * the buyer needs at least 20% down. */
export const MAX_INSURABLE_PRICE = 1_500_000;

export type PropertyUse = "principal" | "rental";

/** TDS ceiling depends on both insurance status and property use. GDS
 * stays fixed at 39% in every case. Insured mortgages (< 20% down) are
 * capped at 44% TDS regardless of use — that's the insurer's own limit.
 * Conventional (20%+ down) mortgages get lender discretion: 50% on a
 * principal residence, 44% on a rental/investment property. Note:
 * refinances are never CMHC-insurable in Canada, so they're always
 * evaluated as "conventional" here. */
export function tdsLimitFor(propertyUse: PropertyUse, downPaymentMode: DownPaymentMode = "conventional") {
  if (downPaymentMode === "insured") return 44;
  return propertyUse === "rental" ? 44 : 50;
}

/** Minimum down payment required under Canadian federal rules. */
export function minimumDownPayment(homePrice: number) {
  if (homePrice <= 500_000) return homePrice * 0.05;
  if (homePrice <= MAX_INSURABLE_PRICE) {
    return 500_000 * 0.05 + (homePrice - 500_000) * 0.1;
  }
  return homePrice * 0.2; // insured mortgages not available above the cap
}

/** Inverts the tiered minimum-down-payment schedule: given a fixed down
 * payment dollar amount, what's the highest home price at which that
 * amount would still satisfy the minimum down payment rule (5% on the
 * first $500K, 10% up to the insurable price cap)? Above the cap, no
 * down payment amount can buy more insured price, so it's clamped there. */
export function maxPriceForDownPaymentTier(downPayment: number, cap: number = MAX_INSURABLE_PRICE) {
  if (downPayment <= 0) return 0;
  const tier1DownAtCap = 500_000 * 0.05; // 25,000
  const tier2DownAtCap = tier1DownAtCap + (cap - 500_000) * 0.1;

  if (downPayment <= tier1DownAtCap) return downPayment / 0.05;
  if (downPayment <= tier2DownAtCap) return 500_000 + (downPayment - tier1DownAtCap) / 0.1;
  return cap;
}

/** CMHC mortgage default insurance premium, as a % of the loan amount,
 * based on loan-to-value (LTV) tier. Insured mortgages require LTV > 80%
 * and are only available on homes at or under $1.5M with amortization
 * capped at 30 years for qualifying buyers. */
export function cmhcPremiumRate(ltvPct: number) {
  if (ltvPct <= 65) return 0.006;
  if (ltvPct <= 75) return 0.017;
  if (ltvPct <= 80) return 0.024;
  if (ltvPct <= 85) return 0.028;
  if (ltvPct <= 90) return 0.031;
  if (ltvPct <= 95) return 0.04;
  return null; // not insurable
}

export function calculateCMHC(homePrice: number, downPayment: number) {
  const loanAmount = homePrice - downPayment;
  const ltv = (loanAmount / homePrice) * 100;
  const rate = cmhcPremiumRate(ltv);
  if (rate === null) {
    return { loanAmount, ltv, premiumRate: null, premium: 0, insurable: false };
  }
  const premium = loanAmount * rate;
  return { loanAmount, ltv, premiumRate: rate, premium, insurable: true };
}

/** Mortgage stress test: buyer must qualify at the greater of the contract
 * rate + 2%, or the current benchmark qualifying rate. */
export const STRESS_TEST_BENCHMARK_RATE = 5.25;

export function qualifyingRate(contractRatePct: number) {
  return Math.max(contractRatePct + 2, STRESS_TEST_BENCHMARK_RATE);
}

export function calculateStressTest(params: {
  grossAnnualIncome: number;
  monthlyDebts: number; // car loans, credit cards, other loan payments
  homePrice: number;
  downPayment: number;
  contractRatePct: number;
  amortizationYears: number;
  propertyTaxMonthly: number;
  heatingMonthly: number;
  condoFeesMonthly?: number;
  propertyUse?: PropertyUse;
}) {
  const {
    grossAnnualIncome,
    monthlyDebts,
    homePrice,
    downPayment,
    contractRatePct,
    amortizationYears,
    propertyTaxMonthly,
    heatingMonthly,
    condoFeesMonthly = 0,
    propertyUse = "principal",
  } = params;

  const loanAmount = homePrice - downPayment;
  const qRate = qualifyingRate(contractRatePct);
  const qualifyingPayment = calculatePayment(loanAmount, qRate, amortizationYears, "monthly");

  const monthlyIncome = grossAnnualIncome / 12;
  const condoFeeInclusion = condoFeesMonthly * 0.5;
  const tdsLimit = tdsLimitFor(propertyUse);

  // GDS: housing costs / income <= 39%
  const gdsCosts = qualifyingPayment + propertyTaxMonthly + heatingMonthly + condoFeeInclusion;
  const gdsRatio = (gdsCosts / monthlyIncome) * 100;

  // TDS: housing costs + other debts / income <= 50% (principal residence) or 44% (rental)
  const tdsCosts = gdsCosts + monthlyDebts;
  const tdsRatio = (tdsCosts / monthlyIncome) * 100;

  const passes = gdsRatio <= 39 && tdsRatio <= tdsLimit;

  return { qRate, qualifyingPayment, gdsRatio, tdsRatio, tdsLimit, passes, loanAmount };
}

/** Land transfer tax. Ontario + Toronto municipal tax modelled on published
 * marginal brackets; other provinces use a simplified single-rate estimate.
 * Always confirm with a real-estate lawyer before closing. */
export type Province =
  | "ON"
  | "ON-TORONTO"
  | "BC"
  | "AB"
  | "SK"
  | "MB"
  | "QC"
  | "OTHER";

function ontarioProvincialLTT(price: number) {
  const brackets: [number, number][] = [
    [55_000, 0.005],
    [250_000, 0.01],
    [400_000, 0.015],
    [2_000_000, 0.02],
    [Infinity, 0.025],
  ];
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of brackets) {
    if (price > lower) {
      tax += (Math.min(price, upper) - lower) * rate;
      lower = upper;
    }
  }
  return tax;
}

function torontoMunicipalLTT(price: number) {
  const brackets: [number, number][] = [
    [55_000, 0.005],
    [250_000, 0.01],
    [400_000, 0.015],
    [2_000_000, 0.02],
    [3_000_000, 0.025],
    [4_000_000, 0.035],
    [5_000_000, 0.045],
    [10_000_000, 0.055],
    [20_000_000, 0.065],
    [Infinity, 0.075],
  ];
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of brackets) {
    if (price > lower) {
      tax += (Math.min(price, upper) - lower) * rate;
      lower = upper;
    }
  }
  return tax;
}

function bcLTT(price: number) {
  const brackets: [number, number][] = [
    [200_000, 0.01],
    [2_000_000, 0.02],
    [3_000_000, 0.03],
    [Infinity, 0.05],
  ];
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of brackets) {
    if (price > lower) {
      tax += (Math.min(price, upper) - lower) * rate;
      lower = upper;
    }
  }
  return tax;
}

export function calculateLandTransferTax(
  price: number,
  province: Province,
  firstTimeBuyer: boolean
) {
  let provincial = 0;
  let municipal = 0;

  switch (province) {
    case "ON":
      provincial = ontarioProvincialLTT(price);
      break;
    case "ON-TORONTO":
      provincial = ontarioProvincialLTT(price);
      municipal = torontoMunicipalLTT(price);
      break;
    case "BC":
      provincial = bcLTT(price);
      break;
    case "AB":
    case "SK":
      provincial = Math.max(price * 0.001, 60); // registration-fee style, rough estimate
      break;
    case "MB":
      provincial = ontarioProvincialLTT(price); // similar marginal structure
      break;
    case "QC":
      provincial = ontarioProvincialLTT(price); // "welcome tax", similar shape
      break;
    default:
      provincial = price * 0.01;
  }

  let rebate = 0;
  if (firstTimeBuyer) {
    if (province === "ON" || province === "ON-TORONTO") rebate += Math.min(provincial, 4000);
    if (province === "ON-TORONTO") rebate += Math.min(municipal, 4475);
    if (province === "BC") rebate += Math.min(provincial, 8000);
  }

  const total = Math.max(0, provincial + municipal - rebate);
  return { provincial, municipal, rebate, total };
}

/** Rough estimate of one-time closing costs beyond land transfer tax. */
export function estimateClosingCosts(params: {
  homePrice: number;
  province: Province;
  cmhcPremium: number;
  includeCmhcTax: boolean;
  firstTimeBuyer?: boolean;
}) {
  const { homePrice, province, cmhcPremium, includeCmhcTax, firstTimeBuyer = false } = params;

  const legalFees = 1500;
  const titleInsurance = 350;
  const homeInspection = 550;
  const appraisal = 325;
  const movingCosts = 1200;
  const adjustments = homePrice * 0.001; // property tax / utility proration estimate

  const pstOnCmhcRates: Partial<Record<Province, number>> = {
    ON: 0.08,
    "ON-TORONTO": 0.08,
    SK: 0.06,
    MB: 0.07,
    QC: 0.09,
  };
  const cmhcTax = includeCmhcTax ? cmhcPremium * (pstOnCmhcRates[province] ?? 0) : 0;

  const lttResult = calculateLandTransferTax(homePrice, province, firstTimeBuyer);

  const items = [
    { label: "Legal / notary fees", amount: legalFees },
    { label: "Title insurance", amount: titleInsurance },
    { label: "Home inspection", amount: homeInspection },
    { label: "Appraisal fee", amount: appraisal },
    { label: "Land transfer tax", amount: lttResult.total },
    { label: "Tax on CMHC premium (if applicable)", amount: cmhcTax },
    { label: "Moving costs (estimate)", amount: movingCosts },
    { label: "Tax / utility adjustments", amount: adjustments },
  ];

  const total = items.reduce((sum, i) => sum + i.amount, 0);
  return { items, total, landTransferTax: lttResult };
}

/**
 * Solves for the maximum home price a buyer can afford, given a fixed down
 * payment dollar amount.
 *
 * Two modes:
 * - "conventional" (20%+ down): price is capped so the down payment is
 *   never less than 20% of it, even if income alone could stretch further.
 *   No CMHC involved.
 * - "insured" (<20% down): price is capped at the *smaller* of what income
 *   qualifies for, and what this specific down payment amount can support
 *   under the tiered minimum-down-payment rule (5% / 10%, capped at
 *   MAX_INSURABLE_PRICE) — plus the premium is solved iteratively since
 *   it's added to the loan and can shift which LTV tier applies.
 */
export type DownPaymentMode = "insured" | "conventional";

export interface AffordabilityInput {
  grossAnnualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  downPaymentMode: DownPaymentMode;
  propertyUse: PropertyUse;
  contractRatePct: number;
  amortizationYears: number;
  propertyTaxMonthly: number;
  heatingMonthly: number;
  condoFeesMonthly?: number;
}

export interface AffordabilityResult {
  qRate: number;
  maxQualifyingPayment: number; // income ceiling, before any down-payment cap
  bindingConstraint: "GDS" | "TDS";
  tdsLimit: number;
  maxLoanTotal: number; // income-ceiling loan, including any CMHC premium
  maxHomePrice: number; // final, after down-payment-tier / price-cap limits
  totalLoan: number; // actual loan at maxHomePrice, including any premium
  monthlyPayment: number; // actual payment at maxHomePrice (may be < maxQualifyingPayment)
  cmhcPremium: number;
  cmhcPremiumRate: number | null;
  ltv: number;
  usingInsurance: boolean;
  cappedByDownPayment: boolean;
  cappedByPriceLimit: boolean;
  gdsRatio: number;
  tdsRatio: number;
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const {
    grossAnnualIncome,
    monthlyDebts,
    downPayment,
    downPaymentMode,
    propertyUse,
    contractRatePct,
    amortizationYears,
    propertyTaxMonthly,
    heatingMonthly,
    condoFeesMonthly = 0,
  } = input;

  const monthlyIncome = grossAnnualIncome / 12;
  const qRate = qualifyingRate(contractRatePct);
  const condoInclusion = condoFeesMonthly * 0.5;
  const tdsLimit = tdsLimitFor(propertyUse, downPaymentMode);

  const gdsMax = monthlyIncome * 0.39 - propertyTaxMonthly - heatingMonthly - condoInclusion;
  const tdsMax =
    (monthlyIncome * tdsLimit) / 100 - propertyTaxMonthly - heatingMonthly - condoInclusion - monthlyDebts;
  const maxQualifyingPayment = Math.max(0, Math.min(gdsMax, tdsMax));
  const bindingConstraint: "GDS" | "TDS" = gdsMax <= tdsMax ? "GDS" : "TDS";

  const n = amortizationYears * 12;
  const r = periodicRate(qRate, 12);
  const maxLoanTotal =
    r === 0 ? maxQualifyingPayment * n : (maxQualifyingPayment * (1 - Math.pow(1 + r, -n))) / r;

  let finalPrice: number;
  let loanRaw: number;
  let premium = 0;
  let premiumRate: number | null = null;
  let cappedByDownPayment = false;
  let cappedByPriceLimit = false;

  if (downPaymentMode === "conventional") {
    const priceByIncome = maxLoanTotal + downPayment;
    const priceByDownRule = downPayment / 0.2;
    finalPrice = Math.min(priceByIncome, priceByDownRule);
    cappedByDownPayment = priceByDownRule < priceByIncome;
    loanRaw = Math.max(0, finalPrice - downPayment);
  } else {
    // Solve price + premium assuming the full income ceiling is used.
    let priceByIncome = maxLoanTotal + downPayment;
    let rawLoanGuess = maxLoanTotal;
    for (let i = 0; i < 8; i++) {
      const ltvGuess = priceByIncome > 0 ? (rawLoanGuess / priceByIncome) * 100 : 0;
      if (ltvGuess <= 80) break; // no premium needed at this LTV
      const rate = cmhcPremiumRate(ltvGuess);
      if (rate === null) break; // resolved by the price/down-payment caps below
      rawLoanGuess = maxLoanTotal / (1 + rate);
      const newPrice = rawLoanGuess + downPayment;
      if (Math.abs(newPrice - priceByIncome) < 1) {
        priceByIncome = newPrice;
        break;
      }
      priceByIncome = newPrice;
    }

    const priceByDownTier = maxPriceForDownPaymentTier(downPayment, MAX_INSURABLE_PRICE);
    finalPrice = Math.min(priceByIncome, priceByDownTier, MAX_INSURABLE_PRICE);
    cappedByDownPayment = finalPrice === priceByDownTier && priceByDownTier < priceByIncome;
    cappedByPriceLimit = finalPrice === MAX_INSURABLE_PRICE && MAX_INSURABLE_PRICE < priceByIncome;

    loanRaw = Math.max(0, finalPrice - downPayment);
    const ltv = finalPrice > 0 ? (loanRaw / finalPrice) * 100 : 0;
    premiumRate = cmhcPremiumRate(ltv);
    premium = premiumRate ? loanRaw * premiumRate : 0;
  }

  const ltvFinal = finalPrice > 0 ? (loanRaw / finalPrice) * 100 : 0;
  const totalLoan = loanRaw + premium;
  const monthlyPayment = calculatePayment(totalLoan, qRate, amortizationYears, "monthly");

  const gdsCosts = monthlyPayment + propertyTaxMonthly + heatingMonthly + condoInclusion;
  const gdsRatio = monthlyIncome > 0 ? (gdsCosts / monthlyIncome) * 100 : 0;
  const tdsRatio = monthlyIncome > 0 ? ((gdsCosts + monthlyDebts) / monthlyIncome) * 100 : 0;

  return {
    qRate,
    maxQualifyingPayment: Math.max(0, maxQualifyingPayment),
    bindingConstraint,
    tdsLimit,
    maxLoanTotal: Math.max(0, maxLoanTotal),
    maxHomePrice: Math.max(0, finalPrice),
    totalLoan,
    monthlyPayment,
    cmhcPremium: premium,
    cmhcPremiumRate: premiumRate,
    ltv: ltvFinal,
    usingInsurance: downPaymentMode === "insured" && premium > 0,
    cappedByDownPayment,
    cappedByPriceLimit,
    gdsRatio,
    tdsRatio,
  };
}

/** Compares a chosen payment frequency (e.g. accelerated biweekly) against
 * a standard monthly schedule at the same rate and amortization, to show
 * how much sooner the mortgage is paid off and how much interest is saved. */
export interface PayoffComparison {
  standardMonths: number;
  actualMonths: number;
  monthsSaved: number;
  yearsSaved: number;
  standardTotalInterest: number;
  actualTotalInterest: number;
  interestSaved: number;
}

export function calculatePayoffSavings(
  principal: number,
  annualRatePct: number,
  amortizationYears: number,
  frequency: Frequency
): PayoffComparison {
  const standardSchedule = buildAmortizationSchedule(principal, annualRatePct, amortizationYears, "monthly");
  const actualSchedule = buildAmortizationSchedule(principal, annualRatePct, amortizationYears, frequency);

  const standardMonths = standardSchedule.length;
  const actualMonths = (actualSchedule.length / PAYMENTS_PER_YEAR[frequency]) * 12;

  const standardTotalInterest = standardSchedule.reduce((s, r) => s + r.interest, 0);
  const actualTotalInterest = actualSchedule.reduce((s, r) => s + r.interest, 0);

  const monthsSaved = Math.max(0, standardMonths - actualMonths);

  return {
    standardMonths,
    actualMonths,
    monthsSaved,
    yearsSaved: monthsSaved / 12,
    standardTotalInterest,
    actualTotalInterest,
    interestSaved: Math.max(0, standardTotalInterest - actualTotalInterest),
  };
}

export interface AnnualSummaryRow {
  year: number;
  totalPayments: number;
  totalInterest: number;
  totalPrincipal: number;
  endingBalance: number;
}

export function buildAnnualSummary(rows: AmortizationRow[], paymentsPerYear: number): AnnualSummaryRow[] {
  const byYear = new Map<number, AnnualSummaryRow>();
  for (const row of rows) {
    const year = Math.ceil(row.period / paymentsPerYear);
    const existing = byYear.get(year) ?? {
      year,
      totalPayments: 0,
      totalInterest: 0,
      totalPrincipal: 0,
      endingBalance: 0,
    };
    existing.totalPayments += row.payment;
    existing.totalInterest += row.interest;
    existing.totalPrincipal += row.principal;
    existing.endingBalance = row.balance;
    byYear.set(year, existing);
  }
  return Array.from(byYear.values());
}

export function formatCurrency(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 2) {
  return `${value.toFixed(fractionDigits)}%`;
}
