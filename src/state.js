// App state lives here. We never mutate the arrays or objects,
// each function hands back a new copy instead.

let expenses = [
  {
    description: 'Lunch',
    amount: 10,
    currency: 'USD',
    category: 'Food',
    id: 0
  }
];
let nextId = 1;

export function getExpenses() {
  return expenses;
}

export function addExpense({ description, amount, currency, category }) {
  const newExpense = { id: nextId, description, amount, currency, category };
  nextId += 1;
  expenses = [...expenses, newExpense];
  return expenses;
}

export function removeExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);
  return expenses;
}

export function updateCategory(id, newCategory) {
  expenses = expenses.map((expense) =>
    expense.id === id ? { ...expense, category: newCategory } : expense
  );
  return expenses;
}
