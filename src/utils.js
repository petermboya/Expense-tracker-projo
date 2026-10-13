// Pure helper functions. No DOM, no fetch, so they're easy to test.

// rates are relative to the home currency, e.g. home = KES means
// rates.USD is how many USD you get for 1 KES.
// So to go from USD back to KES we divide.
export function convertToHome(amount, currency, rates) {
  const rate = rates[currency];
  if (!rate || rate <= 0) {
    return null; // missing or bad rate, caller decides what to show
  }
  return amount / rate;
}

export function filterByCategory(expenses, category) {
  if (category === 'All') {
    return expenses;
  }
  return expenses.filter((expense) => expense.category === category);
}

// Adds up everything we can convert. Expenses with no rate are skipped
// rather than turning the whole total into NaN.
export function calculateTotal(expenses, rates) {
  return expenses.reduce((sum, expense) => {
    const converted = convertToHome(expense.amount, expense.currency, rates);
    return converted === null ? sum : sum + converted;
  }, 0);
}

export function formatMoney(value, currency) {
  return `${value.toFixed(2)} ${currency}`;
}
