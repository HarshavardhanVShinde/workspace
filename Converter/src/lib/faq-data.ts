export type FAQ = { question: string; answer: string };
export type FAQMap = Record<string, FAQ[]>;

export const FAQ_DATA: FAQMap = {
  "/sip-calculator": [
    { question: "What is SIP?", answer: "SIP (Systematic Investment Plan) is a disciplined way to invest a fixed amount in mutual funds at regular intervals, helping average out market volatility and build wealth over time." },
    { question: "How does the SIP calculator compute returns?", answer: "We use monthly compounding with your input amount, expected annual return, and duration to estimate future value. Actual returns may vary based on fund performance and market conditions." },
    { question: "Can I change frequency or step-up amount?", answer: "Yes. Adjust SIP amount, tenure, and expected return. You can also test different scenarios to plan your investments more effectively." }
  ],
  "/emi-calculator": [
    { question: "What is EMI?", answer: "EMI (Equated Monthly Installment) is a fixed payment made every month to repay a loan, comprising both principal and interest." },
    { question: "How is EMI calculated?", answer: "EMI is calculated using the standard formula: P × r × (1 + r)^n ÷ [(1 + r)^n − 1], where P is principal, r is the monthly interest rate, and n is the number of months." },
    { question: "Does prepayment reduce EMI or tenure?", answer: "Prepayment can reduce either the EMI or the loan tenure depending on your lender’s policy. Use scenarios to see impact on total interest." }
  ],
  "/currency-converter": [
    { question: "Where do exchange rates come from?", answer: "Rates are sourced from reliable APIs and refreshed frequently. Minor delays or discrepancies can occur across providers." },
    { question: "How often are rates updated?", answer: "We update rates regularly and cache results for performance. You can refresh to fetch the latest rates as needed." },
    { question: "Does the converter work offline?", answer: "Recent rates may be cached, but a live connection is required to fetch the most accurate exchange rates." }
  ],
  "/bmi-calculator": [
    { question: "What is BMI?", answer: "BMI (Body Mass Index) is a screening measure that uses height and weight to categorize individuals as underweight, normal, overweight, or obese." },
    { question: "Is BMI accurate for athletes?", answer: "BMI may overestimate body fat for muscular individuals. Consider additional metrics like body fat percentage, waist circumference, and activity level." },
    { question: "Which units are supported?", answer: "You can switch between metric and imperial units and get instant recalculations with category guidance." }
  ],
  "/age-calculator": [
    { question: "What does the age calculator show?", answer: "It computes exact age in years, months, and days, with additional breakdowns for weeks and hours." },
    { question: "Can I calculate future age?", answer: "Yes. Enter a target date to see your age on that date for planning events or milestones." },
    { question: "Does it handle leap years?", answer: "Yes, calculations account for leap years to ensure accurate results." }
  ],
  "/fd-calculator": [
    { question: "How is FD interest calculated?", answer: "FD (Fixed Deposit) returns are computed using compounding based on your selected frequency (monthly/quarterly/half-yearly/annually)." },
    { question: "What factors affect FD maturity?", answer: "Principal amount, interest rate, compounding frequency, and tenure determine maturity value." },
    { question: "Are FD returns taxable?", answer: "Interest earned on FDs is typically taxable per local regulations. Check with your tax advisor for details." }
  ],
  "/unit-converter": [
    { question: "What can I convert?", answer: "Convert a wide range of units across length, weight, volume, temperature, area, and more—instantly." },
    { question: "How accurate are conversions?", answer: "We use standard conversion factors. For specialized scientific use, double-check with domain standards." },
    { question: "Can I switch units easily?", answer: "Yes, pick source and target units and see immediate results with keyboard support and mobile-friendly UI." }
  ],
  "/scientific-calculator": [
    { question: "What functions are supported?", answer: "Perform arithmetic, trigonometry, logarithms, exponents, and parentheses operations with a clean interface." },
    { question: "Is it mobile-friendly?", answer: "Yes, the calculator adapts to small screens and supports dark mode for comfortable use." },
    { question: "Can I use keyboard input?", answer: "Keyboard input is supported for faster calculations and productivity." }
  ],
};