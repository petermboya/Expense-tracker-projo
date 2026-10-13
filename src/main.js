import { fetchRates } from '../api.js';
import { getExpenses, addExpense, removeExpense } from './state.js';
import { convertToHome, filterByCategory, formatMoney } from './utils.js';
import { fillCurrencySelect, showStatus, renderExpenses } from './ui.js';

const homeSelect = document.getElementById('home-currency');
const currencySelect = document.getElementById('currency');
const filterSelect = document.getElementById('filter');
const form = document.getElementById('expense-form');
const convertButton = document.getElementById('convert');
const amountInput = document.getElementById('amount');

// a short list to start with, the real list comes back from the API
const DEFAULT_CURRENCIES = ['USD', 'EUR', 'GBP', 'KES', 'JPY'];
const codes = [ 'USD', 'EUR', 'GBP', 'JPY', 'KES' ];

let rates = null;
let homeCurrency = 'USD';
let rateRequest = 0;

function refresh() {
  const visible = filterByCategory(getExpenses(), filterSelect.value);
  renderExpenses(visible, rates, homeCurrency, handleDelete);
}

function handleDelete(id) {
  removeExpense(id);
  refresh();
}

async function loadRates() {
  const request = ++rateRequest;
  rates = null;
  showStatus('Loading exchange rates...');
  refresh();
  try {
    const loadedRates = await fetchRates(homeCurrency);
    if (request !== rateRequest) {
      return;
    }
    rates = loadedRates;
    fillCurrencySelect(homeSelect, DEFAULT_CURRENCIES, homeCurrency);
    fillCurrencySelect(currencySelect, DEFAULT_CURRENCIES, currencySelect.value || 'USD');
    showStatus('Rates are up to date.');
  } catch (error) {
    if (request !== rateRequest) {
      return;
    }
    rates = null;
    showStatus(`Couldn't load rates: ${error.message}. Check your connection and try switching currency to retry.`, true);
  }
  refresh();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addExpense({
    description: document.getElementById('description').value.trim(),
    amount: Number(document.getElementById('amount').value),
    currency: currencySelect.value,
    category: document.getElementById('category').value
  });
  form.reset();
  currencySelect.value = currencySelect.value || 'USD';
  refresh();
});

convertButton.addEventListener('click', () => {
  if (!rates) {
    showStatus('Wait for exchange rates to load before converting.', true);
    return;
  }

  const amount = Number(amountInput.value);
  if (!Number.isFinite(amount) || amount < 0 || amountInput.value === '') {
    showStatus('Enter a valid amount to convert.', true);
    return;
  }

  const converted = convertToHome(amount, currencySelect.value, rates);
  if (converted === null) {
    showStatus(`No rate is available for ${currencySelect.value}.`, true);
    return;
  }

  amountInput.value = converted.toFixed(2);
  currencySelect.value = homeCurrency;
  showStatus(`Converted to ${formatMoney(converted, homeCurrency)}.`);
});

homeSelect.addEventListener('change', () => {
  homeCurrency = homeSelect.value;
  loadRates();
});

filterSelect.addEventListener('change', refresh);

// fill the dropdowns before the fetch finishes so the page isn't empty
fillCurrencySelect(homeSelect, DEFAULT_CURRENCIES, homeCurrency);
fillCurrencySelect(currencySelect, DEFAULT_CURRENCIES, 'USD');
loadRates();
