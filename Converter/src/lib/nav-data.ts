export interface NavItem {
  label: string;
  href: string;
  icon?: string; // lucide icon name reference (optional)
}

export interface NavCategory {
  key: string;
  label: string;
  items: NavItem[];
}

// Central source of truth used by both header & sidebar
export const NAV_CATEGORIES: NavCategory[] = [
  {
    key: 'finance',
    label: 'Financial Calculators',
    items: [
      // Old finance tools retained
      { label: 'SIP Calculator', href: '/sip-calculator', icon: 'DollarSign' },
      { label: 'EMI Calculator', href: '/emi-calculator', icon: 'DollarSign' },
      { label: 'FD Calculator', href: '/fd-calculator', icon: 'DollarSign' },
      { label: 'RD Calculator', href: '/rd-calculator', icon: 'DollarSign' },
      { label: 'PPF Calculator', href: '/ppf-calculator', icon: 'DollarSign' },
      { label: 'EPF Calculator', href: '/epf-calculator', icon: 'DollarSign' },
      { label: 'GST Calculator', href: '/gst-calculator', icon: 'DollarSign' },
      { label: 'XIRR Calculator', href: '/xirr-calculator', icon: 'Percent' },
      { label: 'SWP Calculator', href: '/swp-calculator', icon: 'DollarSign' },

      // New finance suite
      // { label: 'Mortgage Calculator', href: '/mortgage-calculator', icon: 'Calculator' },
      // { label: 'Loan Calculator', href: '/loan-calculator', icon: 'Calculator' },
      // { label: 'Auto Loan Calculator', href: '/auto-loan-calculator', icon: 'Calculator' },
      // { label: 'Interest Calculator', href: '/interest-calculator', icon: 'Calculator' },
      // { label: 'Payment Calculator', href: '/payment-calculator', icon: 'Calculator' },
      // { label: 'Retirement Calculator', href: '/retirement-calculator', icon: 'Calculator' },
      // { label: 'Amortization Calculator', href: '/amortization-calculator', icon: 'Calculator' },
      // { label: 'Investment Calculator', href: '/investment-calculator', icon: 'Calculator' },
      // { label: 'Inflation Calculator', href: '/inflation-calculator', icon: 'Calculator' },
      // { label: 'Finance Calculator', href: '/finance-calculator', icon: 'Calculator' },
      // { label: 'Income Tax Calculator', href: '/income-tax-calculator', icon: 'Calculator' },
      // { label: 'Compound Interest Calculator', href: '/compound-interest-calculator', icon: 'Calculator' },
      // { label: 'Salary Calculator', href: '/salary-calculator', icon: 'Calculator' },
      // { label: 'Interest Rate Calculator', href: '/interest-rate-calculator', icon: 'Calculator' },
      // { label: 'Sales Tax Calculator', href: '/sales-tax-calculator', icon: 'Calculator' },
    ]
  },
  {
    key: 'currency',
    label: 'Currency',
    items: [
      { label: 'Currency Converter', href: '/currency-converter', icon: 'Globe' },
    ]
  },
  {
    key: 'math',
    label: 'Math Calculators',
    items: [
      { label: 'Scientific Calculator', href: '/scientific-calculator', icon: 'Calculator' },
      // { label: 'Fraction Calculator', href: '/fraction-calculator', icon: 'Calculator' },
      // { label: 'Percentage Calculator', href: '/percentage-calculator', icon: 'Percent' },
      // { label: 'Random Number Generator', href: '/random-number-generator', icon: 'Calculator' },
      // { label: 'Triangle Calculator', href: '/triangle-calculator', icon: 'Ruler' },
      // { label: 'Standard Deviation Calculator', href: '/standard-deviation-calculator', icon: 'Calculator' },
    ]
  },
  {
    key: 'fitness',
    label: 'Fitness & Health Calculators',
    items: [
      { label: 'BMI Calculator', href: '/bmi-calculator', icon: 'Heart' },
      // { label: 'Calorie Calculator', href: '/calorie-calculator', icon: 'Heart' },
      // { label: 'Body Fat Calculator', href: '/body-fat-calculator', icon: 'Heart' },
      { label: 'BMR Calculator', href: '/bmr-calculator', icon: 'Activity' },
      // { label: 'Ideal Weight Calculator', href: '/ideal-weight-calculator', icon: 'Heart' },
      // { label: 'Pace Calculator', href: '/pace-calculator', icon: 'Activity' },
      // { label: 'Pregnancy Calculator', href: '/pregnancy-calculator', icon: 'Calendar' },
      // { label: 'Pregnancy Conception Calculator', href: '/pregnancy-conception-calculator', icon: 'Calendar' },
      // { label: 'Due Date Calculator', href: '/due-date-calculator', icon: 'Calendar' },
    ]
  },
  {
    key: 'other',
    label: 'Other Calculators',
    items: [
      { label: 'Age Calculator', href: '/age-calculator', icon: 'Calendar' },
      // { label: 'Date Calculator', href: '/date-calculator', icon: 'Calendar' },
      // { label: 'Time Calculator', href: '/time-calculator', icon: 'Calculator' },
      // { label: 'Hours Calculator', href: '/hours-calculator', icon: 'Calculator' },
      // { label: 'GPA Calculator', href: '/gpa-calculator', icon: 'Calculator' },
      // { label: 'Grade Calculator', href: '/grade-calculator', icon: 'Calculator' },
      // { label: 'Concrete Calculator', href: '/concrete-calculator', icon: 'Calculator' },
      // { label: 'Subnet Calculator', href: '/subnet-calculator', icon: 'Calculator' },
      // { label: 'Password Generator', href: '/password-generator', icon: 'Calculator' },
      // { label: 'Conversion Calculator', href: '/unit-converter', icon: 'Ruler' },
    ]
  }
];
