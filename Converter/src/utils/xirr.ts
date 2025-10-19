// Robust XIRR implementation with validation, precision handling, and fallback root-finding
// Follows financial conventions similar to Excel's XIRR: day-count basis 365

export type CashFlow = { value: number; date: Date };

function sortFlows(values: number[], dates: Date[]): CashFlow[] {
  const flows = values.map((v, i) => ({ value: v, date: dates[i] }));
  return flows.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function hasPositiveAndNegative(flows: CashFlow[]) {
  let hasPos = false, hasNeg = false;
  for (const f of flows) {
    if (f.value > 0) hasPos = true;
    if (f.value < 0) hasNeg = true;
    if (hasPos && hasNeg) return true;
  }
  return false;
}

// Exact NPV given a discount rate and dated cash flows
function xnpv(rate: number, flows: CashFlow[]): number {
  if (!isFinite(rate) || rate <= -1) return NaN; // invalid domain
  const start = flows[0].date.getTime();
  let sum = 0;
  for (const { value, date } of flows) {
    const days = (date.getTime() - start) / (1000 * 60 * 60 * 24);
    sum += value / Math.pow(1 + rate, days / 365.0);
  }
  return sum;
}

// Derivative of NPV w.r.t. rate
function xnpvPrime(rate: number, flows: CashFlow[]): number {
  if (!isFinite(rate) || rate <= -1) return NaN;
  const start = flows[0].date.getTime();
  let sum = 0;
  for (const { value, date } of flows) {
    const days = (date.getTime() - start) / (1000 * 60 * 60 * 24);
    if (days === 0) continue;
    sum -= (value * days) / (365.0 * Math.pow(1 + rate, days / 365.0 + 1));
  }
  return sum;
}

function newtonRaphsonXIRR(flows: CashFlow[], guess: number, tolerance = 1e-10, maxIterations = 100): number | null {
  let x = guess;
  for (let i = 0; i < maxIterations; i++) {
    const fx = xnpv(x, flows);
    const fpx = xnpvPrime(x, flows);
    if (!isFinite(fx) || !isFinite(fpx) || Math.abs(fpx) < 1e-16) break;
    const next = x - fx / fpx;
    if (!isFinite(next) || next <= -0.999999999) break;
    if (Math.abs(next - x) < tolerance) return next;
    x = next;
  }
  return null;
}

function bisectionXIRR(flows: CashFlow[], low: number, high: number, tolerance = 1e-10, maxIterations = 200): number | null {
  let fLow = xnpv(low, flows);
  let fHigh = xnpv(high, flows);
  if (!isFinite(fLow) || !isFinite(fHigh)) return null;
  if (fLow === 0) return low;
  if (fHigh === 0) return high;
  if (fLow * fHigh > 0) return null; // not bracketed

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const fMid = xnpv(mid, flows);
    if (!isFinite(fMid)) return null;
    if (Math.abs(fMid) < tolerance || (high - low) / 2 < tolerance) return mid;
    if (fLow * fMid <= 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }
  return (low + high) / 2; // best effort
}

function findBracket(flows: CashFlow[], baseGuess = 0.1): [number, number] | null {
  // Start with a reasonable domain near Excel defaults
  let low = -0.999999, high = Math.max(0.1, baseGuess * 2);
  let fLow = xnpv(low, flows);
  let fHigh = xnpv(high, flows);
  if (isFinite(fLow) && isFinite(fHigh) && fLow * fHigh <= 0) return [low, high];

  // Expand upward until sign change or cap
  for (let i = 0; i < 40; i++) {
    high = high * 2 + 0.05; // gradually expand
    fHigh = xnpv(high, flows);
    if (!isFinite(fHigh)) break;
    if (isFinite(fLow) && fLow * fHigh <= 0) return [low, high];
  }

  // Try shrinking low slightly above -1
  for (let i = 0; i < 20; i++) {
    low = -0.999999 + (i + 1) * 0.01; // move away from singularity
    fLow = xnpv(low, flows);
    if (!isFinite(fLow)) continue;
    if (isFinite(fHigh) && fLow * fHigh <= 0) return [low, high];
  }

  return null;
}

export function xirr(values: number[], dates: Date[], guess = 0.1): number {
  if (!values || !dates || values.length !== dates.length || values.length < 2) return NaN;
  const flows = sortFlows(values, dates);
  if (!hasPositiveAndNegative(flows)) return NaN;

  // Try Newton-Raphson first (fast)
  let result = newtonRaphsonXIRR(flows, guess);
  if (result != null && isFinite(result)) {
    // Clamp small negatives to zero and round to micro precision
    const r = Math.max(result, -0.999999999);
    return Math.round(r * 1e12) / 1e12;
  }

  // Fallback to bisection on a bracket
  const bracket = findBracket(flows, guess);
  if (bracket) {
    const [low, high] = bracket;
    const bis = bisectionXIRR(flows, low, high);
    if (bis != null && isFinite(bis)) return Math.round(bis * 1e12) / 1e12;
  }

  return NaN;
}