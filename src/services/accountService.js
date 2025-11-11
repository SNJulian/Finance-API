let accounts = [
  { id: 1, type: "checking", currency: "EUR", owner: "Demo User", balance: 1250.45 },
  { id: 2, type: "brokerage", currency: "EUR", owner: "Demo User", balance: 10250.0 },
];

let transactions = {
  1: [
    { id: 1, type: "credit", amount: 1500.0, currency: "EUR", description: "Salary", date: "2025-11-01" },
    { id: 2, type: "debit", amount: 249.55, currency: "EUR", description: "Groceries", date: "2025-11-03" },
  ],
  2: [
    { id: 1, type: "credit", amount: 10000.0, currency: "EUR", description: "Initial funding", date: "2025-10-20" },
    { id: 2, type: "debit", amount: 200.0, currency: "EUR", description: "Commission", date: "2025-10-21" },
  ],
};

function listAccounts() {
  return accounts;
}

function getAccountById(id) {
  return accounts.find((a) => a.id === id);
}

function listTransactions(accountId) {
  return transactions[accountId] || [];
}

function addTransaction(accountId, txn) {
  const account = getAccountById(accountId);
  if (!account) return null;

  const list = transactions[accountId] || [];
  const newId = list.length ? Math.max(...list.map((t) => t.id)) + 1 : 1;
  const newTxn = {
    id: newId,
    type: txn.type,
    amount: txn.amount,
    currency: txn.currency || account.currency,
    description: txn.description || "",
    date: txn.date || new Date().toISOString().slice(0, 10),
  };

  if (txn.type === "credit") {
    account.balance = Number((account.balance + txn.amount).toFixed(2));
  } else if (txn.type === "debit") {
    account.balance = Number((account.balance - txn.amount).toFixed(2));
  }

  list.push(newTxn);
  transactions[accountId] = list;
  return newTxn;
}

module.exports = { listAccounts, getAccountById, listTransactions, addTransaction };
