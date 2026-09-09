"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("researcher@socialguard.local");
  const [password, setPassword] = useState("Researcher123!");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await authService.login({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] p-7"
      >
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-slate-400">Sign in to SocialGuard AI</p>
        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-red-400">
            {error}
          </p>
        )}
        <label className="mt-6 block text-sm">
          Email
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm">
          Password
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-3 my-auto text-sm font-medium text-[#F4A91C]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <button
          disabled={busy}
          className="mt-6 w-full rounded-lg bg-[#F4A91C] p-3 font-bold text-black"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-400">
          No account?{" "}
          <Link className="text-[#F4A91C]" href="/register">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
