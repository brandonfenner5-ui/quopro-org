"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false, // IMPORTANT for callback pages
        },
      }
    );

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) {
      router.replace("/login");
      return;
    }

    const handleAuth = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Session exchange failed:", error);
          router.replace("/login");
          return;
        }

        router.replace("/dashboard");
      } catch (err) {
        console.error("Unexpected error:", err);
        router.replace("/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-xl shadow">
        Redirecting…
      </div>
    </div>
  );
}