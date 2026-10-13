import { convertToHome, calculateTotal, formatMoney } from './utils.js';

const statusEl = document.getElementById('status');
const listEl = document.getElementById('expense-list');
const totalEl = document.getElementById('total');

export function fillCurrencySelect(select, codes, selected) {
  select.innerHTML = '';
  codes.forEach((code) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = code;
    option.selected = code === selected;
    select.appendChild(option);
  });
}

export function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

export function renderExpenses(expenses, rates, homeCurrency, onDelete) {
  listEl.innerHTML = '';

  if (expenses.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Nothing here yet.';
    listEl.appendChild(empty);
  }

  expenses.forEach((expense) => {
    const converted = rates ? convertToHome(expense.amount, expense.currency, rates) : null;
    const convertedText = converted === null ? '--' : formatMoney(converted, homeCurrency);

    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <div class="name"></div>
        <div class="meta"></div>
      </div>
      <div class="amounts">
        <div class="converted"></div>
        <div class="original"></div>
      </div>
      <button type="button" class="delete">Delete</button>
    `;
    li.querySelector('.name').textContent = expense.description;
    li.querySelector('.meta').textContent = expense.category;
    li.querySelector('.converted').textContent = convertedText;
    li.querySelector('.original').textContent = formatMoney(expense.amount, expense.currency);
    li.querySelector('.delete').addEventListener('click', () => onDelete(expense.id));
    listEl.appendChild(li);
  });

  const total = rates ? calculateTotal(expenses, rates) : 0;
  totalEl.textContent = formatMoney(total, homeCurrency);
}
