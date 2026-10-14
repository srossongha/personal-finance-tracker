"use client";

import { useState } from "react";
import { useCategoryBudgets, useTransactions } from "@/lib/hooks";
import { formatCurrency } from "@/lib/format";
import type { Transaction } from "@/lib/types";

const DEFAULT_LIMIT = 1000;

function spentOnCategory(transactions: Transaction[], category: string) {
  return transactions
    .filter((t) => t.type === "expense" && t.category === category)
    .reduce((total, t) => total + t.amount, 0);
}

const Budgets = () => {
  // --- The logged-in user's real transactions and category limits, both
  //     fetched (and cached/redirected-on-401) through the shared hooks. ---
  const { data: transactions } = useTransactions();
  const { data: categoryBudgets } = useCategoryBudgets();

  // --- Overall monthly limit (editable, but only in this browser tab for
  //     now — there's no `overall_limit` column yet, unlike the per-
  //     category limits below which live in the category_budget table). ---
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [isEditing, setIsEditing] = useState(false);
  const [draftLimit, setDraftLimit] = useState(String(DEFAULT_LIMIT));

  const spent = transactions
    .filter((t) => t.type === "expense")
    .reduce((total, t) => total + t.amount, 0);

  const isOverBudget = spent > limit;

  const handleSave = () => {
    const parsed = Number(draftLimit);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setDraftLimit(String(limit));
      setIsEditing(false);
      return;
    }
    setLimit(parsed);
    setIsEditing(false);
  };

  // --- Derived data for the analytics + in/out panels ---
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((total, t) => total + t.amount, 0);

  const totalExpense = spent;

  const expenseCategories = Array.from(
    new Set(
      transactions.filter((t) => t.type === "expense").map((t) => t.category),
    ),
  );
  const categorySpend = expenseCategories.map((category) => ({
    category,
    amount: spentOnCategory(transactions, category),
  }));
  const maxCategorySpend = Math.max(...categorySpend.map((c) => c.amount), 1);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-(--ink-primary)">
        Budgets
      </h1>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {/* 1: overall monthly limit — spans full width on mobile/tablet */}
        <div className="col-span-2 rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-(--ink-muted)">
              Monthly spend
            </p>
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  inputMode="decimal"
                  autoFocus
                  value={draftLimit}
                  onChange={(e) => setDraftLimit(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="w-24 rounded-lg border border-(--chart-grid) px-2 py-1 text-right text-xs sm:text-sm outline-none focus:ring-1 focus:ring-(--brand-500)"
                />
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-(--brand-600) px-3 py-1 text-xs font-semibold text-white hover:bg-(--brand-700) active:scale-95"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setDraftLimit(String(limit));
                  setIsEditing(true);
                }}
                className="text-xs font-medium text-(--brand-600) hover:underline cursor-pointer"
              >
                Edit limit
              </button>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-(--ink-primary)">
            {formatCurrency(spent)}{" "}
            <span className="text-xs sm:text-sm font-normal text-(--ink-muted)">
              / {formatCurrency(limit)}
            </span>
          </p>
          <p
            className={`mt-1 text-xs ${
              isOverBudget ? "text-(--status-critical) font-medium" : "text-(--ink-muted)"
            }`}
          >
            {isOverBudget
              ? `Over by ${formatCurrency(spent - limit)}`
              : `${formatCurrency(limit - spent)} left`}
          </p>
        </div>

        {/* 2, 6, 3, 7: per-category mini cards — 2 per row on mobile */}
        {categoryBudgets.map(({ category, limit: categoryLimit }) => {
          const categorySpent = spentOnCategory(transactions, category);
          const over = categorySpent > categoryLimit;
          return (
            <div
              key={category}
              className="col-span-1 rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-3.5 sm:p-4"
            >
              <p className="truncate text-xs sm:text-sm font-medium text-(--ink-muted)">
                {category}
              </p>
              <p className="mt-1 text-base sm:text-lg font-semibold text-(--ink-primary)">
                {formatCurrency(categorySpent)}
              </p>
              <p
                className={`text-[11px] sm:text-xs mt-0.5 ${
                  over ? "text-(--status-critical) font-medium" : "text-(--ink-muted)"
                }`}
              >
                of {formatCurrency(categoryLimit)}
              </p>
            </div>
          );
        })}

        {/* 4: analytics — spans full width on mobile, 4 columns on desktop */}
        <div className="col-span-2 rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-4 sm:p-5 lg:col-span-4 lg:row-span-2">
          <p className="mb-3 text-sm font-semibold text-(--ink-primary)">
            Spend by category
          </p>
          <div className="flex flex-col gap-3">
            {categorySpend.length === 0 && (
              <p className="text-sm text-(--ink-muted)">
                No expenses recorded yet.
              </p>
            )}
            {categorySpend.map(({ category, amount }) => (
              <div key={category} className="flex items-center gap-2 sm:gap-3">
                <p className="w-20 sm:w-28 shrink-0 truncate text-xs sm:text-sm text-(--ink-secondary)">
                  {category}
                </p>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-(--surface-muted)">
                  <div
                    className="h-full rounded-full bg-(--data-blue)"
                    style={{ width: `${(amount / maxCategorySpend) * 100}%` }}
                  />
                </div>
                <p className="w-16 sm:w-20 shrink-0 text-right text-xs sm:text-sm font-medium text-(--ink-primary)">
                  {formatCurrency(amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5: in/out — spans full width on mobile, 2 columns on desktop */}
        <div className="col-span-2 rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-4 sm:p-5 lg:row-span-2">
          <p className="mb-3 text-sm font-semibold text-(--ink-primary)">
            In / Out
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-(--ink-muted)">Income</p>
              <p className="text-xl font-semibold text-(--status-good)">
                +{formatCurrency(totalIncome)}
              </p>
            </div>
            <div>
              <p className="text-xs text-(--ink-muted)">Expense</p>
              <p className="text-xl font-semibold text-(--status-critical)">
                -{formatCurrency(totalExpense)}
              </p>
            </div>
            <div className="border-t border-(--chart-grid) pt-2">
              <p className="text-xs text-(--ink-muted)">Net</p>
              <p className="text-xl font-semibold text-(--ink-primary)">
                {formatCurrency(totalIncome - totalExpense)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
