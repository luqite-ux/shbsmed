import { NextResponse, type NextRequest } from "next/server.js"

import { SESSION_COOKIE } from "./lib/admin-session.ts"
import { applyServiceExpiryGuard } from "./lib/service-guard-middleware.ts"

const MAINTENANCE_PATH = "/maintenance"

function isMaintenanceExcludedPath(pathname: string) {
  return pathname === MAINTENANCE_PATH || pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname === "/robots.txt" || pathname === "/sitemap.xml" || /\.[a-z0-9]+$/i.test(pathname)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = pathname.startsWith("/admin/login") || pathname.startsWith("/admin/logout")

  if (!isPublic && pathname.startsWith("/admin") && !request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("reason", "unauthorized")
    return NextResponse.redirect(url)
  }

  if (!isMaintenanceExcludedPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = MAINTENANCE_PATH
    const response = NextResponse.rewrite(url)
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
    return response
  }

  const serviceGuardResponse = await applyServiceExpiryGuard(request)
  if (serviceGuardResponse) return serviceGuardResponse

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)"],
}
