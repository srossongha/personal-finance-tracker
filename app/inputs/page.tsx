"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCategoryBudgets } from "@/lib/hooks";
import { useToast } from "../components/toast";

const DEFAULT_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Housing & Utilities",
  "Entertainment",
  "Shopping",
  "Health & Wellness",
  "Other",
];

const Inputs = () => {
  const router = useRouter();
  const toast = useToast();

  const { data: categoryBudgets } = useCategoryBudgets();

  const availableCategories =
    categoryBudgets.length > 0
      ? categoryBudgets.map((b) => b.category)
      : DEFAULT_CATEGORIES;

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const selectedCategory = category || availableCategories[0] || "Other";
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!description.trim()) {
      setError("Please provide a description.");
      return;
    }

    if (!selectedCategory.trim()) {
      setError("Please choose a category.");
      return;
    }

    if (!date.trim()) {
      setError("Please pick a date.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          category: selectedCategory,
          type,
          amount: parsedAmount,
          date,
        }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Couldn't save that transaction. Please try again.");
      }

      toast.success("Transaction added successfully!");
      router.push("/transactions");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Couldn't save that transaction.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full items-start justify-center bg-(--surface-muted) p-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-6 shadow-sm"
      >
        <h1 className="mb-2 text-2xl font-semibold text-(--ink-primary)">
          Add transaction
        </h1>

        <label className="flex flex-col gap-1 text-xs font-medium text-(--ink-secondary)">
          Description
          <input
            type="text"
            required
            placeholder="e.g. Grocery shopping"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-md border border-(--chart-grid) px-3 py-2 text-sm text-(--ink-primary) outline-none focus:ring-2 focus:ring-(--brand-500)"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-(--ink-secondary)">
          Category
          <select
            value={selectedCategory}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-(--chart-grid) px-3 py-2 text-sm text-(--ink-primary) outline-none focus:ring-2 focus:ring-(--brand-500)"
          >
            {availableCategories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-(--ink-secondary)">
          Amount
          <input
            type="number"
            step="any"
            min="0.01"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-md border border-(--chart-grid) px-3 py-2 text-sm text-(--ink-primary) outline-none focus:ring-2 focus:ring-(--brand-500)"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-(--ink-secondary)">
          Date
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-(--chart-grid) px-3 py-2 text-sm text-(--ink-primary) outline-none focus:ring-2 focus:ring-(--brand-500)"
          />
        </label>

        <div className="flex gap-4 pt-1 text-sm text-(--ink-primary)">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              checked={type === "expense"}
              onChange={() => setType("expense")}
              className="accent-(--brand-600)"
            />
            Expense
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              checked={type === "income"}
              onChange={() => setType("income")}
              className="accent-(--brand-600)"
            />
            Income
          </label>
        </div>

        {error && (
          <p className="rounded-lg bg-(--status-critical)/10 p-2.5 text-xs text-(--status-critical)">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-(--brand-600) px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--brand-700) disabled:opacity-50 active:scale-[0.98] cursor-pointer"
        >
          {isSubmitting ? "Saving transaction..." : "Save transaction"}
        </button>
      </form>
    </div>
  );
};

export default Inputs;
