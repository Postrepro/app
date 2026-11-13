import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextPath = url.searchParams.get("next") ?? "/registro/completar";
  const safePath = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/registro/completar";
  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: (updates) => updates.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } },
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safePath, url.origin));
  }
  return NextResponse.redirect(new URL("/acceso?error=verificacion", url.origin));
}
