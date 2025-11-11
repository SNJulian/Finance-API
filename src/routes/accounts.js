const express = require("express");
const { listAccounts, getAccountById, listTransactions, addTransaction } = require("../services/accountService");

const router = express.Router();

router.get("/", (req, res) => {
  const accounts = listAccounts();
  res.json({ items: accounts, total: accounts.length });
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const account = getAccountById(id);
  if (!account) return res.status(404).json({ error: "Account not found" });
  res.json(account);
});

router.get("/:id/transactions", (req, res) => {
  const id = Number(req.params.id);
  const account = getAccountById(id);
  if (!account) return res.status(404).json({ error: "Account not found" });
  const txns = listTransactions(id);
  res.json({ items: txns, total: txns.length });
});

router.post("/:id/transactions", (req, res) => {
  const id = Number(req.params.id);
  const { type, amount, currency, description, date } = req.body;

  if (!type || !["credit", "debit"].includes(type)) {
    return res.status(400).json({ error: "type must be 'credit' or 'debit'" });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "amount must be positive number" });
  }

  const newTxn = addTransaction(id, { type, amount, currency, description, date });
  if (!newTxn) return res.status(404).json({ error: "Account not found" });

  res.status(201).json(newTxn);
});

module.exports = router;
