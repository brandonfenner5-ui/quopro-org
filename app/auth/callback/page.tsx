"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) {
      router.replace("/login");
      return;
    }

    const handleAuth = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Session exchange failed:", error);
        router.replace("/login");
        return;
      }

      router.replace("/dashboard");
    };

    handleAuth();
  }, [router]);

  return <p>Redirecting…</p>;
}