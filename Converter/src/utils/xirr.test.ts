import { describe, it, expect } from 'vitest';
import { xirr } from './xirr';

function xnpv(rate: number, values: number[], dates: Date[]): number {
  const start = dates[0].getTime();
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const days = (dates[i].getTime() - start) / (1000 * 60 * 60 * 24);
    sum += values[i] / Math.pow(1 + rate, days / 365.0);
  }
  return sum;
}

describe('xirr utility', () => {
  it('computes ~10% for -1000 then +1100 at 1 year', () => {
    const d0 = new Date('2020-01-01');
    const d1 = new Date('2021-01-01');
    const r = xirr([-1000, 1100], [d0, d1]);
    expect(r).toBeGreaterThan(0.095);
    expect(r).toBeLessThan(0.105);
    expect(Math.abs(xnpv(r, [-1000, 1100], [d0, d1]))).toBeLessThan(1e-6);
  });

  it('handles irregular multi-cashflows and returns near-zero NPV', () => {
    const d0 = new Date('2020-01-01');
    const d1 = new Date('2020-04-01');
    const d2 = new Date('2020-05-01');
    const d3 = new Date('2021-01-01');
    const vals = [-1000, -500, 200, 1500];
    const dates = [d0, d1, d2, d3];
    const r = xirr(vals, dates, 0.1);
    expect(isFinite(r)).toBe(true);
    expect(Math.abs(xnpv(r, vals, dates))).toBeLessThan(1e-6);
  });

  it('returns NaN when all cash flows are one sign', () => {
    const d0 = new Date('2020-01-01');
    const d1 = new Date('2020-02-01');
    const r = xirr([-100, -200], [d0, d1]);
    expect(Number.isNaN(r)).toBe(true);
  });

  it('screenshot scenario: yearly -10000 for 3 years, +60000 at year 3 ≈ 39%', () => {
    const start = new Date('2021-01-01');
    const mid1 = new Date('2022-01-01');
    const mid2 = new Date('2023-01-01');
    const end = new Date('2024-01-01');
    const vals = [-10000, -10000, -10000, 60000];
    const dates = [start, mid1, mid2, end];
    const r = xirr(vals, dates, 0.4);
    expect(r).toBeGreaterThan(0.385);
    expect(r).toBeLessThan(0.395);
    expect(Math.abs(xnpv(r, vals, dates))).toBeLessThan(1e-6);
  });
});