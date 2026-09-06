"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth";

export default function Register() {
  const router = useRouter(); const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setError(""); try { await authService.register({name,email,password}); router.push("/dashboard"); } catch(err:any) { setError(err?.response?.data?.message || "Registration failed"); } finally { setBusy(false); } }
  return <main className="grid min-h-screen place-items-center px-6"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] p-7">
    <h1 className="text-3xl font-bold">Create account</h1>
    {error && <p className="mt-4 text-red-400">{error}</p>}
    <input required placeholder="Full name" className="mt-6 w-full rounded-lg border border-slate-700 bg-slate-900 p-3" value={name} onChange={e=>setName(e.target.value)}/>
    <input required type="email" placeholder="Email" className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-900 p-3" value={email} onChange={e=>setEmail(e.target.value)}/>
    <input required minLength={8} type="password" placeholder="Password (8+ characters)" className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-900 p-3" value={password} onChange={e=>setPassword(e.target.value)}/>
    <button disabled={busy} className="mt-6 w-full rounded-lg bg-[#F4A91C] p-3 font-bold text-black">{busy ? "Creating..." : "Create account"}</button>
    <p className="mt-5 text-center text-sm text-slate-400">Already registered? <Link href="/login" className="text-[#F4A91C]">Login</Link></p>
  </form></main>;
}
