import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// For React Server Components (pages/layouts/etc). Never mutates cookies.
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value;
        },
        // No-ops in RSC to avoid Next error:
        // "Cookies can only be modified in a Server Action or Route Handler"
        set() {},
        remove() {},
      },
    }
  );
}

// For Server Actions / Route Handlers (safe to mutate cookies).
export async function supabaseAction() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          store.set(name, value, options);
        },
        remove(name: string, options: any) {
          store.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}
