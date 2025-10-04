"use client";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = supabaseClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=/admin` } });
    if (error) alert(error.message);
    else setDone(true);
  }
  return (
    <main className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-2xl font-heading mb-6">Admin Login</h1>
      {done ? (
        <p>Magic link sent. Check your inbox.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full rounded bg-transparent border px-3 py-2"
            placeholder="you@example.com"
            type="email" value={email} onChange={e=>setEmail(e.target.value)} required
          />
          <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 border">Send magic link</button>
        </form>
      )}
    </main>
  );
}
