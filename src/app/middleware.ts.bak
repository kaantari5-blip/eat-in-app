/**
 * Next.js middleware.
 *
 * Responsibilities:
 *   1. Refresh the Supabase session cookie on every request that
 *      passes through the matcher. Without this, the JWT eventually
 *      expires and the user is silently logged out.
 *   2. Coarse routing protection: redirect unauthenticated users
 *      away from /panel, /yonetim, and other auth-only sections.
 *   3. Redirect already-signed-in users away from /giris and /kayit.
 *
 * Role-based redirects (e.g. "only admins can see /yonetim") are
 * NOT done here. They live in the corresponding route group's
 * layout.tsx, where we can hit `profiles.role` cheaply and cache
 * the result with React.cache().
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = [
  "/panel",
  "/yonetim",
  "/siparislerim",
  "/favoriler",
  "/hesabim",
  "/odeme",
];

const AUTH_ONLY_REDIRECTED = ["/giris", "/kayit", "/sifremi-unuttum"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() (not getSession) refreshes & verifies the JWT.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthRoute = AUTH_ONLY_REDIRECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!user && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/giris";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Run on everything EXCEPT:
     *   - _next assets, image optimization, favicon
     *   - public images
     *   - payment webhooks (these must remain unauthenticated)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};