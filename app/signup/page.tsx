"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const SignupPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message ?? "Something went wrong");
      return;
    }

    // Better Auth already signed the user in as part of sign-up (the new
    // session cookie is set). `router.refresh()` throws away any cached,
    // signed-out version of the destination page's server-rendered data,
    // so it re-fetches with the new session instead of briefly looking
    // like you're still logged out.
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-3.5 rounded-2xl border border-(--chart-grid) bg-(--surface-card) p-5 sm:p-6 shadow-sm"
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-(--ink-primary)">Sign up</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-xl border border-(--chart-grid) px-3 text-base sm:text-sm outline-none focus:ring-2 focus:ring-(--brand-500)"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-xl border border-(--chart-grid) px-3 text-base sm:text-sm outline-none focus:ring-2 focus:ring-(--brand-500)"
        />

        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 rounded-xl border border-(--chart-grid) px-3 text-base sm:text-sm outline-none focus:ring-2 focus:ring-(--brand-500)"
        />

        {error && <p className="text-xs sm:text-sm text-(--status-critical)">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex h-11 items-center justify-center rounded-xl bg-(--brand-600) px-4 text-sm font-semibold text-white hover:bg-(--brand-700) active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Signing up..." : "Sign up"}
        </button>

        <p className="text-center text-xs sm:text-sm text-(--ink-muted) mt-1">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-(--brand-600) underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
