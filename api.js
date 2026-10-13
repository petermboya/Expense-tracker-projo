// Talks to the free exchange rate API. No key needed.
const BASE_URL = 'https://open.er-api.com/v6/latest';

export async function fetchRates(baseCurrency) {
  const response = await fetch(`${BASE_URL}/${baseCurrency}`);

  if (!response.ok) {
    throw new Error(`Rate request failed (status ${response.status})`);
  }

  const data = await response.json();

  if (data.result !== 'success' || !data.rates) {
    throw new Error('The rate service sent back something unexpected');
  }

  return data.rates;
}
