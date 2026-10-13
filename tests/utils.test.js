import { convertToHome, filterByCategory, calculateTotal, formatMoney } from '../src/utils.js';

// pretend home currency is KES, so rates say "how many X per 1 KES"
const rates = { KES: 1, USD: 0.0077, EUR: 0.0071 };

const expenses = [
  { id: 1, description: 'Lunch', amount: 10, currency: 'USD', category: 'Food' },
  { id: 2, description: 'Bus', amount: 200, currency: 'KES', category: 'Transport' },
  { id: 3, description: 'Shirt', amount: 20, currency: 'EUR', category: 'Shopping' }
];

describe('convertToHome', () => {
  test('converts a foreign amount into the home currency', () => {
    expect(convertToHome(10, 'USD', rates)).toBeCloseTo(1298.7, 1);
  });

  test('home currency stays the same', () => {
    expect(convertToHome(200, 'KES', rates)).toBe(200);
  });

  test('returns null when the rate is missing', () => {
    expect(convertToHome(10, 'JPY', rates)).toBeNull();
  });

  test('zero amount converts to zero', () => {
    expect(convertToHome(0, 'USD', rates)).toBe(0);
  });
});

describe('filterByCategory', () => {
  test('All returns everything', () => {
    expect(filterByCategory(expenses, 'All')).toHaveLength(3);
  });

  test('returns only the matching category', () => {
    const result = filterByCategory(expenses, 'Food');
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Lunch');
  });

  test('returns an empty list when nothing matches', () => {
    expect(filterByCategory(expenses, 'Bills')).toEqual([]);
  });
});

describe('calculateTotal', () => {
  test('adds up converted amounts', () => {
    // 10 USD + 200 KES + 20 EUR, all in KES
    const expected = 10 / 0.0077 + 200 + 20 / 0.0071;
    expect(calculateTotal(expenses, rates)).toBeCloseTo(expected, 5);
  });

  test('is zero for an empty list', () => {
    expect(calculateTotal([], rates)).toBe(0);
  });

  test('skips expenses with a missing rate', () => {
    const withJpy = [...expenses, { id: 4, description: 'Ramen', amount: 900, currency: 'JPY', category: 'Food' }];
    expect(calculateTotal(withJpy, rates)).toBeCloseTo(calculateTotal(expenses, rates), 5);
  });
});

describe('formatMoney', () => {
  test('shows two decimals and the currency code', () => {
    expect(formatMoney(5, 'USD')).toBe('5.00 USD');
  });
});
