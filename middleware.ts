import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected paths: /dashboard requires authenticated session, /admin requires ADMIN role
  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isAdminRoute = pathname.startsWith("/admin")

  if (!isDashboardRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // Fetch session from better-auth endpoint
  try {
    const sessionRes = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    })

    const session = await sessionRes.json().catch(() => null)

    // Unauthenticated -> redirect to sign-in
    if (!session || !session.user) {
      const signInUrl = new URL("/auth/sign-in", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Role-based access control (RBAC): /admin requires role === "ADMIN"
    if (isAdminRoute && session.user.role !== "ADMIN") {
      const forbiddenUrl = new URL("/dashboard?error=forbidden", request.url)
      return NextResponse.redirect(forbiddenUrl)
    }

    return NextResponse.next()
  } catch {
    // If auth service temporarily unreachable in middleware, allow next or redirect
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}